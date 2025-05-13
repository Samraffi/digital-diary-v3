'use client'

import { useNobleStore } from '@/modules/noble/store'

export function TestControls() {
  const addResources = useNobleStore(state => state.addResources)
  const removeResources = useNobleStore(state => state.removeResources)

  const handleAdd = (type: 'gold' | 'influence', amount: number) => {
    addResources({
      [type]: amount
    })
  }

  const handleRemove = (type: 'gold' | 'influence', amount: number) => {
    removeResources({
      [type]: amount
    })
  }

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-6 py-3 rounded-lg backdrop-blur-sm z-50">
      <div className="text-sm text-gray-400">Тест:</div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAdd('gold', 1000)}
            className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-sm"
          >
            +💰
          </button>
          <button
            onClick={() => handleRemove('gold', 1000)}
            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm"
          >
            -💰
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAdd('influence', 500)}
            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm"
          >
            +👑
          </button>
          <button
            onClick={() => handleRemove('influence', 500)}
            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm"
          >
            -👑
          </button>
        </div>
      </div>
    </div>
  )
} 