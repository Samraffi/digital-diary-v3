'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ThroneRoom() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/main')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
}
