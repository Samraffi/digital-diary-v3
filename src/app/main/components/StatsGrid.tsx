import { Card } from '@/shared/ui/card'
import { Noble } from '@/modules/noble/types'

interface StatsGridProps {
  noble: Noble
}

export const StatsGrid = ({ noble }: StatsGridProps) => {
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
  )
} 