'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import OnboardingScreen from '@/components/onboarding/OnboardingScreen'
import DailyChoicePage from '@/components/value/DailyChoicePage'
import TabBar from '@/components/ui/TabBar'

export default function Home() {
  const { userProfile, updateStreakDays } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    setMounted(true)
    updateStreakDays()
  }, [updateStreakDays])

  useEffect(() => {
    if (mounted && !userProfile.onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [mounted, userProfile.onboardingCompleted])

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">
        <span className="text-4xl animate-float inline-block">🌱</span>
      </div>
    )
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
      )}
      {!showOnboarding && (
        <div className="pb-16">
          <DailyChoicePage />
          <TabBar activeTab="home" />
        </div>
      )}
    </>
  )
}
