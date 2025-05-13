'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { Card, CardGroup } from '@/shared/ui/Card'
import { staggerContainer, fadeInUp, hoverScale } from '@/shared/ui/animations'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { getAchievementName } from '@/modules/noble/constants/achievements'
import { CreateProfileModal } from '@/shared/ui/modals/CreateProfileModal'

type AchievementCategory = 'diplomacy' | 'development' | 'trade' | 'research' | 'strategy' | 'wisdom'

const categories: {
  id: AchievementCategory
  name: string
  icon: string
  color: string
}[] = [
  { id: 'diplomacy', name: 'Дипломатия', icon: '🤝', color: 'from-blue-500 to-sky-500' },
  { id: 'development', name: 'Развитие', icon: '📈', color: 'from-green-500 to-emerald-500' },
  { id: 'trade', name: 'Торговля', icon: '💰', color: 'from-yellow-500 to-amber-500' },
  { id: 'research', name: 'Исследования', icon: '🔬', color: 'from-purple-500 to-violet-500' },
  { id: 'strategy', name: 'Стратегия', icon: '⚔️', color: 'from-red-500 to-rose-500' },
  { id: 'wisdom', name: 'Мудрость', icon: '📚', color: 'from-indigo-500 to-blue-500' }
]

function AchievementsContent() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) {
    return <CreateProfileModal />
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Заголовок */}
      <Card gradient="from-purple-500/20 to-indigo-500/20" className="p-8">
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Достижения</h1>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white font-medium">Всего:</span>
              <span className="text-2xl font-bold text-white">
                {noble.achievements.total}
              </span>
            </div>
          </div>
          <p className="text-gray-300">
            Развивайте своё королевство и получайте уникальные достижения
          </p>
        </motion.div>
      </Card>

      {/* Сетка категорий */}
      <CardGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => {
          const count = noble.achievements.categories[category.id]
          const progress = (count / 50) * 100 // Максимум 50 достижений в категории

          return (
            <Card 
              key={category.id}
              gradient={category.color}
              hover
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl mb-2">{category.icon}</span>
                  <h3 className="text-lg font-bold text-white mt-2">
                    {category.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-white/80 text-sm">Прогресс</span>
                  <p className="text-2xl font-bold text-white">{count}/50</p>
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="h-2 bg-black/20 rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="h-full bg-white/30 transition-all duration-500 group-hover:bg-white/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>

              <div className="absolute bottom-0 right-0 opacity-10 text-8xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2">
                {category.icon}
              </div>
            </Card>
          )
        })}
      </CardGroup>

      {/* Последние достижения */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Полученные достижения
          </h2>
          <div className="space-y-2">
            {noble.achievements.completed.map((achievement, index) => (
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
            {noble.achievements.completed.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                Пока нет полученных достижений. Продолжайте развивать своё королевство!
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default withPageTransition(AchievementsContent)
