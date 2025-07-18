"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, ImageIcon, FileText, Smile, Phone, VideoIcon, MoreVertical, Mic } from "lucide-react"
import type { User, Message } from "@/types/chat"

// Add these imports at the top
import EmojiPicker from "./emoji-picker"
import MediaPicker from "./media-picker"

interface ChatWindowProps {
  selectedUser: User | null
  messages: Message[]
  onSendMessage: (content: string, type?: "text" | "image" | "file" | "audio") => void
  currentUserId: string
}

export default function ChatWindow({ selectedUser, messages, onSendMessage, currentUserId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add these state variables after the existing ones
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedUser) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedUser) {
      const fileType = file.type.startsWith("image/") ? "image" : "file"
      onSendMessage(`Shared ${file.name}`, fileType)
    }
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Invalid time"
    }

    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateObj.toDateString() === today.toDateString()) {
      return "Today"
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: dateObj.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  // Add these handler functions before the return statement
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  const handleMediaSelect = (file: File, type: "image" | "video" | "file" | "audio") => {
    const fileName = file.name
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB"
    onSendMessage(`📎 ${fileName} (${fileSize})`, type)
  }

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onSendMessage(`📍 Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, "text")
        },
        () => {
          onSendMessage("📍 Location: Unable to get current location", "text")
        },
      )
    } else {
      onSendMessage("📍 Location sharing not supported", "text")
    }
  }

  const handleContactShare = () => {
    // Simulate contact sharing
    onSendMessage("👤 Contact: John Doe (+1 234-567-8900)", "text")
  }

  const handleVoiceCall = () => {
    alert(`Starting voice call with ${selectedUser?.name}...`)
  }

  const handleVideoCall = () => {
    alert(`Starting video call with ${selectedUser?.name}...`)
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false)
        onSendMessage("🎤 Voice message (0:05)", "audio")
      }, 3000)
    }
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L2 22l5.65-1.05C9.96 21.64 11.46 22 13 22h-1c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to ChatApp</h3>
          <p className="text-gray-500">Select a contact to start messaging</p>
        </div>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = message.timestamp.toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {selectedUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedUser.isOnline ? "Online" : `Last seen ${formatTime(selectedUser.lastSeen)}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleVoiceCall}>
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleVideoCall}>
              <VideoIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex justify-center mb-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                {formatDate(new Date(date))}
              </span>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message) => {
              const isOwn = message.senderId === currentUserId
              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isOwn ? "bg-green-600 text-white rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {message.type === "image" && (
                      <div className="mb-2">
                        <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    )}
                    {message.type === "file" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">File attachment</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? "text-green-100" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="relative">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowMediaPicker(!showMediaPicker)}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <MediaPicker
              onMediaSelect={handleMediaSelect}
              onLocationShare={handleLocationShare}
              onContactShare={handleContactShare}
              isOpen={showMediaPicker}
              onClose={() => setShowMediaPicker(false)}
            />
          </div>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-10"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="w-4 h-4" />
              </Button>
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                isOpen={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          </div>

          {newMessage.trim() ? (
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              className={`${isRecording ? "bg-red-600 animate-pulse" : "bg-green-600"} hover:bg-green-700`}
              onClick={handleVoiceRecord}
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </form>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  )
}
