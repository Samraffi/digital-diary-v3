'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/shared/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import type { ScheduleActivity } from '../types/schedule'
import { scheduleColors, scheduleIcons, periodLabels, getPeriod, formatDuration } from '../types/schedule'

interface ScheduleBlockProps {
  activity: ScheduleActivity
  isCurrentActivity: boolean
}

function ScheduleBlock({ activity, isCurrentActivity }: ScheduleBlockProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="relative pl-16">
      {/* Time marker */}
      <div className="absolute left-0 top-4 w-12 text-sm text-white/60">
        {activity.startTime}
      </div>

      {/* Activity block */}
      <Card
        gradient={scheduleColors[activity.type]}
        className="mb-2 cursor-pointer group"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="text-xl">{scheduleIcons[activity.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white/90 truncate">{activity.title}</h4>
                {isCurrentActivity && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500 text-white">
                    Сейчас
                  </span>
                )}
              </div>
              <p className="text-sm text-white/60">
                {activity.startTime} - {activity.endTime} ({formatDuration(activity.duration)})
              </p>
            </div>
          </div>

          <AnimatePresence>
            {showDetails && activity.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="mt-2 text-sm text-white/80 border-t border-white/10 pt-2">
                  {activity.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}

interface SchedulePeriodProps {
  period: keyof typeof periodLabels
  activities: ScheduleActivity[]
  currentTime: string
}

function SchedulePeriod({ period, activities, currentTime }: SchedulePeriodProps) {
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

interface TerritoryScheduleTimelineProps {
  activities: ScheduleActivity[]
  dayStart: string
  dayEnd: string
}

export function TerritoryScheduleTimeline({ 
  activities,
  dayStart,
  dayEnd
}: TerritoryScheduleTimelineProps) {
  const [currentTime, setCurrentTime] = useState('')

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Group activities by period
  const groupedActivities = activities.reduce((groups, activity) => {
    const period = getPeriod(activity.startTime)
    if (!groups[period]) groups[period] = []
    groups[period].push(activity)
    return groups
  }, {} as Record<keyof typeof periodLabels, ScheduleActivity[]>)

  return (
    <div className="relative">
      {/* Progress indicator */}
      <div
        className="absolute left-[60px] top-0 bottom-0 w-px bg-primary-500/20"
        style={{
          background: `linear-gradient(to bottom, 
            transparent ${(parseInt(currentTime.split(':')[0], 10) - parseInt(dayStart.split(':')[0], 10)) / 
            (parseInt(dayEnd.split(':')[0], 10) - parseInt(dayStart.split(':')[0], 10)) * 100}%, 
            rgb(var(--primary-500)) ${(parseInt(currentTime.split(':')[0], 10) - parseInt(dayStart.split(':')[0], 10)) / 
            (parseInt(dayEnd.split(':')[0], 10) - parseInt(dayStart.split(':')[0], 10)) * 100}%)`
        }}
      />

      {/* Schedule content */}
      <div className="space-y-6">
        {Object.entries(periodLabels).map(([period, label]) => (
          <SchedulePeriod
            key={period}
            period={period as keyof typeof periodLabels}
            activities={groupedActivities[period as keyof typeof periodLabels] || []}
            currentTime={currentTime}
          />
        ))}
      </div>
    </div>
  )
}
