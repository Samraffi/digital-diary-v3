'use client'

import { useMemo } from 'react'
import { useTerritoryStore } from '../store'
import type { TerritoryChronicleEntry } from '../types/chronicle'

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTypeIcon(type: TerritoryChronicleEntry['type']) {
  switch (type) {
    case 'founded':
      return '🏗️'
    case 'upgraded':
      return '⬆️'
    case 'achievement':
      return '🏆'
    case 'event':
      return '📅'
    default:
      return '📝'
  }
}

export function TerritoryChroniclesList() {
  const chronicles = useTerritoryStore(state => state.chronicles)
  const territories = useTerritoryStore(state => state.territories)

  const sortedChronicles = useMemo(() => {
    return [...chronicles].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [chronicles])

  if (sortedChronicles.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Летопись пуста. Основайте новую территорию, чтобы начать записи.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedChronicles.map(entry => {
        const territory = territories.find(t => t.id === entry.territoryId)
        
        return (
          <div 
            key={entry.id}
            className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getTypeIcon(entry.type)}</div>
              <div className="flex-1">
                <p className="text-white/90">{entry.content}</p>
                <div className="flex gap-2 items-center mt-2 text-sm text-white/60">
                  <span>{territory?.name || 'Неизвестная территория'}</span>
                  <span>•</span>
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
