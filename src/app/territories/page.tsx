'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { selectTerritories } from '@/modules/territory/store'
import { useNobleStore } from '@/modules/noble/store'
import { TerritoryGrid } from '@/modules/territory/components/TerritoryGrid'
import { TerritoryType } from '@/modules/territory/types/territory'
import { staggerContainer } from '@/shared/ui/animations'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { TerritoriesHeader } from './components/TerritoriesHeader'
import { TerritoryFilters } from './components/TerritoryFilters'
import { EmptyTerritoriesMessage } from './components/EmptyTerritoriesMessage'
import { useTerritoriesUpgrade } from './hooks/useTerritoriesUpgrade'

function TerritoriesPage() {
  const [selectedType, setSelectedType] = useState<TerritoryType | 'all'>('all')
  const territories = useSelector((state: RootState) => selectTerritories(state))
  const { upgradingTerritoryId, handleUpgrade } = useTerritoriesUpgrade()

  const filteredTerritories = selectedType === 'all'
    ? territories
    : territories.filter(t => t.type === selectedType)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <TerritoriesHeader territories={territories} />
      <TerritoryFilters selectedType={selectedType} onTypeSelect={setSelectedType} />

      {territories.length === 0 ? (
        <EmptyTerritoriesMessage />
      ) : (
        <TerritoryGrid
          territories={filteredTerritories}
          onUpgrade={handleUpgrade}
          upgradingTerritoryId={upgradingTerritoryId}
        />
      )}
    </motion.div>
  )
}

export default withPageTransition(TerritoriesPage)
