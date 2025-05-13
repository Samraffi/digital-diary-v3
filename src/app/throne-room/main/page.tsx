'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { NobleStatus } from '@/modules/noble/components/NobleStatus'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { withPageTransition } from '@/lib/hooks/usePageTransition'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

function MainHallContent() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const statsCards = [
    {
      title: 'Влияние',
      value: noble.stats.totalInfluence,
      icon: '👑',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Территории',
      value: noble.stats.territoriesOwned,
      icon: '🏰',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Достижения',
      value: noble.achievements.total,
      icon: '🏆',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Уровень',
      value: noble.level,
      icon: '⭐',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Приветствие */}
      <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {`${noble.rank.charAt(0).toUpperCase() + noble.rank.slice(1)} ${noble.id}`}
        </h1>
        <p className="text-gray-300">
          Управляйте своими владениями и развивайте свое королевство
        </p>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card 
            key={card.title}
            gradient={card.gradient}
            hover
            delay={index * 0.1}
            className="p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="text-white/80 text-sm font-medium">
                    {card.title}
                  </span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Статус дворянина */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Статус дворянина</h2>
        </CardHeader>
        <CardContent>
          <NobleStatus />
        </CardContent>
      </Card>

      {/* График ресурсов */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Ресурсы</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Золото</span>
              <span className="text-white font-bold">{noble.resources.gold.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                style={{ width: `${Math.min((noble.resources.gold / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Влияние</span>
              <span className="text-white font-bold">{noble.resources.influence.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                style={{ width: `${Math.min((noble.resources.influence / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default withPageTransition(MainHallContent)
