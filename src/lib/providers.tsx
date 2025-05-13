'use client'

import { ReactNode } from 'react'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TerritoryProvider>
      {children}
    </TerritoryProvider>
  )
}
