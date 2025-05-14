import { motion } from 'framer-motion'

interface StatBarProps {
  label: string
  value: number
  maxValue: number
  color: string
  delay?: number
}

export function StatBar({ label, value, maxValue, color, delay = 0 }: StatBarProps) {
  const percentage = (value / maxValue) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1],
            delay
          }}
        />
      </div>
    </div>
  )
} 