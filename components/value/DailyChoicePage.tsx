'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Flame, ChevronRight } from 'lucide-react'
import ValueCard from './ValueCard'
import { VALUES } from '@/data/values'
import { QUESTIONS } from '@/data/questions'
import { useAppStore } from '@/stores/appStore'
import { ValueDimension } from '@/types'

// 模拟"全球选择百分比"（MVP 硬编码，后期接 API）
const GLOBAL_PERCENT: Record<number, number> = {
  1: 18, 2: 12, 3: 15, 4: 14,
  5: 11, 6: 9,  7: 8,  8: 10,
  9: 13, 10: 16, 11: 7, 12: 6,
}

export default function DailyChoicePage() {
  const router = useRouter()
  const { userProfile, addChoice, getTodayChoice } = useAppStore()
  const todayChoice = getTodayChoice()

  const [selecting, setSelecting] = useState(false)
  const [selectedValue, setSelectedValue] = useState<ValueDimension | null>(null)
  const [showSocialProof, setShowSocialProof] = useState(false)

  // 4 个今日选项：日期种子保证同一天结果一致
  const todayOptions = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    // Fisher-Yates 伪随机（日期种子）
    const arr = [...VALUES]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 1) * 2654435761) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, 4)
  }, [])

  // 今日问题
  const question = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const idx = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % QUESTIONS.length
    return QUESTIONS[idx]
  }, [])

  // 已选时恢复 selectedValue
  useEffect(() => {
    if (todayChoice) {
      const v = VALUES.find((v) => v.id === todayChoice.valueId)
      if (v) setSelectedValue(v)
    }
  }, [todayChoice])

  const handleSelect = async (value: ValueDimension) => {
    if (selecting || todayChoice) return
    setSelecting(true)
    setSelectedValue(value)

    // 先存数据
    const today = format(new Date(), 'yyyy-MM-dd')
    addChoice({
      date: today,
      valueId: value.id,
      valueName: value.name,
      question,
      optionsShown: todayOptions.map((v) => v.id),
      chosenAt: new Date().toISOString(),
    })

    // 短暂显示社会认同文案
    setShowSocialProof(true)

    // 500ms 后跳转到微行动页
    await new Promise((r) => setTimeout(r, 800))
    router.push(`/action?valueId=${value.id}`)
  }

  const chosenValue = selectedValue || (todayChoice ? VALUES.find((v) => v.id === todayChoice.valueId) : null)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">

      {/* 选中后背景色渐变覆盖层 */}
      <AnimatePresence>
        {selectedValue && selecting && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-10"
            style={{
              background: `radial-gradient(ellipse at center, ${selectedValue.color}22 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        {/* 连续天数 */}
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {userProfile.streakDays > 0 ? (
            <>
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-500">
                连续第 {userProfile.streakDays} 天
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">今天是第一天 🌱</span>
          )}
        </motion.div>

        {/* 日期 */}
        <motion.span
          className="text-xs text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {format(new Date(), 'M月d日')}
        </motion.span>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col items-center px-5 pt-6 pb-4">

        {/* 问题文案 */}
        <motion.div
          className="mb-8 w-full max-w-sm text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {!todayChoice ? (
            <>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-300">
                今日之问
              </p>
              <h1 className="text-[1.6rem] font-bold leading-snug text-gray-800">
                {question}
              </h1>
            </>
          ) : (
            <>
              <p className="mb-1 text-sm text-gray-400">你今天选择了</p>
              <h1
                className="text-[2rem] font-bold"
                style={{ color: chosenValue?.color ?? '#1f2937' }}
              >
                {chosenValue?.emoji} {chosenValue?.name}
              </h1>
              <p className="mt-1 text-sm text-gray-400">{chosenValue?.description}</p>
            </>
          )}
        </motion.div>

        {/* 价值卡片 2×2 网格 */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          {todayOptions.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.07, duration: 0.35, ease: 'easeOut' }}
            >
              <ValueCard
                value={value}
                onSelect={handleSelect}
                disabled={selecting}
                selected={todayChoice?.valueId === value.id || selectedValue?.id === value.id}
                dimmed={
                  !!(todayChoice || selectedValue) &&
                  todayChoice?.valueId !== value.id &&
                  selectedValue?.id !== value.id
                }
              />
            </motion.div>
          ))}
        </div>

        {/* 社会认同文案（选择后短暂出现） */}
        <AnimatePresence>
          {showSocialProof && selectedValue && (
            <motion.div
              className="mt-5 rounded-2xl px-5 py-3 text-center"
              style={{ backgroundColor: `${selectedValue.color}15` }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-sm font-medium" style={{ color: selectedValue.color }}>
                全球有{' '}
                <span className="font-bold text-base">
                  {GLOBAL_PERCENT[selectedValue.id]}%
                </span>{' '}
                的人今天也选了{selectedValue.name} {selectedValue.emoji}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已选后的操作入口 */}
        {todayChoice && !selecting && (
          <motion.div
            className="mt-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => router.push(`/action?valueId=${todayChoice.valueId}`)}
              className="flex w-full items-center justify-between rounded-2xl px-5 py-4 font-semibold text-white shadow-md transition-all active:scale-95 hover:shadow-lg"
              style={{ backgroundColor: chosenValue?.color ?? '#374151' }}
            >
              <span>查看今日微行动</span>
              <ChevronRight className="h-5 w-5 opacity-80" />
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              明天再来做新的选择 ✨
            </p>
          </motion.div>
        )}
      </div>

      {/* 底部提示（未选时） */}
      {!todayChoice && (
        <motion.p
          className="pb-6 text-center text-xs text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          选择后会推荐一个 2 分钟内可完成的小行动
        </motion.p>
      )}
    </div>
  )
}
