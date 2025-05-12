'use client'

import { useEffect, useState } from 'react'
import { useScheduleStore, Task } from '../store'

export function CurrentTask() {
  const tasks = useScheduleStore(state => state.tasks)
  const completeTask = useScheduleStore(state => state.completeTask)

  // Get the current task based on scheduled time
  const getCurrentTask = () => {
    const now = new Date()
    return tasks.find(task => {
      const scheduledTime = new Date(task.scheduledTime)
      return (
        !task.completed &&
        scheduledTime.getDate() === now.getDate() &&
        scheduledTime.getMonth() === now.getMonth() &&
        scheduledTime.getFullYear() === now.getFullYear() &&
        scheduledTime.getHours() === now.getHours()
      )
    }) || null
  }

  const [currentTask, setCurrentTask] = useState<Task | null>(getCurrentTask())

  useEffect(() => {
    const updateCurrentTask = () => {
      setCurrentTask(getCurrentTask())
    }

    // Update current task every minute
    const interval = setInterval(updateCurrentTask, 60 * 900)

    // Initial update
    updateCurrentTask()

    return () => clearInterval(interval)
  }, [tasks])

  if (!currentTask) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Нет текущих задач
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{currentTask.title}</h3>
        <span className="text-sm text-muted-foreground">
          {new Date(currentTask.scheduledTime).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className={`
          px-2 py-1 text-xs rounded-full
          ${getCategoryColor(currentTask.category)}
        `}>
          {currentTask.category || 'Без категории'}
        </span>
        <span className="text-sm text-muted-foreground">
          {currentTask.duration} мин
        </span>
      </div>

      <button
        onClick={() => {
          completeTask(currentTask.id)
          setCurrentTask(getCurrentTask())
        }}
        className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
      >
        Завершить
      </button>
    </div>
  )
}

function getCategoryColor(category: string | null): string {
  switch (category) {
    case 'coding':
      return 'bg-blue-100 text-blue-800'
    case 'english':
      return 'bg-green-100 text-green-800'
    case 'linkedin':
      return 'bg-indigo-100 text-indigo-800'
    case 'learning':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
