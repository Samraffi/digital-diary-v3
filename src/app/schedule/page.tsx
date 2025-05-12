'use client'

import { CurrentTask } from '@/modules/schedule/components/CurrentTask'
import { DailySchedule } from '@/modules/schedule/components/DailySchedule'
import { ScheduleInitializer } from '@/modules/schedule/components/ScheduleInitializer'
import { ScheduleTimeline } from '@/modules/schedule/components/ScheduleTimeline'

export default function SchedulePage() {
  return (
    <main className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medieval mb-2">Распорядок дня</h1>
        <p className="text-gray-400">
          Выполняйте задачи, получайте награды и развивайте своё королевство
        </p>
      </div>

      <ScheduleInitializer />

      <div className="grid gap-8">
        {/* Временная шкала */}
        <ScheduleTimeline />

        {/* Текущая задача */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-medieval text-gray-100 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white">
                ⏰
              </span>
              Текущая задача
            </h2>
          </div>
          <CurrentTask />
        </div>

        {/* Список всех задач */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-medieval text-gray-100 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white">
                📋
              </span>
              Задачи по категориям
            </h2>
          </div>
          <DailySchedule />
        </div>
      </div>
    </main>
  )
}
