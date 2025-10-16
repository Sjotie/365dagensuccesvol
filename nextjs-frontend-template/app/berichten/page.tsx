"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Loader2, MessageCircle, User } from "lucide-react"
import { Header } from "@/components/Header"
import type { Conversation, Message } from "@/lib/types"

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
  return past.toLocaleDateString("nl-NL", { day: "numeric", month: "short" })
}

export default function BerichtenPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendLoading, setSendLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations on mount
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch("/api/messages")
        const data = await response.json()
        setConversations(data)
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const conversationId = selectedConversation.id
      async function fetchMessages() {
        try {
          const response = await fetch(`/api/messages/${conversationId}`)
          const data = await response.json()
          setMessages(data)
        } catch (error) {
          console.error("Failed to fetch messages:", error)
        }
      }

      fetchMessages()
    }
  }, [selectedConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return

    setSendLoading(true)

    try {
      const response = await fetch(`/api/messages/${selectedConversation.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      })

      if (response.ok) {
        const newMessage = await response.json()
        setMessages([...messages, newMessage])
        setMessageText("")

        // Update conversation in list
        const updatedConversations = conversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: messageText, lastMessageTime: newMessage.timestamp }
            : conv
        )
        setConversations(updatedConversations)
        setSelectedConversation({
          ...selectedConversation,
          lastMessage: messageText,
          lastMessageTime: newMessage.timestamp,
        })
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSendLoading(false)
    }
  }

  const handleBackToInbox = () => {
    setSelectedConversation(null)
    setMessages([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF0837]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation with Logo */}
      <Header
        showLogo={false}
        rightContent={
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-[#FF0837] hover:text-[#E6061F] -ml-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 flex-1">
              {selectedConversation ? selectedConversation.buddyName : "Berichten"}
            </h1>
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <User className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        }
      />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {!selectedConversation ? (
          /* Inbox View */
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Jouw verbindingen</h2>
              <p className="text-slate-600">Berichten met je buddy matches en cirkelgenoten</p>
            </div>

            {conversations.length === 0 ? (
              <Card className="border-[#FFE6ED]">
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-[#FFE6ED] mx-auto mb-4" />
                  <p className="text-lg text-slate-600 mb-2">Nog geen berichten</p>
                  <p className="text-sm text-slate-500">
                    Zodra je gekoppeld wordt aan een buddy, verschijnen je gesprekken hier.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {conversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    className="border-[#FFE6ED] hover:border-[#FF0837] transition-colors cursor-pointer"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FF0837] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {conversation.buddyName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 text-lg">
                              {conversation.buddyName}
                            </h3>
                            {conversation.type === "buddy-match" && (
                              <Badge className="bg-[#FFF0F5] text-[#FF0837] text-xs">
                                Buddy Match
                              </Badge>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-[#FF0837] text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-slate-400">
                            {getTimeAgo(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Thread View */
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <Card className="border-[#FFE6ED] flex-1 flex flex-col overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.fromUserId === "user_001" // mockUser.id
                  const showAvatar =
                    index === 0 ||
                    messages[index - 1].fromUserId !== message.fromUserId

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        isOwnMessage ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {showAvatar && !isOwnMessage && (
                        <div className="w-8 h-8 rounded-full bg-[#FF0837] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {message.fromUserName.charAt(0)}
                        </div>
                      )}
                      {!showAvatar && !isOwnMessage && <div className="w-8" />}

                      <div
                        className={`max-w-[70%] ${
                          isOwnMessage ? "items-end" : "items-start"
                        }`}
                      >
                        {showAvatar && !isOwnMessage && (
                          <p className="text-xs text-slate-500 mb-1 px-3">
                            {message.fromUserName}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isOwnMessage
                              ? "bg-[#FF0837] text-white"
                              : "bg-white border border-slate-200 text-slate-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <p
                          className={`text-xs text-slate-400 mt-1 px-3 ${
                            isOwnMessage ? "text-right" : "text-left"
                          }`}
                        >
                          {getTimeAgo(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-[#FFE6ED] p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Typ een bericht..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[#FFE6ED] focus:border-[#FF0837] focus:outline-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendLoading}
                    className="bg-[#FF0837] hover:bg-[#E6061F] text-white px-6"
                  >
                    {sendLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
