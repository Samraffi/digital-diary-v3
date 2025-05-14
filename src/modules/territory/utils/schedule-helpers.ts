import { periodLabels } from '../types/schedules'

export function formatDuration(minutes: number): string {
  return `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'}`
}

export function getPeriod(time: string): keyof typeof periodLabels {
  const hour = parseInt(time.split(':')[0], 10)
  if (hour < 12) return 'morning'
  if (hour < 17) return 'day'
  return 'evening'
} 