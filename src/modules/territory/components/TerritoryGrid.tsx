'use client'

import { memo } from 'react'
import { Territory } from '../types/territory'
import { useTerritoryContext } from '../providers/TerritoryProvider'
import { Card } from '@/shared/ui/Card'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

interface TerritoryGridProps {
  territories: Territory[]
  onUpgrade: (territory: Territory) => Promise<void>
  upgradingTerritoryId?: string | null
}

const ITEMS_PER_PAGE = 20

function TerritoryGridComponent({
  territories,
  onUpgrade,
  upgradingTerritoryId
}: TerritoryGridProps) {
  const { activeEffects } = useTerritoryContext()
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalPages = Math.ceil(territories.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const visibleTerritories = territories.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Determine type-specific styles
  const getTypeColor = (type: Territory['type']) => {
    switch (type) {
      case 'camp':
        return 'from-green-500/20 to-green-600/20'
      case 'mine':
        return 'from-blue-500/20 to-blue-600/20'
      case 'village':
        return 'from-yellow-500/20 to-yellow-600/20'
      case 'fortress':
        return 'from-purple-500/20 to-purple-600/20'
      case 'temple':
        return 'from-red-500/20 to-red-600/20'
      default:
        return 'from-primary/20 to-primary-600/20'
    }
  }

  const getTypeIcon = (type: Territory['type']) => {
    switch (type) {
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
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTerritories.map((territory) => {
          const isAffected = activeEffects.some(
            effect => effect.territoryId === territory.id
          )
          const isUpgrading = upgradingTerritoryId === territory.id

          return (
            <motion.div
              key={territory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-6 bg-gradient-to-br ${getTypeColor(territory.type)} hover:scale-[1.02] transition-transform duration-300`}>
                {/* Заголовок */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(territory.type)}</span>
                    <span>{territory.name}</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    Уровень {territory.level}
                  </span>
                </div>

                {/* Прогресс и статистика */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-400">Производство</div>
                      <div className="flex items-center gap-2 text-lg">
                        <span>{territory.production?.gold || 0}</span>
                        <span className="text-yellow-500">💰</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-400">Влияние</div>
                      <div className="flex items-center gap-2 text-lg">
                        <span>{territory.production?.influence || 0}</span>
                        <span className="text-blue-500">👑</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">Стабильность</div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${territory.status?.stability || 0}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">Счастье</div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${territory.status?.happiness || 0}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Link
                    href={`/territories/${territory.id}`}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors text-center"
                  >
                    Управлять
                  </Link>
                  <button
                    onClick={() => onUpgrade(territory)}
                    disabled={isUpgrading}
                    className={`
                      py-3 px-4 rounded-lg font-medium transition-colors
                      ${isUpgrading 
                        ? 'bg-gray-500/50 cursor-not-allowed' 
                        : 'bg-white/10 hover:bg-white/20'
                      }
                    `}
                  >
                    {isUpgrading ? 'Улучшение...' : 'Улучшить'}
                  </button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                w-10 h-10 rounded-lg font-medium transition-colors
                ${currentPage === page
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const TerritoryGrid = memo(TerritoryGridComponent)
