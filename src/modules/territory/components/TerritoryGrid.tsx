'use client'

import { memo, useState } from 'react'
import { Territory } from '../types/territory'
import { useTerritoryContext } from '../providers/TerritoryProvider'
import { TerritoryCard } from './grid/TerritoryCard'
import { Pagination } from './grid/Pagination'

interface TerritoryGridProps {
  territories: Territory[]
  onUpgrade: (territory: Territory) => Promise<void>
  upgradingTerritoryId?: string | null
}

const ITEMS_PER_PAGE = 20

function TerritoryGridComponent({
  territories,
  onUpgrade,
  upgradingTerritoryId
}: TerritoryGridProps) {
  const { activeEffects } = useTerritoryContext()
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalPages = Math.ceil(territories.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const visibleTerritories = territories.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTerritories.map((territory) => (
          <TerritoryCard
            key={territory.id}
            territory={territory}
            isUpgrading={upgradingTerritoryId === territory.id}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export const TerritoryGrid = memo(TerritoryGridComponent)
