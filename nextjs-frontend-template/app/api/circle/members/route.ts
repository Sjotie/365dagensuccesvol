import { NextResponse } from "next/server"
import { getCircleMembers } from "@/lib/mockData"

export async function GET() {
  const members = getCircleMembers()
  return NextResponse.json(members)
}
