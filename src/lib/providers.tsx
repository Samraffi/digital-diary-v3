'use client'

import { ReactNode } from 'react'
import { NotificationsProvider } from '@/shared/ui/notifications/NotificationsProvider'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationsProvider>
      <TerritoryProvider>
        {children}
      </TerritoryProvider>
    </NotificationsProvider>
  )
}
