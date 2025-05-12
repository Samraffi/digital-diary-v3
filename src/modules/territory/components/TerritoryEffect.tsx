'use client'

import { useEffect, useState } from 'react'
import { TerritoryEffectType } from '../types/effects'

interface TerritoryEffectProps {
  type: TerritoryEffectType
  value: number
  duration?: number
  onComplete?: () => void
}

export function TerritoryEffect({
  type,
  value,
  duration = 2000,
  onComplete
}: TerritoryEffectProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Определяем цвет и иконку в зависимости от типа эффекта
  const getEffectStyles = () => {
    switch (type) {
      case 'development':
        return {
          icon: '📈',
          color: value >= 0 ? 'text-purple-500' : 'text-red-500',
          bgColor: value >= 0 ? 'bg-purple-100' : 'bg-red-100'
        }
      case 'diplomacy':
        return {
          icon: '🤝',
          color: value >= 0 ? 'text-blue-500' : 'text-red-500',
          bgColor: value >= 0 ? 'bg-blue-100' : 'bg-red-100'
        }
      case 'trade':
        return {
          icon: '💰',
          color: value >= 0 ? 'text-yellow-500' : 'text-red-500',
          bgColor: value >= 0 ? 'bg-yellow-100' : 'bg-red-100'
        }
      case 'research':
        return {
          icon: '🔬',
          color: value >= 0 ? 'text-green-500' : 'text-red-500',
          bgColor: value >= 0 ? 'bg-green-100' : 'bg-red-100'
        }
      default:
        return {
          icon: '✨',
          color: value >= 0 ? 'text-primary' : 'text-red-500',
          bgColor: value >= 0 ? 'bg-primary-100' : 'bg-red-100'
        }
    }
  }

  const { icon, color, bgColor } = getEffectStyles()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`
        absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
        px-3 py-1 rounded-full ${bgColor} ${color} font-bold
        flex items-center gap-1 shadow-md z-10
        animate-float transition-opacity duration-300
      `}
    >
      <span>{icon}</span>
      <span>{value > 0 ? `+${value}` : value}</span>
    </div>
  )
}
