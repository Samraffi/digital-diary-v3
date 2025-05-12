'use client'

import { useEffect, useMemo } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { rankRequirements } from '@/modules/noble/constants'
import { NobleStatus } from '@/modules/noble/components/NobleStatus'
import { AvailableActions } from '@/modules/noble/components/AvailableActions'
import { AchievementsList } from '@/modules/noble/components/AchievementsList'
import { TerritoryList } from '@/modules/territory/components/TerritoryList'
import { AddTerritoryButton } from '@/modules/territory/components/AddTerritoryButton'

export default function ThroneRoom() {
  const { noble, initializeNoble, isLoading } = useNobleStore()

  useEffect(() => {
    const checkAndInitialize = setTimeout(() => {
      if (!noble && !isLoading) {
        initializeNoble('Player')
      }
    }, 300)
    
    return () => clearTimeout(checkAndInitialize)
  }, [noble, isLoading, initializeNoble])

  // Вычисляем требования к территориям только когда изменяется ранг
  const territoryRequirements = useMemo(() => {
    return noble ? rankRequirements[noble.rank].territories : 0
  }, [noble?.rank])

  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-[50vh]">
          <div className="text-lg text-muted-foreground">Загрузка...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-medieval">Тронный Зал</h1>
          <div className="flex items-center gap-4">
            {/* В будущем здесь могут быть кнопки быстрых действий */}
          </div>
        </div>

        {/* Статус дворянина */}
        <NobleStatus />

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          {/* Левая колонка - Территории */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medieval">Ваши территории</h2>
                <span className="text-sm text-muted-foreground">
                  {noble?.stats.territoriesOwned || 0}/{territoryRequirements}
                </span>
              </div>
              <AddTerritoryButton />
            </div>
            <TerritoryList />
          </div>

          {/* Правая колонка - Действия и Достижения */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-medieval mb-4">Доступные действия</h2>
              <AvailableActions />
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <AchievementsList />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
