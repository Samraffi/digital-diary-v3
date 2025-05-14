'use client'

import { useMemo } from 'react'
import { useChronicleStore } from '../store'
import { Card } from '@/shared/ui/card'
import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface ChronicleEntriesProps {
  category: 'history' | 'journal'
}

export function ChronicleEntries({ category }: ChronicleEntriesProps) {
  const getEntries = useChronicleStore(state => state.getEntries)
  const entries = getEntries(category)

  const renderContent = (content: string | Record<string, unknown>) => {
    if (typeof content === 'string') return content

    const html = generateHTML(content, [StarterKit])
    return (
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center p-8 text-white/60">
        {category === 'history' 
          ? 'В летописи пока нет записей о важных событиях.'
          : 'В дневнике пока нет записей.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {entries.map(entry => (
        <Card
          key={entry.id}
          gradient="from-primary-500/5 to-primary-400/5"
          className="p-6"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-medium text-white/90">{entry.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                  {entry.mood && <span className="text-lg">{entry.mood}</span>}
                </div>
              </div>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-white/80">
              {renderContent(entry.content)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
