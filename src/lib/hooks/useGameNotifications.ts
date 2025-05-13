'use client'

import { useEffect, useRef } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useNotifications } from '@/shared/ui/notifications/NotificationsProvider'
import { toast } from 'react-hot-toast'
import { NobleRank } from '@/modules/noble/types'
import { rankRequirements } from '@/modules/noble/constants'

export function useGameNotifications() {
  const { addNotification } = useNotifications()
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore(state => state.territories)
  
  const prevRankRef = useRef<string | null>(null)
  const prevLevelRef = useRef<number | null>(null)
  const prevTerritoriesCountRef = useRef<number | null>(null)
  const prevAchievementsRef = useRef<number | null>(null)

  useEffect(() => {
    if (!noble) return

    // Отслеживаем изменение ранга
    const currentTitle = noble.titles?.[0]
    if (currentTitle && prevRankRef.current && prevRankRef.current !== currentTitle.toString()) {
      addNotification({
        title: 'Повышение ранга!',
        message: `Поздравляем! Вы достигли ранга ${currentTitle.toString().charAt(0).toUpperCase() + currentTitle.toString().slice(1)}`,
        type: 'success',
        duration: 8000
      })

      // Показываем прогресс до следующего ранга
      const nextRank = getNextRank(currentTitle.toString() as NobleRank)
      if (nextRank) {
        const requirements = rankRequirements[nextRank]
        notifyRankProgress(nextRank, requirements)
      }
    }
    prevRankRef.current = currentTitle?.toString() || null

    // Отслеживаем повышение уровня
    if (prevLevelRef.current && prevLevelRef.current < noble.level) {
      addNotification({
        title: 'Новый уровень!',
        message: `Вы достигли ${noble.level} уровня`,
        type: 'success',
        duration: 6000
      })
    }
    prevLevelRef.current = noble.level

    // Отслеживаем прогресс достижений
    if (prevAchievementsRef.current !== null && 
        prevAchievementsRef.current < noble.achievements.total) {
      const progress = calculateAchievementProgress(noble.achievements.total)
      if (progress.nextMilestone) {
        notifyAchievementProgress(progress)
      }
    }
    prevAchievementsRef.current = noble.achievements.total

  }, [noble, addNotification])

  useEffect(() => {
    // Отслеживаем получение новых территорий
    const currentCount = territories.length
    if (prevTerritoriesCountRef.current !== null && prevTerritoriesCountRef.current < currentCount) {
      addNotification({
        title: 'Новая территория!',
        message: `Получена территория: ${territories[territories.length - 1].name}`,
        type: 'info',
        duration: 5000
      })

      // Показываем прогресс территорий для текущего ранга
      if (noble?.rank) {
        const requirements = rankRequirements[noble.rank as NobleRank]
        notifyTerritoryProgress(currentCount, requirements.territories)
      }
    }
    prevTerritoriesCountRef.current = currentCount

  }, [territories, addNotification])

  // Функции для отправки игровых уведомлений
  const notifyResourceReward = (resources: { gold?: number; influence?: number }) => {
    const message = Object.entries(resources)
      .map(([type, amount]) => `+${amount} ${type === 'gold' ? '🪙' : '⚜️'}`)
      .join(' ')
    
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right'
    })
  }

  const notifyAchievement = (name: string, description: string) => {
    toast.success(`🏆 ${name}\n${description}`, {
      duration: 4000,
      position: 'bottom-right'
    })
  }

  const notifyError = (title: string, message: string) => {
    toast.error(`❌ ${title}\n${message}`, {
      duration: 4000,
      position: 'bottom-right'
    })
  }

  const notifyInfo = (title: string, message: string) => {
    toast(`ℹ️ ${title}\n${message}`, {
      duration: 6000,
      position: 'bottom-right'
    })
  }

  const notifyRankProgress = (nextRank: NobleRank, requirements: typeof rankRequirements[NobleRank]) => {
    if (!noble) return

    const influenceProgress = Math.floor((noble.resources.influence / requirements.influence) * 100)
    const territoriesProgress = Math.floor((territories.length / requirements.territories) * 100)
    const achievementsProgress = Math.floor((noble.achievements.total / requirements.achievements) * 100)

    toast(`📊 Прогресс до ранга ${nextRank}:
    Влияние: ${influenceProgress}%
    Территории: ${territoriesProgress}%
    Достижения: ${achievementsProgress}%`, {
      duration: 8000,
      position: 'bottom-right'
    })
  }

  const notifyTerritoryProgress = (current: number, required: number) => {
    const progress = Math.floor((current / required) * 100)
    toast(`🏰 Прогресс территорий: ${progress}%
    ${current}/${required} территорий`, {
      duration: 5000,
      position: 'bottom-right'
    })
  }

  const notifyAchievementProgress = (progress: { 
    current: number, 
    nextMilestone: number,
    reward?: { gold: number, influence: number }
  }) => {
    const message = progress.reward 
      ? `До следующей награды: ${progress.nextMilestone - progress.current} достижений
         Награда: 💰 ${progress.reward.gold} 👑 ${progress.reward.influence}`
      : `Прогресс достижений: ${progress.current}/${progress.nextMilestone}`

    toast(`🏆 ${message}`, {
      duration: 6000,
      position: 'bottom-right'
    })
  }

  return {
    notifyResourceReward,
    notifyAchievement,
    notifyError,
    notifyInfo
  }
}

// Вспомогательные функции
function getNextRank(currentRank: NobleRank): NobleRank | null {
  const ranks: NobleRank[] = ['барон', 'виконт', 'граф', 'маркиз', 'герцог', 'король']
  const currentIndex = ranks.indexOf(currentRank)
  return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null
}

function calculateAchievementProgress(total: number) {
  const milestones = [5, 10, 25, 50, 100]
  const nextMilestone = milestones.find(m => m > total)
  
  if (!nextMilestone) return { current: total, nextMilestone: null }

  const reward = {
    gold: nextMilestone * 100,
    influence: nextMilestone * 50
  }

  return {
    current: total,
    nextMilestone,
    reward
  }
}
