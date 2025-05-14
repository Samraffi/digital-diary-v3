import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/Card'
import { fadeInUp } from '@/shared/ui/animations'

interface CategoryCardProps {
  id: string
  name: string
  icon: string
  color: string
  count: number
  index: number
}

export function CategoryCard({ id, name, icon, color, count, index }: CategoryCardProps) {
  const progress = (count / 50) * 100 // Максимум 50 достижений в категории

  return (
    <Card 
      key={id}
      gradient={color}
      hover
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      className="p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-3xl mb-2">{icon}</span>
          <h3 className="text-lg font-bold text-white mt-2">
            {name}
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
        {icon}
      </div>
    </Card>
  )
} 