import { useCallback, useEffect, useRef, useState } from 'react'
import { Territory } from '../types/territory'
import { useTerritoryContext } from '../providers/TerritoryProvider'

interface OptimizedTerritoryOptions {
  territory: Territory
  isUpgrading?: boolean
  isAffected?: boolean
}

/**
 * Хук для оптимизации рендеринга территорий
 * Предотвращает лишние перерисовки и оптимизирует производительность
 */
export function useOptimizedTerritory({
  territory,
  isUpgrading = false,
  isAffected = false
}: OptimizedTerritoryOptions) {
  const { isPerformant } = useTerritoryContext()
  const [optimizedTerritory, setOptimizedTerritory] = useState(territory)
  const [optimizedUpgrading, setOptimizedUpgrading] = useState(isUpgrading)
  const [optimizedAffected, setOptimizedAffected] = useState(isAffected)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = useRef<number>(Date.now())
  
  // Функция для обновления состояния с задержкой
  const deferredUpdate = useCallback(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateRef.current
    
    // Очищаем предыдущий таймер, если он существует
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    // Если устройство производительное, обновляем сразу
    if (isPerformant) {
      setOptimizedTerritory(territory)
      setOptimizedUpgrading(isUpgrading)
      setOptimizedAffected(isAffected)
      lastUpdateRef.current = now
      return
    }
    
    // Если прошло достаточно времени с последнего обновления, обновляем сразу
    if (timeSinceLastUpdate > 500) {
      setOptimizedTerritory(territory)
      setOptimizedUpgrading(isUpgrading)
      setOptimizedAffected(isAffected)
      lastUpdateRef.current = now
      return
    }
  }, [territory, isUpgrading, isAffected, isPerformant])
  
  // Обновляем состояние при изменении входных данных
  useEffect(() => {
    deferredUpdate()
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [territory, isUpgrading, isAffected, deferredUpdate])
  
  // Измеряем производительность рендеринга
  const renderTime = useRef(0)

  return {
    territory: optimizedTerritory,
    isUpgrading: optimizedUpgrading,
    isAffected: optimizedAffected,
    renderTime: renderTime.current,
  }
}
