import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Sparkline from '../Sparkline'
import ComparisonLine from '../ComparisonLine'
import AskAiPill from '../AskAiPill'
import './widgets.css'

// ─── Position computation ─────────────────────────────────────────────────────

const POP_W = 300
const GAP = 12
const POP_H_EST = 220 // used only for vertical clamping

function computePosition(rect) {
  const spaceRight = window.innerWidth - rect.right - GAP
  const spaceLeft = rect.left - GAP

  let placement = 'right'
  if (spaceRight < POP_W && spaceLeft >= POP_W) placement = 'left'
  else if (spaceRight < POP_W && spaceLeft < POP_W) placement = 'below'

  const centerY = rect.top + rect.height / 2
  const clampedTop = Math.max(8, Math.min(window.innerHeight - POP_H_EST - 8, centerY - POP_H_EST / 2))

  if (placement === 'right') {
    return { placement, style: { left: rect.right + GAP, top: clampedTop, width: POP_W } }
  }
  if (placement === 'left') {
    return { placement, style: { left: rect.left - GAP - POP_W, top: clampedTop, width: POP_W } }
  }
  return { placement: 'below', style: { left: rect.left, top: rect.bottom + GAP, width: POP_W } }
}

// ─── Popover ──────────────────────────────────────────────────────────────────

function BuMetricsPopover({ data, position, visible, onMouseEnter, onMouseLeave }) {
  return createPortal(
    <div
      className={`bu-popover bu-popover--${position.placement}${visible ? ' bu-popover--visible' : ''}`}
      style={{ position: 'fixed', zIndex: 1000, ...position.style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="bu-popover-arrow" aria-hidden="true" />
      {data.summary && (
        <div className="bu-popover-summary">
          <div className="bu-popover-summary-eyebrow">Summary</div>
          <p className="bu-popover-summary-body">{data.summary}</p>
        </div>
      )}
      <div className="bu-popover-eyebrow">Breakdown</div>
      <div className="bu-popover-metric-list">
        {data.metrics.map((m) => (
          <div key={m.label} className="bu-popover-metric-row">
            <span className="bu-popover-metric-label">{m.label}</span>
            <div className="bu-popover-metric-right">
              <span className="bu-popover-metric-value tnum">{m.value}</span>
              {m.delta && (
                <span className={`bu-popover-metric-delta bu-metric-delta--${m.deltaDir}`}>{m.delta}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {data.action && (
        <div className="bu-popover-footer">
          <AskAiPill metricName={data.primaryLabel} />
          <button className="bu-popover-drill">{data.action.label}</button>
        </div>
      )}
    </div>,
    document.body
  )
}

// ─── BuCard ───────────────────────────────────────────────────────────────────

export default function BuCard({ data, sparklineColor, inFavourite }) {
  const cardRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState(null)
  const enterTimer = useRef(null)
  const leaveTimer = useRef(null)

  // Close on scroll so popover doesn't float over wrong position
  useEffect(() => {
    if (!mounted) return
    function onScroll() { closePopover() }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [mounted])

  function openPopover() {
    clearTimeout(leaveTimer.current)
    clearTimeout(enterTimer.current)
    enterTimer.current = setTimeout(() => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      setPosition(computePosition(rect))
      setMounted(true)
      // Double rAF ensures DOM is painted before opacity transition starts
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    }, 150)
  }

  function closePopover() {
    clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setMounted(false), 120)
    }, 100)
  }

  return (
    <>
      <div
        ref={cardRef}
        className="bu-card"
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
      >
        {!inFavourite && <span className="bu-card-tag">{data.tag}</span>}
        <div className="bu-primary-value tnum">{data.primaryValue}</div>
        <div className="bu-primary-label">{data.primaryLabel}</div>
        <ComparisonLine text={data.comparison} />
        <div className="sparkline-band">
          <Sparkline data={data.sparkline} color={sparklineColor} fluid height={48} showArea />
        </div>
      </div>

      {mounted && position && (
        <BuMetricsPopover
          data={data}
          position={position}
          visible={visible}
          onMouseEnter={() => { clearTimeout(leaveTimer.current); clearTimeout(enterTimer.current) }}
          onMouseLeave={closePopover}
        />
      )}
    </>
  )
}
