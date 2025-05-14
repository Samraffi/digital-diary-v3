'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { NobleStatus } from '@/modules/noble/components/NobleStatus'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { WelcomeScreen } from './components/WelcomeScreen'
import { NobleHeader } from './components/NobleHeader'
import { StatsGrid } from './components/StatsGrid'
import { ResourcesCard } from './components/ResourcesCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

function MainHallContent() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) {
    return <WelcomeScreen />
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <NobleHeader noble={noble} />
      <StatsGrid noble={noble} />
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Статус дворянина</h2>
        </CardHeader>
        <CardContent>
          <NobleStatus />
        </CardContent>
      </Card>

      <ResourcesCard noble={noble} />
    </motion.div>
  )
}

export default withPageTransition(MainHallContent)
