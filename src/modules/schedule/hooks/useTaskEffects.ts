import { useCallback, useEffect } from 'react'
import { useScheduleStore, Task } from '../store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { 
  TerritoryType, 
  TerritoryEffectType,
  TerritoryEffect
} from '@/modules/territory/types'
import {
  EFFECT_STRENGTHS,
  EFFECT_DURATIONS
} from '@/modules/territory/types/constants'

const TASK_TERRITORY_EFFECTS: Record<string, Omit<TerritoryEffect, 'territoryId'> & { duration: number; territoryTypes: string[] }> = {
  coding: {
    effect: 'development',
    bonus: EFFECT_STRENGTHS.MEDIUM,
    duration: EFFECT_DURATIONS.MEDIUM,
    territoryTypes: ['fortress', 'village']
  },
  english: {
    effect: 'diplomacy',
    bonus: EFFECT_STRENGTHS.WEAK,
    duration: EFFECT_DURATIONS.MEDIUM,
    territoryTypes: ['temple', 'village']
  },
  linkedin: {
    effect: 'trade',
    bonus: EFFECT_STRENGTHS.MEDIUM,
    duration: EFFECT_DURATIONS.SHORT,
    territoryTypes: ['village', 'mine']
  },
  learning: {
    effect: 'research',
    bonus: EFFECT_STRENGTHS.MEDIUM,
    duration: EFFECT_DURATIONS.LONG,
    territoryTypes: ['temple', 'fortress']
  }
} as const

export function useTaskEffects() {
  const lastCompletedTask = useScheduleStore(state => state.lastCompletedTask)
  const territories = useTerritoryStore(state => state.territories)
  const applyEffect = useTerritoryStore(state => state.applyEffect)
  const { notifyAchievement } = useGameNotifications()

  const processTaskEffects = useCallback((task: Task) => {
    // Получаем эффекты для данной категории задачи
    const effects = TASK_TERRITORY_EFFECTS[task.category as keyof typeof TASK_TERRITORY_EFFECTS]
    if (!effects) return

    // Находим подходящие территории для применения эффектов
    const affectedTerritories = territories.filter(
      territory => effects.territoryTypes.includes(territory.type)
    )

    // Применяем эффекты ко всем подходящим территориям
    affectedTerritories.forEach(territory => {
      const duration = effects.duration || EFFECT_DURATIONS.SHORT
      const endTime = duration === EFFECT_DURATIONS.PERMANENT 
        ? EFFECT_DURATIONS.PERMANENT 
        : Date.now() + duration

      // Apply effect to territory
      applyEffect({
        territoryId: territory.id,
        effect: effects.effect as TerritoryEffectType,
        bonus: effects.bonus
      })

      notifyAchievement(
        'Территория улучшена!',
        `${territory.name} получает +${effects.bonus} к ${effects.effect} на ${
          duration === EFFECT_DURATIONS.PERMANENT 
            ? 'постоянно' 
            : `${duration / 900} сек.`
        }`
      )
    })
  }, [territories, applyEffect, notifyAchievement])

  // Следим за выполнением задач
  useEffect(() => {
    if (lastCompletedTask) {
      processTaskEffects(lastCompletedTask)
    }
  }, [lastCompletedTask, processTaskEffects])

  return {
    TASK_TERRITORY_EFFECTS,
    processTaskEffects
  }
}
