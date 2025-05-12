'use client'

import { memo } from 'react'
import { Territory } from '../types/territory'
import { useVirtualizedTerritories } from '../hooks/useVirtualizedTerritories'
import { MemoizedTerritoryCard } from './MemoizedTerritoryCard'
import { useTerritoryContext } from '../providers/TerritoryProvider'

interface VirtualizedTerritoryListProps {
  territories: Territory[]
  onUpgrade: (territory: Territory) => Promise<void>
  itemHeight?: number
  containerHeight?: number
  className?: string
  overscan?: number
}

function VirtualizedTerritoryListComponent({
  territories,
  onUpgrade,
  itemHeight = 200,
  containerHeight = 800,
  className = '',
  overscan = 1
}: VirtualizedTerritoryListProps) {
  const { activeEffects } = useTerritoryContext()
  
  // Используем хук виртуализации с overscan
  const {
    containerRef,
    visibleTerritories,
    totalHeight,
    offsetY,
    visibleRange
  } = useVirtualizedTerritories({
    territories,
    itemHeight,
    containerHeight,
    overscan
  })

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ height: containerHeight }}
    >
      {/* Контейнер с полной высотой для правильной прокрутки */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Маркеры для IntersectionObserver */}
        {territories.map((_, index) => (
          <div
            key={`marker-${index}`}
            className="territory-marker absolute left-0 w-full"
            data-index={index}
            style={{
              height: '1px',
              top: index * itemHeight,
              visibility: 'hidden'
            }}
          />
        ))}

        {/* Контейнер для видимых элементов */}
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            width: '100%'
          }}
        >
          {visibleTerritories.map((territory, index) => {
            const actualIndex = visibleRange.start + index
            const isAffected = activeEffects.some(
              effect => effect.territoryId === territory.id
            )

            return (
              <div
                key={territory.id}
                style={{ height: itemHeight }}
                className="p-2"
              >
                <MemoizedTerritoryCard
                  territory={territory}
                  onUpgrade={() => onUpgrade(territory)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Индикатор загрузки при прокрутке */}
      {territories.length > 20 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-16 flex items-center justify-center pointer-events-none">
          <span className="text-sm text-muted-foreground">
            Показано {visibleTerritories.length} из {territories.length} территорий
          </span>
        </div>
      )}
    </div>
  )
}

// Мемоизируем компонент для предотвращения лишних рендеров
export const VirtualizedTerritoryList = memo(VirtualizedTerritoryListComponent)
