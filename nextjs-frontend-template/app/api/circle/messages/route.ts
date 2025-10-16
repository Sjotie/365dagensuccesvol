import { NextResponse } from "next/server"
import { getCircleMessages, sendCircleMessage } from "@/lib/mockData"

export async function GET() {
  const messages = getCircleMessages()
  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { text } = body

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Message text is required" }, { status: 400 })
  }

  const newMessage = sendCircleMessage(text)
  return NextResponse.json(newMessage)
}
