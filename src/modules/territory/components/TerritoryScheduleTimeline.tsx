'use client'

import { useState, useEffect } from 'react'
import { Activity, periodLabels } from '../types/schedules'
import { SchedulePeriod } from './schedule/SchedulePeriod'
import { getPeriod } from './schedule/utils'

interface TerritoryScheduleTimelineProps {
  activities: Activity[]
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
  }, {} as Record<keyof typeof periodLabels, Activity[]>)

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