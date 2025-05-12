'use client'

import { AddDiaryEntry } from '@/modules/diary/components/AddDiaryEntry'
import { DiaryEntries } from '@/modules/diary/components/DiaryEntries'

export default function DiaryPage() {
  return (
    <main className="container mx-auto py-6">
      <h1 className="text-3xl font-medieval mb-6">Дневник</h1>
      
      <div className="grid gap-8">
        <AddDiaryEntry />
        <DiaryEntries />
      </div>
    </main>
  )
}
