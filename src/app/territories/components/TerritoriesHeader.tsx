import { Card } from '@/shared/ui/card'
import { Territory } from '@/modules/territory/types/territory'

interface TerritoriesHeaderProps {
  territories: Territory[]
}

export function TerritoriesHeader({ territories }: TerritoriesHeaderProps) {
  return (
    <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Территории</h1>
      <p className="text-gray-300">
        Управляйте своими владениями и расширяйте своё влияние
      </p>
      <div className="mt-4 flex gap-4">
        <div className="px-4 py-2 bg-white/10 rounded-lg">
          <span className="text-white font-medium">
            Всего территорий: {territories.length}
          </span>
        </div>
        {territories.length === 0 && (
          <div className="px-4 py-2 bg-amber-500/20 rounded-lg">
            <span className="text-amber-300 font-medium">
              Посетите Королевский Рынок, чтобы приобрести территории
            </span>
          </div>
        )}
      </div>
    </Card>
  )
} 