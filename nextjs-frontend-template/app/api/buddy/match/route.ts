import { NextRequest, NextResponse } from "next/server"
import { createBuddyMatch } from "@/lib/mockData"

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || "http://localhost:8001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { day, time } = body

    // Pick a random buddy from the circle
    const buddyNames = ["Thomas", "Sophie", "Jamal", "Emma", "David"]
    const buddyName = buddyNames[Math.floor(Math.random() * buddyNames.length)]

    // For now, create a buddy match with a template message
    // In the future, we can call the AI agent to generate the message
    const buddyMatch = createBuddyMatch(
      buddyName,
      day || "za",
      time || "10:00"
    )

    return NextResponse.json({
      success: true,
      buddyMatch,
    })
  } catch (error) {
    console.error("Failed to create buddy match:", error)
    return NextResponse.json(
      { error: "Failed to create buddy match" },
      { status: 500 }
    )
  }
}
