"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Settings, LogOut, MessageCircle } from "lucide-react"
import type { User, Message } from "@/types/chat"
import ProfileModal from "./profile-modal"

interface SidebarProps {
  contacts: User[]
  selectedUser: User | null
  onSelectUser: (user: User) => void
  messages: Message[]
  currentUserId: string
}

export default function Sidebar({ contacts, selectedUser, onSelectUser, messages, currentUserId }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [currentUserData, setCurrentUserData] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("chatAppUser")
    if (userData) {
      setCurrentUserData(JSON.parse(userData))
    }
  }, [])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getLastMessage = (userId: string) => {
    const userMessages = messages.filter(
      (msg) =>
        (msg.senderId === currentUserId && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === currentUserId),
    )
    return userMessages[userMessages.length - 1]
  }

  const getUnreadCount = (userId: string) => {
    // Mock unread count - in real app, this would come from backend
    return Math.floor(Math.random() * 3)
  }

  const handleLogout = () => {
    localStorage.removeItem("chatAppToken")
    localStorage.removeItem("chatAppUser")
    router.push("/")
  }

  const handleProfileSave = (updatedUser: User) => {
    localStorage.setItem("chatAppUser", JSON.stringify(updatedUser))
    setCurrentUserData(updatedUser)
  }

  const formatTime = (date: Date | string) => {
    // Ensure we have a Date object
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "unknown"
    }

    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8" />
            <h1 className="text-xl font-bold">ChatApp</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-700"
              onClick={() => setShowProfileModal(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-green-700" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No contacts found" : "No contacts available"}
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const lastMessage = getLastMessage(contact.id)
            const unreadCount = getUnreadCount(contact.id)
            const isSelected = selectedUser?.id === contact.id

            return (
              <div
                key={contact.id}
                onClick={() => onSelectUser(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-green-50 border-l-4 border-l-green-600" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">{formatTime(lastMessage.timestamp)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage ? lastMessage.content : "No messages yet"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {contact.isOnline ? "Online" : `Last seen ${formatTime(contact.lastSeen)}`}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
      {currentUserData && (
        <ProfileModal
          user={currentUserData}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  )
}
