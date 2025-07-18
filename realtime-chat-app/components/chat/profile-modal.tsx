"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Save } from "lucide-react"
import type { User } from "@/types/chat"

interface ProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: (updatedUser: User) => void
}

export default function ProfileModal({ user, isOpen, onClose, onSave }: ProfileModalProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [avatar, setAvatar] = useState(user.avatar)

  if (!isOpen) return null

  const handleSave = () => {
    const updatedUser = { ...user, name, email, avatar }
    onSave(updatedUser)
    onClose()
  }

  const profileImages = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="grid grid-cols-4 gap-2">
              {profileImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setAvatar(img)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    avatar === img ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
