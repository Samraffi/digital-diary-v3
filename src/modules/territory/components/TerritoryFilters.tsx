'use client'

import { useState } from 'react'
import type { Territory } from '../types/territory'

interface TerritoryFiltersProps {
  onFilter: (territories: Territory[]) => void
  territories: Territory[]
}

export function TerritoryFilters({ onFilter, territories }: TerritoryFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('level')

  const handleFilterChange = (newTypeFilter?: string, newLevelFilter?: string, newSortBy?: string) => {
    let filtered = [...territories]

    // Use new filter values or current ones
    const type = newTypeFilter ?? typeFilter
    const level = newLevelFilter ?? levelFilter
    const sort = newSortBy ?? sortBy

    // Apply type filter
    if (type !== 'all') {
      filtered = filtered.filter(t => t.type === type)
    }

    // Apply level filter
    if (level !== 'all') {
      const levelNum = parseInt(level)
      filtered = filtered.filter(t => t.level === levelNum)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'level':
          return b.level - a.level
        case 'type':
          return a.type.localeCompare(b.type)
        case 'production':
          const aProduction = (a.production?.gold || 0) + (a.production?.influence || 0)
          const bProduction = (b.production?.gold || 0) + (b.production?.influence || 0)
          return bProduction - aProduction
        default:
          return 0
      }
    })

    onFilter(filtered)
  }

  const typeOptions = [
    { value: 'all', label: 'Все типы' },
    { value: 'fortress', label: 'Крепости' },
    { value: 'mine', label: 'Шахты' },
    { value: 'temple', label: 'Храмы' },
    { value: 'village', label: 'Деревни' },
    { value: 'camp', label: 'Лагеря' }
  ]

  const levelOptions = [
    { value: 'all', label: 'Все уровни' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1),
      label: `Уровень ${i + 1}`
    }))
  ]

  const sortOptions = [
    { value: 'level', label: 'По уровню' },
    { value: 'type', label: 'По типу' },
    { value: 'production', label: 'По производству' }
  ]

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg mb-4">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-1">Тип территории</label>
        <select
          value={typeFilter}
          onChange={e => {
            const value = e.target.value
            setTypeFilter(value)
            handleFilterChange(value, levelFilter, sortBy)
          }}
          className="w-full p-2 rounded bg-secondary text-sm"
        >
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-1">Уровень</label>
        <select
          value={levelFilter}
          onChange={e => {
            const value = e.target.value
            setLevelFilter(value)
            handleFilterChange(typeFilter, value, sortBy)
          }}
          className="w-full p-2 rounded bg-secondary text-sm"
        >
          {levelOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-1">Сортировка</label>
        <select
          value={sortBy}
          onChange={e => {
            const value = e.target.value
            setSortBy(value)
            handleFilterChange(typeFilter, levelFilter, value)
          }}
          className="w-full p-2 rounded bg-secondary text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
