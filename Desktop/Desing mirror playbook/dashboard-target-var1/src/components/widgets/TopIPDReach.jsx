import React from 'react'
import PastelPill from '../PastelPill'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

function formatReach(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K'
  return n.toString()
}

export default function TopIPDReach() {
  const data = WIDGET_DATA['ipd-top-reach']
  return (
    <div>
      <div className="widget-metric-value tnum">{data.value}</div>
      <div className="widget-metric-label">{data.valueLabel}</div>
      <div className="chart-summary-row">
        <PastelPill color={data.summary.pill.color} size="sm">{data.summary.pill.text}</PastelPill>
        <span className="chart-summary-text">{data.summary.text}</span>
      </div>
      <div className="ranked-list">
        {data.items.map((item, i) => (
          <div key={item.id} className="ranked-row">
            <div className="ranked-rank">{i + 1}</div>
            <div className="ranked-info">
              <div className="ranked-name">{item.name}</div>
              <div className="ranked-bar-wrap">
                <div
                  className="ranked-bar"
                  style={{
                    width: `${(item.reach / item.max) * 100}%`,
                    background: 'var(--chart-green)',
                  }}
                />
              </div>
            </div>
            <div className="ranked-value tnum">{formatReach(item.reach)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
