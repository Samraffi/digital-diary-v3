import { Card } from '@/shared/ui/card'
import { Noble } from '@/modules/noble/types'

interface NobleHeaderProps {
  noble: Noble
}

export const NobleHeader = ({ noble }: NobleHeaderProps) => {
  return (
    <Card gradient="from-indigo-500/20 to-purple-500/20" className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">
        {`${noble.rank.charAt(0).toUpperCase() + noble.rank.slice(1)} ${noble.id}`}
      </h1>
      <p className="text-gray-300">
        Управляйте своими владениями и развивайте свое королевство
      </p>
    </Card>
  )
} 