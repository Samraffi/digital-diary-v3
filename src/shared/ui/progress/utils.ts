export const normalizeValue = (value: number, max: number): number => {
  return Math.min(Math.max(0, value), max)
}

export const calculatePercentage = (value: number, max: number): number => {
  return (value / max) * 100
}

export const getColorClasses = (color: string): string => {
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
}

export const getSizeClasses = (size: string): string => {
  switch (size) {
    case 'sm':
      return 'h-1'
    case 'lg':
      return 'h-4'
    default:
      return 'h-2'
  }
}

export const getAnimationClasses = (animated: boolean): string => {
  return animated ? 'progress-shimmer' : ''
} 