import { NextResponse } from "next/server"
import { getCircleMembers } from "@/lib/mockData"

export async function GET() {
  try {
    const members = getCircleMembers()
    const now = new Date()

    // Calculate inactivity tiers
    const inactiveMembers = members
      .map((member) => {
        const lastActiveDate = new Date(member.lastActive)
        const diffMs = now.getTime() - lastActiveDate.getTime()
        const daysInactive = Math.floor(diffMs / 86400000)

        // Determine tier based on inactivity
        let tier: string
        let urgency: string
        let suggestedAction: string

        if (daysInactive >= 4 && daysInactive <= 6) {
          tier = "gentle reminder"
          urgency = "low"
          suggestedAction = "Send pulse reminder"
        } else if (daysInactive >= 7 && daysInactive <= 10) {
          tier = "buddy invitation"
          urgency = "medium"
          suggestedAction = "Match with buddy for koffie"
        } else if (daysInactive >= 11 && daysInactive <= 14) {
          tier = "community update"
          urgency = "medium"
          suggestedAction = "Send weekly summary"
        } else if (daysInactive >= 15) {
          tier = "facilitator alert"
          urgency = "high"
          suggestedAction = "Personal check-in needed"
        } else {
          return null // Still active
        }

        return {
          ...member,
          daysInactive,
          tier,
          urgency,
          suggestedAction,
        }
      })
      .filter((member) => member !== null)
      .sort((a, b) => (b?.daysInactive || 0) - (a?.daysInactive || 0)) // Most inactive first

    // Group by tier
    const grouped = {
      gentle: inactiveMembers.filter((m) => m?.tier === "gentle reminder"),
      buddy: inactiveMembers.filter((m) => m?.tier === "buddy invitation"),
      community: inactiveMembers.filter((m) => m?.tier === "community update"),
      facilitator: inactiveMembers.filter((m) => m?.tier === "facilitator alert"),
    }

    return NextResponse.json({
      total: inactiveMembers.length,
      byTier: {
        gentle: grouped.gentle.length,
        buddy: grouped.buddy.length,
        community: grouped.community.length,
        facilitator: grouped.facilitator.length,
      },
      members: inactiveMembers,
      grouped,
    })
  } catch (error) {
    console.error("Failed to get inactive members:", error)
    return NextResponse.json(
      { error: "Failed to get inactive members" },
      { status: 500 }
    )
  }
}
