import React from 'react'
import Sparkline from '../Sparkline'
import ComparisonLine from '../ComparisonLine'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

export default function AutoPublishIncidents() {
  const data = WIDGET_DATA['promote-auto-publish-incidents']
  const isClear = data.value === 0

  return (
    <div className="guardrail-body">
      <div className={`guardrail-value tnum ${isClear ? 'guardrail-value--clear' : 'guardrail-value--critical'}`}>
        {data.value}
      </div>
      <div className={`guardrail-status ${isClear ? 'guardrail-status--clear' : 'guardrail-status--critical'}`}>
        {isClear ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Clear — system working correctly
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1L13 12H1L7 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M7 5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="7" cy="10" r="0.6" fill="currentColor" />
            </svg>
            {data.value} incident{data.value !== 1 ? 's' : ''} — investigate now
          </>
        )}
      </div>
      <ComparisonLine text={data.comparison} />
      <div className="sparkline-band">
        <Sparkline data={data.sparkline} color="var(--chart-green)" fluid height={56} />
      </div>
    </div>
  )
}
