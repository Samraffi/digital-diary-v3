'use client'

import { useMemo } from 'react'
import { useScheduleStore, Task } from '../store'
import { CATEGORY_ICONS, CATEGORY_COLORS, type TaskCategory, type ScheduleTask } from '../types'

// Convert Task from store to ScheduleTask for UI
function convertTaskToScheduleTask(task: Task): ScheduleTask {
  return {
    id: task.id,
    activity: task.title,
    category: task.category as TaskCategory,
    isCompleted: task.completed,
    timeSlot: {
      startTime: task.scheduledTime,
      endTime: '', // We don't have this in Task
      duration: `${task.duration} минут`
    }
  }
}

function groupTasksByCategory(tasks: ScheduleTask[]) {
  return tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = []
    }
    acc[task.category].push(task)
    return acc
  }, {} as Record<TaskCategory, ScheduleTask[]>)
}

export function DailySchedule() {
  const tasks = useScheduleStore(state => state.tasks)
  const completeTask = useScheduleStore(state => state.completeTask)
  
  // Convert tasks from store format to ScheduleTask format
  const convertedTasks = useMemo(() => 
    tasks.map(task => convertTaskToScheduleTask(task)), 
    [tasks]
  )
  
  const tasksByCategory = useMemo(() => 
    groupTasksByCategory(convertedTasks), 
    [convertedTasks]
  )
  const categories = Object.keys(tasksByCategory) as TaskCategory[]

  return (
    <div className="grid gap-6">
      {categories.map(category => {
        const categoryTasks = tasksByCategory[category]
        const colors = CATEGORY_COLORS[category]
        const completedCount = categoryTasks.filter((t: ScheduleTask) => t.isCompleted).length
        const totalCount = categoryTasks.length
        const progressPercent = (completedCount / totalCount) * 100

        return (
          <div
            key={category}
            className={`border rounded-lg p-6 ${colors.border} ${colors.bg}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                <h3 className={`text-lg font-medium ${colors.text}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
              </div>
              <div className={`text-sm ${colors.text}`}>
                {completedCount} / {totalCount}
              </div>
            </div>

            <div className="h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-3">
              {categoryTasks.map((task: ScheduleTask) => (
                <div
                  key={task.id}
                  className={`p-4 rounded border ${
                    task.isCompleted
                      ? 'border-emerald-600 bg-emerald-900/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {task.timeSlot.startTime} - {task.timeSlot.endTime}{' '}
                        ({task.timeSlot.duration})
                      </div>
                      <div className="font-medium text-gray-200">
                        {task.activity}
                      </div>
                    </div>
                    {!task.isCompleted && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="shrink-0 text-2xl text-gray-400 hover:text-emerald-400 transition"
                      >
                        ⭕
                      </button>
                    )}
                    {task.isCompleted && (
                      <div className="shrink-0 text-2xl text-emerald-400">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {categories.length === 0 && (
        <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-700 rounded-lg">
          <div className="text-4xl mb-2">📋</div>
          <div>Нет запланированных задач</div>
        </div>
      )}
    </div>
  )
}
