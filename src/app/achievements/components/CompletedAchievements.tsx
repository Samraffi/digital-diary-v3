import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { fadeInUp } from '@/shared/ui/animations'
import { getAchievementName } from '@/modules/noble/constants/achievements'

interface CompletedAchievementsProps {
  completedAchievements: string[]
}

export function CompletedAchievements({ completedAchievements }: CompletedAchievementsProps) {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Полученные достижения
        </h2>
        <div className="space-y-2">
          {completedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement}
              variants={fadeInUp}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition-colors"
            >
              <span className="text-white">{getAchievementName(achievement)}</span>
              <span className="text-green-400">✓</span>
            </motion.div>
          ))}
          {completedAchievements.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              Пока нет полученных достижений. Продолжайте развивать своё королевство!
            </p>
          )}
        </div>
      </div>
    </Card>
  )
} 