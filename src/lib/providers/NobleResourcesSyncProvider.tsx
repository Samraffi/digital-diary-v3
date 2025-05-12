'use client'

import { ReactNode } from 'react'
import { useNobleResourcesSync } from '@/lib/hooks/useNobleResourcesSync'

interface NobleResourcesSyncProviderProps {
  children: ReactNode
}

export function NobleResourcesSyncProvider({ children }: NobleResourcesSyncProviderProps) {
  // Initialize the global functions for noble resources sync
  useNobleResourcesSync()
  
  return <>{children}</>
}
