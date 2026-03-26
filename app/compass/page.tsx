'use client'

import CompassPage from '@/components/compass/CompassPage'
import TabBar from '@/components/ui/TabBar'

export default function CompassRoute() {
  return (
    <div className="pb-16">
      <CompassPage />
      <TabBar activeTab="compass" />
    </div>
  )
}
