import { NextRequest, NextResponse } from "next/server"
import { getMessages, sendMessage } from "@/lib/mockData"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const messages = getMessages(conversationId)
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const body = await request.json()
    const { text } = body

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      )
    }

    const newMessage = sendMessage(conversationId, text)
    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
