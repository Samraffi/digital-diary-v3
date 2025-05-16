'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { selectTerritoryById } from '@/modules/territory/store'
import { Card } from '@/shared/ui/card'
import { TerritoryProfile } from '@/modules/territory/components/TerritoryProfile'
import { TerritoryBuildings } from '@/modules/territory/components/TerritoryBuildings'
import { TerritorySchedule } from '@/modules/territory/components/TerritorySchedule'

const tabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'buildings', label: 'Постройки' },
  { id: 'schedule', label: 'Расписание' }
]

export default function TerritoryPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const territoryId = Array.isArray(params.id) ? params.id[0] : params.id ?? ''
  
  if (!territoryId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white/90 mb-2">
            Неверный ID территории
          </h1>
          <p className="text-white/60">
            Пожалуйста, проверьте URL
          </p>
        </Card>
      </div>
    )
  }

  const territory = useSelector((state: RootState) =>
    selectTerritoryById(state, territoryId)
  )

  if (!territory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white/90 mb-2">
            Территория не найдена
          </h1>
          <p className="text-white/60">
            Возможно, она была удалена или перемещена
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with tabs */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white/90">
            {territory.name}
          </h1>
        </div>

        <div className="flex gap-2 border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium transition-colors relative
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <TerritoryProfile territory={territory} />
      )}

      {activeTab === 'buildings' && (
        <TerritoryBuildings territory={territory} />
      )}

      {activeTab === 'schedule' && (
        <TerritorySchedule activities={[]} />
      )}
    </div>
  )
}
