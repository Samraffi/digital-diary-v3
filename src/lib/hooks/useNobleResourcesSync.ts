'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/lib/redux/store'
import { initializeNoble } from '@/modules/noble/redux/nobleSlice'
import { addResources, addSpecialEffect } from '@/modules/noble/redux/nobleThunks'
import { saveNoble } from '@/lib/db'

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    addNobleResources?: (resources: { gold: number; influence: number }) => void;
    addNobleSpecialEffect?: (effect: string) => void;
  }
}

export function useNobleResourcesSync() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Load noble from database when component mounts
    dispatch(initializeNoble('default'))

    // Set up global functions for adding resources and special effects
    window.addNobleResources = (resources) => {
      dispatch(addResources(resources))
    }

    window.addNobleSpecialEffect = (effect) => {
      dispatch(addSpecialEffect(effect))
    }

    return () => {
      // Clean up global functions when component unmounts
      delete window.addNobleResources
      delete window.addNobleSpecialEffect
    }
  }, [dispatch])
}
