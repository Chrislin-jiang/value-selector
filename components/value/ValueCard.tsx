'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ValueDimension } from '@/types'

interface ValueCardProps {
  value: ValueDimension
  onSelect: (value: ValueDimension) => void
  disabled?: boolean
}

export default function ValueCard({ value, onSelect, disabled }: ValueCardProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 800)

    onSelect(value)
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-white p-5 shadow-sm transition-all hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        borderColor: `${value.color}33`,
      }}
      whileHover={{ scale: 1.02, borderColor: value.color }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Background gradient on hover */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at center, ${value.color}15, transparent 70%)`,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
            background: value.color,
            opacity: 0.4,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-3xl leading-none">{value.emoji}</span>
        <span className="text-base font-semibold text-gray-800">{value.name}</span>
        <span className="text-xs text-gray-400 leading-snug text-center">
          {value.keyword.split('、')[0]}
        </span>
      </div>
    </motion.button>
  )
}
