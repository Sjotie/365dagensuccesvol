import { NextRequest, NextResponse } from "next/server"
import { savePulseBResponse, getActivePulse, addCommunityResponse } from "@/lib/mockData"

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || "http://localhost:8001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    // Validate text
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Response text is required" },
        { status: 400 }
      )
    }

    const trimmedText = text.trim()

    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: "Response cannot be empty" },
        { status: 400 }
      )
    }

    if (trimmedText.length > 150) {
      return NextResponse.json(
        { error: "Response must be 150 characters or less" },
        { status: 400 }
      )
    }

    // Save user's response
    savePulseBResponse(trimmedText)

    // Get active pulse to trigger AI responses
    const pulse = getActivePulse()

    if (pulse && pulse.type === "B") {
      // Trigger 1-2 AI responses from community members to create liveliness
      const memberNames = ["Thomas", "Sophie", "Jamal", "Emma", "David", "Mohammed", "Lena"]
      const numResponses = Math.random() < 0.5 ? 1 : 2 // 50% chance of 1 or 2 responses

      // Don't await - let AI responses happen in background
      const aiPromises = []
      for (let i = 0; i < numResponses; i++) {
        const randomMember = memberNames[Math.floor(Math.random() * memberNames.length)]

        aiPromises.push(
          fetch(`${AGENT_SERVER_URL}/community/pulse-response`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              member_name: randomMember,
              ritual_name: `${pulse.ritual.letter} van ${pulse.ritual.name}`,
              ritual_question: pulse.ritual.question,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              addCommunityResponse(data.member_name, data.text, data.tone)
            })
            .catch((err) => {
              console.error("Failed to generate AI response:", err)
            })
        )

        // Small delay between AI requests
        if (i < numResponses - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      // Wait for AI responses before returning
      await Promise.all(aiPromises)
    }

    return NextResponse.json({
      success: true,
      message: "Response saved successfully",
      text: trimmedText,
    })
  } catch (error) {
    console.error("Error in pulse response:", error)
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    )
  }
}
