import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

// Initialize Azure OpenAI client
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: "2024-02-15-preview",
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface BackendViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
  tags: string[];
}

interface BackendResponse {
  url: string;
  timestamp: string;
  violations: BackendViolation[];
  summary: {
    totalViolations: number;
    violationTypes: number;
    passed: number;
    incomplete: number;
    inapplicable: number;
    impactCounts: {
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
  };
  wcagLevel: string;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`[API] Analyzing URL: ${url}`);

    // Step 1: Call Flask backend for accessibility analysis
    console.log(`[API] Calling backend at: ${BACKEND_URL}/api/analyze/webpage`);
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/analyze/webpage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`[API] Backend error: ${errorText}`);
      return NextResponse.json(
        { error: `Backend analysis failed: ${backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    const backendData: BackendResponse = await backendResponse.json();
    console.log(`[API] Backend returned ${backendData.violations.length} violations`);

    // Step 2: Generate AI explanations for violations
    const issuesWithAI = await Promise.all(
      backendData.violations.map(async (violation) => {
        try {
          const aiExplanation = await generateAIExplanation(violation);
          
          return {
            id: violation.id,
            type: violation.help,
            severity: violation.impact,
            description: violation.description,
            wcagCriteria: violation.tags.filter(tag => tag.startsWith('wcag')).join(', ') || 'N/A',
            affectedElements: violation.nodes.length,
            element: violation.nodes[0]?.html || '',
            recommendation: aiExplanation.recommendation,
            aiExplanation: aiExplanation.explanation,
            helpUrl: violation.helpUrl,
          };
        } catch (error) {
          console.error(`[API] Error generating AI explanation for ${violation.id}:`, error);
          // Return violation without AI explanation if it fails
          return {
            id: violation.id,
            type: violation.help,
            severity: violation.impact,
            description: violation.description,
            wcagCriteria: violation.tags.filter(tag => tag.startsWith('wcag')).join(', ') || 'N/A',
            affectedElements: violation.nodes.length,
            element: violation.nodes[0]?.html || '',
            recommendation: violation.help,
            aiExplanation: violation.description,
            helpUrl: violation.helpUrl,
          };
        }
      })
    );

    // Step 3: Generate overall AI summary
    let aiCoachSummary = "";
    try {
      aiCoachSummary = await generateOverallSummary(backendData, issuesWithAI);
    } catch (error) {
      console.error("[API] Error generating AI summary:", error);
      aiCoachSummary = `Analysis complete. Found ${backendData.summary.totalViolations} accessibility issues across ${backendData.summary.violationTypes} different categories.`;
    }

    // Step 4: Format response for frontend
    const response = {
      url: backendData.url,
      timestamp: backendData.timestamp,
      aiCoachSummary,
      summary: {
        totalIssues: backendData.summary.totalViolations,
        critical: backendData.summary.impactCounts.critical,
        serious: backendData.summary.impactCounts.serious,
        moderate: backendData.summary.impactCounts.moderate,
        minor: backendData.summary.impactCounts.minor,
        passed: backendData.summary.passed,
      },
      issues: issuesWithAI,
    };

    console.log(`[API] Returning ${response.issues.length} issues with AI explanations`);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error("[API] Error in scan-web:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze webpage" },
      { status: 500 }
    );
  }
}

async function generateAIExplanation(violation: BackendViolation): Promise<{
  explanation: string;
  recommendation: string;
}> {
  const prompt = `You are an accessibility expert. Explain this WCAG violation in simple terms and provide a clear fix.

Violation: ${violation.help}
Description: ${violation.description}
Impact: ${violation.impact}
Example element: ${violation.nodes[0]?.html || 'N/A'}

Provide:
1. A brief explanation (2-3 sentences) of why this is a problem for users
2. A specific recommendation on how to fix it

Keep it concise and actionable.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in web accessibility and WCAG guidelines. Provide clear, actionable advice.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";
    
    // Parse the response to extract explanation and recommendation
    const parts = aiResponse.split(/\n\n|\d\.\s/);
    const explanation = parts[1]?.trim() || aiResponse.substring(0, 200);
    const recommendation = parts[2]?.trim() || violation.help;

    return {
      explanation,
      recommendation,
    };
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    throw error;
  }
}

async function generateOverallSummary(
  backendData: BackendResponse,
  issues: any[]
): Promise<string> {
  const prompt = `Analyze this accessibility scan and provide a brief executive summary.

URL: ${backendData.url}
Total Issues: ${backendData.summary.totalViolations}
Critical: ${backendData.summary.impactCounts.critical}
Serious: ${backendData.summary.impactCounts.serious}
Moderate: ${backendData.summary.impactCounts.moderate}
Minor: ${backendData.summary.impactCounts.minor}

Top issues:
${issues.slice(0, 3).map(i => `- ${i.type} (${i.severity})`).join('\n')}

Provide a 2-3 sentence summary highlighting the most important findings and overall accessibility status.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an accessibility consultant providing executive summaries of website audits.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 
      `Analysis complete. Found ${backendData.summary.totalViolations} accessibility issues.`;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}
