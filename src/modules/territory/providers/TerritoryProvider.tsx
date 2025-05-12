'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { ActiveEffect } from '../types/effects'

interface TerritoryContextType {
  isPerformant: boolean
  activeEffects: ActiveEffect[]
}

const TerritoryContext = createContext<TerritoryContextType | null>(null)

interface TerritoryProviderProps {
  children: ReactNode
  activeEffects?: ActiveEffect[]
}

export function TerritoryProvider({
  children,
  activeEffects = []
}: TerritoryProviderProps) {
  // Мемоизируем значение контекста
  const contextValue = useMemo(() => ({
    isPerformant: true, // Оптимизировано по умолчанию
    activeEffects
  }), [activeEffects])

  return (
    <TerritoryContext.Provider value={contextValue}>
      {children}
    </TerritoryContext.Provider>
  )
}

export function useTerritoryContext() {
  const context = useContext(TerritoryContext)
  if (!context) {
    throw new Error('useTerritoryContext must be used within TerritoryProvider')
  }
  return context
}
