'use client'

import { useEffect, useRef } from 'react'

interface ParticleEffectProps {
  color: string
}

export default function ParticleEffect({ color }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
      color: string
    }[] = []

    const colors = [color, '#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D']

    // Create particles from center-bottom area
    const cx = canvas.width / 2
    const cy = canvas.height * 0.6

    for (let i = 0; i < 60; i++) {
      const angle = (Math.random() * Math.PI * 2)
      const speed = Math.random() * 8 + 3
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        radius: Math.random() * 5 + 2,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2 // gravity
        p.alpha -= 0.018
        p.vx *= 0.99

        if (p.alpha > 0) {
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      if (particles.some((p) => p.alpha > 0)) {
        animId = requestAnimationFrame(animate)
      }
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}
