'use client'

import { useEffect, useState } from 'react'
import { getDiaryEntries, deleteDiaryEntry } from '@/lib/db'
import type { DiaryEntry } from '@/lib/db'

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function DiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    const entries = await getDiaryEntries()
    setEntries(entries)
  }

  async function handleDelete(id: string) {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      await deleteDiaryEntry(id)
      await loadEntries()
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-medieval text-gray-100 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white">
          📖
        </span>
        Записи дневника
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {entries.map((entry) => (
            <div 
              key={entry.id}
              className={`p-4 rounded-lg border backdrop-blur-sm cursor-pointer transform transition-all duration-200
                ${selectedEntry?.id === entry.id 
                  ? 'border-blue-500 bg-blue-900/20 scale-[1.02] shadow-lg shadow-blue-900/20' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:scale-[1.01]'
                }`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="font-medium text-lg text-gray-100">{entry.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(entry.id)
                  }}
                  className="text-red-500 hover:text-red-400 transition-colors p-1"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-blue-300 mb-2 flex items-center gap-1">
                <span className="text-lg">📅</span> {formatDate(entry.date)}
              </div>
              {!selectedEntry && (
                <div className="mt-2 text-sm text-gray-300 line-clamp-2">
                  {entry.content}
                </div>
              )}
            </div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-700 rounded-lg">
              <div className="text-4xl mb-2">📝</div>
              <div>Начните вести дневник</div>
            </div>
          )}
        </div>

        <div className="h-[calc(100vh-300px)] sticky top-6">
          {selectedEntry ? (
            <div className="p-6 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm h-full overflow-auto">
              <div className="mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-2xl font-medium mb-2 text-gray-100">{selectedEntry.title}</h3>
                <div className="text-sm text-blue-300 flex items-center gap-1">
                  <span className="text-lg">📅</span> {formatDate(selectedEntry.date)}
                </div>
              </div>
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedEntry.content}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
              <div className="text-4xl mb-2">👆</div>
              <div>Выберите запись для просмотра</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
