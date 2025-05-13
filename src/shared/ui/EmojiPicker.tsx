'use client'

import { useState, useEffect } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { createPortal } from 'react-dom'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
  theme?: 'light' | 'dark'
}

export function EmojiPicker({ onEmojiSelect, onClose, theme = 'dark' }: EmojiPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative">
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => {
            onEmojiSelect(emoji.native)
            onClose()
          }}
          theme={theme}
          previewPosition="none"
          skinTonePosition="none"
        />
      </div>
    </div>,
    document.body
  )
}

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void
}

export function EmojiButton({ onEmojiSelect }: EmojiButtonProps) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(true)}
        className="px-2 py-1 text-lg bg-gray-700 hover:bg-gray-600 rounded transition"
      >
        😊
      </button>
      
      {showPicker && (
        <EmojiPicker
          onEmojiSelect={onEmojiSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
