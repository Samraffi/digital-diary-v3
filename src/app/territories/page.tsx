'use client'

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useTerritoryStore } from '@/modules/territory/store'
import { useNobleStore } from '@/modules/noble/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { TerritoryGrid } from '@/modules/territory/components/TerritoryGrid'
import { Card, CardGroup } from '@/shared/ui/Card'
import { Territory, TerritoryType } from '@/modules/territory/types/territory'
import { staggerContainer, fadeInUp } from '@/shared/ui/animations'
import { withPageTransition } from '@/lib/hooks/usePageTransition'

function TerritoriesPage() {
  const [selectedType, setSelectedType] = useState<TerritoryType | 'all'>('all')
  const [upgradingTerritoryId, setUpgradingTerritoryId] = useState<string | null>(null)
  const territories = useTerritoryStore(state => state.territories)
  const noble = useNobleStore(state => state.noble)
  const removeResources = useNobleStore(state => state.removeResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const upgradeTerritory = useTerritoryStore(state => state.upgradeTerritory)
  const { notifyResourceReward, notifyError, notifyAchievement } = useGameNotifications()

  const handleUpgrade = useCallback(async (territory: Territory): Promise<void> => {
    if (!noble) {
      notifyError('Ошибка', 'Не удалось определить статус дворянина')
      return
    }

    const upgradeRequirements = {
      gold: 500 * (territory.level + 1),
      influence: 200 * (territory.level + 1)
    }

    if (
      noble.resources.gold >= upgradeRequirements.gold &&
      noble.resources.influence >= upgradeRequirements.influence
    ) {
      try {
        setUpgradingTerritoryId(territory.id)
        removeResources(upgradeRequirements)
        upgradeTerritory(territory.id)
        addExperience(500)

        const productionBonus = {
          gold: Math.floor((territory.production?.gold || 0) * 0.2),
          influence: Math.floor((territory.production?.influence || 0) * 0.2)
        }

        notifyResourceReward(productionBonus)
        notifyAchievement(
          'Территория улучшена!',
          `${territory.name} достигает ${territory.level + 1} уровня`
        )
      } catch (error) {
        notifyError(
          'Ошибка улучшения',
          'Не удалось улучшить территорию. Попробуйте позже.'
        )
      } finally {
        setUpgradingTerritoryId(null)
      }
    } else {
      const missingResources = []
      if (noble.resources.gold < upgradeRequirements.gold) {
        missingResources.push(`${upgradeRequirements.gold - noble.resources.gold} золота`)
      }
      if (noble.resources.influence < upgradeRequirements.influence) {
        missingResources.push(`${upgradeRequirements.influence - noble.resources.influence} влияния`)
      }

      notifyError(
        'Недостаточно ресурсов',
        `Не хватает: ${missingResources.join(', ')}`
      )
      return
    }
  }, [noble, removeResources, upgradeTerritory, addExperience, notifyResourceReward, notifyAchievement, notifyError])

  const filteredTerritories = selectedType === 'all'
    ? territories
    : territories.filter(t => t.type === selectedType)

  const typeStats = territories.reduce((acc, territory) => {
    acc[territory.type] = (acc[territory.type] || 0) + 1
    return acc
  }, {} as Record<TerritoryType, number>)

  const typeFilters: { type: TerritoryType | 'all', label: string, icon: string }[] = [
    { type: 'all', label: 'Все', icon: '🌐' },
    { type: 'camp', label: 'Лагеря', icon: '⛺' },
    { type: 'village', label: 'Деревни', icon: '🏘️' },
    { type: 'mine', label: 'Шахты', icon: '⛏️' },
    { type: 'fortress', label: 'Крепости', icon: '🏰' },
    { type: 'temple', label: 'Храмы', icon: '🏛️' }
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Заголовок */}
      <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Территории</h1>
        <p className="text-gray-300">
          Управляйте своими владениями и расширяйте своё влияние
        </p>
        <div className="mt-4 flex gap-4">
          <div className="px-4 py-2 bg-white/10 rounded-lg">
            <span className="text-white font-medium">
              Всего территорий: {territories.length}
            </span>
          </div>
          {territories.length === 0 && (
            <div className="px-4 py-2 bg-amber-500/20 rounded-lg">
              <span className="text-amber-300 font-medium">
                Посетите Королевский Рынок, чтобы приобрести территории
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Фильтры */}
      <motion.div variants={fadeInUp}>
        <Card className="p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              Все
            </button>
            {['village', 'mine', 'fortress', 'temple'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type as TerritoryType)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-white'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Список территорий */}
      <motion.div variants={fadeInUp}>
        {territories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-400">
              У вас пока нет территорий. Посетите Королевский Рынок, чтобы приобрести свою первую территорию.
            </p>
          </Card>
        ) : (
          <TerritoryGrid
            territories={filteredTerritories}
            onUpgrade={handleUpgrade}
            upgradingTerritoryId={upgradingTerritoryId}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default withPageTransition(TerritoriesPage)
