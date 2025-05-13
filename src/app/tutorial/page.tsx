'use client'

import { motion } from 'framer-motion'
import { useNobleStore } from '@/modules/noble/store'
import { TutorialProgress } from '@/modules/noble/components/TutorialProgress'
import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { CreateProfileModal } from '@/shared/ui/modals/CreateProfileModal'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

function TutorialPage() {
  const noble = useNobleStore(state => state.noble)

  if (!noble) {
    return <CreateProfileModal />
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Путь к величию
          </h1>
          <p className="text-gray-300">
            Выполняйте задания, чтобы повысить свой титул и расширить влияние в королевстве
          </p>
        </div>

        <TutorialProgress />
      </div>
    </motion.div>
  )
}

export default withPageTransition(TutorialPage) 