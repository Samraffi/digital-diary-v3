'use client'

import { ReactNode } from 'react'
import { NotificationsProvider } from '@/shared/ui/notifications/NotificationsProvider'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'
import { NobleResourcesSyncProvider } from './providers/NobleResourcesSyncProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationsProvider>
      <NobleResourcesSyncProvider>
        <TerritoryProvider>
          {children}
        </TerritoryProvider>
      </NobleResourcesSyncProvider>
    </NotificationsProvider>
  )
}
