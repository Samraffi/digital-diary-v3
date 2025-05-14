import { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, activityColors, activityIcons } from '../../types/schedules'
import { formatDuration } from '../../utils/schedule-helpers'

interface ScheduleBlockProps {
  activity: Activity
  isCurrentActivity: boolean
}

export function ScheduleBlock({ activity, isCurrentActivity }: ScheduleBlockProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="relative pl-16">
      {/* Time marker */}
      <div className="absolute left-0 top-4 w-12 text-sm text-white/60">
        {activity.startTime}
      </div>

      {/* Activity block */}
      <Card
        gradient={activityColors[activity.type]}
        className="mb-2 cursor-pointer group"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="text-xl">{activityIcons[activity.type]}</div>
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