'use client'

import { useEffect, useRef } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useNotifications } from '@/shared/ui/notifications/NotificationsProvider'
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
    if (prevRankRef.current && prevRankRef.current !== noble.title) {
      addNotification({
        title: 'Повышение ранга!',
        message: `Поздравляем! Вы достигли ранга ${noble.title.charAt(0).toUpperCase() + noble.title.slice(1)}`,
        type: 'success',
        duration: 8000
      })
    }
    prevRankRef.current = noble.title

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
    const rewards = []
    if (resources.gold) rewards.push(`${resources.gold} золота`)
    if (resources.influence) rewards.push(`${resources.influence} влияния`)

    if (rewards.length > 0) {
      addNotification({
        title: 'Получена награда!',
        message: `Вы получили: ${rewards.join(' и ')}`,
        type: 'success',
        duration: 4000
      })
    }
  }

  const notifyAchievement = (name: string, description: string) => {
    addNotification({
      title: 'Новое достижение!',
      message: `${name}: ${description}`,
      type: 'success',
      duration: 7000
    })
  }

  const notifyError = (title: string, message: string) => {
    addNotification({
      title,
      message,
      type: 'error',
      duration: 5000
    })
  }

  return {
    notifyResourceReward,
    notifyAchievement,
    notifyError
  }
}
