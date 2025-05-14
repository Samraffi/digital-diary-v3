'use client'

import { useMemo } from 'react'
import { ProgressBarProps } from './types'
import {
  normalizeValue,
  calculatePercentage,
  getColorClasses,
  getSizeClasses,
  getAnimationClasses
} from './utils'

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  animated = true,
  className = ''
}: ProgressBarProps) {
  const normalizedValue = useMemo(() => normalizeValue(value, max), [value, max])
  const percentage = useMemo(() => calculatePercentage(normalizedValue, max), [normalizedValue, max])
  const colorClasses = useMemo(() => getColorClasses(color), [color])
  const sizeClasses = useMemo(() => getSizeClasses(size), [size])
  const animationClasses = useMemo(() => getAnimationClasses(animated), [animated])

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