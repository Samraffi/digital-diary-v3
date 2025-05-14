'use client'

import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { scheduleTypes, WeeklySchedule, dayNames } from '../types/schedules'

interface ScheduleSelectorProps {
  selectedType: string
  onSelect: (type: string) => void
}

export function ScheduleSelector({ selectedType, onSelect }: ScheduleSelectorProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scheduleTypes.map((schedule) => {
          const isSelected = selectedType === schedule.type
          
          return (
            <motion.button
              key={schedule.type}
              onClick={() => onSelect(schedule.type)}
              className={`
                relative p-6 rounded-lg text-center transition-all duration-200
                ${isSelected 
                  ? 'bg-white/20' 
                  : 'bg-white/5 hover:bg-white/10'
                }
              `}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {schedule.label}
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                {schedule.days.map((day, index) => (
                  <span 
                    key={day} 
                    className={`${isSelected ? 'text-white' : ''}`}
                  >
                    {dayNames[day]}
                    {index < schedule.days.length - 1 && ", "}
                  </span>
                ))}
              </div>
              {isSelected && (
                <motion.div
                  layoutId="schedule-active"
                  className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Дни недели */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {dayNames.map((name, index) => {
          const scheduleType = scheduleTypes.find(s => s.days.includes(index))
          const color = scheduleType 
            ? getScheduleTypeColor(scheduleType.type)
            : 'bg-white/10'
          
          return (
            <div key={index} className="text-center">
              <div className="text-sm text-white/60 mb-1">{name}</div>
              <div className={`w-2 h-2 rounded-full ${color}`} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function getScheduleTypeColor(type: string): string {
  switch (type) {
    case 'main':
      return 'bg-blue-500'
    case 'study':
      return 'bg-purple-500'
    case 'saturday':
      return 'bg-green-500'
    default:
      return 'bg-white/10'
  }
}
