'use client'

import { ReactNode } from 'react'
import { NotificationsProvider } from '@/shared/ui/notifications/NotificationsProvider'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'
import { NobleResourcesSyncProvider } from './providers/NobleResourcesSyncProvider'
import { Navigation } from '@/shared/ui/Navigation'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationsProvider>
      <NobleResourcesSyncProvider>
        <Navigation />
      </NobleResourcesSyncProvider>
      <TerritoryProvider>
        {children}
      </TerritoryProvider>
    </NotificationsProvider>
  )
}
