'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'

interface OnboardingScreenProps {
  onComplete: () => void
}

const lines = [
  '嘿，你好。',
  '这里没有测试题，没有评分。',
  '只有一个问题。',
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)

  useEffect(() => {
    // Show lines one by one with 300ms interval
    const timers: ReturnType<typeof setTimeout>[] = []

    lines.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1)
      }, 400 + index * 700)
      timers.push(timer)
    })

    // Show button after all lines + 500ms
    const buttonTimer = setTimeout(() => {
      setShowButton(true)
    }, 400 + lines.length * 700 + 500)
    timers.push(buttonTimer)

    return () => timers.forEach(clearTimeout)
  }, [])

  const handleStart = () => {
    setIsExiting(true)
    completeOnboarding()
    setTimeout(() => {
      onComplete()
    }, 600)
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8] px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Logo / Brand mark */}
          <motion.div
            className="mb-12 text-5xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <span className="animate-float inline-block">🌱</span>
          </motion.div>

          {/* Text lines */}
          <div className="mb-16 space-y-4 text-center">
            {lines.map((line, index) => (
              <motion.p
                key={index}
                className={`text-2xl font-medium leading-relaxed ${
                  index === lines.length - 1
                    ? 'text-gray-800 font-bold'
                    : 'text-gray-600'
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={
                  visibleLines > index
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Start Button */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                onClick={handleStart}
                className="relative overflow-hidden rounded-2xl bg-gray-800 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-shadow hover:shadow-xl active:scale-95"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">开始</span>
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Subtle hint */}
          <AnimatePresence>
            {showButton && (
              <motion.p
                className="mt-6 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                无需注册，立刻开始
              </motion.p>
            )}
          </AnimatePresence>

          {/* Bottom decoration */}
          <div className="absolute bottom-12 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gray-300"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
