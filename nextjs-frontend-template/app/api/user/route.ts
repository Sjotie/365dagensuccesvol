import { NextResponse } from "next/server"
import { mockUser } from "@/lib/mockData"

export async function GET() {
  try {
    return NextResponse.json(mockUser)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    )
  }
}
