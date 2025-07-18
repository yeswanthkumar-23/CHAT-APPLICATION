"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
}

const emojiCategories = {
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
  ],
  hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  gestures: [
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👏",
    "🙌",
    "🤲",
    "🤝",
    "🙏",
  ],
  objects: [
    "📱",
    "💻",
    "⌨️",
    "🖥️",
    "🖨️",
    "🖱️",
    "🖲️",
    "💽",
    "💾",
    "💿",
    "📀",
    "📼",
    "📷",
    "📸",
    "📹",
    "🎥",
    "📽️",
    "🎞️",
    "📞",
    "☎️",
    "📟",
    "📠",
  ],
}

export default function EmojiPicker({ onEmojiSelect, isOpen, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>("smileys")

  if (!isOpen) return null

  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
      <div className="flex space-x-2 mb-3 border-b pb-2">
        {Object.keys(emojiCategories).map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory(category as keyof typeof emojiCategories)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
        {emojiCategories[activeCategory].map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onEmojiSelect(emoji)
              onClose()
            }}
            className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-3 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
