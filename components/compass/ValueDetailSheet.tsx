'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, SkipForward } from 'lucide-react'
import { ValueDimension, DailyChoice, ActionRecord } from '@/types'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ValueDetailSheetProps {
  value: ValueDimension | null
  choices: DailyChoice[]
  actions: ActionRecord[]
  onClose: () => void
}

export default function ValueDetailSheet({
  value,
  choices,
  actions,
  onClose,
}: ValueDetailSheetProps) {
  if (!value) return null

  const valueChoices = choices
    .filter((c) => c.valueId === value.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  const valueActions = actions.filter((a) => a.valueId === value.id)
  const completedCount = valueActions.filter((a) => a.status === 'completed').length

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'M月d日 EEE', { locale: zhCN })
    } catch {
      return dateStr
    }
  }

  return (
    <AnimatePresence>
      {value && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 抽屉面板 */}
          <motion.div
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-3xl bg-white shadow-2xl"
            style={{ maxHeight: '80vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* 拖动条 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `2px solid ${value.color}22` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${value.color}18` }}
                >
                  {value.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{value.name}</h3>
                  <p className="text-xs text-gray-400">{value.keyword}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 小统计 */}
            <div className="flex gap-3 px-5 py-3">
              {[
                { label: '选择次数', value: valueChoices.length, unit: '次' },
                { label: '完成行动', value: completedCount, unit: '次' },
                {
                  label: '完成率',
                  value: valueChoices.length > 0
                    ? Math.round((completedCount / valueChoices.length) * 100)
                    : 0,
                  unit: '%',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex-1 rounded-2xl py-2.5 text-center"
                  style={{ backgroundColor: `${value.color}12` }}
                >
                  <p className="text-xl font-bold" style={{ color: value.color }}>
                    {s.value}
                    <span className="text-xs font-normal text-gray-400">{s.unit}</span>
                  </p>
                  <p className="text-[10px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* 历史记录列表 */}
            <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: '52vh' }}>
              {valueChoices.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="mb-3 text-4xl">{value.emoji}</span>
                  <p className="text-gray-400 text-sm">还没有选择过这个维度</p>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-300">
                    选择历史
                  </p>
                  <div className="space-y-2">
                    {valueChoices.map((c) => {
                      const action = valueActions.find((a) => a.date === c.date)
                      return (
                        <div
                          key={c.date}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                        >
                          {/* 日期行 */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-500">
                              {formatDate(c.date)}
                            </span>
                            {action && (
                              <span
                                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  action.status === 'completed'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {action.status === 'completed' ? (
                                  <><CheckCircle className="h-3 w-3" /> 已完成</>
                                ) : (
                                  <><SkipForward className="h-3 w-3" /> 已跳过</>
                                )}
                              </span>
                            )}
                          </div>

                          {/* 行动内容 */}
                          {action && (
                            <p className="text-sm text-gray-600 leading-snug mb-2">
                              {action.actionContent}
                            </p>
                          )}

                          {/* 感受 */}
                          {action?.feeling && (
                            <p className="text-xs text-gray-400 italic border-l-2 pl-2"
                              style={{ borderColor: value.color }}
                            >
                              "{action.feeling}"
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
