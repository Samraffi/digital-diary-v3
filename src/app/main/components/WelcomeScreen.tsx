import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/shared/ui/card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const WelcomeScreen = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Добро пожаловать в Цифровой Дневник Дворянина
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Начните свой путь к величию, создав свой профиль дворянина
          </p>
          <Link
            href="/profile"
            className="inline-block px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 hover:scale-105"
          >
            Создать профиль
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card gradient="from-purple-500/20 to-indigo-500/20" className="p-6">
          <h3 className="text-xl font-bold text-white mb-3">🏰 Управляйте территориями</h3>
          <p className="text-gray-300">
            Расширяйте свои владения, развивайте инфраструктуру и увеличивайте влияние
          </p>
        </Card>

        <Card gradient="from-blue-500/20 to-cyan-500/20" className="p-6">
          <h3 className="text-xl font-bold text-white mb-3">📝 Ведите летопись</h3>
          <p className="text-gray-300">
            Записывайте важные события и решения в личном дневнике
          </p>
        </Card>

        <Card gradient="from-amber-500/20 to-yellow-500/20" className="p-6">
          <h3 className="text-xl font-bold text-white mb-3">🏆 Получайте достижения</h3>
          <p className="text-gray-300">
            Выполняйте задания и получайте награды за свои успехи
          </p>
        </Card>
      </div>
    </motion.div>
  )
} 