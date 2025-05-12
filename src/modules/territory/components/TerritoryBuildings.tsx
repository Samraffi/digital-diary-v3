'use client'

import { memo } from 'react'
import { Territory, Building, TERRITORY_TYPES } from '../types/territory'
import { useMemo } from 'react'

interface TerritoryBuildingsProps {
  territory: Territory
  className?: string
}

function TerritoryBuildingsComponent({
  territory,
  className = ''
}: TerritoryBuildingsProps) {
  const typeInfo = TERRITORY_TYPES[territory.type]

  // Кэшируем сортировку зданий
  const sortedBuildings = useMemo(() => {
    return [...territory.buildings].sort((a, b) => {
      // Сначала по типу
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type)
      }
      // Затем по уровню (по убыванию)
      return b.level - a.level
    })
  }, [territory.buildings])

  // Вычисляем общий бонус от зданий
  const buildingBonuses = useMemo(() => {
    return territory.buildings.reduce(
      (acc, building) => {
        if (building.effects.production) {
          acc.gold += building.effects.production.gold || 0
          acc.influence += building.effects.production.influence || 0
        }
        if (building.effects.status) {
          acc.happiness += building.effects.status.happiness || 0
          acc.stability += building.effects.status.stability || 0
          acc.development += building.effects.status.development || 0
        }
        return acc
      },
      { gold: 0, influence: 0, happiness: 0, stability: 0, development: 0 }
    )
  }, [territory.buildings])

  if (territory.buildings.length === 0) {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        Нет построенных зданий (0/{typeInfo.maxBuildings})
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
        <span>
          Здания ({territory.buildings.length}/{typeInfo.maxBuildings})
        </span>
        {Object.entries(buildingBonuses).map(([key, value]) => 
          value > 0 && (
            <span key={key} className="text-green-500 ml-2">
              +{value} {key === 'gold' ? '🪙' : key === 'influence' ? '⚜️' : key}
            </span>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {sortedBuildings.map(building => (
          <BuildingBadge 
            key={building.id}
            building={building}
          />
        ))}
      </div>
    </div>
  )
}

interface BuildingBadgeProps {
  building: Building
}

const BuildingBadge = memo(function BuildingBadge({ building }: BuildingBadgeProps) {
  return (
    <span
      className="px-2 py-1 text-xs rounded bg-accent transition-all duration-300 hover:scale-105"
      title={getBuildingEffectsDescription(building)}
    >
      {building.name} (Ур.{building.level})
    </span>
  )
})

function getBuildingEffectsDescription(building: Building): string {
  const effects: string[] = []

  if (building.effects.production) {
    const { gold, influence } = building.effects.production
    if (gold) effects.push(`+${gold} золота`)
    if (influence) effects.push(`+${influence} влияния`)
  }

  if (building.effects.status) {
    const { happiness, stability, development } = building.effects.status
    if (happiness) effects.push(`+${happiness} к счастью`)
    if (stability) effects.push(`+${stability} к стабильности`)
    if (development) effects.push(`+${development} к развитию`)
  }

  return effects.join('\n')
}

export const TerritoryBuildings = memo(TerritoryBuildingsComponent)
