'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNobleStore } from '@/modules/noble/store'
import { useTerritoryStore } from '../store'
import { useGameNotifications } from '@/lib/hooks/useGameNotifications'
import { TERRITORY_TYPES, TerritoryType } from '../types'

export function AddTerritoryButton() {
  const [selectedType, setSelectedType] = useState<TerritoryType>('camp')
  const noble = useNobleStore(state => state.noble)
  const addTerritory = useTerritoryStore(state => state.addTerritory)
  const { notifyResourceReward, notifyError } = useGameNotifications()

  const handleAddTerritory = async () => {
    if (!noble) return

    const typeInfo = TERRITORY_TYPES[selectedType]
    const requirements = typeInfo.requirements

    // Проверяем наличие ресурсов
    if (
      noble.resources.gold >= requirements.gold &&
      noble.resources.influence >= requirements.influence
    ) {
      // Снимаем ресурсы
      useNobleStore.getState().removeResources({
        gold: requirements.gold,
        influence: requirements.influence
      })

      // Добавляем территорию
      await addTerritory(selectedType)

      // Уведомляем об успехе
      notifyResourceReward({
        gold: typeInfo.baseProduction.gold,
        influence: typeInfo.baseProduction.influence
      })
    } else {
      // Уведомляем об ошибке
      notifyError(
        'Недостаточно ресурсов',
        `Требуется ${requirements.gold} золота и ${requirements.influence} влияния`
      )
    }
  }

  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedType}
        onChange={e => setSelectedType(e.target.value as TerritoryType)}
        className="select select-bordered"
      >
        {Object.entries(TERRITORY_TYPES).map(([type, info]) => (
          <option key={type} value={type}>
            {info.name} (
            {info.requirements.gold}🪙,
            {info.requirements.influence}⚜️)
          </option>
        ))}
      </select>

      <button
        onClick={handleAddTerritory}
        disabled={!noble}
        className="btn btn-primary"
      >
        Добавить территорию
      </button>
    </div>
  )
}
