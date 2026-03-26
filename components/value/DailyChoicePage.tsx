'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Flame, Settings } from 'lucide-react'
import ValueCard from './ValueCard'
import { VALUES } from '@/data/values'
import { QUESTIONS } from '@/data/questions'
import { useAppStore } from '@/stores/appStore'
import { ValueDimension } from '@/types'

export default function DailyChoicePage() {
  const router = useRouter()
  const { userProfile, addChoice, getTodayChoice } = useAppStore()
  const todayChoice = getTodayChoice()
  const [selecting, setSelecting] = useState(false)

  // Pick 4 random values for today (seeded by date for consistency)
  const todayOptions = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    // Simple date-based seed for consistent options within a day
    const seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const shuffled = [...VALUES].sort((a, b) => {
      const hashA = (a.id * 1009 + seed) % VALUES.length
      const hashB = (b.id * 1009 + seed) % VALUES.length
      return hashA - hashB
    })
    return shuffled.slice(0, 4)
  }, [])

  // Pick today's question
  const question = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const idx = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % QUESTIONS.length
    return QUESTIONS[idx]
  }, [])

  const handleSelect = async (value: ValueDimension) => {
    if (selecting || todayChoice) return
    setSelecting(true)

    const today = format(new Date(), 'yyyy-MM-dd')
    addChoice({
      date: today,
      valueId: value.id,
      valueName: value.name,
      question,
      optionsShown: todayOptions.map((v) => v.id),
      chosenAt: new Date().toISOString(),
    })

    // Brief animation delay then navigate
    await new Promise((r) => setTimeout(r, 400))
    router.push(`/action?valueId=${value.id}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-1.5">
          <Flame className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-medium text-gray-500">
            {userProfile.streakDays > 0
              ? `连续第 ${userProfile.streakDays} 天`
              : '开始你的第一天'}
          </span>
        </div>
        <button
          onClick={() => router.push('/settings')}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-5 pt-8">
        {/* Question */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {todayChoice ? (
            <>
              <p className="text-lg text-gray-400 mb-2">你今天已经选择了</p>
              <p className="text-3xl font-bold text-gray-800">
                {VALUES.find((v) => v.id === todayChoice.valueId)?.emoji}{' '}
                {todayChoice.valueName}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium uppercase tracking-widest text-gray-400 mb-3">
                今日之问
              </p>
              <h1 className="text-2xl font-bold leading-snug text-gray-800">
                {question}
              </h1>
            </>
          )}
        </motion.div>

        {/* Value Grid */}
        {!todayChoice && (
          <motion.div
            className="grid w-full max-w-sm grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {todayOptions.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
              >
                <ValueCard
                  value={value}
                  onSelect={handleSelect}
                  disabled={selecting}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* If already chose today, show action button */}
        {todayChoice && (
          <motion.div
            className="flex flex-col items-center gap-4 w-full max-w-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => router.push(`/action?valueId=${todayChoice.valueId}`)}
              className="w-full rounded-2xl bg-gray-800 py-4 text-center text-lg font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              查看今日微行动 →
            </button>
            <p className="text-sm text-gray-400">明天再来做新的选择</p>
          </motion.div>
        )}
      </div>

      {/* Bottom hint */}
      {!todayChoice && (
        <motion.p
          className="pb-8 pt-4 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          选择后会推荐一个小小的行动
        </motion.p>
      )}
    </div>
  )
}
