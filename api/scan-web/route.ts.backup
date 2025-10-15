import { NextResponse } from "next/server"
import { JSDOM } from "jsdom"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url.startsWith("http") ? url : `https://${url}`)
    } catch (error) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "FlowFactor-Accessibility-Scanner/1.0",
      },
      timeout: 10000,
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch webpage: ${response.status} ${response.statusText}`,
        },
        { status: 400 },
      )
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Real accessibility analysis
    const issues = []
    const recommendations = []
    let score = 100

    // Check for missing alt text on images
    const images = document.querySelectorAll("img")
    const imagesWithoutAlt = Array.from(images).filter(
      (img) => !img.getAttribute("alt") && !img.getAttribute("aria-label"),
    )

    if (imagesWithoutAlt.length > 0) {
      score -= Math.min(30, imagesWithoutAlt.length * 5)
      issues.push({
        severity: "critical",
        title: "Missing Alternative Text for Images",
        description: `${imagesWithoutAlt.length} images are missing alternative text, making them inaccessible to screen readers.`,
        location: { element: "img", count: imagesWithoutAlt.length },
      })
      recommendations.push({
        title: "Add Alternative Text to Images",
        description: "Ensure all images have descriptive alt attributes that convey their purpose or content.",
      })
    }

    // Check for proper heading structure
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const h1Count = document.querySelectorAll("h1").length

    if (h1Count === 0) {
      score -= 15
      issues.push({
        severity: "warning",
        title: "Missing Main Heading (H1)",
        description: "Page is missing a main heading (H1) which is important for document structure.",
        location: { element: "h1", count: 0 },
      })
      recommendations.push({
        title: "Add Main Heading",
        description: "Include a single H1 element that describes the main content of the page.",
      })
    } else if (h1Count > 1) {
      score -= 10
      issues.push({
        severity: "info",
        title: "Multiple H1 Headings",
        description: "Page has multiple H1 headings. Consider using only one H1 per page.",
        location: { element: "h1", count: h1Count },
      })
    }

    // Check for form labels
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"], textarea, select',
    )
    const inputsWithoutLabels = Array.from(inputs).filter((input) => {
      const id = input.getAttribute("id")
      const ariaLabel = input.getAttribute("aria-label")
      const ariaLabelledby = input.getAttribute("aria-labelledby")
      const label = id ? document.querySelector(`label[for="${id}"]`) : null
      return !label && !ariaLabel && !ariaLabelledby
    })

    if (inputsWithoutLabels.length > 0) {
      score -= Math.min(20, inputsWithoutLabels.length * 5)
      issues.push({
        severity: "warning",
        title: "Form Inputs Missing Labels",
        description: `${inputsWithoutLabels.length} form inputs are missing proper labels.`,
        location: { element: "form inputs", count: inputsWithoutLabels.length },
      })
      recommendations.push({
        title: "Add Labels to Form Inputs",
        description: "Ensure all form inputs have associated labels or ARIA labels for screen reader users.",
      })
    }

    // Check for links without descriptive text
    const links = document.querySelectorAll("a[href]")
    const poorLinks = Array.from(links).filter((link) => {
      const text = link.textContent?.trim().toLowerCase()
      return !text || ["click here", "read more", "more", "link"].includes(text)
    })

    if (poorLinks.length > 0) {
      score -= Math.min(15, poorLinks.length * 3)
      issues.push({
        severity: "info",
        title: "Non-Descriptive Link Text",
        description: `${poorLinks.length} links have non-descriptive text like "click here" or "read more".`,
        location: { element: "links", count: poorLinks.length },
      })
      recommendations.push({
        title: "Improve Link Text",
        description: "Use descriptive link text that explains where the link leads or what it does.",
      })
    }

    // Check for page title
    const title = document.querySelector("title")?.textContent?.trim()
    if (!title || title.length < 10) {
      score -= 10
      issues.push({
        severity: "warning",
        title: "Missing or Poor Page Title",
        description: "Page title is missing or too short to be descriptive.",
        location: { element: "title", count: 1 },
      })
      recommendations.push({
        title: "Add Descriptive Page Title",
        description: "Include a descriptive page title that summarizes the page content.",
      })
    }

    // Standards compliance based on issues found
    const criticalIssues = issues.filter((i) => i.severity === "critical").length
    const warningIssues = issues.filter((i) => i.severity === "warning").length

    const scanResults = {
      url: validUrl.toString(),
      timestamp: new Date().toISOString(),
      accessibilityScore: Math.max(0, Math.round(score)),
      standardsCompliance: {
        wcag21A: criticalIssues === 0,
        wcag21AA: criticalIssues === 0 && warningIssues <= 2,
        section508: criticalIssues === 0 && warningIssues <= 1,
      },
      issues: issues,
      recommendations: recommendations,
      summary: `Scanned ${validUrl.toString()} and found ${issues.length} accessibility issues.`,
    }

    return NextResponse.json(scanResults, { status: 200 })
  } catch (error: any) {
    console.error("Error scanning website:", error)
    return NextResponse.json(
      {
        error: "Failed to scan website",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
