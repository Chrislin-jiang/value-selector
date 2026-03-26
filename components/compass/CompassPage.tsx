'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { VALUES } from '@/data/values'
import { ValueDimension } from '@/types'
import PetalChart from './PetalChart'
import ValueDetailSheet from './ValueDetailSheet'

export default function CompassPage() {
  const router = useRouter()
  const { choices, actions, userProfile } = useAppStore()
  const [selectedValue, setSelectedValue] = useState<ValueDimension | null>(null)

  const totalChoices    = choices.length
  const completedActions = actions.filter((a) => a.status === 'completed').length

  // 计算各维度数据（归一化）
  const petalData = useMemo(() => {
    const maxCount = Math.max(...VALUES.map((v) => choices.filter((c) => c.valueId === v.id).length), 1)
    return VALUES.map((v) => {
      const count = choices.filter((c) => c.valueId === v.id).length
      return {
        value: v,
        count,
        ratio: count / maxCount,
      }
    })
  }, [choices])

  // 最高频价值（Top 3）
  const topValues = useMemo(() =>
    [...petalData]
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
  [petalData])

  const handlePetalClick = (value: ValueDimension) => {
    setSelectedValue(value)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-300 mb-0.5">
            价值罗盘
          </p>
          <h1 className="text-2xl font-bold text-gray-800">你的价值地图</h1>
        </motion.div>
        <button
          onClick={() => router.push('/settings')}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* 统计摘要 */}
      <motion.div
        className="mx-5 mb-5 grid grid-cols-3 gap-2.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: '累计选择', val: totalChoices,    unit: '次',  emoji: '🗓' },
          { label: '完成行动', val: completedActions, unit: '次',  emoji: '✅' },
          { label: '连续天数', val: userProfile.streakDays, unit: '天', emoji: '🔥' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center rounded-2xl bg-white py-3 shadow-sm"
          >
            <span className="text-base mb-0.5">{s.emoji}</span>
            <p className="text-xl font-bold text-gray-800 leading-none">
              {s.val}
              <span className="text-xs font-normal text-gray-400">{s.unit}</span>
            </p>
            <p className="mt-0.5 text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* 花瓣罗盘图 */}
      <motion.div
        className="mx-5 mb-5 flex flex-col items-center rounded-3xl bg-white py-5 shadow-sm"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        {totalChoices === 0 ? (
          <div className="flex flex-col items-center py-14 text-center px-6">
            <motion.span
              className="mb-4 text-5xl inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌱
            </motion.span>
            <p className="text-gray-600 font-medium mb-1">你的价值地图正在生长</p>
            <p className="text-sm text-gray-400">
              每做一次选择，就会有一片花瓣出现
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-gray-400">点击花瓣查看选择历史</p>
            <PetalChart
              data={petalData}
              onPetalClick={handlePetalClick}
              selectedId={selectedValue?.id}
            />
          </>
        )}
      </motion.div>

      {/* Top 价值 */}
      {topValues.length > 0 && (
        <motion.div
          className="mx-5 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-300">
            你的核心价值
          </p>
          <div className="space-y-2">
            {topValues.map((d, rank) => {
              const pct = Math.round((d.count / totalChoices) * 100)
              return (
                <motion.button
                  key={d.value.id}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm text-left hover:shadow-md transition-shadow active:scale-[0.99]"
                  onClick={() => handlePetalClick(d.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + rank * 0.07 }}
                >
                  {/* 排名 */}
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                    #{rank + 1}
                  </span>

                  {/* Emoji */}
                  <span className="text-xl shrink-0">{d.value.emoji}</span>

                  {/* 名称 + 进度条 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">{d.value.name}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {d.count}次 · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: d.value.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: 0.4 + rank * 0.07, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* 箭头 */}
                  <span className="text-gray-300 text-sm shrink-0">›</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* 全部维度分布（包含未选择的） */}
      {totalChoices > 0 && (
        <motion.div
          className="mx-5 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-300">
            全部 12 个维度
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[...petalData].sort((a, b) => b.count - a.count).map((d) => (
              <motion.button
                key={d.value.id}
                className="flex flex-col items-center rounded-2xl bg-white py-3 px-2 shadow-sm text-center hover:shadow-md transition-shadow active:scale-95"
                onClick={() => handlePetalClick(d.value)}
                style={{
                  borderBottom: d.count > 0 ? `3px solid ${d.value.color}` : '3px solid #E5E7EB',
                  opacity: d.count === 0 ? 0.5 : 1,
                }}
              >
                <span className="text-xl mb-1">{d.value.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 mb-0.5">{d.value.name}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: d.count > 0 ? d.value.color : '#9CA3AF' }}
                >
                  {d.count > 0 ? `×${d.count}` : '未选'}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 维度详情抽屉 */}
      <ValueDetailSheet
        value={selectedValue}
        choices={choices}
        actions={actions}
        onClose={() => setSelectedValue(null)}
      />
    </div>
  )
}
