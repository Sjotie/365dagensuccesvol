/**
 * Mock data for 365 Hub
 * In production, this would come from PocketBase
 */

import type { PulseA, PulseB, User, UpcomingMeetup, Message, Conversation, CircleMember, CircleStats, CircleMessage } from "./types"

// Calculate dates relative to today
const now = new Date()
const nextWeek = new Date(now)
nextWeek.setDate(now.getDate() + 7)

export const mockUser: User = {
  id: "user_001",
  name: "Anna",
  postcode: "1033",
  availability: "doordeweeks",
  comfort: "korte-groepjes",
  circleId: "circle_noordoost",
  circleName: "Cirkel Noord-oost",
  connectionsCount: 8,
  meetupsAttended: 3,
  warmthScore: 85,
  currentStreak: 5, // 5 days of consecutive engagement
  lastActive: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
  impactScore: 3, // Your presence raised community warmth by +3
}

export const mockPulseA: PulseA = {
  id: "pulse_2024_w42_a",
  type: "A",
  weekNumber: 42,
  expiresAt: nextWeek.toISOString(),
  ritual: {
    letter: "V",
    name: "Vrijheid",
    question: "Welke micro-keuze maakt je week lichter?",
    duration: 3,
  },
  meetup: {
    type: "Stille wandeling",
    location: "Vliegenbos",
    locationDetails: "Ingang Hamerkanaal",
    time: {
      wednesday: "19:00",
      saturday: "10:00",
    },
    duration: 25,
    attending: 12,
    prompt: "Neem 1 zin mee: \"Waar zeg ik ja tegen?\"",
  },
  userRSVP: null,
}

export const mockPulseB: PulseB = {
  id: "pulse_2024_w42_b",
  type: "B",
  weekNumber: 42,
  expiresAt: nextWeek.toISOString(),
  ritual: {
    letter: "R",
    name: "Radicale Aanvaarding",
    question: "Wat mag er zijn vandaag?",
    duration: 3,
  },
  prompt: "Deel in 1 zin: wat heb je deze week geaccepteerd?",
  userResponse: undefined,
  responses: [
    {
      id: "resp_001",
      userId: "user_002",
      userName: "Thomas",
      text: "Dat ik niet alles hoef te begrijpen.",
      timestamp: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: "resp_002",
      userId: "user_003",
      userName: "Sophie",
      text: "Mijn behoefte aan rust.",
      timestamp: new Date(now.getTime() - 7200000).toISOString(),
    },
    {
      id: "resp_003",
      userId: "user_004",
      userName: "Jamal",
      text: "De stilte tussen ons.",
      timestamp: new Date(now.getTime() - 10800000).toISOString(),
    },
  ],
}

export const mockUpcomingMeetups: UpcomingMeetup[] = [
  {
    id: "meetup_001",
    title: "Reflectie-moment",
    time: "Za 10:00",
    location: "Café De Ruimte",
    attending: 15,
    userRegistered: false,
  },
  {
    id: "meetup_002",
    title: "VREDE ritueel",
    time: "Wo 19:00",
    location: "Noorderpark",
    attending: 8,
    userRegistered: false,
  },
]

// localStorage persistence helpers (survives Next.js hot reloads in dev mode)
const PULSE_STORAGE_KEY = "365hub_current_pulse"

function loadPulseFromStorage(): PulseA | PulseB | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(PULSE_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Failed to load pulse from storage:", error)
  }
  return null
}

function savePulseToStorage(pulse: PulseA | PulseB): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(PULSE_STORAGE_KEY, JSON.stringify(pulse))
  } catch (error) {
    console.error("Failed to save pulse to storage:", error)
  }
}

// In-memory storage for demo purposes
// In production, this would be in PocketBase
// Try to load from localStorage first to survive hot reloads
let currentPulse: PulseA | PulseB = loadPulseFromStorage() || mockPulseB
let userRSVP: "wo" | "za" | null = null

export function getActivePulse(): PulseA | PulseB {
  // Try to load from localStorage first (in case of hot reload)
  const stored = loadPulseFromStorage()
  if (stored) {
    currentPulse = stored
  }

  // Return current pulse with user's RSVP if it's Pulse A
  if (currentPulse.type === "A") {
    return {
      ...currentPulse,
      userRSVP,
    }
  }
  return currentPulse
}

export function saveRSVP(timeSlot: "wo" | "za"): void {
  userRSVP = timeSlot
  if (currentPulse.type === "A") {
    currentPulse = {
      ...currentPulse,
      userRSVP: timeSlot,
    }
    savePulseToStorage(currentPulse) // Persist to localStorage
  }
}

export function savePulseBResponse(text: string): void {
  if (currentPulse.type === "B") {
    const newResponse = {
      id: `resp_${Date.now()}`,
      userId: mockUser.id,
      userName: mockUser.name,
      text,
      timestamp: new Date().toISOString(),
    }
    currentPulse = {
      ...currentPulse,
      userResponse: text,
      responses: [newResponse, ...(currentPulse.responses || [])],
    }
    savePulseToStorage(currentPulse) // Persist to localStorage
  }
}

export function addCommunityResponse(memberName: string, text: string, tone?: string): void {
  if (currentPulse.type === "B") {
    const newResponse = {
      id: `resp_ai_${Date.now()}`,
      userId: `user_ai_${memberName.toLowerCase()}`,
      userName: memberName,
      text,
      timestamp: new Date().toISOString(),
    }
    currentPulse = {
      ...currentPulse,
      responses: [newResponse, ...(currentPulse.responses || [])],
    }
    savePulseToStorage(currentPulse) // Persist to localStorage
  }
}

// Mock conversations data
export const mockConversations: Conversation[] = [
  {
    id: "conv_001",
    buddyName: "Thomas",
    buddyId: "user_002",
    lastMessage: "Super, tot zaterdag!",
    lastMessageTime: new Date(now.getTime() - 1800000).toISOString(), // 30 min ago
    unreadCount: 1,
    type: "buddy-match",
  },
  {
    id: "conv_002",
    buddyName: "Sophie",
    buddyId: "user_003",
    lastMessage: "Dat klinkt goed, ik ben erbij.",
    lastMessageTime: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
    unreadCount: 0,
    type: "direct",
  },
  {
    id: "conv_003",
    buddyName: "Jamal",
    buddyId: "user_004",
    lastMessage: "Hoi Anna, ik ben aan jou gekoppeld voor koffie za 10:00 bij Café De Ruimte. Zien we elkaar 25 min?",
    lastMessageTime: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
    unreadCount: 0,
    type: "buddy-match",
  },
]

// Mock messages by conversation ID
const mockMessagesData: Record<string, Message[]> = {
  conv_001: [
    {
      id: "msg_001",
      conversationId: "conv_001",
      fromUserId: "user_002",
      fromUserName: "Thomas",
      text: "Hoi Anna, ik ben aan jou gekoppeld voor koffie za 10:00 bij Café De Ruimte. Zien we elkaar 25 min?",
      timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
      read: true,
    },
    {
      id: "msg_002",
      conversationId: "conv_001",
      fromUserId: mockUser.id,
      fromUserName: mockUser.name,
      text: "Hoi Thomas! Ja leuk, ik zie je daar.",
      timestamp: new Date(now.getTime() - 5400000).toISOString(), // 1.5 hours ago
      read: true,
    },
    {
      id: "msg_003",
      conversationId: "conv_001",
      fromUserId: "user_002",
      fromUserName: "Thomas",
      text: "Super, tot zaterdag!",
      timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 min ago
      read: false,
    },
  ],
  conv_002: [
    {
      id: "msg_004",
      conversationId: "conv_002",
      fromUserId: "user_003",
      fromUserName: "Sophie",
      text: "Hé Anna, ga je ook naar de stille wandeling woensdag?",
      timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
      read: true,
    },
    {
      id: "msg_005",
      conversationId: "conv_002",
      fromUserId: mockUser.id,
      fromUserName: mockUser.name,
      text: "Ja, ik heb me aangemeld! Ga jij ook?",
      timestamp: new Date(now.getTime() - 129600000).toISOString(), // 1.5 days ago
      read: true,
    },
    {
      id: "msg_006",
      conversationId: "conv_002",
      fromUserId: "user_003",
      fromUserName: "Sophie",
      text: "Dat klinkt goed, ik ben erbij.",
      timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
      read: true,
    },
  ],
  conv_003: [
    {
      id: "msg_007",
      conversationId: "conv_003",
      fromUserId: "user_004",
      fromUserName: "Jamal",
      text: "Hoi Anna, ik ben aan jou gekoppeld voor koffie za 10:00 bij Café De Ruimte. Zien we elkaar 25 min?",
      timestamp: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
      read: true,
    },
  ],
}

// In-memory storage for messages
let conversations = [...mockConversations]
let messages = { ...mockMessagesData }

export function getConversations(): Conversation[] {
  return conversations.sort((a, b) =>
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  )
}

export function getMessages(conversationId: string): Message[] {
  return messages[conversationId] || []
}

export function sendMessage(conversationId: string, text: string): Message {
  const conversation = conversations.find(c => c.id === conversationId)
  if (!conversation) {
    throw new Error("Conversation not found")
  }

  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    fromUserId: mockUser.id,
    fromUserName: mockUser.name,
    text,
    timestamp: new Date().toISOString(),
    read: true,
  }

  if (!messages[conversationId]) {
    messages[conversationId] = []
  }
  messages[conversationId].push(newMessage)

  // Update conversation's last message
  const convIndex = conversations.findIndex(c => c.id === conversationId)
  if (convIndex !== -1) {
    conversations[convIndex] = {
      ...conversations[convIndex],
      lastMessage: text,
      lastMessageTime: newMessage.timestamp,
    }
  }

  return newMessage
}

// Mock circle members data
export const mockCircleMembers: CircleMember[] = [
  {
    id: "user_001",
    name: "Anna",
    joinedAt: new Date(now.getTime() - 90 * 86400000).toISOString(), // 90 days ago
    lastActive: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
    meetupsAttended: 3,
    warmthScore: 85,
    status: "active",
  },
  {
    id: "user_002",
    name: "Thomas",
    joinedAt: new Date(now.getTime() - 120 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
    meetupsAttended: 5,
    warmthScore: 92,
    status: "active",
  },
  {
    id: "user_003",
    name: "Sophie",
    joinedAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
    meetupsAttended: 4,
    warmthScore: 88,
    status: "active",
  },
  {
    id: "user_004",
    name: "Jamal",
    joinedAt: new Date(now.getTime() - 75 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
    meetupsAttended: 2,
    warmthScore: 78,
    status: "active",
  },
  {
    id: "user_005",
    name: "Emma",
    joinedAt: new Date(now.getTime() - 45 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
    meetupsAttended: 3,
    warmthScore: 81,
    status: "active",
  },
  {
    id: "user_006",
    name: "David",
    joinedAt: new Date(now.getTime() - 100 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
    meetupsAttended: 6,
    warmthScore: 94,
    status: "active",
  },
  {
    id: "user_007",
    name: "Lena",
    joinedAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
    meetupsAttended: 1,
    warmthScore: 65,
    status: "quiet",
  },
  {
    id: "user_008",
    name: "Mohammed",
    joinedAt: new Date(now.getTime() - 55 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 518400000).toISOString(), // 6 days ago
    meetupsAttended: 2,
    warmthScore: 72,
    status: "quiet",
  },
  {
    id: "user_009",
    name: "Sanne",
    joinedAt: new Date(now.getTime() - 150 * 86400000).toISOString(),
    lastActive: new Date(now.getTime() - 1296000000).toISOString(), // 15 days ago
    meetupsAttended: 1,
    warmthScore: 45,
    status: "inactive",
  },
]

export const mockCircleStats: CircleStats = {
  totalMembers: 9,
  activeMembers: 6,
  avgWarmth: 78,
  totalMeetups: 12,
  thisWeekRSVP: 8,
}

export function getCircleMembers(): CircleMember[] {
  return mockCircleMembers.sort((a, b) => b.warmthScore - a.warmthScore)
}

export function getCircleStats(): CircleStats {
  return mockCircleStats
}

// Create a buddy match conversation
export function createBuddyMatch(buddyName: string, day: string, time: string) {
  const places = ["Café De Ruimte", "Bibliotheek Noord", "Koffiehuis Buurman", "Café Modern"]
  const place = places[Math.floor(Math.random() * places.length)]

  const conversationId = `conv_buddy_${Date.now()}`
  const messageText = `Hoi Anna, ik ben aan jou gekoppeld voor koffie ${day} ${time} bij ${place}. Zien we elkaar 25 min?`

  // Create new conversation
  const newConversation: Conversation = {
    id: conversationId,
    buddyName,
    buddyId: `user_${buddyName.toLowerCase()}`,
    lastMessage: messageText,
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    type: "buddy-match",
  }

  // Create first message
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    fromUserId: `user_${buddyName.toLowerCase()}`,
    fromUserName: buddyName,
    text: messageText,
    timestamp: new Date().toISOString(),
    read: false,
  }

  // Add to conversations and messages
  conversations.unshift(newConversation)
  messages[conversationId] = [newMessage]

  return {
    conversation: newConversation,
    message: newMessage,
  }
}

// Mock circle messages data
const mockCircleMessagesData: CircleMessage[] = [
  {
    id: "circle_msg_001",
    userId: "user_002",
    userName: "Thomas",
    text: "Super energiek moment gisteren! Dank jullie wel.",
    timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: "circle_msg_002",
    userId: "user_003",
    userName: "Sophie",
    text: "Wie gaat er nog meer naar de wandeling woensdag?",
    timestamp: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
  },
  {
    id: "circle_msg_003",
    userId: "user_006",
    userName: "David",
    text: "Ik ben erbij! Zien jullie elkaar bij de ingang?",
    timestamp: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
  },
]

// In-memory storage for circle messages
let circleMessages = [...mockCircleMessagesData]

export function getCircleMessages(): CircleMessage[] {
  return circleMessages.sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

export function sendCircleMessage(text: string): CircleMessage {
  const newMessage: CircleMessage = {
    id: `circle_msg_${Date.now()}`,
    userId: mockUser.id,
    userName: mockUser.name,
    text,
    timestamp: new Date().toISOString(),
  }

  circleMessages.push(newMessage)
  return newMessage
}
