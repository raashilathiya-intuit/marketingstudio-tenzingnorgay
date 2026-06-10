import React from 'react'
import PastelPill from '../PastelPill'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

function LineChart({ series }) {
  const W = 340, H = 110
  const padL = 8, padR = 8, padT = 8, padB = 20

  const allVals = series.flatMap((s) => s.data)
  const minV = Math.min(...allVals)
  const maxV = Math.max(...allVals)
  const range = maxV - minV || 1
  const len = series[0].data.length

  const toX = (i) => padL + (i / (len - 1)) * (W - padL - padR)
  const toY = (v) => padT + (1 - (v - minV) / range) * (H - padT - padB)

  const makePath = (data) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ')

  // X axis labels (every 7 days)
  const dayLabels = ['Day 1', '', '', '', '', '', 'Day 7', '', '', '', '', '', 'Day 14']

  return (
    <div className="line-chart-wrap">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padT + frac * (H - padT - padB)
          return (
            <line key={frac} x1={padL} y1={y} x2={W - padR} y2={y}
              stroke="var(--chart-grid)" strokeWidth="1" />
          )
        })}
        {/* Series lines */}
        {series.map((s) => (
          <path key={s.name} d={makePath(s.data)} fill="none" stroke={s.color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* End dots */}
        {series.map((s) => {
          const lastVal = s.data[s.data.length - 1]
          return (
            <circle key={s.name + '-dot'} cx={toX(len - 1)} cy={toY(lastVal)} r="3.5"
              fill={s.color} />
          )
        })}
      </svg>
      <div className="line-chart-legend">
        {series.map((s) => (
          <div key={s.name} className="line-legend-item">
            <span className="line-legend-dot" style={{ background: s.color }} />
            <span className="line-legend-name">{s.name}</span>
            <span className="line-legend-val tnum">{(s.data[s.data.length - 1] / 1000).toFixed(0)}K</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ImpressionsByAccessPoint() {
  const data = WIDGET_DATA['ipd-impressions-by-access-point']
  return (
    <div>
      <div className="widget-metric-value tnum">{data.value}</div>
      <div className="widget-metric-label">{data.valueLabel}</div>
      <div className="chart-summary-row">
        <PastelPill color={data.summary.pill.color} size="sm">{data.summary.pill.text}</PastelPill>
        <span className="chart-summary-text">{data.summary.text}</span>
      </div>
      <LineChart series={data.series} />
    </div>
  )
}
