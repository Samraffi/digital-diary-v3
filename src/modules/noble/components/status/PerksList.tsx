import { motion } from 'framer-motion'
import { NoblePerk } from '../../types'

interface PerksListProps {
  perks: NoblePerk[]
}

export function PerksList({ perks }: PerksListProps) {
  if (!perks || perks.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {perks.map((perk, index) => (
        <motion.div
          key={perk.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.4 + index * 0.1
          }}
          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-400">
            <span className="text-sm">{perk.icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{perk.name}</p>
            <p className="text-xs text-gray-400">{perk.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 