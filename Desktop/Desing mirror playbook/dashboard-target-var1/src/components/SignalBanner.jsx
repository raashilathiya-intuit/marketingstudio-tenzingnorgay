import React, { useState } from 'react'
import './SignalBanner.css'
import { SIGNALS } from '../data/mock'

// ─── Per-type icons ───────────────────────────────────────────────────────────

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

function ObservationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function OpportunityIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1l1.6 4.8H14l-3.9 2.9 1.5 4.8L8 10.7l-3.6 2.8 1.5-4.8L2 5.8h4.4L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

const TYPE_CONFIG = {
  alert:       { Icon: AlertIcon,       bgVar: '--pill-peach-bg',    inkVar: '--pill-peach-ink',    borderColor: '#f4c49c', label: 'Alert' },
  observation: { Icon: ObservationIcon, bgVar: '--pill-mint-bg',     inkVar: '--pill-mint-ink',     borderColor: '#9dd6b0', label: 'Observation' },
  opportunity: { Icon: OpportunityIcon, bgVar: '--pill-lavender-bg', inkVar: '--pill-lavender-ink', borderColor: '#c3b6e8', label: 'Opportunity' },
}

// ─── Single callout row ───────────────────────────────────────────────────────

function Callout({ signal, isWhyOpen, onToggleWhy, onDismiss, onSnooze }) {
  const cfg = TYPE_CONFIG[signal.type] ?? TYPE_CONFIG.alert
  const { Icon } = cfg

  return (
    <div
      className={`callout callout--${signal.type}`}
      style={{
        '--callout-bg': `var(${cfg.bgVar})`,
        '--callout-ink': `var(${cfg.inkVar})`,
        '--callout-border': cfg.borderColor,
      }}
      role="status"
    >
      <div className="callout-main">
        {/* Type icon */}
        <span className="callout-icon" aria-label={cfg.label}>
          <Icon />
        </span>

        {/* Copy */}
        <span className="callout-copy">{signal.copy}</span>

        {/* Source chip */}
        <a
          href={signal.sourceHref ?? '#'}
          className="callout-source-chip"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
          aria-label={`Source: ${signal.source}`}
        >
          {signal.source}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M1.5 6.5L6.5 1.5M6.5 1.5H3M6.5 1.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Spacer */}
        <div className="callout-spacer" />

        {/* Primary action */}
        <button className="callout-action" onClick={() => {}}>
          {signal.action}
        </button>

        {/* Why this? */}
        <button
          className={`callout-why-btn${isWhyOpen ? ' callout-why-btn--open' : ''}`}
          onClick={onToggleWhy}
          aria-expanded={isWhyOpen}
        >
          Why this?
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" style={{ transform: isWhyOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Snooze */}
        <button className="callout-snooze-btn" onClick={onSnooze} aria-label="Snooze until next session" title="Snooze until next session">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 4.5v3l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 1.5l2.5 1.5M9.5 1.5L7 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        {/* Dismiss */}
        <button className="callout-dismiss-btn" onClick={onDismiss} aria-label="Dismiss">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Why this — expandable explanation */}
      {isWhyOpen && (
        <div className="callout-why-panel">
          <span className="callout-why-label">Why am I seeing this?</span>
          <span className="callout-why-text">{signal.why}</span>
        </div>
      )}
    </div>
  )
}

// ─── Banner shell ─────────────────────────────────────────────────────────────

const MAX_VISIBLE = 3

export default function SignalBanner() {
  const [dismissed, setDismissed] = useState(new Set())
  const [snoozed, setSnoozed] = useState(new Set())
  const [whyOpenId, setWhyOpenId] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const active = SIGNALS.filter((s) => !dismissed.has(s.id) && !snoozed.has(s.id))

  if (active.length === 0) return null

  const shown = expanded ? active : active.slice(0, MAX_VISIBLE)
  const overflow = active.length - MAX_VISIBLE

  function dismiss(id) {
    setDismissed((prev) => new Set([...prev, id]))
    if (whyOpenId === id) setWhyOpenId(null)
  }

  function snooze(id) {
    setSnoozed((prev) => new Set([...prev, id]))
    if (whyOpenId === id) setWhyOpenId(null)
  }

  return (
    <div className="signal-banner-stack" aria-label="Proactive signals">
      {shown.map((signal) => (
        <Callout
          key={signal.id}
          signal={signal}
          isWhyOpen={whyOpenId === signal.id}
          onToggleWhy={() => setWhyOpenId(whyOpenId === signal.id ? null : signal.id)}
          onDismiss={() => dismiss(signal.id)}
          onSnooze={() => snooze(signal.id)}
        />
      ))}

      {!expanded && overflow > 0 && (
        <button className="signal-view-all-btn" onClick={() => setExpanded(true)}>
          View all {active.length} signals
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginLeft: 3 }}>
            <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
