'use client'

import { Suspense } from 'react'
import ActionPage from '@/components/action/ActionPage'

export default function ActionRoute() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-4xl animate-float inline-block">✨</span>
      </div>
    }>
      <ActionPage />
    </Suspense>
  )
}
