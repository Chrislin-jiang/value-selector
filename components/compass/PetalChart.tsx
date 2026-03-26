'use client'

import { useEffect, useState } from 'react'
import { ValueDimension } from '@/types'

interface PetalData {
  value: ValueDimension
  count: number
  ratio: number   // 0-1，归一化后的值
}

interface PetalChartProps {
  data: PetalData[]
  onPetalClick: (value: ValueDimension) => void
  selectedId?: number | null
}

const SIZE = 280          // SVG 宽高
const CX = SIZE / 2       // 中心 x
const CY = SIZE / 2       // 中心 y
const MAX_RADIUS = 100    // 最大花瓣半径
const MIN_RADIUS = 8      // 最小花瓣半径（无数据时的占位圆）
const LABEL_RADIUS = 122  // 标签距圆心距离
const N = 12              // 维度数量

// 极坐标转笛卡尔坐标
function polar(angle: number, r: number) {
  return {
    x: CX + r * Math.sin(angle),
    y: CY - r * Math.cos(angle),
  }
}

// 生成单个花瓣的 SVG path（泪滴形）
function petalPath(angle: number, radius: number): string {
  if (radius < 2) return ''
  const halfWidth = radius * 0.35  // 花瓣宽度
  const tipR = radius              // 花瓣尖端距中心
  const baseR = MIN_RADIUS * 0.6   // 花瓣根部距中心

  // 花瓣左右控制点的偏移角度
  const leftAngle  = angle - Math.PI / 7
  const rightAngle = angle + Math.PI / 7

  const tip   = polar(angle, tipR)
  const left  = polar(leftAngle, halfWidth + baseR * 0.5)
  const right = polar(rightAngle, halfWidth + baseR * 0.5)
  const base  = polar(angle + Math.PI, baseR)  // 根部（背面）

  // 三次贝塞尔曲线画花瓣轮廓
  const cp1L = polar(angle - Math.PI / 12, tipR * 0.55)
  const cp2L = polar(leftAngle - Math.PI / 16, halfWidth * 1.2 + baseR)
  const cp1R = polar(rightAngle + Math.PI / 16, halfWidth * 1.2 + baseR)
  const cp2R = polar(angle + Math.PI / 12, tipR * 0.55)

  return [
    `M ${base.x} ${base.y}`,
    `C ${cp2L.x} ${cp2L.y}, ${cp1L.x} ${cp1L.y}, ${left.x} ${left.y}`,
    `C ${cp1L.x} ${cp1L.y}, ${cp1L.x} ${cp1L.y}, ${tip.x} ${tip.y}`,
    `C ${cp2R.x} ${cp2R.y}, ${cp1R.x} ${cp1R.y}, ${right.x} ${right.y}`,
    `C ${cp1R.x} ${cp1R.y}, ${cp2L.x} ${cp2L.y}, ${base.x} ${base.y}`,
    'Z',
  ].join(' ')
}

// 简化版：用平滑椭圆形花瓣（更稳定）
function smoothPetalPath(angle: number, radius: number): string {
  if (radius < 1) return ''
  const tipR   = Math.max(radius, MIN_RADIUS)
  const width  = tipR * 0.4

  // 4个控制点
  const tip    = polar(angle, tipR)
  const base   = polar(angle, MIN_RADIUS * 0.5)
  const left   = polar(angle - Math.PI / 2, width * 0.5)
  const right  = polar(angle + Math.PI / 2, width * 0.5)

  // 相对于花瓣轴线，实际偏移
  const lx = CX + (left.x - CX) * 0.4 + (base.x - CX) * 0.6
  const ly = CY + (left.y - CY) * 0.4 + (base.y - CY) * 0.6
  const rx = CX + (right.x - CX) * 0.4 + (base.x - CX) * 0.6
  const ry = CY + (right.y - CY) * 0.4 + (base.y - CY) * 0.6

  return [
    `M ${base.x} ${base.y}`,
    `Q ${lx} ${ly} ${tip.x} ${tip.y}`,
    `Q ${rx} ${ry} ${base.x} ${base.y}`,
    'Z',
  ].join(' ')
}

export default function PetalChart({ data, onPetalClick, selectedId }: PetalChartProps) {
  const [animRatios, setAnimRatios] = useState<number[]>(data.map(() => 0))

  // 入场生长动画
  useEffect(() => {
    setAnimRatios(data.map(() => 0))
    const duration = 900
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      // easeOutBack
      const ease = 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2)
      const clampedEase = Math.min(Math.max(ease, 0), 1)
      setAnimRatios(data.map((d) => d.ratio * clampedEase))
      if (t < 1) requestAnimationFrame(tick)
    }

    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.map((d) => d.count).join(',')])

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[280px]"
    >
      {/* 背景网格圆 */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <circle
          key={r}
          cx={CX}
          cy={CY}
          r={MAX_RADIUS * r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
          strokeDasharray={r === 1 ? '4 3' : '2 3'}
        />
      ))}

      {/* 轴线 */}
      {data.map((_, i) => {
        const angle = (2 * Math.PI * i) / N
        const end = polar(angle, MAX_RADIUS)
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={end.x}
            y2={end.y}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        )
      })}

      {/* 花瓣 */}
      {data.map((d, i) => {
        const angle    = (2 * Math.PI * i) / N
        const animR    = animRatios[i] * MAX_RADIUS
        const hasData  = d.count > 0
        const isSelected = selectedId === d.value.id

        const path = smoothPetalPath(angle, hasData ? Math.max(animR, 4) : 0)
        if (!path) return null

        return (
          <g key={d.value.id} style={{ cursor: 'pointer' }} onClick={() => onPetalClick(d.value)}>
            {/* 花瓣填充 */}
            <path
              d={path}
              fill={hasData ? d.value.color : '#E5E7EB'}
              fillOpacity={hasData ? (isSelected ? 0.9 : 0.65) : 0.4}
              stroke={hasData ? d.value.color : '#D1D5DB'}
              strokeWidth={isSelected ? 2 : 1}
              style={{ transition: 'fill-opacity 0.2s, stroke-width 0.2s' }}
            />
            {/* 选中时的外发光 */}
            {isSelected && (
              <path
                d={path}
                fill="none"
                stroke={d.value.color}
                strokeWidth={3}
                strokeOpacity={0.3}
              />
            )}
          </g>
        )
      })}

      {/* 中心圆 */}
      <circle cx={CX} cy={CY} r={8} fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1.5} />

      {/* 标签 */}
      {data.map((d, i) => {
        const angle    = (2 * Math.PI * i) / N
        const labelPos = polar(angle, LABEL_RADIUS)
        const hasData  = d.count > 0

        // 文字对齐根据位置调整
        const sinA = Math.sin(angle)
        let textAnchor: 'start' | 'middle' | 'end' = 'middle'
        if (sinA > 0.3)       textAnchor = 'start'
        else if (sinA < -0.3) textAnchor = 'end'

        return (
          <g
            key={`label-${d.value.id}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onPetalClick(d.value)}
          >
            <text
              x={labelPos.x}
              y={labelPos.y - 5}
              textAnchor={textAnchor}
              fontSize="14"
              dominantBaseline="middle"
            >
              {d.value.emoji}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 10}
              textAnchor={textAnchor}
              fontSize="9"
              fill={hasData ? '#4B5563' : '#9CA3AF'}
              fontWeight={hasData ? '600' : '400'}
              dominantBaseline="middle"
            >
              {d.value.name}
            </text>
            {/* 选择次数角标 */}
            {d.count > 0 && (
              <text
                x={labelPos.x}
                y={labelPos.y + 21}
                textAnchor={textAnchor}
                fontSize="8"
                fill={d.value.color}
                fontWeight="600"
                dominantBaseline="middle"
              >
                ×{d.count}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
