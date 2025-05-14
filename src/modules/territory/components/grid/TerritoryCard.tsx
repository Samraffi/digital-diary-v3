import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/shared/ui/card'
import { Territory } from '../../types/territory'
import { getTypeColor, getTypeIcon } from '../../utils/territory-helpers'
import { TerritoryStats } from './TerritoryStats'

interface TerritoryCardProps {
  territory: Territory
  isUpgrading: boolean
  onUpgrade: (territory: Territory) => Promise<void>
}

export function TerritoryCard({ territory, isUpgrading, onUpgrade }: TerritoryCardProps) {
  return (
    <motion.div
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

        <TerritoryStats territory={territory} />

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
} 