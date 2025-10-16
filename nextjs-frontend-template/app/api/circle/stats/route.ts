import { NextResponse } from "next/server"
import { getCircleStats } from "@/lib/mockData"

export async function GET() {
  const stats = getCircleStats()
  return NextResponse.json(stats)
}
