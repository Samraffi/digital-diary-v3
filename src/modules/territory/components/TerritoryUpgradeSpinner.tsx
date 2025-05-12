'use client'

interface TerritoryUpgradeSpinnerProps {
  visible: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function TerritoryUpgradeSpinner({
  visible,
  size = 'md'
}: TerritoryUpgradeSpinnerProps) {
  if (!visible) return null

  // Определяем размеры в зависимости от параметра size
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div
      className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        ${sizeClasses[size]} rounded-full border-4 border-primary/20
        border-t-primary z-20 pointer-events-none animate-spin
        transition-opacity duration-300
      `}
    >
      <span className="sr-only">Улучшение...</span>
    </div>
  )
}
