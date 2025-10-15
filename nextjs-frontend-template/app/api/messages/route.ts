import { NextResponse } from "next/server"
import { getConversations } from "@/lib/mockData"

export async function GET() {
  try {
    const conversations = getConversations()
    return NextResponse.json(conversations)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
