import { NextResponse } from "next/server"
import { mockUpcomingMeetups } from "@/lib/mockData"

export async function GET() {
  try {
    return NextResponse.json(mockUpcomingMeetups)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch meetups" },
      { status: 500 }
    )
  }
}
