'use client'

import { useEffect, useMemo, useCallback, useState } from 'react'
import { useTerritoryStore } from '../store'
import { useNobleStore } from '@/modules/noble/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import type { Territory } from '../types/territory'
import { TerritoryFilters } from './TerritoryFilters'
import { Territory as TerritoryComponent } from './Territory'

const typeLabels: Record<string, string> = {
  'fortress': 'Крепости',
  'mine': 'Шахты',
  'temple': 'Храмы',
  'village': 'Деревни',
  'camp': 'Лагеря'
}

export function TerritoryList() {
  const territories = useTerritoryStore(state => state.territories)
  const [filteredTerritories, setFilteredTerritories] = useState<Territory[]>([])

  useEffect(() => {
    setFilteredTerritories(territories)
  }, [territories])
  const updateStats = useNobleStore(state => state.updateStats)
  const addResources = useNobleStore(state => state.addResources)
  const removeResources = useNobleStore(state => state.removeResources)
  const addExperience = useNobleStore(state => state.addExperience)
  const noble = useNobleStore(state => state.noble)
  const upgradeTerritory = useTerritoryStore(state => state.upgradeTerritory)
  const { notifyResourceReward, notifyError, notifyAchievement } = useGameNotifications()

  // Обновляем статистику дворянина при изменении территорий
  useEffect(() => {
    updateStats({
      territoriesOwned: territories.length
    })
  }, [territories.length, updateStats])

  // Мемоизируем вычисление общего производства
  const totalProduction = useMemo(() => {
    return territories.reduce(
      (acc, territory) => {
        if (territory.production) {
          acc.gold += territory.production.gold * (1 + territory.level * 0.1)
          acc.influence += territory.production.influence * (1 + territory.level * 0.1)
        }
        return acc
      },
      { gold: 0, influence: 0 }
    )
  }, [territories])

  // Мемоизируем коллбэк обновления ресурсов с использованием requestAnimationFrame
  const updateResources = useCallback(() => {
    requestAnimationFrame(() => {
      addResources(totalProduction)
      notifyResourceReward(totalProduction)
    })
  }, [totalProduction, addResources, notifyResourceReward])

  // Обработка производства ресурсов каждый час
  useEffect(() => {
    const interval = setInterval(updateResources, 60 * 60 * 900)
    return () => clearInterval(interval)
  }, [updateResources])

  // Мемоизируем обработчик улучшения
  const handleUpgrade = useCallback(async (territory: Territory): Promise<void> => {
    if (!noble) {
      notifyError('Ошибка', 'Не удалось определить статус дворянина')
      return
    }

    try {
      const upgradeRequirements = {
        gold: 500 * (territory.level),
        influence: 200 * (territory.level + 1)
      }

      if (
        noble.resources.gold < upgradeRequirements.gold ||
        noble.resources.influence < upgradeRequirements.influence
      ) {
        notifyError(
          'Недостаточно ресурсов',
          `Требуется ${upgradeRequirements.gold} золота и ${upgradeRequirements.influence} влияния`
        )
        return
      }

      // Сначала пробуем повысить уровень
      upgradeTerritory(territory.id)
      
      // Если улучшение прошло успешно, снимаем ресурсы
      removeResources(upgradeRequirements)
      
      // Добавляем опыт за улучшение
      addExperience(500)

      // Вычисляем бонусы к производству
      const productionBonus = territory.production ? {
        gold: Math.floor(territory.production.gold * 0.2),
        influence: Math.floor(territory.production.influence * 0.2)
      } : { gold: 0, influence: 0 }

      // Показываем уведомления об успешном улучшении
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
  }, [noble, removeResources, upgradeTerritory, addExperience, notifyResourceReward, notifyAchievement, notifyError])

  if (territories.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          У вас пока нет территорий. Начните с создания лагеря или деревни.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <TerritoryFilters
          territories={territories}
          onFilter={(filtered) => setFilteredTerritories(filtered)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerritories.length > 0 ? (
            Object.entries(
              filteredTerritories.reduce<Record<string, Territory[]>>((groups, territory) => {
                if (!groups[territory.type]) groups[territory.type] = []
                groups[territory.type].push(territory)
                return groups
              }, {})
            ).map(([type, groupTerritories]) => (
              <div key={type} className="bg-card rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">{typeLabels[type] || type}</h3>
                <div className="divide-y divide-border">
                  {groupTerritories.map(territory => (
                    <div key={territory.id} className="py-3">
                      <TerritoryComponent
                        territory={territory}
                        onUpgrade={handleUpgrade}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-card rounded-lg">
              <p className="text-muted-foreground">
                По выбранным фильтрам территорий не найдено
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
