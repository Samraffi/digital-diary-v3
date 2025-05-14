'use client'

import { Card } from '@/shared/ui/card'
import { Activity, ActivityType, activityIcons } from '../types/schedules'

interface ScheduleStatisticsProps {
  activities: Activity[]
}

interface ActivityStats {
  type: ActivityType
  totalMinutes: number
  percentage: number
}

export function ScheduleStatistics({ activities }: ScheduleStatisticsProps) {
  const stats = calculateStatistics(activities)
  const totalHours = Math.round(stats.reduce((sum, stat) => sum + stat.totalMinutes, 0) / 60)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total stats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Общая статистика</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-white/60">Активностей</div>
            <div className="text-2xl font-bold mt-1">
              {activities.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-white/60">Часов всего</div>
            <div className="text-2xl font-bold mt-1">
              {totalHours}
            </div>
          </div>
        </div>
      </Card>

      {/* Activity breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">По типам активностей</h3>
        <div className="space-y-4">
          {stats
            .filter(stat => stat.totalMinutes > 0)
            .sort((a, b) => b.totalMinutes - a.totalMinutes)
            .map(stat => (
              <div key={stat.type} className="flex items-center gap-3">
                <div className="text-xl">{activityIcons[stat.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-white/60 capitalize">
                      {getActivityTypeLabel(stat.type)}
                    </div>
                    <div className="text-sm text-white">
                      {formatDuration(stat.totalMinutes)}
                    </div>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getActivityTypeColor(stat.type)}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}

function calculateStatistics(activities: Activity[]): ActivityStats[] {
  const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0)

  const statsByType = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + activity.duration
    return acc
  }, {} as Record<ActivityType, number>)

  return Object.entries(statsByType).map(([type, minutes]) => ({
    type: type as ActivityType,
    totalMinutes: minutes,
    percentage: Math.round((minutes / totalMinutes) * 100)
  }))
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${minutes}м`
  }
  
  return remainingMinutes > 0 
    ? `${hours}ч ${remainingMinutes}м`
    : `${hours}ч`
}

function getActivityTypeLabel(type: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    english: 'Английский',
    coding: 'Программирование',
    linkedin: 'LinkedIn',
    break: 'Перерывы',
    leisure: 'Отдых',
    food: 'Еда',
    transport: 'Транспорт',
    other: 'Прочее'
  }
  return labels[type]
}

function getActivityTypeColor(type: ActivityType): string {
  const colors: Record<ActivityType, string> = {
    english: 'bg-blue-500',
    coding: 'bg-green-500',
    linkedin: 'bg-orange-500',
    break: 'bg-gray-500',
    leisure: 'bg-purple-500',
    food: 'bg-yellow-500',
    transport: 'bg-red-500',
    other: 'bg-primary-500'
  }
  return colors[type]
}
