import { NextRequest, NextResponse } from "next/server"
import { savePulseBResponse } from "@/lib/mockData"

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

    // Save response
    savePulseBResponse(trimmedText)

    return NextResponse.json({
      success: true,
      message: "Response saved successfully",
      text: trimmedText,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    )
  }
}
