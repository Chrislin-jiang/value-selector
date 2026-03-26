'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { useAppStore } from '@/stores/appStore'
import { VALUES } from '@/data/values'

export default function CompassPage() {
  const { choices, actions, userProfile } = useAppStore()

  const radarData = useMemo(() => {
    return VALUES.map((v) => {
      const count = choices.filter((c) => c.valueId === v.id).length
      return {
        value: v.name,
        count,
        fullMark: Math.max(...choices.map((c) => {
          const cnt = choices.filter((x) => x.valueId === c.valueId).length
          return cnt
        }), 1),
      }
    })
  }, [choices])

  const completedActions = actions.filter((a) => a.status === 'completed').length
  const totalChoices = choices.length

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400 mb-1">
            价值罗盘
          </p>
          <h1 className="text-2xl font-bold text-gray-800">你的价值地图</h1>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className="mx-5 mb-6 grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: '累计选择', value: totalChoices, unit: '次' },
          { label: '完成行动', value: completedActions, unit: '次' },
          { label: '连续天数', value: userProfile.streakDays, unit: '天' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-3 text-center shadow-sm"
          >
            <p className="text-2xl font-bold text-gray-800">
              {stat.value}
              <span className="text-sm font-normal text-gray-400">{stat.unit}</span>
            </p>
            <p className="mt-0.5 text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        className="mx-5 rounded-3xl bg-white p-6 shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {totalChoices === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="mb-4 text-5xl">🌱</span>
            <p className="text-gray-500">还没有数据</p>
            <p className="mt-1 text-sm text-gray-400">做几次选择后，你的价值地图就会出现</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="value"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
              />
              <Radar
                name="选择次数"
                dataKey="count"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Value list */}
      {totalChoices > 0 && (
        <motion.div
          className="mx-5 mt-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-3 text-sm font-medium text-gray-400">选择分布</p>
          <div className="space-y-2">
            {VALUES.filter((v) => choices.some((c) => c.valueId === v.id))
              .sort(
                (a, b) =>
                  choices.filter((c) => c.valueId === b.id).length -
                  choices.filter((c) => c.valueId === a.id).length
              )
              .map((v) => {
                const count = choices.filter((c) => c.valueId === v.id).length
                const pct = Math.round((count / totalChoices) * 100)
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="text-xl">{v.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{v.name}</span>
                        <span className="text-xs text-gray-400">{count}次 · {pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: v.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
