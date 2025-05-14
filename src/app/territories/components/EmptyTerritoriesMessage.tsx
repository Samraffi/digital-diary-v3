import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/Card'
import { fadeInUp } from '@/shared/ui/animations'

export function EmptyTerritoriesMessage() {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="p-8 text-center">
        <p className="text-gray-400">
          У вас пока нет территорий. Посетите Королевский Рынок, чтобы приобрести свою первую территорию.
        </p>
      </Card>
    </motion.div>
  )
} 