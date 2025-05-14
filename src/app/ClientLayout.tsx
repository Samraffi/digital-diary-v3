'use client'

import { withPageTransition } from '@/lib/hooks/usePageTransition'
import { TerritoryProvider } from '@/modules/territory/providers/TerritoryProvider'
import { TopHeader } from '@/shared/ui/header/TopHeader'
import { Toaster } from 'react-hot-toast'
import { TestControls } from '@/shared/ui/TestControls'
import { NavigationTabs } from './components/navigation/NavigationTabs'
import { BottomGradient } from './components/layout/BottomGradient'

function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <TerritoryProvider>
      <div className="min-h-screen">
        <Toaster />
        <TestControls />
        <TopHeader />

        <div className="container mx-auto px-4 pt-20 pb-8 lg:pb-12 max-w-7xl">
          <NavigationTabs />

          <main className="min-h-[calc(100vh-12rem)]">
            {children}
          </main>

          <BottomGradient />
        </div>
      </div>
    </TerritoryProvider>
  )
}

export default withPageTransition(ClientLayout)
