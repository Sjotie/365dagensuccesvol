/**
 * AI Simulator - "Stille Regisseur"
 *
 * Simulates community activity to make the circle feel alive
 * Following PLAN.md principles: kort-maar-warm, realistic, connection-focused
 */

import type { PulseResponse, Conversation, Message } from "./types"

// Pool of realistic Dutch names for simulated members
const CIRCLE_MEMBERS = [
  "Thomas", "Sophie", "Jamal", "Emma", "Lucas",
  "Noor", "Bas", "Lisa", "Omar", "Nina",
  "Daan", "Fatima", "Max", "Layla", "Tim",
  "Aisha", "Finn", "Zara", "Jesse", "Amira"
]

// Pool of realistic responses for Pulse B prompts
// Following VREDE themes: Vrijheid, Radicale Aanvaarding, Essentie, Doelloosheid, Eenheid
const PULSE_RESPONSES = {
  "Radicale Aanvaarding": [
    "Dat ik niet alles hoef te begrijpen.",
    "Mijn behoefte aan rust.",
    "De stilte tussen ons.",
    "Dat het goed genoeg is.",
    "Mijn eigen tempo.",
    "Dat het mag duren.",
    "De onzekerheid.",
    "Mijn twijfel.",
    "Dat ik hulp nodig heb.",
    "De chaos van deze week.",
    "Dat ik me klein voelde.",
    "Mijn grenzen."
  ],
  "Vrijheid": [
    "Nee zeggen tegen de drinks.",
    "Een halve dag offline zijn.",
    "Vroeger naar bed.",
    "Een rondje lopen ipv scrollen.",
    "Geen uitleg geven.",
    "Koffie zonder schuldgevoel.",
    "Zelf kiezen wanneer ik antwoord.",
    "De was laten liggen.",
    "Niet opnemen.",
    "Een middag zonder plan."
  ],
  "Essentie": [
    "Tijd met mijn kind.",
    "Een gesprek aan tafel.",
    "Stilte.",
    "Mijn ochtendkoffie.",
    "Een wandeling.",
    "Contact.",
    "Muziek luisteren.",
    "Eten koken.",
    "Niets doen.",
    "Een boek vasthouden."
  ],
  "Doelloosheid": [
    "Ronddwalen in de stad.",
    "Zitten zonder reden.",
    "Kijken uit het raam.",
    "Een gesprek zonder agenda.",
    "Geen to-do's.",
    "Gewoon zijn.",
    "Een rondje fietsen.",
    "Thee drinken zonder haast.",
    "Niet weten waar het heen gaat.",
    "Loslaten van het plan."
  ],
  "Eenheid": [
    "We begrepen elkaar zonder woorden.",
    "Iemand zag me echt.",
    "Samen stil zijn voelde goed.",
    "De groep droeg me.",
    "Iemand nam tijd voor me.",
    "We lachten om hetzelfde.",
    "Geen uitleg nodig.",
    "Erbij horen zonder te presteren.",
    "Samen ademhalen.",
    "Alleen maar aanwezig zijn."
  ]
}

// Generate a simulated Pulse B response
export function generatePulseResponse(
  ritualName: string,
  excludeUserIds: string[] = []
): PulseResponse {
  // Get unused member name
  const usedMembers = excludeUserIds.map(id => id.split("_")[1])
  const availableMembers = CIRCLE_MEMBERS.filter(
    name => !usedMembers.includes(name.toLowerCase())
  )

  if (availableMembers.length === 0) {
    // If all members used, pick a random one
    const randomMember = CIRCLE_MEMBERS[Math.floor(Math.random() * CIRCLE_MEMBERS.length)]
    const userId = `user_${Date.now()}_${randomMember.toLowerCase()}`

    return {
      id: `resp_${Date.now()}`,
      userId,
      userName: randomMember,
      text: getRandomResponse(ritualName),
      timestamp: new Date().toISOString(),
    }
  }

  const memberName = availableMembers[Math.floor(Math.random() * availableMembers.length)]
  const userId = `user_sim_${memberName.toLowerCase()}`

  return {
    id: `resp_${Date.now()}`,
    userId,
    userName: memberName,
    text: getRandomResponse(ritualName),
    timestamp: new Date().toISOString(),
  }
}

// Get a random response for a given ritual theme
function getRandomResponse(ritualName: string): string {
  // Find matching theme in PULSE_RESPONSES
  const theme = Object.keys(PULSE_RESPONSES).find(key =>
    ritualName.includes(key)
  ) as keyof typeof PULSE_RESPONSES | undefined

  if (!theme) {
    // Fallback to Radicale Aanvaarding
    const responses = PULSE_RESPONSES["Radicale Aanvaarding"]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const responses = PULSE_RESPONSES[theme]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Simulate a new buddy match conversation
export function generateBuddyMatch(existingConversations: Conversation[]): Conversation {
  const usedMembers = existingConversations.map(c => c.buddyName)
  const availableMembers = CIRCLE_MEMBERS.filter(name => !usedMembers.includes(name))

  if (availableMembers.length === 0) {
    throw new Error("No available members for buddy match")
  }

  const buddyName = availableMembers[Math.floor(Math.random() * availableMembers.length)]
  const buddyId = `user_sim_${buddyName.toLowerCase()}`

  // Generate buddy match message following PLAN.md template
  const locations = [
    "Café De Ruimte",
    "Bibliotheek Noord",
    "Café Modern",
    "Koffie Academie",
    "De Groene Oase"
  ]
  const location = locations[Math.floor(Math.random() * locations.length)]

  const times = ["za 10:00", "za 14:00", "wo 19:00", "do 18:30"]
  const time = times[Math.floor(Math.random() * times.length)]

  const message = `Hoi Anna, ik ben aan jou gekoppeld voor koffie ${time} bij ${location}. Zien we elkaar 25 min?`

  return {
    id: `conv_${Date.now()}`,
    buddyName,
    buddyId,
    lastMessage: message,
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    type: "buddy-match",
  }
}

// Simulate RSVP count increase (people joining meetups)
export function simulateRSVPIncrease(currentCount: number): number {
  // Randomly increase by 1-3 people
  const increase = Math.floor(Math.random() * 3) + 1
  return currentCount + increase
}

// Check if we should simulate activity based on time and probability
export function shouldSimulateActivity(
  lastActivityTime: Date,
  activityType: "pulse_response" | "buddy_match" | "rsvp_increase"
): boolean {
  const now = new Date()
  const minutesSinceLastActivity = (now.getTime() - lastActivityTime.getTime()) / 60000

  // Activity probabilities (per minute)
  const probabilities = {
    pulse_response: 0.15, // 15% chance per minute after 5 min
    buddy_match: 0.05,    // 5% chance per minute after 30 min
    rsvp_increase: 0.10,  // 10% chance per minute after 10 min
  }

  const minWaitTimes = {
    pulse_response: 5,    // Wait at least 5 minutes
    buddy_match: 30,      // Wait at least 30 minutes
    rsvp_increase: 10,    // Wait at least 10 minutes
  }

  // Don't simulate if not enough time has passed
  if (minutesSinceLastActivity < minWaitTimes[activityType]) {
    return false
  }

  // Probability increases with time (up to 2x after an hour)
  const timeMultiplier = Math.min(minutesSinceLastActivity / 60, 2)
  const probability = probabilities[activityType] * timeMultiplier

  return Math.random() < probability
}

// Generate initial community responses for a new Pulse B
export function generateInitialResponses(
  ritualName: string,
  count: number = 3
): PulseResponse[] {
  const responses: PulseResponse[] = []
  const usedUserIds: string[] = []

  for (let i = 0; i < count; i++) {
    const response = generatePulseResponse(ritualName, usedUserIds)

    // Make timestamp progressively older
    const hoursAgo = count - i
    const timestamp = new Date(Date.now() - hoursAgo * 3600000)
    response.timestamp = timestamp.toISOString()

    responses.push(response)
    usedUserIds.push(response.userId)
  }

  return responses
}
