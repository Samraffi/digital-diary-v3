'use client'

import { Card } from '@/shared/ui/Card'
import { TerritoryScheduleTimeline } from './TerritoryScheduleTimeline'
import type { ScheduleActivity } from '../types/schedule'
import { useState } from 'react'

// Example schedule data
const exampleSchedule: ScheduleActivity[] = [
  { id: '1', startTime: '08:00', endTime: '08:15', title: 'Завтрак', duration: 15, type: 'food' },
  { id: '2', startTime: '08:15', endTime: '09:00', title: 'Английский: грамматика/лексика', duration: 45, type: 'english' },
  { id: '3', startTime: '09:00', endTime: '09:10', title: 'LinkedIn: connect-заявки', duration: 10, type: 'linkedin' },
  { id: '4', startTime: '09:10', endTime: '09:30', title: 'Английский: слушание с субтитрами', duration: 20, type: 'english' },
  { id: '5', startTime: '09:30', endTime: '09:35', title: 'Короткий перерыв', duration: 5, type: 'break' },
  { id: '6', startTime: '09:35', endTime: '10:35', title: 'Кодирование: проект', duration: 60, type: 'coding' },
  { id: '7', startTime: '10:35', endTime: '10:40', title: 'Короткий перерыв', duration: 5, type: 'break' },
  { id: '8', startTime: '10:40', endTime: '11:40', title: 'Английский: Busuu или аудио-тренинг', duration: 60, type: 'english' },
  { id: '9', startTime: '11:40', endTime: '12:00', title: 'Кодирование: мелкая работа/рефакторинг', duration: 20, type: 'coding' },
  { id: '10', startTime: '12:00', endTime: '12:10', title: 'LinkedIn: отклики/сообщения', duration: 10, type: 'linkedin' },
  { id: '11', startTime: '12:10', endTime: '12:15', title: 'Короткий перерыв', duration: 5, type: 'break' },
  { id: '12', startTime: '12:15', endTime: '12:35', title: 'Кодирование: фокус-сессия', duration: 20, type: 'coding' },
  { id: '13', startTime: '12:35', endTime: '13:30', title: 'Английский: подкаст + словарь', duration: 55, type: 'english' },
  { id: '14', startTime: '13:30', endTime: '13:45', title: 'Обед', duration: 15, type: 'food' },
  { id: '15', startTime: '13:45', endTime: '14:10', title: 'Кодирование', duration: 25, type: 'coding' },
  { id: '16', startTime: '14:10', endTime: '14:20', title: 'LinkedIn: входящие', duration: 10, type: 'linkedin' },
  { id: '17', startTime: '14:20', endTime: '14:30', title: 'Перерыв: шахматы или растяжка', duration: 10, type: 'break' },
  { id: '18', startTime: '14:30', endTime: '15:00', title: 'Кодирование или мини-проект', duration: 30, type: 'coding' },
  { id: '19', startTime: '15:00', endTime: '16:00', title: 'Busuu или сериал на английском', duration: 60, type: 'english' },
  { id: '20', startTime: '16:00', endTime: '17:00', title: 'Кодирование: глубокая работа', duration: 60, type: 'coding' },
  { id: '21', startTime: '17:00', endTime: '17:15', title: 'Короткий перерыв', duration: 15, type: 'break' },
  { id: '22', startTime: '17:15', endTime: '18:00', title: 'Теория React или JS', duration: 45, type: 'coding' },
  { id: '23', startTime: '18:00', endTime: '18:30', title: 'author.today', duration: 30, type: 'leisure' },
  { id: '24', startTime: '18:30', endTime: '19:15', title: 'Просмотр дорамы', duration: 45, type: 'leisure' },
  { id: '25', startTime: '19:15', endTime: '20:00', title: 'Ужин и свободное плавание', duration: 45, type: 'food' },
  { id: '26', startTime: '20:00', endTime: '21:00', title: 'Повторение слов/определений', duration: 60, type: 'english' },
  { id: '27', startTime: '21:00', endTime: '21:30', title: 'Дневник побед', duration: 30, type: 'other' },
  { id: '28', startTime: '21:30', endTime: '21:45', title: 'Author.today', duration: 15, type: 'leisure' },
  { id: '29', startTime: '21:45', endTime: '23:00', title: 'дорама', duration: 75, type: 'leisure' },
  { id: '30', startTime: '23:00', endTime: '23:30', title: 'Шахматы', duration: 30, type: 'leisure' },
  { id: '31', startTime: '23:30', endTime: '23:55', title: 'Подготовка ко сну', duration: 25, type: 'other' }
]

export function TerritorySchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div>
      <Card gradient="from-primary-500/20 to-primary-400/20" className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white/90 mb-2">Расписание дня</h2>
          <p className="text-white/60">
            Распорядок дня для максимальной эффективности
          </p>
        </div>

        {/* Schedule Content */}
        <div className="space-y-6">
          <TerritoryScheduleTimeline
            activities={exampleSchedule}
            dayStart="08:00"
            dayEnd="23:55"
          />
        </div>
      </Card>

      {/* Extra Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="p-4">
          <div className="text-sm text-white/60">Активностей за день</div>
          <div className="text-2xl font-bold mt-1">
            {exampleSchedule.length}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-white/60">Общая длительность</div>
          <div className="text-2xl font-bold mt-1">
            {Math.round(exampleSchedule.reduce((total, activity) => total + activity.duration, 0) / 60)} часов
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-white/60">Эффективность</div>
          <div className="text-2xl font-bold mt-1 text-green-400">
            92%
          </div>
        </Card>
      </div>
    </div>
  )
}
