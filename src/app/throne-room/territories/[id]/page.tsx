'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TerritoryProfile } from '@/modules/territory/components/TerritoryProfile'
import { useTerritoryStore } from '@/modules/territory/store'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { Card } from '@/shared/ui/Card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

function TerritoryPage() {
  const params = useParams()
  const router = useRouter()
  const getTerritory = useTerritoryStore(state => state.getTerritory)
  
  const territory = getTerritory(params.id as string)

  if (!territory) {
    router.push('/throne-room/territories')
    return null
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-white">Профиль территории</h1>
      </div>

      <TerritoryProfile territory={territory} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card gradient="from-blue-500/20 to-cyan-500/20" className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Статус</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Развитие</span>
                <span className="text-white font-medium">{territory.status.development}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${territory.status.development}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Счастье</span>
                <span className="text-white font-medium">{territory.status.happiness}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${territory.status.happiness}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Стабильность</span>
                <span className="text-white font-medium">{territory.status.stability}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  style={{ width: `${territory.status.stability}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card gradient="from-amber-500/20 to-yellow-500/20" className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Производство в час</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 rounded-lg bg-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500">💰</span>
                  <span className="text-gray-400">Золото</span>
                </div>
                <p className="text-2xl font-bold text-white">+{territory.production.gold}</p>
              </div>
              <div className="flex-1 p-4 rounded-lg bg-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500">👑</span>
                  <span className="text-gray-400">Влияние</span>
                </div>
                <p className="text-2xl font-bold text-white">+{territory.production.influence}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default withPageTransition(TerritoryPage)
