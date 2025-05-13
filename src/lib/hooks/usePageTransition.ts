'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageTransition() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsLoading(true)
      
      // Имитируем загрузку для плавного перехода
      const timer = setTimeout(() => {
        setIsLoading(false)
        setCurrentPath(pathname)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, currentPath])

  return {
    isLoading,
    currentPath,
    isChangingPage: isLoading || pathname !== currentPath
  }
}

export function withPageTransition<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithPageTransition(props: P) {
    const { isChangingPage } = usePageTransition()
    
    if (isChangingPage) {
      return React.createElement('div',
        { className: "min-h-screen flex items-center justify-center" },
        React.createElement('div', {
          className: "w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
        })
      )
    }

    return React.createElement(WrappedComponent, props)
  }
}
