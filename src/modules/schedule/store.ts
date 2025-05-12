import { create, type StoreApi } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { CATEGORY_REWARDS } from './types'

import { TaskCategory, type ScheduleTask } from './types'

// Declare global type for window functions
declare global {
  interface Window {
    addNobleResources?: (resources: { gold?: number; influence?: number }) => void;
    addNobleSpecialEffect?: (effect: string) => void;
  }
}

export interface Task {
  id: string
  title: string
  category: TaskCategory | null
  completed: boolean
  scheduledTime: string
  duration: number // in minutes
  recurring?: boolean
  territoryEffects?: {
    type: string
    bonus: number
    territoryTypes: string[]
  }
  completedAt?: Date
}

export function convertTaskToScheduleTask(task: Task): ScheduleTask {
  return {
    id: task.id,
    activity: task.title,
    category: task.category as TaskCategory,
    isCompleted: task.completed,
    timeSlot: {
      startTime: task.scheduledTime,
      endTime: '',
      duration: `${task.duration} минут`
    },
    completedAt: task.completedAt
  }
}

interface NotificationCallbacks {
  notifyResourceReward: (resources: { gold?: number; influence?: number }) => void;
  notifyAchievement: (name: string, description: string) => void;
}

interface ScheduleStore {
  tasks: Task[]
  lastCompletedTask: Task | null
  notificationCallbacks: NotificationCallbacks | null
  addTask: (task: Task) => void
  removeTask: (taskId: string) => void
  completeTask: (taskId: string) => void
  editTask: (taskId: string, updates: Partial<Task>) => void
  setTasks: (tasks: Task[]) => void
  setNotificationCallback: (callbacks: NotificationCallbacks) => void
}

export function setupScheduleSync(store: StoreApi<ScheduleStore>) {
  return store.subscribe((state: ScheduleStore) => {
    // Save to database when state changes
    import('@/lib/db').then(({ updateSchedule }) => {
      updateSchedule(state.tasks.map(convertTaskToScheduleTask))
        .catch(console.error)
    })
  })
}

export const useScheduleStore = create<ScheduleStore>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        lastCompletedTask: null,
        notificationCallbacks: null,

        addTask: (task) => {
          set((state) => ({
            tasks: [...state.tasks, task]
          }))
        },

        removeTask: (taskId) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId)
          }))
        },

        completeTask: (taskId) => {
          // Find task by ID
          const task = get().tasks.find((t) => t.id === taskId)
          if (!task) return

          // Mark task as completed and set completedAt
          const now = new Date()
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: true, completedAt: now } : t
            ),
            lastCompletedTask: task
          }))
          
          // Save to database
          import('@/lib/db').then(({ updateTask }) => {
            updateTask(taskId, { isCompleted: true, completedAt: now })
              .catch(console.error)
          })
          
          // Use notification callbacks if available
          const { notificationCallbacks } = get()
          if (notificationCallbacks && task.category) {
            // Get rewards based on task category
            const categoryKey = task.category as keyof typeof CATEGORY_REWARDS
            if (CATEGORY_REWARDS[categoryKey]) {
              const rewards = CATEGORY_REWARDS[categoryKey]
              
              // Notify about resource rewards
              notificationCallbacks.notifyResourceReward({
                gold: rewards.gold,
                influence: rewards.influence
              })
              
              // Add resources to noble store directly
              // We need to use a global function to avoid circular dependencies
              window.addNobleResources = window.addNobleResources || function(resources) {
                import('@/modules/noble/store').then(({ useNobleStore }) => {
                  useNobleStore.getState().addResources(resources)
                  console.log(`Added resources: ${resources.gold} gold, ${resources.influence} influence`)
                }).catch(error => {
                  console.error('Failed to add resources:', error)
                })
              }
              
              // Call the global function
              window.addNobleResources({
                gold: rewards.gold,
                influence: rewards.influence
              })
              
              // Notify about achievement if there's a special effect
              if (rewards.territoryEffect?.specialEffect) {
                notificationCallbacks.notifyAchievement(
                  'Особый эффект активирован!',
                  `Эффект "${rewards.territoryEffect.specialEffect}" применен к территориям`
                )
                
                // Add special effect to noble store directly
                // We need to use a global function to avoid circular dependencies
                window.addNobleSpecialEffect = window.addNobleSpecialEffect || function(effect) {
                  import('@/modules/noble/store').then(({ useNobleStore }) => {
                    useNobleStore.getState().addSpecialEffect(effect)
                    console.log(`Added special effect: ${effect}`)
                  }).catch(error => {
                    console.error('Failed to add special effect:', error)
                  })
                }
                
                // Call the global function
                if (rewards.territoryEffect?.specialEffect) {
                  window.addNobleSpecialEffect(rewards.territoryEffect.specialEffect)
                }
              }
            }
          }
        },

        editTask: (taskId, updates) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }))
        },

        setTasks: (tasks) => {
          // Convert ScheduleTask to Task if necessary
          const convertedTasks = tasks.map(task => {
            // Check if this is a ScheduleTask (has isCompleted and activity properties)
            if ('isCompleted' in task && 'activity' in task && 'timeSlot' in task) {
              const scheduleTask = task as unknown as { 
                id: string; 
                activity: string; 
                category: TaskCategory; 
                isCompleted: boolean; 
                timeSlot: { 
                  startTime: string; 
                  duration: string; 
                } 
              };
              
              return {
                id: scheduleTask.id,
                title: scheduleTask.activity,
                category: scheduleTask.category,
                completed: scheduleTask.isCompleted,
                scheduledTime: scheduleTask.timeSlot.startTime,
                duration: parseInt(scheduleTask.timeSlot.duration) || 30,
              } as Task;
            }
            // It's already a Task
            return task as Task;
          });
          
          set({ tasks: convertedTasks });
        },

        setNotificationCallback: (callbacks) => {
          set({ notificationCallbacks: callbacks })
        }
      }),
      {
        name: 'schedule-store'
      }
    )
  )
)
