'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { useNobleStore } from '@/modules/noble/store'
import { toast } from 'react-hot-toast'
import { NobleRank } from '@/modules/noble/types'
import { rankRequirements } from '@/modules/noble/constants'

const toastOptions = {
  duration: 4000,
  position: 'bottom-right' as const,
  className: 'cursor-pointer',
  style: {
    minWidth: '200px',
  },
  onClick: (t: any) => toast.dismiss(t.id)
}

export function useGameNotifications() {
  const pathname = usePathname()
  const { noble } = useNobleStore();
  const territories = useSelector((state: RootState) => state.territory.territories)
  
  const prevRankRef = useRef<string | null>(null)
  const prevLevelRef = useRef<number | null>(null)
  const prevTerritoriesCountRef = useRef<number | null>(null)
  const prevAchievementsRef = useRef<number | null>(null)

  // Функция для проверки, нужно ли показывать уведомления
  const shouldShowNotifications = () => pathname !== '/road-to-glory'

  useEffect(() => {
    if (!noble || !shouldShowNotifications()) return

    // Отслеживаем изменение ранга
    const currentTitle = noble.titles?.[0]
    if (currentTitle && prevRankRef.current && prevRankRef.current !== currentTitle.toString()) {
      toast.success(`🎉 Повышение ранга!\nПоздравляем! Вы достигли ранга ${currentTitle.toString().charAt(0).toUpperCase() + currentTitle.toString().slice(1)}`, {
        ...toastOptions,
        duration: 8000,
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
      toast.success(`⭐ Новый уровень!\nВы достигли ${noble.level} уровня`, {
        ...toastOptions,
        duration: 6000,
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

  }, [noble, pathname])

  useEffect(() => {
    if (!shouldShowNotifications()) return

    // Отслеживаем получение новых территорий
    const currentCount = territories.length
    if (prevTerritoriesCountRef.current !== null && prevTerritoriesCountRef.current < currentCount) {
      toast.success(`🏰 Новая территория!\nПолучена территория: ${territories[territories.length - 1].name}`, {
        ...toastOptions,
        duration: 5000,
      })

      // Показываем прогресс территорий для текущего ранга
      if (noble?.rank) {
        const requirements = rankRequirements[noble.rank as NobleRank]
        notifyTerritoryProgress(currentCount, requirements.territories)
      }
    }
    prevTerritoriesCountRef.current = currentCount

  }, [territories, noble?.rank, pathname])

  // Функции для отправки игровых уведомлений
  const notifyResourceReward = (resources: { gold?: number; influence?: number }) => {
    if (!shouldShowNotifications()) return

    const message = Object.entries(resources)
      .map(([type, amount]) => `+${amount} ${type === 'gold' ? '🪙' : '⚜️'}`)
      .join(' ')
    
    toast.success(message, {
      ...toastOptions,
      duration: 3000,
    })
  }

  const notifyAchievement = (name: string, description: string) => {
    if (!shouldShowNotifications()) return

    toast.success(`🏆 ${name}\n${description}`, {
      ...toastOptions,
      duration: 4000,
    })
  }

  const notifyError = (title: string, message: string) => {
    if (!shouldShowNotifications()) return

    toast.error(`❌ ${title}\n${message}`, {
      ...toastOptions,
      duration: 4000,
    })
  }

  const notifyInfo = (title: string, message: string) => {
    if (!shouldShowNotifications()) return

    toast(`ℹ️ ${title}\n${message}`, {
      ...toastOptions,
      duration: 6000,
    })
  }

  const notifyRankProgress = (nextRank: NobleRank, requirements: typeof rankRequirements[NobleRank]) => {
    if (!noble || !shouldShowNotifications()) return

    const influenceProgress = Math.floor((noble.resources.influence / requirements.influence) * 100)
    const territoriesProgress = Math.floor((territories.length / requirements.territories) * 100)
    const achievementsProgress = Math.floor((noble.achievements.total / requirements.achievements) * 100)

    toast(`📊 Прогресс до ранга ${nextRank}:
    Влияние: ${influenceProgress}%
    Территории: ${territoriesProgress}%
    Достижения: ${achievementsProgress}%`, {
      ...toastOptions,
      duration: 8000,
    })
  }

  const notifyTerritoryProgress = (current: number, required: number) => {
    if (!shouldShowNotifications()) return

    const progress = Math.floor((current / required) * 100)
    toast(`🏰 Прогресс территорий: ${progress}%
    ${current}/${required} территорий`, {
      ...toastOptions,
      duration: 5000,
    })
  }

  const notifyAchievementProgress = (progress: { 
    current: number, 
    nextMilestone: number,
    reward?: { gold: number, influence: number }
  }) => {
    if (!shouldShowNotifications()) return

    const message = progress.reward 
      ? `До следующей награды: ${progress.nextMilestone - progress.current} достижений
         Награда: 💰 ${progress.reward.gold} 👑 ${progress.reward.influence}`
      : `Прогресс достижений: ${progress.current}/${progress.nextMilestone}`

    toast(`🏆 ${message}`, {
      ...toastOptions,
      duration: 6000,
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
