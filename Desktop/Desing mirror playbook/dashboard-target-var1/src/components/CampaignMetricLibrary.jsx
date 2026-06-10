import React, { useState, useEffect, useRef } from 'react'
import './CardLibrary.css'
import './CampaignMetricLibrary.css'

// ─── Metric sections data ─────────────────────────────────────────────────────

export const CAMPAIGN_METRIC_SECTIONS = [
  {
    id: 'conversion',
    label: 'Conversion',
    metrics: [
      {
        id: 'camp-conv-rate',
        label: 'Conversion rate',
        description: 'Percentage of reached users who completed a desired action.',
        sparkline: [1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
        value: '2.6%',
        pill: { color: 'mint', text: '↑ 0.4% vs last month' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View report' },
        popover: {
          summary: 'Percentage of reached users who completed the primary campaign goal (purchase, sign-up, or upgrade) within the attribution window.',
          metrics: [
            { label: 'Email conversions', value: '1.8%',  delta: '↑ 0.3%' },
            { label: 'IPD conversions',   value: '3.9%',  delta: '↑ 0.6%' },
            { label: 'Push conversions',  value: '1.2%',  delta: '↑ 0.1%' },
          ],
          actionLabel: 'View conversion report',
        },
      },
      {
        id: 'camp-conv-revenue',
        label: 'Revenue attributed',
        description: 'Total revenue directly attributed to active campaigns.',
        sparkline: [1.1, 1.2, 1.3, 1.35, 1.4, 1.5, 1.55, 1.6],
        value: '$1.6M',
        pill: { color: 'mint', text: '↑ 18% vs last month' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View breakdown' },
        popover: {
          summary: 'Total revenue directly attributed to campaign interactions using last-touch attribution within a 7-day window.',
          metrics: [
            { label: 'QBO campaigns',     value: '$820K', delta: '↑ 21%' },
            { label: 'Payroll campaigns', value: '$480K', delta: '↑ 14%' },
            { label: 'Capital campaigns', value: '$300K', delta: '↑ 12%' },
          ],
          actionLabel: 'View revenue breakdown',
        },
      },
      {
        id: 'camp-conv-cost-per-conv',
        label: 'Cost per conversion',
        description: 'Average spend to generate a single conversion event.',
        sparkline: [24, 23, 22, 21, 20, 19, 18.5, 18],
        value: '$18',
        pill: { color: 'mint', text: '↓ $6 improved' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View details' },
        popover: {
          summary: 'Average cost to generate one conversion, calculated as total campaign spend divided by total conversions in the period.',
          metrics: [
            { label: 'Email CPC',  value: '$12', delta: '↓ $4 improved' },
            { label: 'IPD CPC',    value: '$9',  delta: '↓ $3 improved' },
            { label: 'Push CPC',   value: '$22', delta: '↓ $2 improved' },
          ],
          actionLabel: 'View cost analysis',
        },
      },
      {
        id: 'camp-conv-ltv',
        label: 'Attributed LTV uplift',
        description: 'Estimated increase in customer lifetime value from campaigns.',
        sparkline: [40, 42, 44, 46, 48, 50, 52, 54],
        value: '+$54',
        pill: { color: 'mint', text: '↑ $14 vs last month' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View analysis' },
        popover: {
          summary: 'Estimated average lifetime value uplift for customers who converted via campaign, compared to similar non-exposed customers.',
          metrics: [
            { label: 'QBO segment',      value: '+$72', delta: 'Highest uplift' },
            { label: 'Payroll segment',  value: '+$48', delta: '↑ $10' },
            { label: 'Capital segment',  value: '+$38', delta: '↑ $6' },
          ],
          actionLabel: 'View LTV report',
        },
      },
    ],
  },
  {
    id: 'experiment-incrementality',
    label: 'Experiment / Incrementality',
    metrics: [
      {
        id: 'camp-exp-lift',
        label: 'Incremental lift',
        description: 'Incremental conversion lift vs. unexposed holdout group.',
        sparkline: [4.2, 4.5, 4.8, 5.0, 5.1, 5.3, 5.5, 5.7],
        value: '5.7%',
        pill: { color: 'mint', text: '↑ 1.5 pts vs last month' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View experiments' },
        popover: {
          summary: 'Percentage point lift in conversion rate between the campaign-exposed group and the unexposed holdout control group.',
          metrics: [
            { label: 'Exposed conversion',  value: '9.3%',  delta: '' },
            { label: 'Control conversion',  value: '3.6%',  delta: '' },
            { label: 'Incremental lift',    value: '+5.7%', delta: 'Statistically significant' },
          ],
          actionLabel: 'View experiment details',
        },
      },
      {
        id: 'camp-exp-significance',
        label: 'Experiments near significance',
        description: 'Count of A/B experiments within 5% of statistical significance.',
        sparkline: [1, 1, 2, 2, 2, 3, 3, 3],
        value: '3',
        pill: { color: 'lavender', text: 'of 7 active experiments' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View experiments' },
        popover: {
          summary: '3 of 7 currently running experiments are within 5 percentage points of their minimum detectable effect threshold.',
          metrics: [
            { label: 'Near significance', value: '3', delta: '≥85% confidence' },
            { label: 'Early stage',       value: '2', delta: '<50% confidence' },
            { label: 'Concluded',         value: '2', delta: 'This period' },
          ],
          actionLabel: 'View all experiments',
        },
      },
      {
        id: 'camp-exp-holdout-rate',
        label: 'Holdout rate',
        description: 'Percentage of audience held out for control measurement.',
        sparkline: [10, 10, 10, 10, 10, 10, 10, 10],
        value: '10%',
        pill: { color: 'lavender', text: 'Standard holdout' },
        sparklineLabel: 'Configured holdout',
        action: { label: 'View config' },
        popover: {
          summary: 'Proportion of the eligible audience withheld from campaign exposure to serve as a measurement control group.',
          metrics: [
            { label: 'Holdout users', value: '160K', delta: '10% of eligible' },
            { label: 'Exposed users', value: '1.44M', delta: '90% of eligible' },
            { label: 'Min detectable effect', value: '0.5%', delta: 'At 80% power' },
          ],
          actionLabel: 'Edit holdout config',
        },
      },
      {
        id: 'camp-exp-winner-rate',
        label: 'Experiment winner rate',
        description: 'Share of concluded experiments with a statistically significant winner.',
        sparkline: [55, 58, 60, 62, 63, 65, 66, 68],
        value: '68%',
        pill: { color: 'mint', text: '↑ 8 pts this quarter' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View results' },
        popover: {
          summary: 'Share of concluded experiments where a treatment variant outperformed control at ≥95% statistical confidence.',
          metrics: [
            { label: 'Won (clear winner)', value: '17', delta: '68%' },
            { label: 'Inconclusive',       value: '6',  delta: '24%' },
            { label: 'Lost (control won)', value: '2',  delta: '8%' },
          ],
          actionLabel: 'View experiment history',
        },
      },
    ],
  },
  {
    id: 'health-operational',
    label: 'Health / Operational signals',
    metrics: [
      {
        id: 'camp-health-spam-rate',
        label: 'Spam complaint rate',
        description: 'Emails marked as spam. Keep below 0.1% to protect sender reputation.',
        sparkline: [0.08, 0.08, 0.09, 0.08, 0.08, 0.07, 0.07, 0.06],
        value: '0.06%',
        pill: { color: 'mint', text: '↓ 0.02% improved' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View report' },
        popover: {
          summary: 'Percentage of delivered emails reported as spam. Industry threshold is 0.1% — consistently above this risks inbox delivery.',
          metrics: [
            { label: 'Current rate',      value: '0.06%',  delta: 'Well below threshold' },
            { label: 'Google threshold',  value: '0.10%',  delta: 'Regulatory limit' },
            { label: 'Highest campaign',  value: '0.09%',  delta: 'Enterprise renewal' },
          ],
          actionLabel: 'View spam detail',
        },
      },
      {
        id: 'camp-health-list-growth',
        label: 'List growth rate',
        description: 'Net growth in the active send list after removals.',
        sparkline: [0.8, 0.9, 1.0, 1.1, 1.1, 1.2, 1.3, 1.4],
        value: '1.4%',
        pill: { color: 'mint', text: '↑ 0.3% vs last month' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View list' },
        popover: {
          summary: 'Net monthly growth in the active addressable list, calculated as (new subscribers − unsubscribes − hard bounces) / previous total.',
          metrics: [
            { label: 'New subscribers',   value: '+28K', delta: 'This month' },
            { label: 'Unsubscribes',      value: '−6K',  delta: 'This month' },
            { label: 'Hard bounces removed', value: '−2K', delta: 'This month' },
          ],
          actionLabel: 'View list health',
        },
      },
      {
        id: 'camp-health-send-errors',
        label: 'Send error rate',
        description: 'Failed sends due to infrastructure, throttling, or data issues.',
        sparkline: [0.4, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.2],
        value: '0.2%',
        pill: { color: 'mint', text: '↓ 0.2% improved' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View errors' },
        popover: {
          summary: 'Percentage of attempted sends that could not be delivered due to sending infrastructure errors, throttling, or data quality issues.',
          metrics: [
            { label: 'Throttle errors',  value: '0.1%', delta: '↓ 0.1% improved' },
            { label: 'Data errors',      value: '0.05%', delta: 'Stable' },
            { label: 'System errors',    value: '0.05%', delta: '↓ 0.05% improved' },
          ],
          actionLabel: 'View error log',
        },
      },
      {
        id: 'camp-health-suppression-rate',
        label: 'Suppression rate',
        description: 'Audience suppressed due to fatigue rules, opt-outs, or compliance.',
        sparkline: [12, 12, 13, 13, 14, 14, 13, 14],
        value: '14%',
        pill: { color: 'lavender', text: 'Within normal range' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View details' },
        popover: {
          summary: 'Share of eligible audience removed from sends by active suppression rules.',
          metrics: [
            { label: 'Fatigue suppressed',    value: '8%',  delta: 'Frequency cap' },
            { label: 'Compliance suppressed', value: '4%',  delta: 'Opt-outs + CCPA' },
            { label: 'Manual suppressed',     value: '2%',  delta: 'Ops holds' },
          ],
          actionLabel: 'View suppression rules',
        },
      },
    ],
  },
  {
    id: 'benchmark-context',
    label: 'Benchmark context',
    metrics: [
      {
        id: 'camp-bench-open-vs-industry',
        label: 'Open rate vs industry',
        description: 'Your open rate vs. financial services industry average.',
        sparkline: [5.2, 5.8, 6.2, 6.5, 6.8, 7.0, 7.1, 7.3],
        value: '+7.3 pts',
        pill: { color: 'mint', text: 'Above industry avg' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View benchmark' },
        popover: {
          summary: 'Your average open rate versus the Litmus financial services industry benchmark, updated quarterly.',
          metrics: [
            { label: 'Your open rate',        value: '31.4%', delta: '' },
            { label: 'Industry avg',          value: '24.1%', delta: 'Fin services' },
            { label: 'Outperformance margin', value: '+7.3 pts', delta: 'Consistent 8 weeks' },
          ],
          actionLabel: 'View benchmark report',
        },
      },
      {
        id: 'camp-bench-ctr-vs-industry',
        label: 'CTR vs industry',
        description: 'Click-through rate vs. financial services peers.',
        sparkline: [0.5, 0.8, 0.9, 1.1, 1.2, 1.3, 1.4, 1.5],
        value: '+1.5 pts',
        pill: { color: 'mint', text: 'Above industry avg' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View benchmark' },
        popover: {
          summary: 'Your click-through rate versus the financial services industry benchmark for email campaigns.',
          metrics: [
            { label: 'Your CTR',              value: '3.8%', delta: '' },
            { label: 'Industry avg CTR',      value: '2.3%', delta: 'Fin services' },
            { label: 'Outperformance margin', value: '+1.5 pts', delta: '8-week trend' },
          ],
          actionLabel: 'View CTR benchmark',
        },
      },
      {
        id: 'camp-bench-deliverability-vs-industry',
        label: 'Deliverability vs peers',
        description: 'Deliverability rate vs. SaaS peers in your revenue tier.',
        sparkline: [0.8, 0.9, 1.0, 1.1, 1.1, 1.2, 1.2, 1.3],
        value: '+1.3 pts',
        pill: { color: 'mint', text: 'Above peer avg' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View benchmark' },
        popover: {
          summary: 'Your deliverability rate compared to peer SaaS companies in the $1B+ ARR tier.',
          metrics: [
            { label: 'Your rate',    value: '97.4%', delta: '' },
            { label: 'Peer avg',     value: '96.1%', delta: 'SaaS $1B+ ARR' },
            { label: 'Top quartile', value: '98.2%', delta: 'Target range' },
          ],
          actionLabel: 'View deliverability benchmark',
        },
      },
      {
        id: 'camp-bench-revenue-per-email',
        label: 'Revenue per email sent',
        description: 'Total attributed revenue ÷ emails sent — a combined efficiency signal.',
        sparkline: [0.08, 0.09, 0.10, 0.11, 0.11, 0.12, 0.13, 0.14],
        value: '$0.14',
        pill: { color: 'mint', text: '↑ $0.06 vs last month' },
        sparklineLabel: 'Last 8 weeks',
        action: { label: 'View analysis' },
        popover: {
          summary: 'Total attributed revenue divided by total emails sent. Combines deliverability, engagement, and conversion into a single efficiency signal.',
          metrics: [
            { label: 'Total revenue',   value: '$1.6M', delta: '' },
            { label: 'Emails sent',     value: '11.4M', delta: '' },
            { label: 'Revenue / email', value: '$0.14', delta: '↑ $0.06 vs last month' },
          ],
          actionLabel: 'View revenue analysis',
        },
      },
    ],
  },
]

// ─── Mini sparkline preview (neutral grey) ───────────────────────────────────

const GREY = '#C7C7CC'

function MetricTilePreview({ metric }) {
  const data = metric.sparkline
  if (!data || data.length < 2) {
    return (
      <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
        <text x="8" y="32" fontSize="22" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">
          {metric.value}
        </text>
      </svg>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const X0 = 6, X1 = 194, Y0 = 12, Y1 = 66
  const xStep = (X1 - X0) / (data.length - 1)

  const pts = data.map((v, i) => {
    const x = X0 + i * xStep
    const y = Y1 - ((v - min) / range) * (Y1 - Y0)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const linePath = pts.join(' ')
  const areaPath = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(' ')} L${X1},${Y1} L${X0},${Y1} Z`

  // Delta pill text (short)
  const pillText = metric.pill?.text || ''
  const shortPill = pillText.length > 22 ? pillText.slice(0, 21) + '…' : pillText

  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      {/* Value */}
      <text x="8" y="24" fontSize="20" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">
        {metric.value}
      </text>
      {/* Delta */}
      {shortPill && (
        <text x="8" y="37" fontSize="8.5" fill={GREY} fontFamily="inherit">
          {shortPill}
        </text>
      )}
      {/* Area fill */}
      <path d={areaPath} fill={GREY} fillOpacity="0.18" />
      {/* Line */}
      <polyline points={linePath} stroke={GREY} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// ─── Metric tile (wgt-tile pattern) ──────────────────────────────────────────

function MetricTile({ metric, sectionId, isAdded, onAdd }) {
  return (
    <div className={`wgt-tile${isAdded ? ' wgt-tile--added' : ''}`}>
      {isAdded && (
        <div className="wgt-tile-added-badge" aria-label="Already added">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Added
        </div>
      )}
      <div className="wgt-tile-preview">
        <MetricTilePreview metric={metric} />
      </div>
      <div className="wgt-tile-body">
        <div className="wgt-tile-name-row">
          <span className="wgt-tile-name">{metric.label}</span>
        </div>
        <div className="wgt-tile-desc">{metric.description}</div>
      </div>
      {!isAdded && (
        <button className="wgt-tile-add-btn" onClick={() => onAdd(sectionId, metric)}>
          + Add
        </button>
      )}
    </div>
  )
}

// ─── CampaignMetricLibrary component ─────────────────────────────────────────

export default function CampaignMetricLibrary({ open, onClose, addedIds, onAdd }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const filtered = search.trim()
    ? CAMPAIGN_METRIC_SECTIONS.map(section => ({
        ...section,
        metrics: section.metrics.filter(m =>
          m.label.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(s => s.metrics.length > 0)
    : CAMPAIGN_METRIC_SECTIONS

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="lib-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Drawer — full width like widget library */}
      <aside className="lib-drawer" role="dialog" aria-label="Add metrics" aria-modal="true">

        {/* Header */}
        <div className="lib-header camp-lib-header">
          <div className="camp-lib-header-row">
            <h2 className="lib-title">Add metrics</h2>
            <button className="lib-close-btn" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="camp-lib-subtitle">Add additional metric sections to the Campaigns overview tab.</p>
        </div>

        {/* Search */}
        <div className="lib-search-wrap">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="var(--ink-3)" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="lib-search"
            type="text"
            placeholder="Search metrics…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search metrics"
          />
          {search && (
            <button className="lib-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Gallery — 3-column tile grid per section */}
        <div className="lib-gallery">
          {filtered.length === 0 ? (
            <div className="lib-empty">
              <p>No metrics match "{search}"</p>
            </div>
          ) : filtered.map(section => (
            <div key={section.id} className="lib-section">
              <div className="lib-section-header">{section.label}</div>
              <div className="lib-tile-grid">
                {section.metrics.map(metric => (
                  <MetricTile
                    key={metric.id}
                    metric={metric}
                    sectionId={section.id}
                    isAdded={addedIds.has(metric.id)}
                    onAdd={onAdd}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="lib-footer">
          Can't find what you need?
          <button className="lib-request-link">
            Request a metric
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}
