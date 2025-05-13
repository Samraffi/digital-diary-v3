'use client'

import { TerritoryChroniclesList } from '@/modules/territory/components/TerritoryChroniclesList'

export default function ChroniclesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white/90 mb-2">Летопись территорий</h1>
        <p className="text-white/60">
          Здесь записаны все важные события, происходящие с вашими территориями
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <TerritoryChroniclesList />
      </div>
    </div>
  )
}
