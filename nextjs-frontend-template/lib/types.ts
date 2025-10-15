/**
 * Type definitions for 365 Hub
 */

export interface User {
  id: string
  name: string
  postcode: string
  availability: "doordeweeks" | "weekend" | "beide"
  comfort: "korte-groepjes" | "grote-groepen" | "1-op-1"
  circleId: string
  circleName: string
  connectionsCount: number
  meetupsAttended: number
}

export interface VREDERitual {
  letter: "V" | "R" | "E" | "D" | "E2"
  name: string
  question: string
  duration: number // in minutes
}

export interface Meetup {
  type: string // "Stille wandeling", "Koffie-moment", etc.
  location: string
  locationDetails: string // "Ingang Hamerkanaal"
  time: {
    wednesday?: string // "19:00"
    saturday?: string // "10:00"
  }
  duration: number // in minutes
  attending: number
  prompt: string // "Neem 1 zin mee: ..."
}

export interface PulseA {
  id: string
  type: "A"
  weekNumber: number
  expiresAt: string // ISO date string
  ritual: VREDERitual
  meetup: Meetup
  userRSVP?: "wo" | "za" | null
}

export interface PulseResponse {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: string
}

export interface PulseB {
  id: string
  type: "B"
  weekNumber: number
  expiresAt: string
  ritual: VREDERitual
  prompt: string
  userResponse?: string
  responses?: PulseResponse[]
}

export type ActivePulse = PulseA | PulseB

export interface BuddyMatch {
  id: string
  buddyName: string
  message: string
  timestamp: string
  status: "pending" | "accepted" | "declined"
}

export interface UpcomingMeetup {
  id: string
  title: string
  time: string // "Za 10:00"
  location: string
  attending: number
  userRegistered: boolean
}

export interface Message {
  id: string
  conversationId: string
  fromUserId: string
  fromUserName: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  buddyName: string
  buddyId: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  type: "buddy-match" | "direct"
}
