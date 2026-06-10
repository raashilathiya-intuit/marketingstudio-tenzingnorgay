import React from 'react'
import PastelPill from '../PastelPill'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

const TREND_ICONS = {
  up: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 1l3 4H2l3-4Z" fill="currentColor" />
    </svg>
  ),
  down: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 9L2 5h6L5 9Z" fill="currentColor" />
    </svg>
  ),
  stable: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

export default function TopFailureModes() {
  const data = WIDGET_DATA['val-top-failure-modes']
  return (
    <div>
      <div className="widget-metric-value tnum">{data.value}</div>
      <div className="widget-metric-label">{data.valueLabel}</div>
      <div className="chart-summary-row">
        <PastelPill color={data.summary.pill.color} size="sm">{data.summary.pill.text}</PastelPill>
        <span className="chart-summary-text">{data.summary.text}</span>
      </div>
      <div className="failure-list">
        {data.items.map((item, i) => (
          <div key={i} className="failure-row">
            <div className="failure-name">{item.name}</div>
            <div className="failure-right">
              <span className="failure-count tnum">{item.count}</span>
              <PastelPill color={item.trendColor} size="sm">
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {TREND_ICONS[item.trend]}
                </span>
              </PastelPill>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
