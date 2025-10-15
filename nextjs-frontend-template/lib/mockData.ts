/**
 * Mock data for 365 Hub
 * In production, this would come from PocketBase
 */

import type { PulseA, PulseB, User, UpcomingMeetup, Message, Conversation } from "./types"

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

// In-memory storage for demo purposes
// In production, this would be in PocketBase
let currentPulse: PulseA | PulseB = mockPulseB // Changed to Pulse B for Phase 2
let userRSVP: "wo" | "za" | null = null

export function getActivePulse(): PulseA | PulseB {
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
