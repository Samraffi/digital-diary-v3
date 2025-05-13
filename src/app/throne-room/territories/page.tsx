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
        throw error
      }
    } else {
      notifyError(
        'Недостаточно ресурсов',
        `Требуется ${upgradeRequirements.gold} золота и ${upgradeRequirements.influence} влияния`
      )
      throw new Error('Insufficient resources')
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
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Заголовок и действия */}
      <Card gradient="from-blue-500/20 to-cyan-500/20" className="p-8">
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl font-bold text-white mb-2">Территории</h1>
          <p className="text-gray-300">
            Управляйте своими владениями и развивайте их инфраструктуру
          </p>
        </motion.div>
      </Card>

      {/* Фильтры */}
      <CardGroup variants={fadeInUp}>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {typeFilters.map(({ type, label, icon }, index) => {
            const count = type === 'all' ? territories.length : (typeStats[type] || 0)
            const isSelected = selectedType === type
            
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                  px-6 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200 min-w-[160px] backdrop-blur-md
                  ${isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </div>
                  <span className="ml-3 px-2 py-1 text-xs bg-white/20 rounded-full">
                    {count}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardGroup>

      {/* Список территорий */}
      <Card>
        <div className="p-6">
          {filteredTerritories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {selectedType === 'all'
                  ? 'У вас пока нет территорий. Создайте свою первую территорию!'
                  : 'Нет территорий выбранного типа.'}
              </p>
            </div>
          ) : (
            <TerritoryGrid
              territories={filteredTerritories}
              onUpgrade={handleUpgrade}
            />
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default withPageTransition(TerritoriesPage)
