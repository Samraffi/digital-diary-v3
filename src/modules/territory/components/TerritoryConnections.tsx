'use client'

import { memo } from 'react'
import { Territory, TerritoryConnection } from '../types'
import { useMemo } from 'react'

interface TerritoryConnectionsProps {
  territory: Territory
  className?: string
}

function TerritoryConnectionsComponent({
  territory,
  className = ''
}: TerritoryConnectionsProps) {
  // Группируем связи по типу
  const connectionsByType = useMemo(() => {
    return territory.connections.reduce((acc, connection) => {
      if (!acc[connection.type]) {
        acc[connection.type] = []
      }
      acc[connection.type].push(connection)
      return acc
    }, {} as Record<TerritoryConnection['type'], TerritoryConnection[]>)
  }, [territory.connections])

  // Вычисляем бонусы от связей
  const connectionBonuses = useMemo(() => {
    const bonuses = {
      trade: { gold: 0, influence: 0 },
      military: { stability: 0 },
      road: { development: 0 }
    }

    territory.connections.forEach(connection => {
      const level = connection.level
      switch (connection.type) {
        case 'trade':
          bonuses.trade.gold += level * 2
          bonuses.trade.influence += level
          break
        case 'military':
          bonuses.military.stability += level * 3
          break
        case 'road':
          bonuses.road.development += level * 2
          break
      }
    })

    return bonuses
  }, [territory.connections])

  if (territory.connections.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
        <span>Связи ({territory.connections.length})</span>
        <div className="flex gap-2">
          {Object.entries(connectionBonuses).map(([type, bonuses]) => 
            Object.entries(bonuses).map(([stat, value]) => 
              value > 0 && (
                <span key={`${type}-${stat}`} className="text-blue-500">
                  +{value} {getStatIcon(stat)}
                </span>
              )
            )
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(connectionsByType).map(([type, connections]) => (
          <ConnectionGroup 
            key={type}
            type={type as TerritoryConnection['type']}
            connections={connections}
          />
        ))}
      </div>
    </div>
  )
}

interface ConnectionGroupProps {
  type: TerritoryConnection['type']
  connections: TerritoryConnection[]
}

const ConnectionGroup = memo(function ConnectionGroup({ type, connections }: ConnectionGroupProps) {
  const icon = getConnectionIcon(type)
  const averageLevel = Math.round(
    connections.reduce((acc, conn) => acc + conn.level, 0) / connections.length
  )

  return (
    <div 
      className="px-2 py-1 text-xs rounded bg-accent/50 flex items-center gap-1"
      title={getConnectionDescription(type, connections.length, averageLevel)}
    >
      <span>{icon}</span>
      <span>{connections.length}</span>
      <span className="text-muted-foreground">Ур.{averageLevel}</span>
    </div>
  )
})

function getConnectionIcon(type: TerritoryConnection['type']): string {
  switch (type) {
    case 'trade': return '🛒'
    case 'military': return '⚔️'
    case 'road': return '🛣️'
  }
}

function getStatIcon(stat: string): string {
  switch (stat) {
    case 'gold': return '🪙'
    case 'influence': return '⚜️'
    case 'stability': return '🛡️'
    case 'development': return '📈'
    default: return ''
  }
}

function getConnectionDescription(
  type: TerritoryConnection['type'],
  count: number,
  level: number
): string {
  const typeNames = {
    trade: 'Торговые пути',
    military: 'Военные союзы',
    road: 'Дороги'
  }

  return `${typeNames[type]}\nКоличество: ${count}\nСредний уровень: ${level}`
}

export const TerritoryConnections = memo(TerritoryConnectionsComponent)
