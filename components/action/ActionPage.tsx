'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle, RefreshCw, SkipForward, Star } from 'lucide-react'
import { getValueById } from '@/data/values'
import { MICRO_ACTIONS, getRandomAction } from '@/data/actions'
import { useAppStore } from '@/stores/appStore'
import { MicroAction } from '@/types'
import ParticleEffect from '@/components/effects/ParticleEffect'

type DifficultyFeedback = 'too_easy' | 'just_right' | 'challenging'
type PageStatus = 'idle' | 'done' | 'skipped'

// 难度评价选项
const DIFFICULTY_OPTIONS: { key: DifficultyFeedback; label: string; emoji: string }[] = [
  { key: 'too_easy',    label: '太简单了', emoji: '😌' },
  { key: 'just_right',  label: '刚好',     emoji: '👌' },
  { key: 'challenging', label: '有挑战',   emoji: '💪' },
]

export default function ActionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const valueId = parseInt(searchParams.get('valueId') || '1')
  const value = getValueById(valueId)

  const { addAction, getTodayAction } = useAppStore()
  const todayAction = getTodayAction()

  const [currentAction, setCurrentAction] = useState<MicroAction | null>(null)
  // 备选池：预先抓 2 个备选，换一个时依次出队
  const [alternateActions, setAlternateActions] = useState<MicroAction[]>([])
  const [usedActionIds, setUsedActionIds] = useState<number[]>([])

  const [status, setStatus] = useState<PageStatus>(
    todayAction?.status === 'completed' ? 'done' :
    todayAction?.status === 'skipped'   ? 'skipped' : 'idle'
  )

  // 感受相关
  const [feeling, setFeeling] = useState(todayAction?.feeling || '')
  const [feelingSaved, setFeelingSaved] = useState(false)

  // 难度反馈
  const [difficultyFeedback, setDifficultyFeedback] = useState<DifficultyFeedback | null>(null)

  // 粒子特效
  const [showParticles, setShowParticles] = useState(false)

  // 卡片翻转状态（行动卡片入场翻转）
  const [cardFlipped, setCardFlipped] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 预备备选行动池（1 推荐 + 2 备选）
  const buildPool = useCallback((excludeIds: number[] = []) => {
    const used = [...excludeIds]
    const main = getRandomAction(valueId, used)
    if (!main) return
    used.push(main.id)

    const alt1 = getRandomAction(valueId, used)
    if (alt1) used.push(alt1.id)
    const alt2 = getRandomAction(valueId, used)

    setCurrentAction(main)
    setUsedActionIds(used)
    setAlternateActions([alt1, alt2].filter(Boolean) as MicroAction[])

    // 触发卡片翻转入场
    setCardFlipped(false)
    setTimeout(() => setCardFlipped(true), 50)
  }, [valueId])

  useEffect(() => {
    if (todayAction) {
      const found = MICRO_ACTIONS.find((a) => a.id === todayAction.actionId)
      if (found) {
        setCurrentAction(found)
        setCardFlipped(true)
      }
    } else {
      buildPool()
    }
  }, [todayAction, buildPool])

  if (!value || !currentAction) return null

  // 保存行动记录
  const saveAction = (overrides: Partial<Parameters<typeof addAction>[0]> = {}) => {
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
      ...overrides,
    })
  }

  const handleComplete = () => {
    setStatus('done')
    setShowParticles(true)
    saveAction()
    setTimeout(() => setShowParticles(false), 2200)
    // 自动聚焦感受输入框
    setTimeout(() => textareaRef.current?.focus(), 600)
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
    if (alternateActions.length === 0) {
      // 备选耗尽时重新随机
      buildPool(usedActionIds)
      return
    }
    // 取出第一个备选，把当前加入 used
    const [next, ...rest] = alternateActions
    setUsedActionIds((prev) => [...prev, next.id])
    setCurrentAction(next)
    setAlternateActions(rest)
    // 翻转动画
    setCardFlipped(false)
    setTimeout(() => setCardFlipped(true), 50)
  }

  const handleSaveFeeling = () => {
    saveAction({ feeling, completedAt: new Date().toISOString() })
    setFeelingSaved(true)
  }

  const handleDifficultyFeedback = (fb: DifficultyFeedback) => {
    setDifficultyFeedback(fb)
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
      difficultyFeedback: fb,
    })
  }

  // 难度星级展示
  const DifficultyStars = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= count ? 'fill-current text-amber-400' : 'text-gray-200 fill-current'
          }`}
        />
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">
      {showParticles && <ParticleEffect color={value.color} />}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 rounded-xl p-2 text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-2xl">{value.emoji}</span>
          <span className="text-lg font-bold text-gray-800">{value.name}</span>
        </motion.div>
        <div className="w-9" />
      </div>

      {/* 主内容 */}
      <div className="flex flex-1 flex-col items-center px-5 pt-4">
        <AnimatePresence mode="wait">

          {/* ── idle 状态：展示行动卡片 ── */}
          {status === 'idle' && (
            <motion.div
              key="action-card"
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.35 }}
            >
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-300">
                今日小行动
              </p>

              {/* 行动卡片（翻转入场） */}
              <div
                className="mb-5 w-full"
                style={{ perspective: '800px' }}
              >
                <motion.div
                  className="rounded-3xl bg-white shadow-lg overflow-hidden"
                  style={{
                    borderTop: `4px solid ${value.color}`,
                    transformOrigin: 'top center',
                  }}
                  initial={{ rotateX: -90, opacity: 0 }}
                  animate={
                    cardFlipped
                      ? { rotateX: 0, opacity: 1 }
                      : { rotateX: -90, opacity: 0 }
                  }
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* 价值色装饰条 */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: `linear-gradient(to right, ${value.color}, ${value.color}88)`,
                    }}
                  />

                  <div className="p-6">
                    {/* 行动内容 */}
                    <p className="text-xl font-semibold leading-relaxed text-gray-800 mb-5 min-h-[4rem]">
                      {currentAction.content}
                    </p>

                    {/* 底部信息行 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DifficultyStars count={currentAction.difficulty} />
                        <span className="text-xs text-gray-400">
                          {currentAction.difficulty === 1 ? '轻松完成' : currentAction.difficulty === 2 ? '适度挑战' : '深度挑战'}
                        </span>
                      </div>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${value.color}18`, color: value.color }}
                      >
                        约 2 分钟
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 备选提示 */}
              {alternateActions.length > 0 && (
                <motion.p
                  className="mb-4 text-center text-xs text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  还有 {alternateActions.length} 个备选行动
                </motion.p>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col gap-3">
                {/* 主按钮：我做到了 */}
                <motion.button
                  onClick={handleComplete}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white shadow-lg active:scale-95"
                  style={{ backgroundColor: value.color }}
                  whileHover={{ scale: 1.02, boxShadow: `0 8px 24px ${value.color}44` }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CheckCircle className="h-5 w-5" />
                  ✅ 我做到了
                </motion.button>

                {/* 次级按钮行 */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleSwitch}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-100 bg-white py-3 text-sm font-semibold text-gray-600 hover:border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    🔄 换一个
                  </motion.button>

                  <motion.button
                    onClick={handleSkip}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-100 bg-white py-3 text-sm font-medium text-gray-400 hover:border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <SkipForward className="h-4 w-4" />
                    💤 今天先跳过
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── done 状态：完成反馈 ── */}
          {status === 'done' && (
            <motion.div
              key="done"
              className="flex w-full max-w-sm flex-col items-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, type: 'spring', stiffness: 300, damping: 24 }}
            >
              {/* 庆祝 emoji */}
              <motion.div
                className="mb-4 text-6xl"
                animate={{ rotate: [0, -12, 12, -6, 6, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                🎉
              </motion.div>

              <motion.h2
                className="mb-2 text-2xl font-bold text-gray-800"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                真棒！
              </motion.h2>

              <motion.p
                className="mb-6 text-center text-base text-gray-500 leading-relaxed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                你刚刚用一个小行动，
                <br />
                证明了自己是一个{' '}
                <span className="font-bold" style={{ color: value.color }}>
                  {value.name}
                </span>{' '}
                的人。
              </motion.p>

              {/* 完成的行动回顾卡 */}
              <motion.div
                className="mb-6 w-full rounded-2xl p-4 text-sm"
                style={{ backgroundColor: `${value.color}12`, border: `1px solid ${value.color}30` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <p className="text-xs font-medium mb-1" style={{ color: value.color }}>
                  今天完成的行动
                </p>
                <p className="text-gray-700 font-medium leading-snug">{currentAction.content}</p>
              </motion.div>

              {/* 感受输入 */}
              <motion.div
                className="mb-5 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <p className="mb-2 text-sm font-medium text-gray-500">
                  写一句感受？<span className="text-gray-300 font-normal">（可选）</span>
                </p>
                {!feelingSaved ? (
                  <>
                    <textarea
                      ref={textareaRef}
                      value={feeling}
                      onChange={(e) => setFeeling(e.target.value)}
                      placeholder="比如：比想象中简单…"
                      className="w-full rounded-xl border-2 border-gray-100 bg-white p-3 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-300 focus:outline-none resize-none transition-colors"
                      rows={2}
                    />
                    <div className="mt-2 flex justify-between items-center">
                      <button
                        onClick={handleSaveFeeling}
                        className="text-sm font-semibold transition-colors"
                        style={{ color: value.color }}
                        disabled={!feeling.trim()}
                      >
                        {feeling.trim() ? '保存感受 →' : ''}
                      </button>
                      <button
                        onClick={() => setFeelingSaved(true)}
                        className="text-xs text-gray-300 hover:text-gray-400"
                      >
                        跳过
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="rounded-xl border-2 border-gray-100 bg-white p-3 text-sm text-gray-500 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {feeling.trim() ? `"${feeling}"` : '已记录 ✓'}
                  </motion.div>
                )}
              </motion.div>

              {/* 难度评价 */}
              <AnimatePresence>
                {feelingSaved && !difficultyFeedback && (
                  <motion.div
                    className="mb-5 w-full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mb-2.5 text-sm font-medium text-gray-500">这个行动对你来说：</p>
                    <div className="flex gap-2">
                      {DIFFICULTY_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleDifficultyFeedback(opt.key)}
                          className="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-gray-100 bg-white py-2.5 px-1 text-xs font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
                        >
                          <span className="text-lg">{opt.emoji}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 已评价反馈 */}
              {difficultyFeedback && (
                <motion.p
                  className="mb-5 text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {difficultyFeedback === 'too_easy' && '👍 已记录，下次给你推荐稍有挑战的'}
                  {difficultyFeedback === 'just_right' && '👌 完美！继续保持这个节奏'}
                  {difficultyFeedback === 'challenging' && '💪 勇敢完成挑战！越来越棒'}
                </motion.p>
              )}

              {/* 返回首页 */}
              <motion.button
                onClick={() => router.push('/')}
                className="w-full rounded-2xl bg-gray-800 py-4 text-center text-lg font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                明天见 👋
              </motion.button>
            </motion.div>
          )}

          {/* ── skipped 状态 ── */}
          {status === 'skipped' && (
            <motion.div
              key="skipped"
              className="flex w-full max-w-sm flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="mb-5 text-6xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.2, repeat: 2, ease: 'easeInOut' }}
              >
                😴
              </motion.div>

              <h2 className="mb-2 text-2xl font-bold text-gray-700">没关系</h2>
              <p className="mb-8 text-center text-gray-400 leading-relaxed">
                今天先休息一下。
                <br />
                跳过不等于失败，明天还是新的开始 🌱
              </p>

              {/* 跳过时可改为完成 */}
              <button
                onClick={() => {
                  setStatus('idle')
                  const today = format(new Date(), 'yyyy-MM-dd')
                  // 从 store 里移除今天的 action，让用户重新操作
                  addAction({
                    date: today,
                    valueId,
                    actionId: currentAction.id,
                    actionContent: currentAction.content,
                    difficulty: currentAction.difficulty,
                    status: 'skipped',
                  })
                  setStatus('idle')
                }}
                className="mb-3 w-full rounded-2xl border-2 py-3.5 text-center text-base font-semibold transition-all active:scale-95 hover:bg-gray-50"
                style={{ borderColor: value.color, color: value.color }}
              >
                还是决定做一下 💪
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full rounded-2xl bg-gray-100 py-3.5 text-center text-base font-semibold text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
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
