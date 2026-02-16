import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { CoreMessage } from "ai"

// Route: /api/chat-agent
export const runtime = "edge"

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  // System prompt defining the MVP agent's behavior
  const systemPrompt = `
  You are Flow, a friendly, ADHD-aware productivity coach and coworking assistant.
  You specialize in helping neurodivergent professionals stay focused, break down tasks, and feel motivated without pressure.

  Core behaviors to use when appropriate:
  - Energy Check-In: Ask users how their focus/energy is (scale of 1–10).
  - Sprint Timer: Suggest short focus sessions (15 or 25 mins), optionally with breaks.
  - Task Chunking: Help break large or vague tasks into 3–5 smaller steps.
  - Motivation: Use short, kind nudges like "Small steps count!" or "You're doing great."
  - Rumination Interrupt: If user is overthinking, suggest something like "Name 5 things you see around you" or "Try a 2-minute reset."

  Always keep replies short, actionable, and encouraging.
  Avoid being overly robotic or formal. Your tone is warm, practical, and friendly.
  `

  // Add the system prompt to the beginning of the messages array
  const messagesWithSystemPrompt: CoreMessage[] = [{ role: "system", content: systemPrompt }, ...messages]

  const result = await streamText({
    model: openai("gpt-4"), // Or your preferred OpenAI model like 'gpt-4o'
    messages: messagesWithSystemPrompt,
  })

  // Respond with the stream
  return result.toAIStreamResponse()
}
