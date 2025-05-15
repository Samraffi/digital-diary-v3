import { useState, useCallback } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { Territory } from '@/modules/territory/types/territory'

export function useTerritoriesUpgrade() {
  const [upgradingTerritoryId, setUpgradingTerritoryId] = useState<string | null>(null)
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

  return {
    upgradingTerritoryId,
    handleUpgrade
  }
} 