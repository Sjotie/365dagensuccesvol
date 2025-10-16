"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Heart, MapPin, Clock, User, Coffee, Loader2 } from "lucide-react"
import { downloadICS } from "@/lib/ics"
import type { PulseA, PulseB, User as UserType, UpcomingMeetup, ActivePulse, Conversation } from "@/lib/types"
import { WarmthWidget } from "@/components/WarmthWidget"

// VREDE emoji mapping
const VREDE_EMOJIS = {
  V: "🕊️",
  R: "💫",
  E: "✨",
  D: "🌊",
  E2: "🌟",
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
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minuut" : "minuten"} geleden`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "uur" : "uur"} geleden`
  if (diffDays === 1) return "gisteren"
  if (diffDays < 7) return `${diffDays} dagen geleden`
  return past.toLocaleDateString("nl-NL", { day: "numeric", month: "short" })
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [pulse, setPulse] = useState<ActivePulse | null>(null)
  const [meetups, setMeetups] = useState<UpcomingMeetup[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [responseLoading, setResponseLoading] = useState(false)
  const [aiSimulating, setAiSimulating] = useState(false)
  const [buddyMatching, setBuddyMatching] = useState(false)
  const [meetupRegistering, setMeetupRegistering] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, pulseRes, meetupsRes, conversationsRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/pulse/active"),
          fetch("/api/meetups"),
          fetch("/api/messages"),
        ])

        const userData = await userRes.json()
        const pulseData = await pulseRes.json()
        const meetupsData = await meetupsRes.json()
        const conversationsData = await conversationsRes.json()

        setUser(userData)
        setPulse(pulseData)
        setMeetups(meetupsData)
        setConversations(conversationsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRSVP = async (timeSlot: "wo" | "za") => {
    if (!pulse || pulse.type !== "A") return

    setRsvpLoading(true)

    try {
      // Save RSVP to backend
      const response = await fetch("/api/pulse/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSlot }),
      })

      if (response.ok) {
        // Update local state
        setPulse({ ...pulse, userRSVP: timeSlot })

        // Download calendar file
        handleAddToCalendar(timeSlot)
      }
    } catch (error) {
      console.error("Failed to save RSVP:", error)
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleResponseSubmit = async () => {
    if (!responseText.trim() || !pulse || pulse.type !== "B") return

    setResponseLoading(true)

    try {
      const response = await fetch("/api/pulse/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: responseText }),
      })

      if (response.ok) {
        // Refresh pulse data to get updated responses
        const pulseRes = await fetch("/api/pulse/active")
        const pulseData = await pulseRes.json()
        setPulse(pulseData)
        setResponseText("")
      }
    } catch (error) {
      console.error("Failed to save response:", error)
    } finally {
      setResponseLoading(false)
    }
  }

  const handleSimulateActivity = async () => {
    if (!pulse || pulse.type !== "B") return

    setAiSimulating(true)

    try {
      const response = await fetch("/api/community/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ritualName: `${pulse.ritual.letter} van ${pulse.ritual.name}`,
          ritualQuestion: pulse.ritual.question,
          memberName: ["Thomas", "Sophie", "Jamal", "Emma", "David"][Math.floor(Math.random() * 5)],
        }),
      })

      if (response.ok) {
        // Refresh pulse data to get updated responses
        const pulseRes = await fetch("/api/pulse/active")
        const pulseData = await pulseRes.json()
        setPulse(pulseData)
      }
    } catch (error) {
      console.error("Failed to simulate activity:", error)
    } finally {
      setAiSimulating(false)
    }
  }

  const handleBuddyMatch = async () => {
    setBuddyMatching(true)

    try {
      const response = await fetch("/api/buddy/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: "za",
          time: "10:00",
        }),
      })

      if (response.ok) {
        // Redirect to messages to see the new buddy match
        router.push("/berichten")
      }
    } catch (error) {
      console.error("Failed to create buddy match:", error)
    } finally {
      setBuddyMatching(false)
    }
  }

  const handleMeetupRSVP = async (meetupId: string) => {
    setMeetupRegistering(meetupId)

    try {
      const response = await fetch("/api/meetups/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetupId }),
      })

      if (response.ok) {
        // Update local state to mark meetup as registered
        setMeetups((prevMeetups) =>
          prevMeetups.map((m) =>
            m.id === meetupId ? { ...m, userRegistered: true, attending: m.attending + 1 } : m
          )
        )
      }
    } catch (error) {
      console.error("Failed to register for meetup:", error)
    } finally {
      setMeetupRegistering(null)
    }
  }

  const handleAddToCalendar = (timeSlot: "wo" | "za") => {
    if (!pulse || pulse.type !== "A") return

    const now = new Date()
    const eventDate = new Date(now)

    if (timeSlot === "wo") {
      const daysUntilWednesday = (3 - now.getDay() + 7) % 7 || 7
      eventDate.setDate(now.getDate() + daysUntilWednesday)
      eventDate.setHours(
        parseInt(pulse.meetup.time.wednesday?.split(":")[0] || "19"),
        parseInt(pulse.meetup.time.wednesday?.split(":")[1] || "0"),
        0,
        0
      )
    } else {
      const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7
      eventDate.setDate(now.getDate() + daysUntilSaturday)
      eventDate.setHours(
        parseInt(pulse.meetup.time.saturday?.split(":")[0] || "10"),
        parseInt(pulse.meetup.time.saturday?.split(":")[1] || "0"),
        0,
        0
      )
    }

    const endDate = new Date(eventDate)
    endDate.setMinutes(endDate.getMinutes() + pulse.meetup.duration)

    downloadICS(
      {
        title: `${pulse.ritual.letter} van ${pulse.ritual.name} — ${pulse.meetup.type}`,
        description: `VREDE ritueel: ${pulse.ritual.question}\n\n${pulse.meetup.prompt}\n\nWe lopen ${pulse.meetup.duration} minuten samen in stilte door het ${pulse.meetup.location}.`,
        location: `${pulse.meetup.location}, ${pulse.meetup.locationDetails}, Amsterdam Noord`,
        startTime: eventDate,
        endTime: endDate,
      },
      `365hub-vrede-${timeSlot === "wo" ? "woensdag" : "zaterdag"}.ics`
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF0837]" />
      </div>
    )
  }

  if (!user || !pulse) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Er is iets misgegaan. Probeer het opnieuw.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - 365dagensuccesvol style */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/365-logo.svg" alt="365 Hub" className="h-10 w-10" />
              <span className="text-xl font-bold text-slate-900">365 Hub</span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-slate-700 hover:text-[#FF0837] font-medium text-sm">Deze Week</button>
              <button
                onClick={() => router.push("/cirkel")}
                className="text-slate-600 hover:text-[#FF0837] text-sm"
              >
                Jouw Cirkel
              </button>
              <button
                onClick={() => router.push("/berichten")}
                className="text-slate-600 hover:text-[#FF0837] relative text-sm"
              >
                Verbindingen
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
                  <span className="absolute -top-1 -right-3 bg-[#FF0837] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push("/whatsapp")}
                className="text-white bg-[#FF0837] hover:bg-[#E6061F] px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                WhatsApp Demo →
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <User className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Personal Welcome */}
        <div className="mb-8">
          <p className="text-[#FF0837] font-medium mb-2">Welkom in</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{user.circleName} 👋</h2>
          <p className="text-lg text-slate-600">Van eenzaamheid naar verbinding. Dit is wat er deze week gebeurt.</p>
        </div>

        {/* This Week's Pulse - Center Stage */}
        <Card className="mb-8 border-2 border-[#FFE6ED] shadow-lg bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* VREDE Ritual */}
              <div className="border-b border-slate-200 pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{VREDE_EMOJIS[pulse.ritual.letter]}</span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {pulse.ritual.letter} van {pulse.ritual.name}
                  </h3>
                  <Badge className="bg-[#FFF0F5] text-[#FF0837]">{pulse.ritual.duration} min ritueel</Badge>
                </div>
                <p className="text-lg text-slate-700 italic">
                  "{pulse.ritual.question}"
                </p>
              </div>

              {/* Pulse A - Meetup Proposal */}
              {pulse.type === "A" && (
                <div>
                  <p className="text-slate-600 mb-4">Laten we samen deze vraag verkennen:</p>
                  <div className="bg-[#FFF0F5] rounded-xl p-6 mb-6 border border-[#FFE6ED]">
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="h-6 w-6 text-[#FF0837] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                          {pulse.meetup.type} — {pulse.meetup.location}
                        </h4>
                        <div className="space-y-2 text-slate-700">
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#FF0837]" />
                            {pulse.meetup.duration} minuten samen lopen
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#FF0837]" />
                            {pulse.meetup.attending} mensen komen • {pulse.meetup.locationDetails}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic mb-4">
                      {pulse.meetup.prompt}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button
                      size="lg"
                      onClick={() => handleRSVP("wo")}
                      disabled={rsvpLoading || pulse.userRSVP === "wo"}
                      className="bg-[#FF0837] hover:bg-[#E6061F] text-white text-lg py-6 font-medium"
                    >
                      {rsvpLoading ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="h-5 w-5 mr-2" />
                      )}
                      {pulse.userRSVP === "wo" ? "✓ " : ""}Ja, wo {pulse.meetup.time.wednesday} in agenda
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleRSVP("za")}
                      disabled={rsvpLoading || pulse.userRSVP === "za"}
                      className="border-2 border-[#FF0837] text-[#FF0837] hover:bg-[#FFF0F5] text-lg py-6 font-medium"
                    >
                      {pulse.userRSVP === "za" ? "✓ " : ""}Liever za {pulse.meetup.time.saturday}
                    </Button>
                  </div>
                </div>
              )}

              {/* Pulse B - Community Response */}
              {pulse.type === "B" && (
                <div>
                  <p className="text-slate-600 mb-4">{pulse.prompt}</p>

                  {/* Response Input */}
                  {!pulse.userResponse ? (
                    <div className="bg-[#FFF0F5] rounded-xl p-6 mb-6 border border-[#FFE6ED]">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Deel jouw ervaring in 1 zin..."
                        maxLength={150}
                        className="w-full p-4 rounded-lg border-2 border-[#FFE6ED] focus:border-[#FF0837] focus:outline-none resize-none bg-white"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-slate-500">
                          {responseText.length}/150 karakters
                        </span>
                        <Button
                          onClick={handleResponseSubmit}
                          disabled={!responseText.trim() || responseLoading}
                          className="bg-[#FF0837] hover:bg-[#E6061F] text-white font-medium"
                        >
                          {responseLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Delen...
                            </>
                          ) : (
                            "Deel jouw acceptatie"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FFF0F5] rounded-xl p-6 mb-6 border-2 border-[#FFE6ED]">
                      <p className="text-sm text-[#FF0837] font-medium mb-2">Jouw reactie:</p>
                      <p className="text-lg text-slate-900 font-medium">"{pulse.userResponse}"</p>
                    </div>
                  )}

                  {/* Community Responses */}
                  {pulse.responses && pulse.responses.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-slate-900">
                          Wat anderen accepteerden deze week
                        </h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSimulateActivity}
                          disabled={aiSimulating}
                          className="text-xs border-[#FFE6ED] text-[#FF0837] hover:bg-[#FFF0F5]"
                        >
                          {aiSimulating ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              AI denkt...
                            </>
                          ) : (
                            "🤖 Simuleer activiteit"
                          )}
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {pulse.responses.map((response) => {
                          const isOwnResponse = response.userId === user.id
                          const timeAgo = getTimeAgo(response.timestamp)

                          return (
                            <div
                              key={response.id}
                              className={`p-4 rounded-lg ${
                                isOwnResponse
                                  ? "bg-[#FFF0F5] border-2 border-[#FFE6ED]"
                                  : "bg-white border border-slate-200"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <p className="text-slate-900">
                                    <span className="font-semibold">{response.userName}</span>
                                    {isOwnResponse && (
                                      <span className="ml-2 text-xs text-[#FF0837] font-medium">(jij)</span>
                                    )}
                                  </p>
                                  <p className="text-slate-700 mt-1">"{response.text}"</p>
                                  <p className="text-xs text-slate-500 mt-2">{timeAgo}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Warmth Widget */}
          <WarmthWidget user={user} />

          {/* Your Connections */}
          <Card className="border-[#FFE6ED]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-[#FF0837]" />
                <h3 className="text-xl font-bold text-slate-900">Jouw verbindingen</h3>
              </div>
              <div className="space-y-3">
                <p className="text-3xl font-bold text-[#FF0837]">{user.connectionsCount} mensen</p>
                <p className="text-slate-600">ontmoet in {user.meetupsAttended} bijeenkomsten</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    Sinds je gestart bent, ben je van eenzaamheid naar verbinding gegaan 🌱
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coffee Buddy */}
          <Card className="border-[#FFE6ED] bg-[#FFF0F5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="h-6 w-6 text-[#FF0837]" />
                <h3 className="text-xl font-bold text-slate-900">Koffie-buddy</h3>
              </div>
              <p className="text-slate-700 mb-4">
                Deze week een koffie-buddy in je buurt? 25 min is genoeg.
              </p>
              <div className="grid gap-2 grid-cols-2">
                <Button
                  onClick={handleBuddyMatch}
                  disabled={buddyMatching}
                  className="bg-[#FF0837] hover:bg-[#E6061F] text-white font-medium"
                >
                  {buddyMatching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Koppelen...
                    </>
                  ) : (
                    "Ja, koppel me"
                  )}
                </Button>
                <Button variant="ghost" className="text-slate-600">
                  Niet nu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming in Your Circle */}
        <Card className="border-[#FFE6ED]">
          <CardHeader>
            <CardTitle className="text-xl">Volgende bijeenkomsten in jouw cirkel</CardTitle>
            <CardDescription>Nog niet ingeschreven? Dat kan nog!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetups.map((meetup) => (
                <div
                  key={meetup.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#FFF0F5] transition-colors"
                >
                  <Calendar className="h-5 w-5 text-[#FF0837] mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{meetup.time} — {meetup.title}</p>
                    <p className="text-sm text-slate-600">{meetup.location} • {meetup.attending} mensen komen</p>
                  </div>
                  <Button
                    size="sm"
                    variant={meetup.userRegistered ? "default" : "ghost"}
                    className={meetup.userRegistered ? "bg-[#FF0837] text-white font-medium" : "text-[#FF0837]"}
                    onClick={() => !meetup.userRegistered && handleMeetupRSVP(meetup.id)}
                    disabled={meetupRegistering === meetup.id || meetup.userRegistered}
                  >
                    {meetupRegistering === meetup.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ...
                      </>
                    ) : meetup.userRegistered ? (
                      "✓ Aangemeld"
                    ) : (
                      "Aanmelden →"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
