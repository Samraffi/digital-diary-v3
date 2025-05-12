'use client'

import { memo } from 'react'
import { Territory } from '../types/territory'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { useOptimizedTerritory } from '../hooks/useOptimizedTerritory'

interface TerritoryStatsWidgetProps {
  territory: Territory
  className?: string
}

function TerritoryStatsWidgetComponent({ 
  territory,
  className = ''
}: TerritoryStatsWidgetProps) {
  const { territory: optimizedTerritory, isAffected } = useOptimizedTerritory({ territory })
  const { status, production } = optimizedTerritory

  return (
    <div className={className}>
      {/* Production Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">
          <span className="flex items-center gap-1">
            <span className={`text-yellow-500 ${isAffected ? 'animate-pulse' : ''}`}>🪙</span>
            <span className="transition-all duration-300">
              {Math.floor(production.gold)}/ч
              {production.gold > territory.production.gold && (
                <span className="text-xs text-green-500 ml-1">
                  +{Math.floor((production.gold / territory.production.gold - 1) * 100)}%
                </span>
              )}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className={`text-blue-500 ${isAffected ? 'animate-pulse' : ''}`}>⚜️</span>
            <span className="transition-all duration-300">
              {Math.floor(production.influence)}/ч
              {production.influence > territory.production.influence && (
                <span className="text-xs text-green-500 ml-1">
                  +{Math.floor((production.influence / territory.production.influence - 1) * 100)}%
                </span>
              )}
            </span>
          </span>
        </div>

        {/* Overall Status */}
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <span>Общий статус:</span>
            <span className={status.overall > 80 ? 'text-green-500' : status.overall > 50 ? 'text-yellow-500' : 'text-red-500'}>
              {status.overall}%
            </span>
            {status.isProsperous && <span className="text-yellow-500">👑</span>}
          </div>
        </div>
      </div>

      {/* Status Bars */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
            <span>Счастье</span>
            <span className="text-green-500">{status.happiness}%</span>
          </div>
          <ProgressBar
            value={status.happiness}
            color="green"
            size="md"
            animated={isAffected}
            className="bg-opacity-25"
          />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
            <span>Стабильность</span>
            <span className="text-blue-500">{status.stability}%</span>
          </div>
          <ProgressBar
            value={status.stability}
            color="blue"
            size="md"
            animated={isAffected}
            className="bg-opacity-25"
          />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
            <span>Развитие</span>
            <span className="text-purple-500">{status.development}%</span>
          </div>
          <ProgressBar
            value={status.development}
            color="purple"
            size="md"
            animated={isAffected}
            className="bg-opacity-25"
          />
        </div>
      </div>
    </div>
  )
}

export const TerritoryStatsWidget = memo(TerritoryStatsWidgetComponent, (prev, next) => {
  // Оптимизированное сравнение статусов
  return (
    prev.territory.status.happiness === next.territory.status.happiness &&
    prev.territory.status.stability === next.territory.status.stability &&
    prev.territory.status.development === next.territory.status.development &&
    prev.territory.production.gold === next.territory.production.gold &&
    prev.territory.production.influence === next.territory.production.influence
  )
})
