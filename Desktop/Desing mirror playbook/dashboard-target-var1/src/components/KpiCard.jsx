import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './KpiCard.css'
import PastelPill from './PastelPill'
import Sparkline from './Sparkline'
import DotMenu from './DotMenu'
import AskAiPill from './AskAiPill'

// ─── Popover position ────────────────────────────────────────────────────────

const POP_W = 300
const GAP = 12
const POP_H_EST = 230

function computePopoverPosition(rect) {
  const spaceRight = window.innerWidth - rect.right - GAP
  const spaceLeft = rect.left - GAP

  let placement = 'right'
  if (spaceRight < POP_W && spaceLeft >= POP_W) placement = 'left'
  else if (spaceRight < POP_W && spaceLeft < POP_W) placement = 'below'

  const centerY = rect.top + rect.height / 2
  const clampedTop = Math.max(8, Math.min(window.innerHeight - POP_H_EST - 8, centerY - POP_H_EST / 2))

  if (placement === 'right') return { placement, style: { left: rect.right + GAP, top: clampedTop, width: POP_W } }
  if (placement === 'left') return { placement, style: { left: rect.left - GAP - POP_W, top: clampedTop, width: POP_W } }
  return { placement: 'below', style: { left: rect.left, top: rect.bottom + GAP, width: POP_W } }
}

// ─── KPI popover (portal) ─────────────────────────────────────────────────────

function KpiPopover({ label, popover, position, visible, onMouseEnter, onMouseLeave, onDrilldown }) {
  return createPortal(
    <div
      className={`bu-popover bu-popover--${position.placement}${visible ? ' bu-popover--visible' : ''}`}
      style={{ position: 'fixed', zIndex: 1000, ...position.style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="bu-popover-arrow" aria-hidden="true" />
      <div className="bu-popover-summary">
        <div className="bu-popover-summary-eyebrow">Summary</div>
        <p className="bu-popover-summary-body">{popover.summary}</p>
      </div>
      <div className="bu-popover-eyebrow">Breakdown</div>
      <div className="bu-popover-metric-list">
        {popover.metrics.map((m) => (
          <div key={m.label} className="bu-popover-metric-row">
            <span className="bu-popover-metric-label">{m.label}</span>
            <div className="bu-popover-metric-right">
              <span className="bu-popover-metric-value tnum">{m.value}</span>
              {m.delta && <span className="bu-popover-metric-delta">{m.delta}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="bu-popover-footer">
        <AskAiPill metricName={label} />
        <button className="bu-popover-drill" onClick={onDrilldown}>{popover.actionLabel}</button>
      </div>
    </div>,
    document.body
  )
}

function StalenessDot({ state = 'fresh' }) {
  if (state === 'fresh') return null
  return <span className={`staleness-dot staleness-dot--${state}`} aria-hidden="true" />
}

function stalenessLabel(staleness) {
  if (staleness.state === 'stale') return `Stale · ${staleness.ago} ago`
  if (staleness.state === 'error') return `Sync failed · ${staleness.ago} ago`
  return `${staleness.ago} ago`
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function KpiCard({
  label, value, pill, sparkline, sparklineColor, sparklineLabel,
  progressValue, progressMax, progressColor, progressLabel, progressLabelStrong,
  staleness, action,
  descriptor, descriptorSuffix, descriptorSuffixAtRisk,
  tooltip,
  popover,
  vizKey,
  onEdit, onDuplicate, onRemove,
  isFavourite, onRemoveFromFavourite, onRestore,
  onDrilldown,
}) {
  const hasLowerArea = sparkline?.length > 0 || progressValue != null || descriptor
  const sparklineIsDown = sparkline?.length > 1 && sparkline[sparkline.length - 1] < sparkline[0]
  // If sparklineColor is explicitly set, it wins — allows "lower is better" metrics to stay green
  const derivedSparklineColor = sparklineIsDown ? 'var(--pill-pink-ink)' : (sparklineColor || 'var(--chart-green)')

  const cardRef = useRef(null)
  const [popMounted, setPopMounted] = useState(false)
  const [popVisible, setPopVisible] = useState(false)
  const [popPosition, setPopPosition] = useState(null)
  const enterTimer = useRef(null)
  const leaveTimer = useRef(null)

  useEffect(() => {
    if (!popMounted) return
    function onScroll() { closePopover() }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [popMounted])

  function openPopover() {
    if (!popover) return
    clearTimeout(leaveTimer.current)
    clearTimeout(enterTimer.current)
    enterTimer.current = setTimeout(() => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      setPopPosition(computePopoverPosition(rect))
      setPopMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setPopVisible(true)))
    }, 150)
  }

  function closePopover() {
    clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => {
      setPopVisible(false)
      setTimeout(() => setPopMounted(false), 120)
    }, 100)
  }

  return (
    <>
    <div className="kpi-card" ref={cardRef} onMouseEnter={openPopover} onMouseLeave={closePopover}>
      <div className="kpi-header-row">
<div className="kpi-label">
          <span className="kpi-label-text">{label}</span>
          {tooltip && (
            <span className="kpi-info-wrap" tabIndex={0} aria-label={`${label}: ${tooltip.description}`}>
              <svg className="kpi-info-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 7v4.5M8 5.25v.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <div className="kpi-tooltip" role="tooltip">
                {tooltip.description}
                {tooltip.formula && <div className="kpi-tooltip-formula">{tooltip.formula}</div>}
              </div>
            </span>
          )}
        </div>
        <DotMenu
          cardName={label}
          hideResize
          onEdit={onEdit ?? (() => console.log(`Edit: ${label}`))}
          onDuplicate={onDuplicate ?? (() => console.log(`Duplicate: ${label}`))}
          onRemove={onRemove ?? (() => console.log(`Remove: ${label}`))}
          isFavourite={isFavourite}
          onRemoveFromFavourite={onRemoveFromFavourite}
          onRestore={onRestore}
        />
      </div>
      <div className="kpi-value tnum">{value}</div>
      {pill && (
        <div className="kpi-pill-row">
          <PastelPill color={sparklineIsDown ? 'pink' : pill.color}>{pill.text}</PastelPill>
        </div>
      )}

      {hasLowerArea && (
        <div key={vizKey} className="kpi-lower-area">
          {sparkline?.length > 0 && (
            <div className="kpi-sparkline-band">
              <Sparkline
                data={sparkline}
                color={derivedSparklineColor}
                fluid
                height={44}
                showArea
              />
            </div>
          )}

          {progressValue != null && progressMax != null && (
            <div className="kpi-progress-wrap">
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{
                    width: `${Math.min(100, (progressValue / progressMax) * 100)}%`,
                    background: progressColor || 'var(--primary)',
                  }}
                />
              </div>
              {progressLabel && (
                <div className="kpi-progress-label">
                  {progressLabel}
                  {progressLabelStrong && <strong>{progressLabelStrong}</strong>}
                </div>
              )}
            </div>
          )}

          {descriptor && !sparkline?.length && progressValue == null && (
            <div className="kpi-descriptor">
              {descriptor}
              {descriptorSuffix && (
                <span className={descriptorSuffixAtRisk ? 'kpi-descriptor--at-risk' : ''}>
                  {descriptorSuffix}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {(staleness || action || sparklineLabel) && (
        <div className="kpi-footer">
          {staleness ? (
            <div className="kpi-staleness">
              <StalenessDot state={staleness.state} />
              <span className="kpi-ago">{stalenessLabel(staleness)}</span>
            </div>
          ) : sparklineLabel ? (
            <div className="kpi-sparkline-label">{sparklineLabel}</div>
          ) : null}
          {action && (
            <button className="kpi-action" onClick={onDrilldown}>{action.label}<ChevronRight /></button>
          )}
        </div>
      )}
    </div>
    {popMounted && popPosition && (
      <KpiPopover
        label={label}
        popover={popover}
        position={popPosition}
        visible={popVisible}
        onMouseEnter={() => { clearTimeout(leaveTimer.current); clearTimeout(enterTimer.current) }}
        onMouseLeave={closePopover}
        onDrilldown={onDrilldown}
      />
    )}
    </>
  )
}
