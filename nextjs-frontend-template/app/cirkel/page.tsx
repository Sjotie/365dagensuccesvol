"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Calendar, Activity, User, Loader2, Bell, Send, Coffee, MessageCircle } from "lucide-react"
import { Header } from "@/components/Header"
import type { CircleMember, CircleStats, User as UserType } from "@/lib/types"

interface CircleMessage {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: string
}

// Helper function to format relative time
function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "zojuist"
  if (diffMins < 60) return `${diffMins} min geleden`
  if (diffHours < 24) return `${diffHours} uur geleden`
  if (diffDays === 1) return "gisteren"
  if (diffDays < 7) return `${diffDays} dagen geleden`
  if (diffDays < 14) return `${Math.floor(diffDays / 7)} week geleden`
  return `${Math.floor(diffDays / 7)} weken geleden`
}

interface InactiveMember extends CircleMember {
  daysInactive: number
  tier: string
  urgency: string
  suggestedAction: string
}

interface InactiveData {
  total: number
  byTier: {
    gentle: number
    buddy: number
    community: number
    facilitator: number
  }
  grouped: {
    gentle: InactiveMember[]
    buddy: InactiveMember[]
    community: InactiveMember[]
    facilitator: InactiveMember[]
  }
}

export default function CirkelPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [members, setMembers] = useState<CircleMember[]>([])
  const [stats, setStats] = useState<CircleStats | null>(null)
  const [inactiveData, setInactiveData] = useState<InactiveData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingNudge, setSendingNudge] = useState<string | null>(null)

  // Group chat state
  const [circleMessages, setCircleMessages] = useState<CircleMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, membersRes, statsRes, inactiveRes, messagesRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/circle/members"),
          fetch("/api/circle/stats"),
          fetch("/api/reengagement/inactive"),
          fetch("/api/circle/messages"),
        ])

        const userData = await userRes.json()
        const membersData = await membersRes.json()
        const statsData = await statsRes.json()
        const inactiveDataRes = await inactiveRes.json()
        const messagesData = await messagesRes.json()

        setUser(userData)
        setMembers(membersData)
        setStats(statsData)
        setInactiveData(inactiveDataRes)
        setCircleMessages(messagesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSendNudge = async (member: InactiveMember) => {
    setSendingNudge(member.id)
    try {
      const response = await fetch("/api/reengagement/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: member.name,
          daysInactive: member.daysInactive,
          lastActivity: "deelname aan pulse",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Nudge gestuurd naar ${member.name}!\n\n${data.nudge.message}`)
      }
    } catch (error) {
      console.error("Failed to send nudge:", error)
      alert("Er ging iets mis bij het versturen van de nudge.")
    } finally {
      setSendingNudge(null)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user) return

    setSendingMessage(true)
    try {
      const response = await fetch("/api/circle/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageInput }),
      })

      if (response.ok) {
        const newMessage = await response.json()
        setCircleMessages([...circleMessages, newMessage])
        setMessageInput("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF0837]" />
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Er is iets misgegaan. Probeer het opnieuw.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        showLogo={true}
        rightContent={
          <div className="flex items-center gap-6">
            <button onClick={() => router.push("/")} className="text-slate-500 hover:text-[#FF0837]">
              Deze Week
            </button>
            <button className="text-slate-700 hover:text-[#FF0837] font-medium">Jouw Cirkel</button>
            <button onClick={() => router.push("/berichten")} className="text-slate-500 hover:text-[#FF0837]">
              Verbindingen
            </button>
            <button className="p-2 hover:bg-[#FFF0F5] rounded-lg">
              <User className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        }
      />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Circle Header */}
        <div className="mb-8">
          <p className="text-[#FF0837] font-medium mb-2">Jouw community</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{user.circleName}</h2>
          <p className="text-lg text-slate-600">Samen groeien we van eenzaamheid naar verbinding.</p>
        </div>

        {/* Circle Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-[#FFE6ED]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-[#FF0837]" />
                <p className="text-sm text-slate-600">Totaal leden</p>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.totalMembers}</p>
            </CardContent>
          </Card>

          <Card className="border-[#FFE6ED]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <p className="text-sm text-slate-600">Actief</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.activeMembers}</p>
            </CardContent>
          </Card>

          <Card className="border-[#FFE6ED]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-[#FF0837]" />
                <p className="text-sm text-slate-600">Warmte</p>
              </div>
              <p className="text-3xl font-bold text-[#FF0837]">{stats.avgWarmth}%</p>
            </CardContent>
          </Card>

          <Card className="border-[#FFE6ED]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-[#FF0837]" />
                <p className="text-sm text-slate-600">Deze week</p>
              </div>
              <p className="text-3xl font-bold text-[#FF0837]">{stats.thisWeekRSVP}</p>
              <p className="text-xs text-slate-500 mt-1">RSVP's</p>
            </CardContent>
          </Card>
        </div>

        {/* Group Chat */}
        <Card className="border-[#FFE6ED] mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-[#FF0837]" />
              <div>
                <CardTitle className="text-xl">Cirkel Chat</CardTitle>
                <CardDescription>Deel updates, stel vragen, moedig elkaar aan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages Area */}
            <div className="mb-4 max-h-96 overflow-y-auto space-y-3 p-4 bg-white rounded-lg border border-slate-100">
              {circleMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-[#FFE6ED] mx-auto mb-3" />
                  <p className="text-slate-600 mb-1">Nog geen berichten</p>
                  <p className="text-sm text-slate-500">Wees de eerste om iets te delen met je cirkel!</p>
                </div>
              ) : (
                circleMessages.map((message) => {
                  const isOwnMessage = message.userId === user.id
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FF0837] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {message.userName.charAt(0)}
                      </div>
                      <div className={`flex-1 max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}>
                        <p className="text-xs text-slate-500 mb-1 px-3">
                          {message.userName} • {getTimeAgo(message.timestamp)}
                        </p>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isOwnMessage
                              ? "bg-[#FF0837] text-white"
                              : "bg-[#FFF0F5] border border-[#FFE6ED] text-slate-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Deel iets met je cirkel..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-[#FFE6ED] focus:border-[#FF0837] focus:outline-none text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sendingMessage}
                className="bg-[#FF0837] hover:bg-[#E6061F] text-white px-6"
              >
                {sendingMessage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Facilitator: Re-engagement Dashboard */}
        {inactiveData && inactiveData.total > 0 && (
          <Card className="border-red-100 bg-gradient-to-br from-red-50/30 to-orange-50/30 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-600" />
                    Facilitator: Re-engagement
                  </CardTitle>
                  <CardDescription>
                    {inactiveData.total} leden zijn stil. Stuur een warme nudge.
                  </CardDescription>
                </div>
                <Badge className="bg-red-100 text-red-700">{inactiveData.total} inactief</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Gentle reminders (Day 4-6) */}
                {inactiveData.grouped.gentle.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">Gentle</Badge>
                      {inactiveData.grouped.gentle.length} leden (4-6 dagen stil)
                    </h4>
                    <div className="space-y-2">
                      {inactiveData.grouped.gentle.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.daysInactive} dagen stil • {member.suggestedAction}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNudge(member)}
                            disabled={sendingNudge === member.id}
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          >
                            {sendingNudge === member.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Send className="h-3 w-3 mr-1" />
                                Stuur reminder
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buddy invitations (Day 7-10) */}
                {inactiveData.grouped.buddy.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Badge className="bg-[#FFE6ED] text-[#FF0837] text-xs">Buddy</Badge>
                      {inactiveData.grouped.buddy.length} leden (7-10 dagen stil)
                    </h4>
                    <div className="space-y-2">
                      {inactiveData.grouped.buddy.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#FFE6ED]">
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.daysInactive} dagen stil • {member.suggestedAction}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNudge(member)}
                            disabled={sendingNudge === member.id}
                            className="border-[#FFE6ED] text-[#FF0837] hover:bg-[#FFF0F5]"
                          >
                            {sendingNudge === member.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Coffee className="h-3 w-3 mr-1" />
                                Buddy match
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community updates (Day 11-14) */}
                {inactiveData.grouped.community.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 text-xs">Community</Badge>
                      {inactiveData.grouped.community.length} leden (11-14 dagen stil)
                    </h4>
                    <div className="space-y-2">
                      {inactiveData.grouped.community.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.daysInactive} dagen stil • {member.suggestedAction}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNudge(member)}
                            disabled={sendingNudge === member.id}
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            {sendingNudge === member.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Send className="h-3 w-3 mr-1" />
                                Stuur update
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilitator alerts (Day 15+) */}
                {inactiveData.grouped.facilitator.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-700 text-xs">Alert</Badge>
                      {inactiveData.grouped.facilitator.length} leden (15+ dagen stil)
                    </h4>
                    <div className="space-y-2">
                      {inactiveData.grouped.facilitator.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-red-600">{member.daysInactive} dagen stil • {member.suggestedAction}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNudge(member)}
                            disabled={sendingNudge === member.id}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            {sendingNudge === member.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Bell className="h-3 w-3 mr-1" />
                                Persoonlijk contact
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Circle Members */}
        <Card className="border-[#FFE6ED]">
          <CardHeader>
            <CardTitle className="text-xl">Cirkelleden</CardTitle>
            <CardDescription>Gesorteerd op warmte & activiteit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => {
                const isCurrentUser = member.id === user.id
                const timeAgo = getTimeAgo(member.lastActive)

                return (
                  <div
                    key={member.id}
                    className={`p-4 rounded-lg border ${
                      isCurrentUser
                        ? "bg-[#FFF0F5] border-[#FFE6ED]"
                        : member.status === "inactive"
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          {isCurrentUser && (
                            <Badge className="bg-[#FFE6ED] text-[#FF0837] text-xs">jij</Badge>
                          )}
                          {member.status === "active" && !isCurrentUser && (
                            <Badge className="bg-green-100 text-green-700 text-xs">actief</Badge>
                          )}
                          {member.status === "quiet" && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs">stil</Badge>
                          )}
                          {member.status === "inactive" && (
                            <Badge className="bg-slate-100 text-slate-600 text-xs">inactief</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>{member.meetupsAttended} bijeenkomsten</span>
                          <span className="text-xs">•</span>
                          <span>Laatst actief: {timeAgo}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                member.warmthScore >= 80
                                  ? "bg-green-500"
                                  : member.warmthScore >= 60
                                  ? "bg-[#FF0837]"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${member.warmthScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 w-10 text-right">
                            {member.warmthScore}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">warmte</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
