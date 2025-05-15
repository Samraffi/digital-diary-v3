'use client'

import { useEffect } from 'react'
import { useNobleStore } from '@/modules/noble/store'
import { syncNobleState, saveNoble } from '@/lib/db'

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    addNobleResources?: (resources: { gold: number; influence: number }) => void;
    addNobleSpecialEffect?: (effect: string) => void;
  }
}

export function useNobleResourcesSync() {
  useEffect(() => {
    // Load noble from database when component mounts
    syncNobleState(useNobleStore)

    // Set up store subscription for auto-saving
    const unsubscribe = useNobleStore.subscribe(
      (state) => {
        if (state.noble && !state.isLoading && !state.error) {
          saveNoble(state.noble).catch(console.error)
        }
      }
    )

    // Set up global functions for adding resources and special effects
    window.addNobleResources = (resources) => {
      useNobleStore.getState().addResources(resources)
    }

    window.addNobleSpecialEffect = (effect) => {
      useNobleStore.getState().addSpecialEffect(effect)
    }

    return () => {
      // Clean up subscriptions and global functions when component unmounts
      unsubscribe()
      delete window.addNobleResources
      delete window.addNobleSpecialEffect
    }
  }, [])
}
