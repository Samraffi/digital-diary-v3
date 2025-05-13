'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { Card, CardGroup } from '@/shared/ui/Card'
import { staggerContainer, fadeInUp, scaleUp } from '@/shared/ui/animations'
import { withPageTransition } from '@/lib/hooks/usePageTransition'

function TreasuryContent() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const resourceCards = [
    {
      title: 'Золото',
      value: noble.resources.gold,
      change: '+120/час',
      icon: '💰',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Влияние',
      value: noble.resources.influence,
      change: '+45/час',
      icon: '👑',
      color: 'from-purple-500 to-indigo-500'
    }
  ]

  const expenses = [
    { name: 'Содержание армии', amount: 50, percentage: 35 },
    { name: 'Развитие территорий', amount: 40, percentage: 28 },
    { name: 'Дипломатия', amount: 30, percentage: 21 },
    { name: 'Прочие расходы', amount: 23, percentage: 16 }
  ]

  const recentTransactions = [
    { type: 'income', title: 'Доход от территорий', amount: 250, time: '2 часа назад' },
    { type: 'expense', title: 'Расходы на армию', amount: 180, time: '3 часа назад' },
    { type: 'income', title: 'Торговые сделки', amount: 320, time: '5 часов назад' },
    { type: 'expense', title: 'Дипломатическая миссия', amount: 150, time: '6 часов назад' },
    { type: 'income', title: 'Налоговые сборы', amount: 420, time: '8 часов назад' }
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Заголовок */}
      <Card gradient="from-yellow-500/20 to-amber-500/20" className="p-8">
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl font-bold text-white mb-2">Сокровищница</h1>
          <p className="text-gray-300">
            Управляйте ресурсами королевства и следите за экономикой
          </p>
        </motion.div>
      </Card>

      {/* Основные ресурсы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resourceCards.map((card, index) => (
          <Card
            key={card.title}
            gradient={card.color}
            variants={scaleUp}
            transition={{ delay: index * 0.1 }}
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
                <p className="text-white text-3xl font-bold mt-2">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-white/80 text-sm">Прирост</span>
                <p className="text-white font-bold">{card.change}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((card.value / 1000) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* График расходов */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Расходы</h2>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.name}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{expense.name}</span>
                  <span className="text-white font-medium">
                    {expense.amount} золота/час
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${expense.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* История транзакций */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Последние транзакции
          </h2>
          <div className="space-y-2">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-lg
                    bg-gradient-to-br
                    ${transaction.type === 'income' 
                      ? 'from-green-500 to-emerald-500' 
                      : 'from-red-500 to-rose-500'}
                  `}>
                    {transaction.type === 'income' ? '📈' : '📉'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.title}</p>
                    <p className="text-sm text-gray-400">{transaction.time}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default withPageTransition(TreasuryContent)
