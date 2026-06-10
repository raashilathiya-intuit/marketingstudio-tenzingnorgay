import React from 'react'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

function DonutChart({ segments, total }) {
  const cx = 52, cy = 52, outerR = 42, innerR = 28
  let cumAngle = -Math.PI / 2

  const arcs = segments.map((seg) => {
    const fraction = seg.count / total
    const angle = fraction * 2 * Math.PI
    const startX = cx + outerR * Math.cos(cumAngle)
    const startY = cy + outerR * Math.sin(cumAngle)
    cumAngle += angle
    const endX = cx + outerR * Math.cos(cumAngle)
    const endY = cy + outerR * Math.sin(cumAngle)
    const innerStartX = cx + innerR * Math.cos(cumAngle)
    const innerStartY = cy + innerR * Math.sin(cumAngle)
    const innerEndX = cx + innerR * Math.cos(cumAngle - angle)
    const innerEndY = cy + innerR * Math.sin(cumAngle - angle)
    const largeArc = angle > Math.PI ? 1 : 0
    const d = [
      `M ${startX} ${startY}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endX} ${endY}`,
      `L ${innerStartX} ${innerStartY}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEndX} ${innerEndY}`,
      'Z',
    ].join(' ')
    return { ...seg, d }
  })

  return (
    <div className="donut-wrap">
      <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
        {arcs.map((arc) => (
          <path key={arc.label} d={arc.d} fill={arc.color} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ink-1)">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--ink-3)">
          total
        </text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="donut-legend-row">
            <span className="donut-dot" style={{ background: seg.color }} />
            <span className="donut-legend-label">{seg.label}</span>
            <span className="donut-legend-count tnum">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CampaignsByState() {
  const data = WIDGET_DATA['ipd-campaigns-by-state']
  return <DonutChart segments={data.segments} total={data.total} />
}
