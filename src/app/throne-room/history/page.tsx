'use client'

import { AddChronicleEntry } from '@/modules/chronicles/components/AddChronicleEntry'
import { ChronicleEntries } from '@/modules/chronicles/components/ChronicleEntries'

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white/90 mb-2">Летопись</h1>
        <p className="text-white/60">
          Здесь записаны важные события и решения, определяющие ход истории вашего правления
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <AddChronicleEntry category="history" />
        <ChronicleEntries category="history" />
      </div>
    </div>
  )
}
