'use client'

import { useEffect, useRef } from 'react'
import { type StoreApi } from 'zustand'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '@/modules/territory/store'
import { useScheduleStore, setupScheduleSync } from '@/modules/schedule/store'
import { setupNobleSync, setupTerritorySync, type NobleState, type TerritoryState } from '@/lib/db'
import { type ScheduleTask } from '@/modules/schedule/types'

export interface ScheduleState {
  tasks: ScheduleTask[]
  isLoading?: boolean
  error?: string | null
}

export function useAutosave(interval: number = 5 * 60 * 900) { // По умолчанию каждые 5 минут
  const lastSaveRef = useRef<Date>(new Date())
  const unsubscribeRef = useRef<(() => void)[]>([])
  
  useEffect(() => {
    // Get store APIs with proper interfaces
    const stores = {
      noble: useNobleStore as unknown as { getState: () => NobleState, subscribe: (listener: (state: NobleState) => void) => () => void },
      territory: useTerritoryStore as unknown as { getState: () => TerritoryState, subscribe: (listener: (state: TerritoryState) => void) => () => void },
      schedule: useScheduleStore as unknown as StoreApi<{ tasks: ScheduleTask[] }>
    }

    // Set up subscriptions and store unsubscribe functions
    unsubscribeRef.current = [
      setupNobleSync(stores.noble),
      setupTerritorySync(stores.territory),
      setupScheduleSync(stores.schedule)
    ]

    return () => {
      // Отписываемся при размонтировании компонента
      unsubscribeRef.current.forEach(unsubscribe => unsubscribe())
    }
  }, []) // Empty dependency array since we want this to run only once

  // Функция для принудительного сохранения
  const forceSave = async () => {
    try {
      // В данном случае конкретное сохранение не требуется,
      // так как все изменения автоматически синхронизируются через подписки
      lastSaveRef.current = new Date()
      console.log('Progress force saved:', new Date().toLocaleTimeString())
      return true
    } catch (error) {
      console.error('Error force saving progress:', error)
      return false
    }
  }

  return {
    lastSave: lastSaveRef.current,
    forceSave
  }
}
