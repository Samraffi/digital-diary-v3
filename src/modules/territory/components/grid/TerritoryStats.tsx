import { motion } from 'framer-motion'
import { Territory } from '../../types/territory'

interface TerritoryStatsProps {
  territory: Territory
}

export function TerritoryStats({ territory }: TerritoryStatsProps) {
  return (
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
  )
}