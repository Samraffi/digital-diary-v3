'use client'

import { useEffect } from 'react'
import { useScheduleStore } from '../store'
import type { ScheduleTask, TaskCategory } from '../types'
import { getTasks, saveTask, updateTask } from '@/lib/db'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'

const DAILY_SCHEDULE: Omit<ScheduleTask, 'id' | 'isCompleted' | 'completedAt'>[] = [
  {
    activity: 'Завтрак',
    category: 'meal',
    timeSlot: {
      startTime: '08:00',
      endTime: '08:15',
      duration: '15 минут'
    }
  },
  {
    activity: 'Английский: грамматика/лексика',
    category: 'english',
    timeSlot: {
      startTime: '08:15',
      endTime: '09:00',
      duration: '45 минут'
    }
  },
  {
    activity: 'LinkedIn: connect-заявки',
    category: 'linkedin',
    timeSlot: {
      startTime: '09:00',
      endTime: '09:10',
      duration: '10 минут'
    }
  },
  {
    activity: 'Английский: слушание с субтитрами',
    category: 'english',
    timeSlot: {
      startTime: '09:10',
      endTime: '09:30',
      duration: '20 минут'
    }
  },
  {
    activity: 'Короткий перерыв',
    category: 'break',
    timeSlot: {
      startTime: '09:30',
      endTime: '09:35',
      duration: '5 минут'
    }
  },
  {
    activity: 'Кодирование: проект',
    category: 'coding',
    timeSlot: {
      startTime: '09:35',
      endTime: '10:35',
      duration: '60 минут'
    }
  },
  {
    activity: 'Короткий перерыв',
    category: 'break',
    timeSlot: {
      startTime: '10:35',
      endTime: '10:40',
      duration: '5 минут'
    }
  },
  {
    activity: 'Английский: Busuu или аудио-тренинг',
    category: 'english',
    timeSlot: {
      startTime: '10:40',
      endTime: '11:40',
      duration: '60 минут'
    }
  },
  {
    activity: 'Кодирование: мелкая работа/рефакторинг',
    category: 'coding',
    timeSlot: {
      startTime: '11:40',
      endTime: '12:00',
      duration: '20 минут'
    }
  },
  {
    activity: 'LinkedIn: отклики/сообщения',
    category: 'linkedin',
    timeSlot: {
      startTime: '12:00',
      endTime: '12:10',
      duration: '10 минут'
    }
  },
  {
    activity: 'Короткий перерыв',
    category: 'break',
    timeSlot: {
      startTime: '12:10',
      endTime: '12:15',
      duration: '5 минут'
    }
  },
  {
    activity: 'Кодирование: фокус-сессия',
    category: 'coding',
    timeSlot: {
      startTime: '12:15',
      endTime: '12:35',
      duration: '20 минут'
    }
  },
  {
    activity: 'Английский: подкаст + словарь',
    category: 'english',
    timeSlot: {
      startTime: '12:35',
      endTime: '13:30',
      duration: '55 минут'
    }
  },
  {
    activity: 'Обед',
    category: 'meal',
    timeSlot: {
      startTime: '13:30',
      endTime: '13:45',
      duration: '15 минут'
    }
  },
  {
    activity: 'Кодирование',
    category: 'coding',
    timeSlot: {
      startTime: '13:45',
      endTime: '14:10',
      duration: '25 минут'
    }
  },
  {
    activity: 'LinkedIn: входящие',
    category: 'linkedin',
    timeSlot: {
      startTime: '14:10',
      endTime: '14:20',
      duration: '10 минут'
    }
  },
  {
    activity: 'Перерыв: шахматы или растяжка',
    category: 'break',
    timeSlot: {
      startTime: '14:20',
      endTime: '14:30',
      duration: '10 минут'
    }
  },
  {
    activity: 'Кодирование или мини-проект',
    category: 'coding',
    timeSlot: {
      startTime: '14:30',
      endTime: '15:00',
      duration: '30 минут'
    }
  },
  {
    activity: 'Busuu или сериал на английском',
    category: 'english',
    timeSlot: {
      startTime: '15:00',
      endTime: '16:00',
      duration: '60 минут'
    }
  },
  {
    activity: 'Кодирование: глубокая работа',
    category: 'coding',
    timeSlot: {
      startTime: '16:00',
      endTime: '17:00',
      duration: '60 минут'
    }
  },
  {
    activity: 'Короткий перерыв',
    category: 'break',
    timeSlot: {
      startTime: '17:00',
      endTime: '17:15',
      duration: '15 минут'
    }
  },
  {
    activity: 'Теория React или JS',
    category: 'learning',
    timeSlot: {
      startTime: '17:15',
      endTime: '18:00',
      duration: '45 минут'
    }
  },
  {
    activity: 'Author.today',
    category: 'reading',
    timeSlot: {
      startTime: '18:00',
      endTime: '18:30',
      duration: '30 минут'
    }
  },
  {
    activity: 'Просмотр дорамы',
    category: 'entertainment',
    timeSlot: {
      startTime: '18:30',
      endTime: '19:15',
      duration: '45 минут'
    }
  },
  {
    activity: 'Ужин и свободное плавание',
    category: 'meal',
    timeSlot: {
      startTime: '19:15',
      endTime: '20:00',
      duration: '45 минут'
    }
  },
  {
    activity: 'Повторение слов/определений',
    category: 'learning',
    timeSlot: {
      startTime: '20:00',
      endTime: '21:00',
      duration: '60 минут'
    }
  },
  {
    activity: 'Дневник побед',
    category: 'reflection',
    timeSlot: {
      startTime: '21:00',
      endTime: '21:30',
      duration: '30 минут'
    }
  },
  {
    activity: 'Author.today',
    category: 'reading',
    timeSlot: {
      startTime: '21:30',
      endTime: '21:45',
      duration: '15 минут'
    }
  },
  {
    activity: 'Дорама',
    category: 'entertainment',
    timeSlot: {
      startTime: '21:45',
      endTime: '23:00',
      duration: '75 минут'
    }
  },
  {
    activity: 'Шахматы',
    category: 'chess',
    timeSlot: {
      startTime: '23:00',
      endTime: '23:30',
      duration: '30 минут'
    }
  },
  {
    activity: 'Подготовка ко сну',
    category: 'break',
    timeSlot: {
      startTime: '23:30',
      endTime: '23:55',
      duration: '25 минут'
    }
  }
]

export function ScheduleInitializer() {
  const setTasks = useScheduleStore(state => state.setTasks)
  const setNotificationCallback = useScheduleStore(state => state.setNotificationCallback)
  const { notifyResourceReward, notifyAchievement } = useGameNotifications()

  // Set up notification callback
  useEffect(() => {
    setNotificationCallback({
      notifyResourceReward,
      notifyAchievement
    })
  }, [setNotificationCallback, notifyResourceReward, notifyAchievement])

  useEffect(() => {
    async function initializeTasks() {
      // Пытаемся получить задачи из IndexedDB
      const savedTasks = await getTasks()
      
      if (savedTasks.length === 0) {
        // Если задач нет, создаем их из шаблона
        const tasks = DAILY_SCHEDULE.map(task => ({
          ...task,
          id: crypto.randomUUID(),
          isCompleted: false
        }))
        
        // Сохраняем задачи в IndexedDB и store
        for (const task of tasks) {
          await saveTask(task)
        }
        
        // Преобразуем ScheduleTask в Task для store
        const convertedTasks = tasks.map(task => ({
          id: task.id,
          title: task.activity,
          category: task.category,
          completed: task.isCompleted,
          scheduledTime: task.timeSlot.startTime,
          duration: parseInt(task.timeSlot.duration) || 30,
        }))
        
        setTasks(convertedTasks)
      } else {
        // Если задачи есть, преобразуем их в Task и загружаем в store
        const convertedSavedTasks = savedTasks.map((task: ScheduleTask) => ({
          id: task.id,
          title: task.activity,
          category: task.category,
          completed: task.isCompleted,
          scheduledTime: task.timeSlot.startTime,
          duration: parseInt(task.timeSlot.duration) || 30,
          completedAt: task.completedAt
        }))
        
        setTasks(convertedSavedTasks)
        
        // Проверяем, не начался ли новый день
        const completedTasks = savedTasks.filter((t: ScheduleTask) => t.completedAt)
        const now = new Date()
        let shouldReset = false
        
        // Проверяем, есть ли завершенные задачи
        if (completedTasks.length > 0) {
          const lastTaskDate = new Date(Math.max(...completedTasks.map((t: ScheduleTask) => 
            new Date(t.completedAt!).getTime()
          )))
          
          // Если последняя завершенная задача была в другой день, сбрасываем
          shouldReset = lastTaskDate.getDate() !== now.getDate() || 
                        lastTaskDate.getMonth() !== now.getMonth() ||
                        lastTaskDate.getFullYear() !== now.getFullYear()
        } else {
          // Если нет завершенных задач, проверяем дату последнего сброса
          // Получаем дату из localStorage или используем текущую дату
          const lastResetDateStr = localStorage.getItem('lastScheduleReset')
          if (lastResetDateStr) {
            const lastResetDate = new Date(lastResetDateStr)
            shouldReset = lastResetDate.getDate() !== now.getDate() || 
                          lastResetDate.getMonth() !== now.getMonth() ||
                          lastResetDate.getFullYear() !== now.getFullYear()
          }
        }
        
        // Сохраняем текущую дату как дату последнего сброса
        localStorage.setItem('lastScheduleReset', now.toISOString())
        
        if (shouldReset) {
          // Если начался новый день, сбрасываем статусы выполнения
          const resetTasks = savedTasks.map((task: ScheduleTask) => ({
            ...task,
            isCompleted: false,
            completedAt: undefined
          }))
          
          // Обновляем задачи в IndexedDB и store
          for (const task of resetTasks) {
            await updateTask(task.id, {
              isCompleted: false,
              completedAt: undefined
            })
          }
          
          // Преобразуем сброшенные задачи в Task для store
          const convertedResetTasks = resetTasks.map((task: ScheduleTask) => ({
            id: task.id,
            title: task.activity,
            category: task.category,
            completed: task.isCompleted,
            scheduledTime: task.timeSlot.startTime,
            duration: parseInt(task.timeSlot.duration) || 30,
          }))
          
          setTasks(convertedResetTasks)
        }
      }
    }

    initializeTasks()
  }, [setTasks])

  return null
}
