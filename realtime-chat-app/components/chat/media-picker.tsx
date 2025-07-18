"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, FileText, Video, Mic, MapPin, Contact } from "lucide-react"

interface MediaPickerProps {
  onMediaSelect: (file: File, type: "image" | "video" | "file" | "audio") => void
  onLocationShare: () => void
  onContactShare: () => void
  isOpen: boolean
  onClose: () => void
}

export default function MediaPicker({
  onMediaSelect,
  onLocationShare,
  onContactShare,
  isOpen,
  onClose,
}: MediaPickerProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "file" | "audio") => {
    const file = e.target.files?.[0]
    if (file) {
      onMediaSelect(file, type)
      onClose()
    }
  }

  const mediaOptions = [
    {
      icon: ImageIcon,
      label: "Photos",
      color: "text-purple-600",
      onClick: () => imageInputRef.current?.click(),
    },
    {
      icon: Video,
      label: "Videos",
      color: "text-red-600",
      onClick: () => videoInputRef.current?.click(),
    },
    {
      icon: FileText,
      label: "Documents",
      color: "text-blue-600",
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: Mic,
      label: "Audio",
      color: "text-green-600",
      onClick: () => audioInputRef.current?.click(),
    },
    {
      icon: MapPin,
      label: "Location",
      color: "text-orange-600",
      onClick: () => {
        onLocationShare()
        onClose()
      },
    },
    {
      icon: Contact,
      label: "Contact",
      color: "text-indigo-600",
      onClick: () => {
        onContactShare()
        onClose()
      },
    },
  ]

  return (
    <>
      <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50">
        <div className="grid grid-cols-2 gap-3">
          {mediaOptions.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50"
              onClick={option.onClick}
            >
              <option.icon className={`w-6 h-6 ${option.color}`} />
              <span className="text-sm text-gray-700">{option.label}</span>
            </Button>
          ))}
        </div>

        <div className="flex justify-end mt-3 pt-2 border-t">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "image")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "video")}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "file")}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "audio")}
      />
    </>
  )
}
