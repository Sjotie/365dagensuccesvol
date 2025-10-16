import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { meetupId } = body

    if (!meetupId) {
      return NextResponse.json(
        { error: "Meetup ID is required" },
        { status: 400 }
      )
    }

    // In production, this would save to PocketBase
    // For now, we just return success
    return NextResponse.json({
      success: true,
      message: "Successfully registered for meetup",
      meetupId,
    })
  } catch (error) {
    console.error("Failed to register for meetup:", error)
    return NextResponse.json(
      { error: "Failed to register for meetup" },
      { status: 500 }
    )
  }
}
