'use client'

import { useEffect, useState } from 'react'
import { ValueDimension } from '@/types'

interface PetalData {
  value: ValueDimension
  count: number
  ratio: number  // 0–1 归一化
}

interface PetalChartProps {
  data: PetalData[]
  onPetalClick: (value: ValueDimension) => void
  selectedId?: number | null
}

const SIZE = 300
const CX = SIZE / 2
const CY = SIZE / 2
const MAX_R = 96     // 花瓣最大半径
const MIN_R = 10     // 花瓣最小半径（无数据时）
const LABEL_R = 128  // 标签半径
const N = 12

/** 极坐标 → 笛卡尔（0° = 正上方，顺时针） */
function pt(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

/**
 * 生成正确的花瓣 SVG path。
 * 花瓣以圆心为底，沿 angleDeg 方向延伸 radius 长，
 * 宽度为 radius * widthFactor。
 * 使用 3 次贝塞尔曲线，左右对称。
 */
function petalPath(angleDeg: number, radius: number, widthFactor = 0.38): string {
  if (radius < 2) return ''

  const halfW = radius * widthFactor
  // 花瓣尖端（沿主轴方向，距圆心 radius）
  const tip = pt(angleDeg, radius)
  // 花瓣根部（在圆心附近，距圆心很小）
  const baseR = Math.min(radius * 0.12, 6)
  const base = pt(angleDeg, baseR)

  // 花瓣最宽处大约在 50% 处
  const midR = radius * 0.52
  // 左右两侧最宽点（垂直于主轴方向偏移 halfW）
  const perpLeft  = angleDeg - 90
  const perpRight = angleDeg + 90
  const leftMid  = {
    x: pt(angleDeg, midR).x + halfW * Math.cos((perpLeft  - 90) * Math.PI / 180),
    y: pt(angleDeg, midR).y + halfW * Math.sin((perpLeft  - 90) * Math.PI / 180),
  }
  const rightMid = {
    x: pt(angleDeg, midR).x + halfW * Math.cos((perpRight - 90) * Math.PI / 180),
    y: pt(angleDeg, midR).y + halfW * Math.sin((perpRight - 90) * Math.PI / 180),
  }

  // 控制点
  // 从 base → leftMid：控制点贴近 base 侧
  const cp1L = {
    x: base.x + (leftMid.x - base.x) * 0.2,
    y: base.y + (leftMid.y - base.y) * 0.2,
  }
  // leftMid → tip：控制点靠近 tip
  const cp2L = {
    x: leftMid.x + (tip.x - leftMid.x) * 0.7,
    y: leftMid.y + (tip.y - leftMid.y) * 0.7,
  }
  // tip → rightMid
  const cp1R = {
    x: tip.x + (rightMid.x - tip.x) * 0.3,
    y: tip.y + (rightMid.y - tip.y) * 0.3,
  }
  // rightMid → base
  const cp2R = {
    x: rightMid.x + (base.x - rightMid.x) * 0.8,
    y: rightMid.y + (base.y - rightMid.y) * 0.8,
  }

  return [
    `M ${base.x.toFixed(2)} ${base.y.toFixed(2)}`,
    `C ${cp1L.x.toFixed(2)} ${cp1L.y.toFixed(2)},`,
    `  ${cp2L.x.toFixed(2)} ${cp2L.y.toFixed(2)},`,
    `  ${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`,
    `C ${cp1R.x.toFixed(2)} ${cp1R.y.toFixed(2)},`,
    `  ${cp2R.x.toFixed(2)} ${cp2R.y.toFixed(2)},`,
    `  ${base.x.toFixed(2)} ${base.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

// easeOutCubic
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function PetalChart({ data, onPetalClick, selectedId }: PetalChartProps) {
  const [progress, setProgress] = useState(0)  // 0–1 动画进度

  const countKey = data.map((d) => d.count).join(',')

  useEffect(() => {
    setProgress(0)
    const duration = 900
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setProgress(easeOut(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countKey])

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ maxWidth: SIZE, display: 'block', margin: '0 auto' }}
    >
      {/* 背景网格圆（4 圈虚线） */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <circle
          key={r}
          cx={CX} cy={CY}
          r={MAX_R * r}
          fill="none"
          stroke={r === 1 ? '#D1D5DB' : '#E5E7EB'}
          strokeWidth={r === 1 ? 1.5 : 1}
          strokeDasharray={r === 1 ? '3 4' : '2 4'}
        />
      ))}

      {/* 轴线 */}
      {data.map((_, i) => {
        const end = pt(i * (360 / N), MAX_R)
        return (
          <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y}
            stroke="#E5E7EB" strokeWidth={1} />
        )
      })}

      {/* 花瓣（底层先渲染无数据的灰色占位） */}
      {data.map((d, i) => {
        const angleDeg = i * (360 / N)
        const hasData  = d.count > 0
        const r = hasData
          ? Math.max(d.ratio * MAX_R * progress, MIN_R * 0.5)
          : MIN_R * 0.6  // 灰色小占位
        const path = petalPath(angleDeg, r)
        if (!path) return null
        const isSelected = selectedId === d.value.id

        return (
          <g key={d.value.id} onClick={() => onPetalClick(d.value)}
            style={{ cursor: 'pointer' }}>
            {/* 选中光晕（外层，先绘制） */}
            {isSelected && (
              <path d={petalPath(angleDeg, r + 6)}
                fill={d.value.color} fillOpacity={0.18}
                stroke="none" />
            )}
            {/* 花瓣主体 */}
            <path
              d={path}
              fill={hasData ? d.value.color : '#E5E7EB'}
              fillOpacity={hasData ? (isSelected ? 0.88 : 0.60) : 0.35}
              stroke={hasData ? d.value.color : '#D1D5DB'}
              strokeWidth={isSelected ? 1.8 : 0.8}
              strokeOpacity={0.7}
            />
          </g>
        )
      })}

      {/* 中心圆 */}
      <circle cx={CX} cy={CY} r={9}
        fill="white" stroke="#E5E7EB" strokeWidth={1.5} />

      {/* 标签层（最上层，不参与点击判断，透传给花瓣 g） */}
      {data.map((d, i) => {
        const angleDeg = i * (360 / N)
        const lp = pt(angleDeg, LABEL_R)
        const hasData = d.count > 0

        // 文字对齐：左侧 end，右侧 start，上下 middle
        const cosA = Math.cos((angleDeg - 90) * Math.PI / 180)
        const anchor = cosA > 0.25 ? 'start' : cosA < -0.25 ? 'end' : 'middle'

        return (
          <g key={`lbl-${d.value.id}`}
            onClick={() => onPetalClick(d.value)}
            style={{ cursor: 'pointer', pointerEvents: 'none' }}>
            {/* emoji */}
            <text x={lp.x} y={lp.y - 7}
              textAnchor={anchor} fontSize="15" dominantBaseline="middle">
              {d.value.emoji}
            </text>
            {/* 名称 */}
            <text x={lp.x} y={lp.y + 9}
              textAnchor={anchor} fontSize="9.5"
              fill={hasData ? '#374151' : '#9CA3AF'}
              fontWeight={hasData ? '700' : '400'}
              dominantBaseline="middle">
              {d.value.name}
            </text>
            {/* 次数 */}
            {hasData && (
              <text x={lp.x} y={lp.y + 21}
                textAnchor={anchor} fontSize="8"
                fill={d.value.color} fontWeight="600"
                dominantBaseline="middle">
                ×{d.count}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
