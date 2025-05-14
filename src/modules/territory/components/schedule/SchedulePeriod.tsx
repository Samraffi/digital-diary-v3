'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, periodLabels } from '../../types/schedules'
import { ScheduleBlock } from './ScheduleBlock'

interface SchedulePeriodProps {
  period: keyof typeof periodLabels
  activities: Activity[]
  currentTime: string
}

export function SchedulePeriod({ period, activities, currentTime }: SchedulePeriodProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center gap-2 mb-4 text-lg font-medium text-white/80 hover:text-white"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          className="w-6 h-6 flex items-center justify-center"
        >
          ▼
        </motion.div>
        {periodLabels[period]}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {activities.map(activity => (
                <ScheduleBlock
                  key={activity.id}
                  activity={activity}
                  isCurrentActivity={
                    currentTime >= activity.startTime && currentTime < activity.endTime
                  }
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}