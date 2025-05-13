'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '../store'

interface StatBarProps {
  label: string
  value: number
  maxValue: number
  color: string
  delay?: number
}

function StatBar({ label, value, maxValue, color, delay = 0 }: StatBarProps) {
  const percentage = (value / maxValue) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1],
            delay
          }}
        />
      </div>
    </div>
  )
}

export function NobleStatus() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) return null

  const { experience = 0, experienceForNextLevel = 100 } = noble
  const expPercentage = (experience / experienceForNextLevel) * 100

  return (
    <div className="space-y-6">
      {/* Опыт */}
      {typeof experience !== 'undefined' && typeof experienceForNextLevel !== 'undefined' && (
        <div className="relative overflow-hidden rounded-lg bg-white/5 p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">Опыт</h3>
          <span className="text-sm text-white font-medium">
            {experience}/{experienceForNextLevel}
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
            initial={{ width: 0 }}
            animate={{ width: `${expPercentage}%` }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        </div>
      </div>
      )}

      {/* Статусы */}
      {noble.status && (
        <div className="space-y-4">
          {[
            {
              label: 'Репутация',
              value: noble.status.reputation,
              maxValue: 100,
              color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
              delay: 0.1
            },
            {
              label: 'Авторитет',
              value: noble.status.authority,
              maxValue: 100,
              color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
              delay: 0.2
            },
            {
              label: 'Популярность',
              value: noble.status.popularity,
              maxValue: 100,
              color: 'bg-gradient-to-r from-amber-500 to-orange-500',
              delay: 0.3
            }
          ].map((stat) => (
          <StatBar key={stat.label} {...stat} />
        ))}
        </div>
      )}

      {/* Перки */}
      {noble.perks && noble.perks.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {noble.perks.map((perk, index) => (
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
      )}
    </div>
  )
}
