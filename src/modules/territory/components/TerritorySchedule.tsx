'use client'

import { Card } from '@/shared/ui/card'
import { TerritoryScheduleTimeline } from './TerritoryScheduleTimeline'
import type { Activity } from '../types/schedules'

interface TerritoryScheduleProps {
  activities: Activity[]
  dayStart?: string
  dayEnd?: string
}

export function TerritorySchedule({
  activities,
  dayStart = "08:00",
  dayEnd = "23:55"
}: TerritoryScheduleProps) {
  return (
    <Card gradient="from-primary-500/20 to-primary-400/20" className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white/90 mb-2">Расписание дня</h2>
        <p className="text-white/60">
          Распорядок дня для максимальной эффективности
        </p>
      </div>

      {/* Schedule Content */}
      <div className="space-y-6">
        <TerritoryScheduleTimeline
          activities={activities}
          dayStart={dayStart}
          dayEnd={dayEnd}
        />
      </div>
    </Card>
  )
}
