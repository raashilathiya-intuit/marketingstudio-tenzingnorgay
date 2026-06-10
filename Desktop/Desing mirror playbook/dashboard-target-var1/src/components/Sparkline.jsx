import React, { useId } from 'react'

// fluid=true: renders at 100% container width using a fixed 200-unit internal coordinate space.
// fluid=false (default): fixed pixel width, for inline/compact uses (e.g. KPI strip).
// showArea=true: adds a subtle gradient fill below the line (fluid mode only).
export default function Sparkline({ data = [], color = 'var(--ink-2)', width = 64, height = 24, fluid = false, showArea = false }) {
  const gradId = useId()
  if (!data || data.length < 2) return null

  const coordW = fluid ? 200 : width
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 2
  const innerH = height - pad * 2
  const step = (coordW - pad * 2) / (data.length - 1)

  const points = data.map((v, i) => {
    const x = pad + i * step
    const y = pad + innerH - ((v - min) / range) * innerH
    return `${x},${y}`
  })

  if (fluid) {
    const firstX = pad
    const lastX = pad + (data.length - 1) * step
    const areaPoints = [...points, `${lastX},${height}`, `${firstX},${height}`].join(' ')
    return (
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${coordW} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        {showArea && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        {showArea && (
          <polygon points={areaPoints} fill={`url(#${gradId})`} stroke="none" />
        )}
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
