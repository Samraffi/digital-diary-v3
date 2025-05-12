'use client'

import { useMemo } from 'react'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'primary' | 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  animated = true,
  className = ''
}: ProgressBarProps) {
  // Нормализуем значение
  const normalizedValue = useMemo(() => {
    return Math.min(Math.max(0, value), max)
  }, [value, max])

  // Вычисляем процент заполнения
  const percentage = useMemo(() => {
    return (normalizedValue / max) * 100
  }, [normalizedValue, max])

  // Определяем цвет прогресс-бара
  const colorClasses = useMemo(() => {
    switch (color) {
      case 'green':
        return 'bg-green-500'
      case 'blue':
        return 'bg-blue-500'
      case 'purple':
        return 'bg-purple-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'red':
        return 'bg-red-500'
      default:
        return 'bg-primary'
    }
  }, [color])

  // Определяем размер прогресс-бара
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'h-1'
      case 'lg':
        return 'h-4'
      default:
        return 'h-2'
    }
  }, [size])

  // Определяем классы анимации
  const animationClasses = useMemo(() => {
    if (!animated) return ''
    return 'progress-shimmer'
  }, [animated])

  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses} ${className}`}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`${colorClasses} ${sizeClasses} ${animationClasses} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
