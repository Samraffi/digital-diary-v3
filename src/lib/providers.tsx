'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'
import { store } from './redux/store'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <TerritoryProvider>
        {children}
      </TerritoryProvider>
    </Provider>
  )
}
