"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import ChatWindow from "./chat-window"
import type { User, Message } from "@/types/chat"

// Enhanced mock data with real profile images
const mockContacts: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "5",
    name: "Emma Brown",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "7",
    name: "Grace Lee",
    email: "grace@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    lastSeen: new Date(),
  },
]

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<User[]>(mockContacts)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Load current user
    const userData = localStorage.getItem("chatAppUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    // Load registered users and merge with mock contacts
    const registeredUsers = JSON.parse(localStorage.getItem("chatAppUsers") || "[]")
    const allContacts = [...mockContacts]

    // Add registered users as contacts (excluding current user)
    registeredUsers.forEach((user: any) => {
      if (user.id !== JSON.parse(userData || "{}").id && !allContacts.find((c) => c.email === user.email)) {
        allContacts.push({
          ...user,
          isOnline: Math.random() > 0.5, // Random online status
          lastSeen: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24), // Random last seen
        })
      }
    })

    setContacts(allContacts)

    // Load messages from localStorage
    const savedMessages = localStorage.getItem("chatAppMessages")
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp), // Convert string back to Date
      }))
      setMessages(parsedMessages)
    }

    // Initialize with some mock messages
    const initialMessages: Message[] = [
      {
        id: "1",
        senderId: "1",
        receiverId: "demo-user",
        content: "Hey! How are you doing?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: "text",
      },
      {
        id: "2",
        senderId: "demo-user",
        receiverId: "1",
        content: "I'm doing great! Thanks for asking. How about you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        type: "text",
      },
      {
        id: "3",
        senderId: "2",
        receiverId: "demo-user",
        content: "Are we still on for the meeting tomorrow?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: "text",
      },
    ]

    if (!savedMessages) {
      setMessages(initialMessages)
      localStorage.setItem("chatAppMessages", JSON.stringify(initialMessages))
    }
  }, [])

  const handleSendMessage = (content: string, type: "text" | "image" | "file" = "text") => {
    if (!selectedUser || !currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content,
      timestamp: new Date(),
      type,
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    localStorage.setItem("chatAppMessages", JSON.stringify(updatedMessages))

    // Simulate receiving a reply after a short delay
    setTimeout(
      () => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: selectedUser.id,
          receiverId: currentUser.id,
          content: getRandomReply(),
          timestamp: new Date(),
          type: "text",
        }

        const messagesWithReply = [...updatedMessages, replyMessage]
        setMessages(messagesWithReply)
        localStorage.setItem("chatAppMessages", JSON.stringify(messagesWithReply))
      },
      1000 + Math.random() * 2000,
    )
  }

  const getRandomReply = () => {
    const replies = [
      "Thanks for your message!",
      "That sounds great!",
      "I agree with you.",
      "Let me think about it.",
      "Sure, no problem!",
      "That's interesting.",
      "I'll get back to you on that.",
      "Sounds good to me!",
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }

  const getMessagesForUser = (userId: string) => {
    if (!currentUser) return []
    return messages
      .filter(
        (msg) =>
          (msg.senderId === currentUser.id && msg.receiverId === userId) ||
          (msg.senderId === userId && msg.receiverId === currentUser.id),
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        contacts={contacts}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        messages={messages}
        currentUserId={currentUser?.id || ""}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={getMessagesForUser(selectedUser?.id || "")}
        onSendMessage={handleSendMessage}
        currentUserId={currentUser?.id || ""}
      />
    </div>
  )
}
