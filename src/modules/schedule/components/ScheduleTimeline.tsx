'use client'

import { useMemo, useState, useEffect } from 'react'
import { useScheduleStore, Task } from '../store'
import { CATEGORY_COLORS, type ScheduleTask, type TaskCategory } from '../types'

// Convert Task from store to ScheduleTask for UI
function convertTaskToScheduleTask(task: Task): ScheduleTask {
  return {
    id: task.id,
    activity: task.title,
    category: task.category as TaskCategory,
    isCompleted: task.completed,
    timeSlot: {
      startTime: task.scheduledTime,
      // Calculate endTime based on duration (in minutes)
      endTime: (() => {
        const [hours, minutes] = task.scheduledTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + task.duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      })(),
      duration: `${task.duration} минут`
    }
  }
}

function calcTimePosition(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return ((hours * 60 + minutes) - (8 * 60)) / (16 * 60) * 100 // 8:00 to 24:00 range
}

export function ScheduleTimeline() {
  const tasks = useScheduleStore(state => state.tasks)
  
  // Convert tasks from store format to ScheduleTask format
  const convertedTasks = useMemo(() => 
    tasks.map(task => convertTaskToScheduleTask(task)), 
    [tasks]
  )
  
  const sortedTasks = useMemo(() => {
    return [...convertedTasks].sort((a, b) => {
      const aTime = a.timeSlot.startTime
      const bTime = b.timeSlot.startTime
      return aTime.localeCompare(bTime)
    })
  }, [convertedTasks])

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-medieval text-gray-100 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white">
          📅
        </span>
        Расписание дня
      </h2>

      <div className="relative h-12 mb-4">
        {/* Временная шкала */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gray-700" />
        
        {/* Отметки времени */}
        {Array.from({ length: 17 }, (_, i) => i + 8).map(hour => (
          <div
            key={hour}
            className="absolute top-2 transform -translate-x-1/2 text-xs text-gray-400"
            style={{ left: `${((hour - 8) / 16) * 100}%` }}
          >
            {String(hour).padStart(2, '0')}:00
          </div>
        ))}

        {/* Задачи */}
        {sortedTasks.map((task) => {
          const startPos = calcTimePosition(task.timeSlot.startTime)
          const endPos = calcTimePosition(task.timeSlot.endTime)
          const width = endPos - startPos
          const colors = CATEGORY_COLORS[task.category]

          return (
            <div
              key={task.id}
              className={`absolute h-4 rounded-full transition-colors ${
                task.isCompleted 
                  ? 'bg-emerald-500'
                  : colors.bg
              } ${colors.border} border cursor-help`}
              style={{
                left: `${startPos}%`,
                width: `${width}%`,
                bottom: '0'
              }}
              title={`${task.activity} (${task.timeSlot.startTime} - ${task.timeSlot.endTime})`}
            />
          )
        })}
      </div>

      {/* Текущее время */}
      <CurrentTimeLine />
    </div>
  )
}

function CurrentTimeLine() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    // Обновляем время каждую минуту
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // Показываем линию только в рабочее время (8:00 - 24:00)
  if (currentHour < 8 || currentHour >= 24) return null
  
  const position = calcTimePosition(`${currentHour}:${currentMinute}`)

  return (
    <div
      className="absolute w-0.5 h-12 bg-red-500 transform -translate-x-1/2"
      style={{ left: `${position}%`, bottom: 0 }}
    >
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
    </div>
  )
}
