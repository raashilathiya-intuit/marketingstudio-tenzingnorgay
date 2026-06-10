import React, { useState } from 'react'
import './InsightsCard.css'

// ─── Static callouts ──────────────────────────────────────────────────────────

export const CALLOUTS = [
  {
    id: 's1',
    type: 'alert',
    typeLabel: 'Alert',
    anchor: 'ELM-8333',
    copy: 'ELM-8333 Treatment A click rate has been below the at-risk floor for 3 consecutive weeks.',
    shortCopy: 'Treatment A click rate below floor for 3 weeks',
    source: 'Eloqua',
    action: 'Review campaign',
    why: 'Threshold: 0.5% at-risk floor (CPTL benchmark 0.37%). Current: 0.31% — 38% below benchmark. Detected: 3 consecutive weekly measurements below threshold. Source: Eloqua delivery + click data, last refresh 4 min ago.',
    whyHref: '#',
  },
  {
    id: 's2',
    type: 'observation',
    typeLabel: 'Observation',
    anchor: 'billpay-gns',
    copy: 'Bill Pay GNS net-new subscriptions down 11% over 3 weeks — matches Q3 ESS fatigue pattern.',
    shortCopy: 'Net-new subscriptions down 11% over 3 weeks',
    source: 'QuickBase',
    action: 'See trends',
    why: 'Trend: 11% decline in net-new subscriptions over 3 weeks. Pattern match: similar to Q3 ESS campaign (Sep–Oct 2025) which exhibited identical decay shape before audience refresh. Source: QuickBase subscription ledger + historical campaign archive.',
    whyHref: '#',
  },
  {
    id: 's3',
    type: 'opportunity',
    typeLabel: 'Opportunity',
    anchor: 'ELM-8333',
    copy: 'ELM-8333 Treatment B is 2.4x above Capital cross-sell benchmark — eligible for budget reallocation.',
    shortCopy: 'Treatment B 2.4× above Capital cross-sell benchmark',
    source: 'IPD',
    action: 'Explore',
    why: 'Treatment B vs Capital cross-sell benchmark: 2.4x lift on application submits. Statistical significance: 100% probability (n=1,310 in treatment arm). Annualized impact projection: $1.6M. Source: IPD experiment ledger, treatment concluded Mar 31.',
    whyHref: '#',
  },
  {
    id: 's4',
    type: 'opportunity',
    typeLabel: 'Opportunity',
    anchor: 'capital',
    copy: 'Capital loan volume up 8% vs last week — above the 6% benchmark. ELM campaigns eligible for budget reallocation.',
    shortCopy: 'Loan volume up 8% vs last week, above benchmark',
    source: 'Eloqua',
    action: 'Explore reallocation',
    why: 'Capital loan volume trending 8% above last week and 6% above the quarterly growth benchmark. Three ELM campaign variants are driving above-average submit rates in the treatment arms. Budget reallocation from underperforming variants could amplify the current lift. Source: Capital reporting + Eloqua send data.',
    whyHref: '#',
  },
]

// ─── Cluster metadata (pre-written synthesized headlines + why explanations) ───

const CLUSTER_META = {
  'ELM-8333': {
    headline: 'ELM-8333 — Treatment A underperforming, Treatment B 2.4× above benchmark and ready to scale.',
    action: 'Review experiment',
  },
  'billpay-gns': {
    headline: 'Bill Pay GNS softening — net-new subscriptions down 11% over 3 weeks, matching Q3 ESS fatigue pattern.',
    action: 'See trends',
  },
  'capital': {
    headline: 'Capital pacing strong — loan volume up 8% vs last week, ELM campaigns eligible for budget reallocation.',
    action: 'Review campaigns',
  },
}

const CLUSTER_WHY = {
  'ELM-8333': 'Treatment A and Treatment B are variants of the same experiment (ELM-8333, started Mar 14). Treatment B has outperformed Treatment A on click rate every week for the past 3 weeks (3.2% vs 0.18% in week 3, statistically significant from day 14). The combined picture: Treatment A should be sunset and Treatment B promoted to evergreen — eligible for budget reallocation from underperforming variants. Source: IPD experiment ledger + Eloqua send data.',
  'billpay-gns': 'Net-new subscription decline and the Q3 ESS fatigue pattern share the same decay shape — both started 3 weeks after a high-volume send cadence, plateaued, then dropped. The combined picture: audience fatigue is the likely driver, not product or pricing. An audience refresh or suppression window should be evaluated. Source: QuickBase subscription ledger + historical campaign archive.',
  'capital': 'Loan volume growth and campaign performance are moving together — the 8% volume lift correlates with ELM open-rate improvements over the same period. The combined picture: Capital campaigns are punching above their budget allocation; reallocation from underperforming variants would likely compound the lift. Source: Capital reporting + Eloqua send data.',
}

const MAX_ROWS = 5

// ─── Icons ────────────────────────────────────────────────────────────────────

function AlertIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5L13 12.5H1L7 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 5.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.7" fill="currentColor" />
    </svg>
  )
}

function ObservationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 7C3 4.5 5 3 7 3s4 1.5 5.5 4c-1.5 2.5-3.5 4-5.5 4s-4-1.5-5.5-4z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function OpportunityIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 11.5V2.5M3.5 6L7 2.5 10.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TYPE_ICONS  = { alert: AlertIcon, observation: ObservationIcon, opportunity: OpportunityIcon }
const TYPE_LABELS = { alert: 'Alert',  observation: 'Observation',   opportunity: 'Opportunity'   }

// ─── Loading shimmer ──────────────────────────────────────────────────────────

function LoadingRow() {
  return (
    <div className="insights-loading-row">
      <div className="insights-loading-sparkle" aria-hidden="true" />
      <div className="insights-loading-text" aria-hidden="true" />
      <span className="sr-only">Generating summary…</span>
    </div>
  )
}

// ─── Clustering helpers ───────────────────────────────────────────────────────

function dominantType(signals) {
  if (signals.some((s) => s.type === 'alert')) return 'alert'
  if (signals.some((s) => s.type === 'observation')) return 'observation'
  return 'opportunity'
}

function sortPriority(item) {
  const types = item.isCluster ? item.signals.map((s) => s.type) : [item.signal.type]
  if (types.includes('alert')) return 0
  if (types.includes('observation')) return 1
  return 2
}

function buildClusters(callouts) {
  const anchorMap = new Map()
  for (const c of callouts) {
    const key = c.anchor ?? `__solo__${c.id}`
    if (!anchorMap.has(key)) anchorMap.set(key, [])
    anchorMap.get(key).push(c)
  }

  const clusters = []
  for (const [key, signals] of anchorMap.entries()) {
    if (signals.length >= 2 && !key.startsWith('__solo__')) {
      const anchor = signals[0].anchor
      clusters.push({
        isCluster: true,
        id: `cluster-${anchor}`,
        anchor,
        signals,
        dominant: dominantType(signals),
      })
    } else {
      clusters.push({ isCluster: false, id: signals[0].id, signal: signals[0] })
    }
  }

  clusters.sort((a, b) => sortPriority(a) - sortPriority(b))
  return clusters
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InsightsCard({ pushToast, dynamicCallouts = [], isLoading = false }) {
  const [dismissed, setDismissed] = useState(new Set())
  const [collapsing, setCollapsing] = useState(new Set())
  const [expandedWhyId, setExpandedWhyId] = useState(null)
  const [toggledClusters, setToggledClusters] = useState(new Set())

  const allCallouts = [...CALLOUTS, ...dynamicCallouts]
  const visible = allCallouts.filter((c) => !dismissed.has(c.id))
  const clusters = buildClusters(visible)
  const rows = clusters.slice(0, MAX_ROWS)
  const showOverflow = clusters.length > MAX_ROWS

  function animateDismiss(ids, toastLabel, snapshot) {
    setCollapsing((prev) => new Set([...prev, ...ids]))
    if (expandedWhyId && ids.includes(expandedWhyId)) setExpandedWhyId(null)
    setTimeout(() => {
      setDismissed((prev) => new Set([...prev, ...ids]))
      setCollapsing((prev) => {
        const n = new Set(prev)
        ids.forEach((id) => n.delete(id))
        return n
      })
    }, 200)
    if (pushToast) {
      pushToast(`Dismissed "${toastLabel}"`, () => {
        setDismissed(snapshot)
        setCollapsing(new Set())
      })
    }
  }

  function handleDismissSingle(signal) {
    animateDismiss([signal.id], signal.typeLabel, new Set(dismissed))
  }

  function handleDismissCluster(cluster) {
    const ids = [cluster.id, ...cluster.signals.map((s) => s.id)]
    const label = (CLUSTER_META[cluster.anchor]?.headline ?? cluster.anchor).slice(0, 32) + '…'
    animateDismiss(ids, label, new Set(dismissed))
  }

  function toggleWhy(id) {
    setExpandedWhyId((prev) => (prev === id ? null : id))
  }

  function toggleCluster(clusterId) {
    setToggledClusters((prev) => {
      const n = new Set(prev)
      n.has(clusterId) ? n.delete(clusterId) : n.add(clusterId)
      return n
    })
  }

  function isClusterOpen(cluster) {
    return toggledClusters.has(cluster.id)
  }

  return (
    <div className="insights-card-body">
      {isLoading && <LoadingRow />}

      {rows.length === 0 && !isLoading ? (
        <div className="insights-empty">
          No signals worth your attention right now — your portfolio is healthy.
        </div>
      ) : (
        rows.map((item) => {
          if (!item.isCluster) {
            // ── Single row ──────────────────────────────────────────────────
            const callout = item.signal
            const Icon = TYPE_ICONS[callout.type]
            const isCollapsing = collapsing.has(callout.id)
            const isExpanded = expandedWhyId === callout.id
            return (
              <div
                key={callout.id}
                className={`insights-row insights-row--${callout.type}${isCollapsing ? ' insights-row--collapsing' : ''}`}
              >
                <div
                  className="insights-row-main"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleWhy(callout.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleWhy(callout.id) } }}
                >
                  <div className="insights-row-type">
                    {Icon && <Icon />}
                    <span className="insights-row-type-label">{callout.typeLabel}</span>
                  </div>
                  <p className="insights-row-copy">{callout.copy}</p>
                  <span className="insights-row-source" onClick={(e) => e.stopPropagation()}>{callout.source}</span>
                  <button className="insights-row-action" onClick={(e) => e.stopPropagation()}>
                    {callout.action}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span
                    className={`insights-row-expander${isExpanded ? ' insights-row-expander--open' : ''}`}
                    aria-hidden="true"
                  >
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true">
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <button
                    className="insights-row-dismiss"
                    onClick={(e) => { e.stopPropagation(); handleDismissSingle(callout) }}
                    aria-label={`Dismiss ${callout.typeLabel}`}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <div className={`insights-why${isExpanded ? ' insights-why--open' : ''}`}>
                  <div className="insights-why-inner">
                    <div className="insights-why-eyebrow">Why this signal?</div>
                    <p className="insights-why-body">{callout.why}</p>
                    <a href={callout.whyHref} className="insights-why-link">View raw data &#x2197;</a>
                  </div>
                </div>
              </div>
            )
          }

          // ── Cluster row ───────────────────────────────────────────────────
          const { id, anchor, signals, dominant } = item
          const meta = CLUSTER_META[anchor] ?? { headline: anchor, action: 'Review' }
          const isCollapsing = collapsing.has(id)
          const isOpen = isClusterOpen(item)
          const sources = [...new Set(signals.map((s) => s.source))].join(' + ')
          const DominantIcon = TYPE_ICONS[dominant]

          return (
            <div
              key={id}
              className={`insights-row insights-row--cluster insights-row--${dominant}${isCollapsing ? ' insights-row--collapsing' : ''}`}
            >
              <div
                className="insights-row-main insights-cluster-main"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggleCluster(id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCluster(id) } }}
              >
                <div className="insights-row-type">
                  {DominantIcon && <DominantIcon />}
                  <span className="insights-row-type-label">
                    {TYPE_LABELS[dominant]}
                    <span className="insights-cluster-count">+{signals.length - 1}</span>
                  </span>
                </div>
                <div className="insights-cluster-body">
                  <p className="insights-row-copy insights-cluster-headline">{meta.headline}</p>
                  <div className={`insights-signal-pills${isOpen ? ' insights-signal-pills--open' : ''}`}>
                    {signals.map((s) => {
                      const PillIcon = TYPE_ICONS[s.type]
                      return (
                        <div key={s.id} className={`insights-signal-pill insights-signal-pill--${s.type}`}>
                          {PillIcon && <PillIcon />}
                          <span className="insights-signal-pill-label">{s.typeLabel}</span>
                          <span className="insights-signal-pill-text">{s.shortCopy || s.copy}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <span className="insights-row-source" onClick={(e) => e.stopPropagation()}>{sources}</span>
                <button className="insights-row-action" onClick={(e) => e.stopPropagation()}>
                  {meta.action}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span
                  className={`insights-row-expander${isOpen ? ' insights-row-expander--open' : ''}`}
                  aria-hidden="true"
                >
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true">
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <button
                  className="insights-row-dismiss"
                  onClick={(e) => { e.stopPropagation(); handleDismissCluster(item) }}
                  aria-label="Dismiss cluster"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {CLUSTER_WHY[anchor] && (
                <div className={`insights-why insights-why--cluster${isOpen ? ' insights-why--open' : ''}`}>
                  <div className="insights-why-inner">
                    <div className="insights-why-eyebrow">Why this signal?</div>
                    <p className="insights-why-body">{CLUSTER_WHY[anchor]}</p>
                    <a href="#" className="insights-why-link">View raw data &#x2197;</a>
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}

      {showOverflow && (
        <div className="insights-footer">
          <button className="insights-footer-link">
            View all ({visible.length})
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
