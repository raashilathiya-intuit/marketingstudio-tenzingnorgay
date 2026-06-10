import React from 'react'
import Sparkline from '../Sparkline'
import ComparisonLine from '../ComparisonLine'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

export default function ValThroughput() {
  const data = WIDGET_DATA['val-throughput']
  return (
    <div className="kpi-widget">
      <div className="kpi-widget-value tnum">{data.value}</div>
      <div className="kpi-widget-label">{data.valueLabel}</div>
      <ComparisonLine text={data.comparison} />
      <div className="sparkline-band">
        <Sparkline data={data.sparkline} color="var(--chart-green)" fluid height={56} />
      </div>
    </div>
  )
}
