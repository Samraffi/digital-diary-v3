'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Анимированный спиннер */}
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        
        {/* Дополнительные элементы загрузки */}
        <div className="mt-4 space-y-2 w-48">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/50 to-primary"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/50 to-primary"
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
            />
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/50 to-primary"
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Анимированный текст */}
        <motion.p
          className="mt-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Загрузка данных...
        </motion.p>
      </motion.div>
    </div>
  )
}
