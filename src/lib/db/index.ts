import Dexie, { Table } from 'dexie'
import type { Noble } from '@/modules/noble/types'
import type { Territory } from '@/modules/territory/types'
import type { ScheduleTask } from '@/modules/schedule/types'

// Типы для новых таблиц
export interface DiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
}

export class AppDatabase extends Dexie {
  nobles!: Table<Noble>
  territories!: Table<Territory>
  diary!: Table<DiaryEntry>
  tasks!: Table<ScheduleTask>

  constructor() {
    super('digital_diary_v3')
    
    this.version(3).stores({
      nobles: '&id, rank, level',
      territories: '&id, type, level',
      diary: '&id, date, title',
      tasks: '&id, isCompleted, category'
    })
  }
}

// Хелперы для работы с задачами расписания
export async function getTasks(): Promise<ScheduleTask[]> {
  return db.tasks.toArray()
}

export async function saveTask(task: ScheduleTask): Promise<void> {
  await db.tasks.put(task)
}

export async function updateTask(id: string, updates: Partial<ScheduleTask>): Promise<void> {
  await db.tasks.update(id, updates)
}

export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id)
}

export function syncTasksState(store: any): void {
  getTasks()
    .then(tasks => store.setState({ tasks }))
    .catch(console.error)
}

export function setupScheduleSync(store: { getState: () => { tasks: ScheduleTask[] }; subscribe: (listener: (state: { tasks: ScheduleTask[] }) => void) => () => void }) {
  return store.subscribe(
    state => {
      if (state.tasks) {
        // Сохраняем каждую задачу в IndexedDB
        state.tasks.forEach((task: any) => {
          // Преобразуем Task в ScheduleTask для сохранения в БД
          const scheduleTask: ScheduleTask = {
            id: task.id,
            activity: task.title,
            category: task.category,
            isCompleted: task.completed,
            timeSlot: {
              startTime: task.scheduledTime,
              endTime: '',
              duration: `${task.duration} минут`
            },
            completedAt: task.completedAt
          }
          
          saveTask(scheduleTask).catch(console.error)
        })
      }
    }
  )
}

export const db = new AppDatabase()

// Хелперы для работы с благородными
export async function getNoble(): Promise<Noble | undefined> {
  return db.nobles.toCollection().first()
}

export async function saveNoble(noble: Noble): Promise<void> {
  // Create a deep clone and handle Date objects
  const safeNoble = JSON.parse(JSON.stringify({
    ...noble,
    stats: {
      ...noble.stats,
      taskStreaks: Object.fromEntries(
        Object.entries(noble.stats.taskStreaks).map(([key, streak]) => [
          key,
          {
            ...streak,
            lastCompleted: streak.lastCompleted?.toISOString()
          }
        ])
      )
    }
  }))
  await db.nobles.put(safeNoble)
}

export async function updateNoble(id: string, updates: Partial<Noble>): Promise<void> {
  await db.nobles.update(id, updates)
}

// Хелперы для работы с территориями
export async function getTerritories(): Promise<Territory[]> {
  return db.territories.toArray()
}

export async function saveTerritory(territory: Territory): Promise<void> {
  await db.territories.put(territory)
}

export async function updateTerritory(id: string, updates: Partial<Territory>): Promise<void> {
  await db.territories.update(id, updates)
}

export async function deleteTerritory(id: string): Promise<void> {
  await db.territories.delete(id)
}

// Функции для синхронизации состояния Zustand с IndexedDB
export function syncNobleState(nobleStore: any): void {
  getNoble()
    .then(noble => {
      if (noble) {
        nobleStore.setState({ noble })
      }
    })
    .catch(console.error)
}

export function syncTerritoryState(territoryStore: any): void {
  getTerritories()
    .then(territories => territoryStore.setState({ territories }))
    .catch(console.error)
}

// Функции для работы с дневником
export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  return db.diary.orderBy('date').reverse().toArray()
}

export async function saveDiaryEntry(entry: DiaryEntry): Promise<void> {
  await db.diary.put(entry)
}

export async function deleteDiaryEntry(id: string): Promise<void> {
  await db.diary.delete(id)
}

export interface BaseState {
  isLoading?: boolean
  error?: string | null
}

export interface NobleState extends BaseState {
  noble: Noble | null
}

export interface TerritoryState extends BaseState {
  territories: Territory[]
}

// Подписываемся на изменения в store для автоматического сохранения
export function setupNobleSync(store: { getState: () => NobleState; subscribe: (listener: (state: NobleState) => void) => () => void }) {
  return store.subscribe(
    state => {
      if (state.noble && !state.isLoading && !state.error) {
        saveNoble(state.noble).catch(console.error)
      }
    }
  )
}

export function setupTerritorySync(store: { getState: () => TerritoryState; subscribe: (listener: (state: TerritoryState) => void) => () => void }) {
  return store.subscribe(
    state => {
      if (state.territories && !state.isLoading && !state.error) {
        getTerritories().then(existingTerritories => {
          const existingIds = new Set(existingTerritories.map(t => t.id))
          
          // Обрабатываем каждую территорию в store
          state.territories.forEach((territory: Territory) => {
            saveTerritory(territory).catch(console.error)
            existingIds.delete(territory.id)
          })
          
          // Удаляем территории, которых больше нет в store
          existingIds.forEach(id => deleteTerritory(id).catch(console.error))
        }).catch(console.error)
      }
    }
  )
}
