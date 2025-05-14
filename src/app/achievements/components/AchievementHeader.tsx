import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { fadeInUp } from '@/shared/ui/animations'
import { Noble } from '@/modules/noble/types'

interface AchievementHeaderProps {
  noble: Noble
  totalCategories: number
}

export function AchievementHeader({ noble, totalCategories }: AchievementHeaderProps) {
  return (
    <Card gradient="from-purple-500/20 to-indigo-500/20" className="p-8">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Достижения</h1>
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
            <span className="text-white font-medium">Всего:</span>
            <span className="text-2xl font-bold text-white">
              {noble.achievements.completed.length} / {totalCategories}
            </span>
          </div>
        </div>
        <p className="text-gray-300">
          Развивайте своё королевство и получайте уникальные достижения
        </p>
      </motion.div>
    </Card>
  )
} 