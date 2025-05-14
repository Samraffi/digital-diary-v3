import { motion } from 'framer-motion'

interface ExperienceBarProps {
  experience: number
  experienceForNextLevel: number
}

export function ExperienceBar({ experience, experienceForNextLevel }: ExperienceBarProps) {
  const expPercentage = (experience / experienceForNextLevel) * 100

  return (
    <div className="relative overflow-hidden rounded-lg bg-white/5 p-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">Опыт</h3>
        <span className="text-sm text-white font-medium">
          {experience}/{experienceForNextLevel}
        </span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
          initial={{ width: 0 }}
          animate={{ width: `${expPercentage}%` }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />
      </div>
    </div>
  )
} 