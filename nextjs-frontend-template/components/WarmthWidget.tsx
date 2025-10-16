"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/lib/types"
import { Flame, TrendingUp, Calendar } from "lucide-react"

interface WarmthWidgetProps {
  user: User
}

export function WarmthWidget({ user }: WarmthWidgetProps) {
  // Calculate warmth color based on score
  const getWarmthColor = (score: number) => {
    if (score >= 80) return "text-[#FF0837]"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-blue-400"
    return "text-gray-400"
  }

  const getWarmthLabel = (score: number) => {
    if (score >= 80) return "Sterk verbonden"
    if (score >= 60) return "Aanwezig"
    if (score >= 40) return "Rustig aan"
    return "Even stil"
  }

  return (
    <Card className="border-[#FFE6ED] bg-[#FFF0F5]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-2">
          <Flame className="h-4 w-4 text-[#FF0837]" />
          Je aanwezigheid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warmth Score */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">Warmte score</span>
            <span className={`text-2xl font-bold ${getWarmthColor(user.warmthScore)}`}>
              {user.warmthScore}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#FF0837] h-full rounded-full transition-all duration-500"
              style={{ width: `${user.warmthScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{getWarmthLabel(user.warmthScore)}</p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between py-2 border-t border-[#FFE6ED]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#FF0837]" />
            <span className="text-sm text-gray-600">Huidige reeks</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-[#FF0837]">{user.currentStreak}</span>
            <span className="text-xs text-gray-500">dagen</span>
          </div>
        </div>

        {/* Impact Score */}
        {user.impactScore && user.impactScore > 0 && (
          <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-100">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-xs text-green-700">
              Je aanwezigheid verhoogt de cirkel warmte met <span className="font-semibold">+{user.impactScore}</span>
            </p>
          </div>
        )}

        {/* Gentle encouragement */}
        <div className="pt-2 border-t border-[#FFE6ED]">
          <p className="text-xs text-gray-500 italic">
            Elke deelname telt. Elke week bouwt verbinding.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
