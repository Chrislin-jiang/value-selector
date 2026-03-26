'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ValueDimension } from '@/types'

interface ValueCardProps {
  value: ValueDimension
  onSelect: (value: ValueDimension) => void
  disabled?: boolean
  selected?: boolean   // 今天已选中此项
  dimmed?: boolean     // 今天已选其他项（灰显）
}

export default function ValueCard({
  value,
  onSelect,
  disabled,
  selected,
  dimmed,
}: ValueCardProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || dimmed) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 700)

    onSelect(value)
  }

  // 将 hex 颜色加透明度
  const colorWithAlpha = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || dimmed}
      className="relative w-full overflow-hidden rounded-2xl p-5 text-left shadow-sm transition-shadow"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${colorWithAlpha(value.color, 0.22)}, ${colorWithAlpha(value.color, 0.10)})`
          : dimmed
          ? '#F5F5F7'
          : `linear-gradient(135deg, ${colorWithAlpha(value.color, 0.12)}, ${colorWithAlpha(value.color, 0.05)})`,
        border: selected
          ? `2px solid ${value.color}`
          : `2px solid ${colorWithAlpha(value.color, 0.25)}`,
        opacity: dimmed ? 0.45 : 1,
      }}
      whileHover={!disabled && !dimmed && !selected ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled && !dimmed ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: dimmed ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      layout
    >
      {/* 涟漪扩散 */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute animate-ripple rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 24,
            height: 24,
            marginLeft: -12,
            marginTop: -12,
            background: value.color,
            opacity: 0.5,
          }}
        />
      ))}

      {/* 选中光晕背景 */}
      {selected && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 30% 40%, ${colorWithAlpha(value.color, 0.25)}, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* 内容 */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* emoji 区域 */}
        <motion.span
          className="text-4xl leading-none"
          animate={selected ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {value.emoji}
        </motion.span>

        {/* 名称 */}
        <span
          className="text-base font-bold"
          style={{ color: selected ? value.color : '#1f2937' }}
        >
          {value.name}
        </span>

        {/* 关键词 */}
        <span className="text-xs leading-snug text-center text-gray-400">
          {value.keyword.split('、')[0]}
        </span>

        {/* 已选中勾 */}
        {selected && (
          <motion.div
            className="mt-1 flex items-center justify-center rounded-full p-0.5"
            style={{ backgroundColor: value.color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}
