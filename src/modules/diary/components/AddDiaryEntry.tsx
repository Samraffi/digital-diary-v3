'use client'

import { useState } from 'react'
import { saveDiaryEntry } from '@/lib/db'
import { EmojiButton } from '@/shared/ui/EmojiPicker'
import type { DiaryEntry } from '@/lib/db'

export function AddDiaryEntry() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('😊')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      title: `${mood} ${title}`,
      content
    }

    await saveDiaryEntry(entry)
    
    // Очищаем форму
    setTitle('')
    setContent('')
  }

  const handleContentEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji)
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Настроение и заголовок
            </label>
            <div className="flex gap-2">
              <EmojiButton onEmojiSelect={setMood} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Озаглавьте вашу запись"
                className="flex-1 p-2 rounded bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Запись
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Поделитесь своими мыслями..."
                className="w-full p-4 rounded bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px] transition"
                required
              />
              <div className="absolute bottom-4 right-4">
                <EmojiButton onEmojiSelect={handleContentEmojiSelect} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-105"
          >
            Сохранить запись
          </button>
        </div>
      </form>
    </div>
  )
}
