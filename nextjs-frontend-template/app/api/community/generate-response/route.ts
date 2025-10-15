import { NextRequest, NextResponse } from "next/server"
import { addCommunityResponse } from "@/lib/mockData"

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || "http://localhost:8001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ritualName, ritualQuestion, memberName } = body

    // Call the agent server on port 8001
    const agentResponse = await fetch(`${AGENT_SERVER_URL}/community/pulse-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ritual_name: ritualName,
        ritual_question: ritualQuestion,
        member_name: memberName || "Sophie",
      }),
    })

    if (!agentResponse.ok) {
      const errorData = await agentResponse.json()
      console.error("Agent server error:", errorData)
      return NextResponse.json(
        { error: "Failed to generate response from AI agent" },
        { status: 500 }
      )
    }

    const aiResponse = await agentResponse.json()

    // Extract clean text from potentially markdown-wrapped JSON
    let cleanText = aiResponse.text
    if (cleanText.includes("```json")) {
      // Parse the JSON from markdown code block
      const jsonMatch = cleanText.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          cleanText = parsed.text
        } catch (e) {
          console.error("Failed to parse JSON from markdown:", e)
        }
      }
    }

    // Add the AI-generated response to the mock data
    addCommunityResponse(
      aiResponse.member_name,
      cleanText,
      aiResponse.tone
    )

    return NextResponse.json({
      success: true,
      response: aiResponse,
    })
  } catch (error) {
    console.error("Failed to generate community response:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
