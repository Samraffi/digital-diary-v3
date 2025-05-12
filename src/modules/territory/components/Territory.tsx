'use client'

import { useCallback, useState } from 'react'
import { Territory as TerritoryType } from '../types/territory'
import { ActiveEffect } from '../types/effects'
import { useTerritoryContext } from '../providers/TerritoryProvider'
import { TerritoryEffect } from './TerritoryEffect'
import { TerritoryUpgradeSpinner } from './TerritoryUpgradeSpinner'
import { MemoizedTerritoryCard } from './MemoizedTerritoryCard'

interface TerritoryProps {
  territory: TerritoryType
  onUpgrade: (territory: TerritoryType) => Promise<void>
}

export function Territory({ territory, onUpgrade: onUpgradeProps }: TerritoryProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [effects, setEffects] = useState<ActiveEffect[]>([])

  const { activeEffects } = useTerritoryContext()

  const currentEffects = activeEffects.filter(
    effect => effect.territoryId === territory.id
  )
  
  const isAffected = currentEffects.length > 0

  // Оптимизированный обработчик улучшения
  const handleUpgrade = useCallback(async () => {
    setIsUpgrading(true)

    try {
      await onUpgradeProps(territory)
      // Добавляем эффект улучшения
      setEffects(prev => [...prev, {
        territoryId: territory.id,
        effect: 'development',
        bonus: 10,
        endTime: Date.now() + 5000
      }])
    } catch (error) {
      // В случае ошибки не показываем эффект
      console.error('Failed to upgrade territory:', error)
    } finally {
      setIsUpgrading(false)
    }
  }, [territory, onUpgradeProps])

  // Обработчик завершения эффекта
  const handleEffectComplete = useCallback((index: number) => {
    setEffects(prev => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="relative">
      <TerritoryUpgradeSpinner visible={isUpgrading} />
      
      {/* Отображаем плавающие эффекты над картой */}
      {effects.map((effect, index) => (
        <TerritoryEffect
          key={`${effect.effect}-${index}`}
          type={effect.effect}
          value={effect.bonus}
          onComplete={() => handleEffectComplete(index)}
        />
      ))}

      <div className="relative">
        <MemoizedTerritoryCard
          territory={territory}
          isUpgrading={isUpgrading}
          isAffected={isAffected}
          onUpgrade={handleUpgrade}
        />
      </div>
    </div>
  )
}
