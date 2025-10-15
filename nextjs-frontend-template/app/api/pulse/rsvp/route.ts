import { NextRequest, NextResponse } from "next/server"
import { saveRSVP } from "@/lib/mockData"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { timeSlot } = body

    if (!timeSlot || (timeSlot !== "wo" && timeSlot !== "za")) {
      return NextResponse.json(
        { error: "Invalid time slot. Must be 'wo' or 'za'" },
        { status: 400 }
      )
    }

    saveRSVP(timeSlot)

    return NextResponse.json({
      success: true,
      message: `RSVP saved for ${timeSlot === "wo" ? "woensdag" : "zaterdag"}`,
      timeSlot,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save RSVP" },
      { status: 500 }
    )
  }
}
