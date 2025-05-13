'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { TerritorySchedule } from '@/modules/territory/components/TerritorySchedule'
import { ScheduleSelector } from '@/modules/territory/components/ScheduleSelector'
import { ScheduleStatistics } from '@/modules/territory/components/ScheduleStatistics'
import { fadeInUp } from '@/shared/ui/animations'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { scheduleTypes } from '@/modules/territory/types/schedules'

function SchedulePage() {
  const [selectedType, setSelectedType] = useState('main')
  const currentSchedule = scheduleTypes.find(s => s.type === selectedType)

  return (
    <motion.div
      variants={{ 
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Заголовок */}
      <Card gradient="from-blue-500/20 to-cyan-500/20" className="p-8">
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl font-bold text-white mb-2">Общее расписание</h1>
          <p className="text-gray-300">
            Ежедневное расписание для всех территорий
          </p>
        </motion.div>
      </Card>

      {/* Навигация */}
      <Card className="p-4">
        <div className="flex gap-4 border-b border-white/10">
          <motion.a
            href="/territories"
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Список
          </motion.a>
          <motion.a
            href="/territories/schedule"
            className="px-4 py-2 text-sm font-medium text-white relative"
            whileHover={{ scale: 1.02 }}
          >
            Расписание дня
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          </motion.a>
        </div>
      </Card>

      {/* Селектор расписания */}
      <ScheduleSelector 
        selectedType={selectedType}
        onSelect={setSelectedType}
      />

      {/* Статистика */}
      {currentSchedule && (
        <ScheduleStatistics 
          activities={currentSchedule.activities}
        />
      )}

      {/* Расписание */}
      {currentSchedule && (
        <Card>
          <TerritorySchedule 
            activities={currentSchedule.activities}
            dayStart="08:00"
            dayEnd="23:55"
          />
        </Card>
      )}
    </motion.div>
  )
}

export default withPageTransition(SchedulePage)
