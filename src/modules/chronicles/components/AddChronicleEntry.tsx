'use client'

import { useState } from 'react'
import { useChronicleStore } from '../store'
import { RichTextEditor } from './RichTextEditor'
import { Card } from '@/shared/ui/card'
import { EmojiButton } from '@/shared/ui/EmojiPicker'

interface AddChronicleEntryProps {
  category: 'history' | 'journal'
}

export function AddChronicleEntry({ category }: AddChronicleEntryProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<Record<string, unknown>>({})
  const [mood, setMood] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  
  const addEntry = useChronicleStore(state => state.addEntry)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content) return

    addEntry({
      title: title.trim(),
      content,
      category,
      mood,
      tags
    })

    // Reset form
    setTitle('')
    setContent({})
    setMood('')
    setTags([])
    setTagInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card gradient="from-primary-500/20 to-primary-400/20" className="p-4 space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Название</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
            placeholder={category === 'history' ? 'Важное событие...' : 'Запись в дневнике...'}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">Содержание</label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Начните писать..."
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Настроение</label>
            <EmojiButton onEmojiSelect={setMood} />
            {mood && <span className="ml-2">{mood}</span>}
          </div>

          <div className="flex-1">
            <label className="block text-sm text-white/60 mb-1">Теги</label>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="text-white/60 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 text-sm"
                placeholder="Добавить тег..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors text-white font-medium"
            disabled={!title.trim() || Object.keys(content).length === 0}
          >
            {category === 'history' ? 'Записать в летопись' : 'Добавить запись'}
          </button>
        </div>
      </Card>
    </form>
  )
}
