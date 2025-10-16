import { NextRequest, NextResponse } from "next/server"

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || "http://localhost:8001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberName, daysInactive, lastActivity, upcomingEvent } = body

    if (!memberName || !daysInactive) {
      return NextResponse.json(
        { error: "memberName and daysInactive are required" },
        { status: 400 }
      )
    }

    // Call Python backend to generate nudge
    const response = await fetch(`${AGENT_SERVER_URL}/reengagement/generate-nudge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_name: memberName,
        days_inactive: daysInactive,
        last_activity: lastActivity || "deelname aan pulse",
        upcoming_event: upcomingEvent,
      }),
    })

    if (!response.ok) {
      throw new Error(`Agent server responded with ${response.status}`)
    }

    const nudge = await response.json()

    // In production, this would send the nudge via email/SMS/WhatsApp
    // For now, just return the generated message
    console.log(`[NUDGE] Generated for ${memberName}:`, nudge.message)

    return NextResponse.json({
      success: true,
      nudge: {
        subject: nudge.subject,
        message: nudge.message,
        tone: nudge.tone,
        urgency: nudge.urgency_level,
        tier: nudge.tier,
      },
    })
  } catch (error) {
    console.error("Failed to generate nudge:", error)
    return NextResponse.json(
      { error: "Failed to generate nudge" },
      { status: 500 }
    )
  }
}
