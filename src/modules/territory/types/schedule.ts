export interface ScheduleActivity {
  id: string
  startTime: string // format: "HH:mm"
  endTime: string // format: "HH:mm"
  title: string
  duration: number // in minutes
  type: 'english' | 'coding' | 'linkedin' | 'break' | 'leisure' | 'food' | 'other'
  description?: string
}

export interface DaySchedule {
  activities: ScheduleActivity[]
  dayStart: string // format: "HH:mm"
  dayEnd: string // format: "HH:mm"
}

export const scheduleColors = {
  english: 'from-blue-500/20 to-blue-400/20',
  coding: 'from-green-500/20 to-green-400/20',
  linkedin: 'from-orange-500/20 to-orange-400/20',
  break: 'from-gray-500/20 to-gray-400/20',
  leisure: 'from-purple-500/20 to-purple-400/20',
  food: 'from-yellow-500/20 to-yellow-400/20',
  other: 'from-primary-500/20 to-primary-400/20'
}

export const scheduleIcons = {
  english: '🔤',
  coding: '💻',
  linkedin: '🔗',
  break: '☕',
  leisure: '🎮',
  food: '🍽️',
  other: '📝'
}

export const periodLabels = {
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер'
}