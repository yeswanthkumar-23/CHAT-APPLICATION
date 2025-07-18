export interface User {
  id: string
  name: string
  email: string
  avatar: string
  isOnline: boolean
  lastSeen: Date | string // Allow both Date and string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date | string // Allow both Date and string
  type: "text" | "image" | "file" | "audio" | "video"
}

export interface ChatRoom {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
}
