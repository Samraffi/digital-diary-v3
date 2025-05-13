'use client'

import Link from 'next/link'
import { Territory as TerritoryType } from '../types/territory'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'

interface TerritoryProps {
  territory: TerritoryType
  onUpgrade: (territory: TerritoryType) => Promise<void>
}

export function Territory({ territory, onUpgrade }: TerritoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Link
          href={`/territories/${territory.id}`}
          className="group space-y-1 flex-1"
        >
          <h3 className="font-medium text-white group-hover:text-primary transition-colors">
            {territory.name}
          </h3>
          <div className="flex items-center text-sm text-gray-400 space-x-4">
            <span>Уровень {territory.level}</span>
            <span>•</span>
            <span>{territory.type}</span>
          </div>
        </Link>
        
        <button
          onClick={() => onUpgrade(territory)}
          className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors"
        >
          Улучшить
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between p-2 rounded bg-white/5">
          <span className="text-sm text-gray-400">Золото</span>
          <span className="text-sm font-medium text-yellow-500">
            +{territory.production.gold}/ч
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-white/5">
          <span className="text-sm text-gray-400">Влияние</span>
          <span className="text-sm font-medium text-blue-500">
            +{territory.production.influence}/ч
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Развитие</span>
            <span className="text-xs text-white">{territory.development} / {territory.maxDevelopment}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              style={{ width: `${(territory.development / territory.maxDevelopment) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
