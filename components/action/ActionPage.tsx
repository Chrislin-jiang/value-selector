'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle, RefreshCw, SkipForward, Star } from 'lucide-react'
import { VALUES, getValueById } from '@/data/values'
import { MICRO_ACTIONS, getRandomAction } from '@/data/actions'
import { useAppStore } from '@/stores/appStore'
import { MicroAction } from '@/types'
import ParticleEffect from '@/components/effects/ParticleEffect'

export default function ActionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const valueId = parseInt(searchParams.get('valueId') || '1')
  const value = getValueById(valueId)

  const { addAction, getTodayAction } = useAppStore()
  const todayAction = getTodayAction()

  const [currentAction, setCurrentAction] = useState<MicroAction | null>(null)
  const [usedActionIds, setUsedActionIds] = useState<number[]>([])
  const [status, setStatus] = useState<'idle' | 'done' | 'skipped'>(
    todayAction?.status === 'completed' ? 'done' :
    todayAction?.status === 'skipped' ? 'skipped' : 'idle'
  )
  const [feeling, setFeeling] = useState(todayAction?.feeling || '')
  const [showFeelingInput, setShowFeelingInput] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  const pickAction = useCallback((excludeIds: number[] = []) => {
    const action = getRandomAction(valueId, excludeIds)
    if (action) {
      setCurrentAction(action)
      setUsedActionIds((prev) => [...prev, action.id])
    }
  }, [valueId])

  useEffect(() => {
    if (todayAction) {
      // Already has action today, find it
      const found = MICRO_ACTIONS.find((a) => a.id === todayAction.actionId)
      if (found) setCurrentAction(found)
    } else {
      pickAction()
    }
  }, [todayAction, pickAction])

  if (!value || !currentAction) return null

  const handleComplete = () => {
    setStatus('done')
    setShowParticles(true)
    setShowFeelingInput(true)

    const today = format(new Date(), 'yyyy-MM-dd')
    addAction({
      date: today,
      valueId,
      actionId: currentAction.id,
      actionContent: currentAction.content,
      difficulty: currentAction.difficulty,
      status: 'completed',
      feeling,
      completedAt: new Date().toISOString(),
    })

    setTimeout(() => setShowParticles(false), 2000)
  }

  const handleSkip = () => {
    setStatus('skipped')
    const today = format(new Date(), 'yyyy-MM-dd')
    addAction({
      date: today,
      valueId,
      actionId: currentAction.id,
      actionContent: currentAction.content,
      difficulty: currentAction.difficulty,
      status: 'skipped',
    })
  }

  const handleSwitch = () => {
    pickAction(usedActionIds)
  }

  const handleSaveFeeling = () => {
    if (feeling.trim()) {
      const today = format(new Date(), 'yyyy-MM-dd')
      addAction({
        date: today,
        valueId,
        actionId: currentAction.id,
        actionContent: currentAction.content,
        difficulty: currentAction.difficulty,
        status: 'completed',
        feeling,
        completedAt: new Date().toISOString(),
      })
    }
    setShowFeelingInput(false)
  }

  const DifficultyStars = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= count ? 'fill-current text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">
      {/* Particle effect */}
      {showParticles && <ParticleEffect color={value.color} />}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 rounded-xl p-2 text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{value.emoji}</span>
          <span className="text-lg font-bold text-gray-800">{value.name}</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-5 pt-6">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="action-card"
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Label */}
              <p className="mb-4 text-center text-sm font-medium text-gray-400">
                今天的小行动
              </p>

              {/* Action Card */}
              <motion.div
                className="rounded-3xl bg-white p-6 shadow-lg mb-6"
                style={{ borderTop: `4px solid ${value.color}` }}
                layout
              >
                <p className="text-lg font-medium leading-relaxed text-gray-800 mb-4">
                  {currentAction.content}
                </p>
                <div className="flex items-center justify-between">
                  <DifficultyStars count={currentAction.difficulty} />
                  <span className="text-xs text-gray-400">约2分钟内可完成</span>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleComplete}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-semibold text-white shadow-md transition-all active:scale-95"
                  style={{ backgroundColor: value.color }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <CheckCircle className="h-5 w-5" />
                  我做到了
                </motion.button>

                <div className="flex gap-3">
                  <button
                    onClick={handleSwitch}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors active:scale-95"
                  >
                    <RefreshCw className="h-4 w-4" />
                    换一个
                  </button>
                  <button
                    onClick={handleSkip}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors active:scale-95"
                  >
                    <SkipForward className="h-4 w-4" />
                    今天先跳过
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div
              key="done"
              className="flex w-full max-w-sm flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              {/* Success emoji */}
              <motion.div
                className="mb-6 text-6xl"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                🎉
              </motion.div>

              <h2 className="mb-2 text-2xl font-bold text-gray-800">真棒！</h2>
              <p className="mb-8 text-center text-gray-500 leading-relaxed">
                你刚刚用一个小行动，
                <br />
                证明了自己是一个{' '}
                <span className="font-bold" style={{ color: value.color }}>
                  {value.name}
                </span>{' '}
                的人。
              </p>

              {/* Feeling input */}
              <AnimatePresence>
                {showFeelingInput && (
                  <motion.div
                    className="mb-6 w-full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="mb-2 text-sm font-medium text-gray-500">
                      写一句感受？（可选）
                    </p>
                    <textarea
                      value={feeling}
                      onChange={(e) => setFeeling(e.target.value)}
                      placeholder="比如：比想象中简单…"
                      className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-400 focus:outline-none resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleSaveFeeling}
                      className="mt-2 text-sm font-medium text-gray-400 hover:text-gray-600"
                    >
                      {feeling.trim() ? '保存感受' : '跳过'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => router.push('/')}
                className="w-full rounded-2xl bg-gray-800 py-4 text-center text-lg font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                明天见 👋
              </button>
            </motion.div>
          )}

          {status === 'skipped' && (
            <motion.div
              key="skipped"
              className="flex w-full max-w-sm flex-col items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6 text-5xl">😴</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-700">没关系</h2>
              <p className="mb-8 text-center text-gray-400 leading-relaxed">
                今天先休息一下。
                <br />
                明天还是一个新的开始。
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full rounded-2xl bg-gray-200 py-4 text-center text-lg font-semibold text-gray-600 hover:bg-gray-300 transition-all active:scale-95"
              >
                明天见
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
