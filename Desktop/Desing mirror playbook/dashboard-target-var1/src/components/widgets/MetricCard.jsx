import React from 'react'
import Sparkline from '../Sparkline'
import ComparisonLine from '../ComparisonLine'
import { WIDGET_REGISTRY, WIDGET_SPARKLINES } from '../../data/widgetRegistry'
import './widgets.css'
import './MetricCard.css'

// Build a ComparisonLine-compatible string from registry delta fields.
function formatComparison(meta) {
  if (!meta.previewDelta) return null
  const arrow = meta.previewDeltaUp ? '↑' : '↓'
  const amount = String(meta.previewDelta).replace(/^[+-]/, '')
  return `${arrow} ${amount} vs last week`
}

// ─── Number + sparkline ───────────────────────────────────────────────────────

function NumberSparkline({ meta, accentColor }) {
  const sparkline = WIDGET_SPARKLINES[meta.id]
  const comparison = formatComparison(meta)
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-value tnum">{meta.previewValue}</div>
      <div className="bu-primary-label">{meta.name}</div>
      {comparison && <ComparisonLine text={comparison} />}
      {sparkline && (
        <div className="sparkline-band">
          <Sparkline data={sparkline} color={accentColor} fluid height={48} showArea />
        </div>
      )}
    </div>
  )
}

// ─── Number only ─────────────────────────────────────────────────────────────

function NumberOnly({ meta }) {
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-value tnum mc-number-hero">{meta.previewValue}</div>
      <div className="bu-primary-label">{meta.name}</div>
    </div>
  )
}

// ─── Bar chart by month ───────────────────────────────────────────────────────

function BarMonth({ meta, accentColor }) {
  const relHeights = [0.54, 0.74, 0.63, 0.86, 0.79, 1.0]
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="mc-bar-group">
        {relHeights.map((rel, i) => (
          <div
            key={i}
            className="mc-bar"
            style={{
              height: Math.round(rel * 52),
              background: i === relHeights.length - 1 ? accentColor : 'var(--chart-grid)',
            }}
          />
        ))}
      </div>
      <div className="bu-primary-label">{meta.name} · last 6 mo</div>
    </div>
  )
}

// ─── Area chart ──────────────────────────────────────────────────────────────

function AreaChart({ meta, accentColor }) {
  const sparkline = WIDGET_SPARKLINES[meta.id] || [50, 54, 52, 58, 55, 62, 60, 68]
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-label">{meta.name}</div>
      <div className="sparkline-band">
        <Sparkline data={sparkline} color={accentColor} fluid height={60} showArea />
      </div>
    </div>
  )
}

// ─── Horizontal bar by status ─────────────────────────────────────────────────

function HorizontalBar({ meta, accentColor }) {
  const bars = [
    { label: 'Live',   pct: 0.61, color: accentColor },
    { label: 'Review', pct: 0.37, color: accentColor },
    { label: 'Draft',  pct: 0.25, color: 'var(--chart-grid)' },
    { label: 'Ended',  pct: 0.15, color: 'var(--chart-grid)' },
  ]
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="mc-hbar-list">
        {bars.map((b) => (
          <div key={b.label} className="mc-hbar-row">
            <span className="mc-hbar-label">{b.label}</span>
            <div className="mc-hbar-track">
              <div className="mc-hbar-fill" style={{ width: `${b.pct * 100}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stacked bar ─────────────────────────────────────────────────────────────

function StackedBar({ meta, accentColor }) {
  const segments = [
    { label: 'Treat A', pct: 0.45, color: accentColor },
    { label: 'Treat B', pct: 0.27, color: 'var(--chart-gray)' },
    { label: 'Control', pct: 0.18, color: 'var(--chart-grid)' },
    { label: 'Hold',    pct: 0.10, color: 'var(--line-soft, #e8e8ee)' },
  ]
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-label mc-mb-8">{meta.name}</div>
      <div className="mc-stacked-track">
        {segments.map((s) => (
          <div
            key={s.label}
            className="mc-stacked-seg"
            style={{ width: `${s.pct * 100}%`, background: s.color }}
          />
        ))}
      </div>
      <div className="mc-stacked-legend">
        {segments.map((s) => (
          <span key={s.label} className="mc-stacked-leg-item">
            <span className="mc-stacked-leg-dot" style={{ background: s.color }} />
            <span className="mc-stacked-leg-val">{Math.round(s.pct * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Comparison cards ─────────────────────────────────────────────────────────

function ComparisonCards({ meta, accentColor }) {
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="mc-comp-cards">
        <div className="mc-comp-card">
          <div className="mc-comp-card-eyebrow">Control</div>
          <div className="mc-comp-card-value tnum">1.8%</div>
          <div className="mc-comp-card-sub" style={{ color: 'var(--ink-3)' }}>CTR baseline</div>
        </div>
        <div className="mc-comp-card mc-comp-card--winner" style={{ borderColor: accentColor }}>
          <div className="mc-comp-card-eyebrow" style={{ color: accentColor }}>Treatment B</div>
          <div className="mc-comp-card-value tnum">4.3%</div>
          <div className="mc-comp-card-sub" style={{ color: 'var(--pill-mint-ink)' }}>2.4× lift ✓</div>
        </div>
      </div>
    </div>
  )
}

// ─── Comparison bar (YTD attach) ──────────────────────────────────────────────

function ComparisonBar({ meta, accentColor }) {
  const pct = parseFloat(meta.previewValue) || 40
  const priorPct = Math.max(pct - 6, 0)
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-value tnum">{meta.previewValue}</div>
      <div className="bu-primary-label">YTD attach</div>
      <div className="mc-compbar-rows">
        <div className="mc-compbar-row">
          <span className="mc-compbar-label">This yr</span>
          <div className="mc-compbar-track">
            <div className="mc-compbar-fill" style={{ width: `${pct}%`, background: accentColor }} />
          </div>
        </div>
        <div className="mc-compbar-row">
          <span className="mc-compbar-label">Last yr</span>
          <div className="mc-compbar-track">
            <div className="mc-compbar-fill" style={{ width: `${priorPct}%`, background: 'var(--chart-grid)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Number + list ────────────────────────────────────────────────────────────

function NumberList({ meta }) {
  const count = parseInt(meta.previewValue, 10) || 3
  const items = [
    'ELM-8333 — Capital email',
    'ESS-2241 — Payments TRON',
    'ELM-8401 — Bill Pay Reactivation',
  ].slice(0, count)
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-value tnum">{meta.previewValue}</div>
      <div className="bu-primary-label">{meta.name}</div>
      <div className="mc-list">
        {items.map((item) => (
          <div key={item} className="mc-list-row">{item}</div>
        ))}
      </div>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ meta, accentColor }) {
  const pct = Math.min(100, meta.previewPct ?? 50)
  return (
    <div className="bu-card">
      <span className="bu-card-tag">{meta.source}</span>
      <div className="bu-primary-value tnum">{meta.previewValue}</div>
      <div className="mc-compbar-rows" style={{ marginTop: 8 }}>
        <div className="mc-compbar-row">
          <div className="mc-compbar-track">
            <div className="mc-compbar-fill" style={{ width: `${pct}%`, background: accentColor }} />
          </div>
        </div>
      </div>
      {meta.previewBarLabel && (
        <div className="bu-primary-label" style={{ marginTop: 6 }}>{meta.previewBarLabel}</div>
      )}
    </div>
  )
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

const RENDERERS = {
  'number-sparkline': NumberSparkline,
  'number-only':      NumberOnly,
  'bar-month':        BarMonth,
  'area-chart':       AreaChart,
  'horizontal-bar':   HorizontalBar,
  'stacked-bar':      StackedBar,
  'comparison-cards': ComparisonCards,
  'comparison-bar':   ComparisonBar,
  'number-list':      NumberList,
  'progress-bar':     ProgressBar,
}

export default function MetricCard({ widgetId, accentColor = 'var(--chart-green)' }) {
  const meta = WIDGET_REGISTRY.find((w) => w.id === widgetId)
  if (!meta) return <div className="card-placeholder">Widget</div>

  const Renderer = RENDERERS[meta.preview]
  if (!Renderer) return <div className="card-placeholder">{meta.name}</div>

  return <Renderer meta={meta} accentColor={accentColor} />
}
