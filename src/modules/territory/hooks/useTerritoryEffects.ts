import { useEffect, useState } from 'react'
import { useTerritoryStore } from '../store'
import { useScheduleStore } from '@/modules/schedule/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { TerritoryEffect, TerritoryEffectType } from '../types'

interface ActiveEffect extends TerritoryEffect {
  endTime: number
}

export function useTerritoryEffects() {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([])

  const lastEffect = useTerritoryStore(state => state.lastEffect)
  const lastCompletedTask = useScheduleStore(state => state.lastCompletedTask)
  const { notifyAchievement } = useGameNotifications()

  // Отслеживаем завершение задач
  useEffect(() => {
    if (lastCompletedTask && lastCompletedTask.category) {
      const task = lastCompletedTask.category
      const taskEffect = TASK_EFFECTS[task]
      
      if (taskEffect) {
        const affectedTerritories = useTerritoryStore.getState().territories
          .filter(t => taskEffect.territoryTypes.includes(t.type))

        affectedTerritories.forEach(territory => {
          setActiveEffects(prev => [
            ...prev,
            {
              territoryId: territory.id,
              effect: taskEffect.effect,
              bonus: taskEffect.bonus,
              endTime: Date.now() + 5000
            }
          ])
        })
      }
    }
  }, [lastCompletedTask])

  // Обработка эффектов территории
  useEffect(() => {
    if (lastEffect) {
      setActiveEffects(prev => [
        ...prev,
        {
          ...lastEffect,
          endTime: Date.now() + 5000
        }
      ])

      notifyAchievement(
        'Эффект применен',
        `${lastEffect.effect} +${lastEffect.bonus}`
      )
    }
  }, [lastEffect, notifyAchievement])

  // Очищаем завершенные эффекты
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setActiveEffects(prev => prev.filter(effect => effect.endTime > now))
    }, 900)

    return () => clearInterval(interval)
  }, [])

  const getEffectsForTerritory = (territoryId: string) => {
    return activeEffects.filter(effect => effect.territoryId === territoryId)
  }

  return {
    activeEffects,
    getEffectsForTerritory
  }
}

const TASK_EFFECTS: Record<string, {
  effect: TerritoryEffectType,
  bonus: number,
  territoryTypes: string[]
}> = {
  coding: {
    effect: 'development',
    bonus: 5,
    territoryTypes: ['fortress', 'village']
  },
  english: {
    effect: 'diplomacy',
    bonus: 3,
    territoryTypes: ['temple', 'village']
  },
  linkedin: {
    effect: 'trade',
    bonus: 4,
    territoryTypes: ['village', 'mine']
  },
  learning: {
    effect: 'research',
    bonus: 5,
    territoryTypes: ['temple', 'fortress']
  }
}
