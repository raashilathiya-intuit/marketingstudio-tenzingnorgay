import React from 'react'
import PastelPill from '../PastelPill'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

export default function ThreeGateTime() {
  const data = WIDGET_DATA['promote-three-gate-time']
  const maxCount = Math.max(...data.bars.map((b) => b.count))

  return (
    <div>
      <div className="widget-metric-value tnum">{data.value}</div>
      <div className="widget-metric-label">{data.valueLabel}</div>
      <div className="histogram-wrap">
      <div className="chart-summary-row">
        <PastelPill color={data.summary.pill.color} size="sm">{data.summary.pill.text}</PastelPill>
        <span className="chart-summary-text">{data.summary.text}</span>
      </div>
      <div className="histogram-bars">
        {data.bars.map((bar) => {
          const isMedian = bar.label === data.median
          const isP95 = bar.label === data.p95
          return (
            <div key={bar.label} className="histogram-col">
              <div className="histogram-bar-track">
                {isMedian && (
                  <div className="histogram-marker histogram-marker--median" title="Median" />
                )}
                {isP95 && (
                  <div className="histogram-marker histogram-marker--p95" title="p95" />
                )}
                <div
                  className="histogram-bar"
                  style={{
                    height: `${(bar.count / maxCount) * 100}%`,
                    background: isMedian
                      ? 'var(--chart-green)'
                      : isP95
                      ? 'var(--chart-orange)'
                      : 'var(--chart-purple)',
                    opacity: isMedian || isP95 ? 1 : 0.55,
                  }}
                />
              </div>
              <div className="histogram-label">{bar.label}</div>
            </div>
          )
        })}
      </div>
      <div className="histogram-legend">
        <span className="histogram-legend-item">
          <span className="histogram-legend-dot" style={{ background: 'var(--chart-green)' }} />
          Median: {data.median}
        </span>
        <span className="histogram-legend-item">
          <span className="histogram-legend-dot" style={{ background: 'var(--chart-orange)' }} />
          p95: {data.p95}
        </span>
      </div>
      </div>
    </div>
  )
}
