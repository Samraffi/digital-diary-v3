import { Card, CardHeader, CardContent } from '@/shared/ui/card'
import { Noble } from '@/modules/noble/types'

interface ResourcesCardProps {
  noble: Noble
}

export const ResourcesCard = ({ noble }: ResourcesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-white">Ресурсы</h2>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Золото</span>
            <span className="text-white font-bold">{noble.resources.gold.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
              style={{ width: `${Math.min((noble.resources.gold / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Влияние</span>
            <span className="text-white font-bold">{noble.resources.influence.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: `${Math.min((noble.resources.influence / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}