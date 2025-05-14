import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { fadeInUp } from '@/shared/ui/animations'
import { TerritoryType } from '@/modules/territory/types/territory'

interface TerritoryFiltersProps {
  selectedType: TerritoryType | 'all'
  onTypeSelect: (type: TerritoryType | 'all') => void
}

export function TerritoryFilters({ selectedType, onTypeSelect }: TerritoryFiltersProps) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => onTypeSelect('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-primary text-white'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            Все
          </button>
          {['village', 'mine', 'fortress', 'temple'].map(type => (
            <button
              key={type}
              onClick={() => onTypeSelect(type as TerritoryType)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === type
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  )
} 