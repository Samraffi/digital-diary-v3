import Dexie, { Table } from 'dexie'
import type { Noble, TaskStreak } from '@/modules/noble/types'
import type { Territory } from '@/modules/territory/types'

// Типы для новых таблиц
export interface DiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
}

// Тип для сериализованных данных
interface SerializedNoble extends Omit<Noble, 'stats' | 'taskStreaks'> {
  stats: {
    totalInfluence: number;
    territoriesOwned: number;
    taskStreaks: Record<string, {
      current: number;
      best: number;
      lastCompleted: string | null;
    }>;
    specialEffects: Record<string, number>;
  };
  taskStreaks: Record<string, {
    current: number;
    best: number;
    lastCompleted: string | null;
  }>;
}

export class AppDatabase extends Dexie {
  nobles!: Table<SerializedNoble>
  territories!: Table<Territory>
  diaryEntries!: Table<DiaryEntry>

  constructor() {
    super('digital-diary')
    
    this.version(1).stores({
      nobles: '++id',
      territories: '++id',
      diaryEntries: '++id'
    })

    // Добавляем версию 4 с миграцией UUID в имена
    this.version(4)
      .stores({
      nobles: '&id, rank, level',
      territories: '&id, type, level',
      diaryEntries: '&id, date, title'
      })
      .upgrade(async (tx) => {
        // Миграция nobles
        const nobles = await tx.table('nobles').toArray()
        for (const noble of nobles) {
          // Проверяем является ли id UUID
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(noble.id)
          
          if (isUuid) {
            // Создаем новое имя на основе ранга
            const newName = `${noble.rank}_${Math.floor(Math.random() * 1000)}`
            
            // Обновляем ID
            await tx.table('nobles').where('id').equals(noble.id).delete()
            noble.id = newName
            await tx.table('nobles').add(noble)
          }
        }
      })
  }
}

const db = new AppDatabase()

// Хелперы для работы с благородными
export async function getNoble(): Promise<Noble | undefined> {
  const noble = await db.nobles.toCollection().first()
  if (noble) {
    // Преобразуем строковые даты обратно в объекты Date
    const convertedNoble: Noble = {
      ...noble,
      stats: {
        ...noble.stats,
        taskStreaks: Object.fromEntries(
          Object.entries(noble.stats.taskStreaks).map(([key, streak]) => [
            key,
            {
              current: streak.current || 0,
              best: streak.best || 0,
              lastCompleted: streak.lastCompleted ? new Date(streak.lastCompleted) : undefined
            }
          ])
        )
      },
      taskStreaks: Object.fromEntries(
        Object.entries(noble.taskStreaks).map(([key, streak]) => [
          key,
          {
            current: streak.current || 0,
            best: streak.best || 0,
            lastCompleted: streak.lastCompleted ? new Date(streak.lastCompleted) : undefined
          }
        ])
      )
    }
    return convertedNoble
  }
  return undefined
}

export async function saveNoble(noble: Noble): Promise<void> {
  // Создаем безопасную копию для сохранения
  const safeNoble: SerializedNoble = {
    id: noble.id,
    rank: noble.rank,
    level: noble.level,
    experience: noble.experience,
    experienceForNextLevel: noble.experienceForNextLevel,
    experienceMultipliers: {
      level: noble.experienceMultipliers.level,
      rank: noble.experienceMultipliers.rank,
      bonus: noble.experienceMultipliers.bonus
    },
    resources: {
      gold: noble.resources.gold,
      influence: noble.resources.influence
    },
    stats: {
      totalInfluence: noble.stats.totalInfluence,
      territoriesOwned: noble.stats.territoriesOwned,
      taskStreaks: Object.fromEntries(
        Object.entries(noble.stats.taskStreaks || {}).map(([key, streak]) => [
          key,
          {
            current: streak.current || 0,
            best: streak.best || 0,
            lastCompleted: streak.lastCompleted instanceof Date ? 
              streak.lastCompleted.toISOString() : 
              (streak.lastCompleted ? new Date(streak.lastCompleted).toISOString() : null)
          }
        ])
      ),
      specialEffects: { ...noble.stats.specialEffects }
    },
    status: {
      reputation: noble.status.reputation,
      influence: noble.status.influence,
      popularity: noble.status.popularity
    },
    perks: noble.perks.map(perk => ({ ...perk })),
    achievements: {
      completed: Array.from(noble.achievements.completed),
      total: noble.achievements.total,
      categories: { ...noble.achievements.categories }
    },
    titles: noble.titles.map(title => ({ ...title })),
    taskStreaks: Object.fromEntries(
      Object.entries(noble.taskStreaks || {}).map(([key, streak]) => [
        key,
        {
          current: streak.current || 0,
          best: streak.best || 0,
          lastCompleted: streak.lastCompleted instanceof Date ? 
            streak.lastCompleted.toISOString() : 
            (streak.lastCompleted ? new Date(streak.lastCompleted).toISOString() : null)
        }
      ])
    )
  }

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

// Функции для синхронизации состояния Zustand с IndexedDB
export async function syncNobleState(name: string): Promise<Noble | null> {
  try {
    const noble = await getNoble()
    if (noble) {
      return noble
    }
    return null
  } catch (error) {
    console.error('Error syncing noble state:', error)
    return null
  }
}

export function syncTerritoryState(territoryStore: any): void {
  getTerritories()
    .then(territories => territoryStore.setState({ territories }))
    .catch(console.error)
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
          
          state.territories.forEach((territory: Territory) => {
            saveTerritory(territory).catch(console.error)
            existingIds.delete(territory.id)
          })
          
          existingIds.forEach(id => deleteTerritory(id).catch(console.error))
        }).catch(console.error)
      }
    }
  )
}
