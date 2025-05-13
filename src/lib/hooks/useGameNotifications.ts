'use client'

import { useEffect, useRef } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useNotifications } from '@/shared/ui/notifications/NotificationsProvider'
import { toast } from 'react-hot-toast'

export function useGameNotifications() {
  const { addNotification } = useNotifications()
  const noble = useNobleStore(state => state.noble)
  const territories = useTerritoryStore(state => state.territories)
  
  const prevRankRef = useRef<string | null>(null)
  const prevLevelRef = useRef<number | null>(null)
  const prevTerritoriesCountRef = useRef<number | null>(null)

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

  return {
    notifyResourceReward,
    notifyAchievement,
    notifyError,
    notifyInfo
  }
}
