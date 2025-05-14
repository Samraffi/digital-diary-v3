'use client'

import { Card } from '@/shared/ui/card'
import { NoblePath } from '../../types/noble-path'
import { NoblePathCard } from './NoblePathCard'

interface TutorialPathsSectionProps {
  tutorialPaths: NoblePath[]
}

export function TutorialPathsSection({ tutorialPaths }: TutorialPathsSectionProps) {
  return (
    <Card gradient="from-purple-500/20 to-blue-500/20" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Дорога к величию</h2>
          <p className="text-gray-300">
            Отслеживайте свой прогресс в развитии благородного дома. Выполняйте задания в игре, чтобы продвигаться по пути.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tutorialPaths.map(path => (
          <NoblePathCard
            key={path.id}
            path={path}
          />
        ))}
      </div>
    </Card>
  )
}