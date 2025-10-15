import { NextResponse } from "next/server"
import { getActivePulse } from "@/lib/mockData"

export async function GET() {
  try {
    const pulse = getActivePulse()
    return NextResponse.json(pulse)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch active pulse" },
      { status: 500 }
    )
  }
}
