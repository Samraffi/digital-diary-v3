'use client'

import { memo } from 'react'
import { Territory } from '../types/territory'
import { useTerritoryContext } from '../providers/TerritoryProvider'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { TerritoryUpgradeSpinner } from './TerritoryUpgradeSpinner'

interface TerritoryCardProps {
  territory: Territory
  isAffected?: boolean
  isUpgrading?: boolean
  onUpgrade: (territory: Territory) => Promise<void>
}

function TerritoryCardComponent({
  territory,
  isAffected = false,
  isUpgrading = false,
  onUpgrade: onUpgradeProps
}: TerritoryCardProps) {
  const { activeEffects } = useTerritoryContext()

  // Определяем цвет в зависимости от типа территории
  const getTypeColor = () => {
    switch (territory.type) {
      case 'camp':
        return 'green'
      case 'mine':
        return 'blue'
      case 'village':
        return 'yellow'
      case 'fortress':
        return 'purple'
      case 'temple':
        return 'red'
      default:
        return 'primary'
    }
  }

  // Определяем иконку в зависимости от типа территории
  const getTypeIcon = () => {
    switch (territory.type) {
      case 'camp':
        return '⛺'
      case 'mine':
        return '⛏️'
      case 'village':
        return '🏘️'
      case 'fortress':
        return '🏰'
      case 'temple':
        return '🏛️'
      default:
        return '🏙️'
    }
  }

  return (
    <div className="relative">
      <div
        className={`
          relative border rounded-lg p-4 shadow-sm transition-all duration-300
          ${isAffected ? 'territory-card-highlight' : ''}
          ${isUpgrading ? 'opacity-70' : 'hover:shadow-md'}
        `}
      >
        {/* Спиннер улучшения */}
        <TerritoryUpgradeSpinner visible={isUpgrading} />

        {/* Заголовок */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span>{getTypeIcon()}</span>
            <span>{territory.name}</span>
          </h3>
          <span className="text-sm text-gray-500">Уровень {territory.level}</span>
        </div>

        {/* Прогресс развития */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Развитие</span>
            <span>{territory.development}/{territory.maxDevelopment}</span>
          </div>
          <ProgressBar
            value={territory.development}
            max={territory.maxDevelopment}
            color={getTypeColor()}
          />
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Производство:</span>
            <span className="ml-1 font-medium">{territory.production?.gold || 0} 💰</span>
          </div>
          <div>
            <span className="text-gray-500">Влияние:</span>
            <span className="ml-1 font-medium">{territory.production?.influence || 0} 👑</span>
          </div>
          <div>
            <span className="text-gray-500">Стабильность:</span>
            <span className="ml-1 font-medium">{territory.status?.stability || 0}%</span>
          </div>
          <div>
            <span className="text-gray-500">Счастье:</span>
            <span className="ml-1 font-medium">{territory.status?.happiness || 0}%</span>
          </div>
        </div>

        {/* Кнопка улучшения */}
        <button
          onClick={() => onUpgradeProps(territory)}
          disabled={isUpgrading}
          className={`
            w-full py-2 px-4 rounded text-white font-medium transition-colors
            ${isUpgrading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}
          `}
        >
          {isUpgrading ? 'Улучшение...' : 'Улучшить'}
        </button>
      </div>
    </div>
  )
}

// Мемоизируем компонент для предотвращения лишних рендеров
export const MemoizedTerritoryCard = memo(TerritoryCardComponent)
