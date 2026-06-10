import React, { useState, useEffect, useRef, useMemo } from 'react'
import './CardLibrary.css'
import { WIDGET_REGISTRY, WIDGET_CATEGORIES } from '../data/widgetRegistry'

// ─── Category → preview accent color (uniform AI violet for all library previews) ──
const PREVIEW_ACCENT = {
  'Capital':     '#6B5BD6',
  'Payments':    '#6B5BD6',
  'Bill Pay':    '#6B5BD6',
  'Experiments': '#6B5BD6',
  'Campaigns':   '#6B5BD6',
  'Insights':    '#6B5BD6',
}

// ─── Mini preview SVG components ─────────────────────────────────────────────

function PreviewNumberSparkline({ value, delta, up, color = '#2DBA75' }) {
  const deltaColor = up ? '#1f7a45' : '#b73947'
  const linePoints = up
    ? '8,66 28,60 48,63 68,53 88,57 108,48 128,52 148,43 168,47 192,38'
    : '8,40 28,46 48,49 68,53 88,57 108,60 128,62 148,65 168,63 192,67'
  const areaClose = ' L192,73 L8,73 Z'

  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="8" y="27" fontSize="21" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">{value}</text>
      {delta && (
        <text x="8" y="41" fontSize="9.5" fill={deltaColor} fontFamily="inherit">{delta} vs last week</text>
      )}
      <path d={`M${linePoints.split(' ').map((p, i) => `${i === 0 ? '' : ' L'}${p}`).join('')}${areaClose}`}
        fill={color} fillOpacity="0.1" />
      <polyline points={linePoints} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function PreviewBarMonth({ color = '#2DBA75' }) {
  const heights = [38, 52, 44, 60, 55, 70]
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="8" y="11" fontSize="8" fill="var(--ink-4, #aaa)" fontFamily="inherit">Monthly</text>
      {heights.map((h, i) => {
        const x = 10 + i * 31
        const y = 73 - h
        return (
          <rect key={i} x={x} y={y} width="22" height={h} rx="2"
            fill={i === 5 ? color : 'var(--line-soft, #e8e8ee)'}
          />
        )
      })}
    </svg>
  )
}

function PreviewAlertStack() {
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="188" height="19" rx="3" fill="#fef3e2" />
      <text x="14" y="20" fontSize="9" fill="#b45309" fontFamily="inherit" fontWeight="700">ALERT</text>
      <text x="60" y="20" fontSize="9" fill="#7a5a2a" fontFamily="inherit">Click rate below floor</text>

      <rect x="6" y="29" width="188" height="19" rx="3" fill="#f0eeff" />
      <text x="14" y="43" fontSize="9" fill="#5b4fcf" fontFamily="inherit" fontWeight="700">OBSERVATION</text>
      <text x="106" y="43" fontSize="9" fill="#4a3a8a" fontFamily="inherit">Fatigue pattern</text>

      <rect x="6" y="52" width="188" height="19" rx="3" fill="#edfbf4" />
      <text x="14" y="66" fontSize="9" fill="#1a7a4a" fontFamily="inherit" fontWeight="700">OPPORTUNITY</text>
      <text x="106" y="66" fontSize="9" fill="#1a5a35" fontFamily="inherit">2.4× above benchmark</text>
    </svg>
  )
}

function PreviewNumberOnly({ value }) {
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="100" y="50" fontSize="42" fontWeight="700" fill="var(--ink-1)"
        textAnchor="middle" fontFamily="inherit">{value}</text>
    </svg>
  )
}

function PreviewAreaChart({ color = '#2DBA75' }) {
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <path d="M8,62 30,54 55,57 80,46 105,50 130,37 155,41 180,28 200,32 L200,73 L8,73 Z"
        fill={color} fillOpacity="0.1" />
      <polyline points="8,62 30,54 55,57 80,46 105,50 130,37 155,41 180,28 200,32"
        stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function PreviewHorizontalBar({ color = '#6B5BD6' }) {
  const bars = [
    { label: 'Live',   width: 122, color },
    { label: 'Review', width: 74,  color },
    { label: 'Draft',  width: 50,  color: 'var(--line-soft, #e8e8ee)' },
    { label: 'Ended',  width: 30,  color: 'var(--line-soft, #e8e8ee)' },
  ]
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      {bars.map((b, i) => (
        <g key={i}>
          <text x="6" y={13 + i * 17} fontSize="8.5" fill="var(--ink-3)" fontFamily="inherit">{b.label}</text>
          <rect x="46" y={3 + i * 17} width={b.width} height="11" rx="2" fill={b.color} />
        </g>
      ))}
    </svg>
  )
}

function PreviewStackedBar({ color = '#6B5BD6' }) {
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="6" y="12" fontSize="8" fill="var(--ink-3)" fontFamily="inherit">Traffic split</text>
      <rect x="6"   y="18" width="82" height="16" rx="0" fill={color} />
      <rect x="88"  y="18" width="50" height="16" rx="0" fill={color} fillOpacity="0.65" />
      <rect x="138" y="18" width="34" height="16" rx="0" fill={color} fillOpacity="0.35" />
      <rect x="172" y="18" width="22" height="16" rx="2" fill="var(--line-soft, #e8e8ee)" />
      <text x="6"   y="50" fontSize="8.5" fill={color} fontFamily="inherit">45%</text>
      <text x="88"  y="50" fontSize="8.5" fill={color} fontFamily="inherit" fillOpacity="0.75">27%</text>
      <text x="138" y="50" fontSize="8.5" fill={color} fontFamily="inherit" fillOpacity="0.5">18%</text>
      <text x="172" y="50" fontSize="8.5" fill="var(--ink-4)" fontFamily="inherit">10%</text>
      <text x="6"   y="63" fontSize="7.5" fill="var(--ink-4)" fontFamily="inherit">Treat A</text>
      <text x="88"  y="63" fontSize="7.5" fill="var(--ink-4)" fontFamily="inherit">Treat B</text>
      <text x="138" y="63" fontSize="7.5" fill="var(--ink-4)" fontFamily="inherit">Control</text>
      <text x="172" y="63" fontSize="7.5" fill="var(--ink-4)" fontFamily="inherit">Hold</text>
    </svg>
  )
}

function PreviewComparisonCards({ color = '#2DBA75' }) {
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="84" height="64" rx="4"
        fill="var(--surface-2, #f4f4f8)" stroke="var(--line, #d4d4e0)" strokeWidth="1" />
      <text x="14" y="21" fontSize="8" fill="var(--ink-3)" fontFamily="inherit">Control</text>
      <text x="14" y="42" fontSize="17" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">1.8%</text>
      <text x="14" y="58" fontSize="8" fill="var(--ink-4)" fontFamily="inherit">CTR baseline</text>

      <rect x="102" y="6" width="92" height="64" rx="4"
        fill="var(--surface, #fff)" stroke={color} strokeWidth="1.5" />
      <text x="110" y="21" fontSize="8" fill={color} fontFamily="inherit">Treatment B</text>
      <text x="110" y="42" fontSize="17" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">4.3%</text>
      <text x="110" y="58" fontSize="8" fill="#1a7a4a" fontFamily="inherit">2.4× lift ✓</text>
    </svg>
  )
}

function PreviewComparisonBar({ value, color = '#2DBA75' }) {
  const pct = parseFloat(value) || 40
  const priorPct = Math.max(pct - 6, 0)
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="8" y="23" fontSize="20" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">{value}</text>
      <text x="8" y="36" fontSize="9" fill="var(--ink-3)" fontFamily="inherit">YTD attach</text>
      <text x="8" y="53" fontSize="8" fill="var(--ink-3)" fontFamily="inherit">This yr</text>
      <rect x="52" y="44" width={Math.round(pct * 1.5)} height="10" rx="2"
        fill={color} />
      <text x="8" y="70" fontSize="8" fill="var(--ink-3)" fontFamily="inherit">Last yr</text>
      <rect x="52" y="61" width={Math.round(priorPct * 1.5)} height="10" rx="2"
        fill="var(--line-soft, #e8e8ee)" />
    </svg>
  )
}

function PreviewProgressBar({ value, pct = 50, label, color = '#2DBA75' }) {
  const fillW = Math.round(Math.min(100, pct) * 1.84)
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="8" y="26" fontSize="21" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">{value}</text>
      <rect x="8" y="36" width="184" height="8" rx="4" fill="var(--line-soft, #e8e8ee)" />
      <rect x="8" y="36" width={fillW} height="8" rx="4" fill={color} />
      {label && <text x="8" y="60" fontSize="9" fill="var(--ink-3)" fontFamily="inherit">{label}</text>}
    </svg>
  )
}

function PreviewNumberList({ value }) {
  return (
    <svg viewBox="0 0 200 76" fill="none" aria-hidden="true">
      <text x="8" y="28" fontSize="28" fontWeight="700" fill="var(--ink-1)" fontFamily="inherit">{value}</text>
      <line x1="6" y1="36" x2="194" y2="36" stroke="var(--line-soft, #e8e8ee)" strokeWidth="1" />
      <text x="8" y="49" fontSize="9" fill="var(--ink-2)" fontFamily="inherit">ELM-8333 — Capital email</text>
      <line x1="6" y1="54" x2="194" y2="54" stroke="var(--line-soft, #e8e8ee)" strokeWidth="1" />
      <text x="8" y="67" fontSize="9" fill="var(--ink-2)" fontFamily="inherit">ESS-2241 — Payments TRON</text>
    </svg>
  )
}

function MiniPreview({ widget, color = '#2DBA75' }) {
  switch (widget.preview) {
    case 'number-sparkline':
      return <PreviewNumberSparkline value={widget.previewValue} delta={widget.previewDelta} up={widget.previewDeltaUp} color={color} />
    case 'bar-month':
      return <PreviewBarMonth color={color} />
    case 'alert-stack':
      return <PreviewAlertStack />
    case 'number-only':
      return <PreviewNumberOnly value={widget.previewValue} />
    case 'area-chart':
      return <PreviewAreaChart color={color} />
    case 'horizontal-bar':
      return <PreviewHorizontalBar color={color} />
    case 'stacked-bar':
      return <PreviewStackedBar color={color} />
    case 'comparison-cards':
      return <PreviewComparisonCards color={color} />
    case 'comparison-bar':
      return <PreviewComparisonBar value={widget.previewValue} color={color} />
    case 'number-list':
      return <PreviewNumberList value={widget.previewValue} />
    case 'progress-bar':
      return <PreviewProgressBar value={widget.previewValue} pct={widget.previewPct} label={widget.previewBarLabel} color={color} />
    default:
      return null
  }
}

// ─── Tile ─────────────────────────────────────────────────────────────────────

function WidgetTile({ widget, isAdded, onAdd }) {
  const accentColor = PREVIEW_ACCENT[widget.category] || '#2DBA75'
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
        <MiniPreview widget={widget} color={accentColor} />
      </div>
      <div className="wgt-tile-body">
        <div className="wgt-tile-name-row">
          <span className="wgt-tile-name">{widget.name}</span>
          {widget.formula && (
            <div className="wgt-info-wrap">
              <button className="wgt-info-btn" type="button" aria-label="Metric definition" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M8 7.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="8" cy="4.5" r="0.85" fill="currentColor"/>
                </svg>
              </button>
              <div className="wgt-info-tooltip" role="tooltip">{widget.formula}</div>
            </div>
          )}
        </div>
        <div className="wgt-tile-variant">{widget.variantLabel}</div>
        <div className="wgt-tile-desc">{widget.description}</div>
      </div>
      {!isAdded && (
        <button className="wgt-tile-add-btn" onClick={onAdd}>+ Add</button>
      )}
    </div>
  )
}

// ─── Category filter pill ─────────────────────────────────────────────────────

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      className={`lib-cat-pill${active ? ' lib-cat-pill--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function CardLibrary({ open, onClose, addedIds = new Set(), onAdd }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveCategory('All')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const filteredWidgets = useMemo(() => {
    let items = WIDGET_REGISTRY
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter((w) =>
        w.name.toLowerCase().includes(q) ||
        w.variantLabel.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.source.toLowerCase().includes(q)
      )
    }
    // Deduplicate: keep only the first variant per name+category
    const seen = new Set()
    items = items.filter((w) => {
      const key = `${w.name}__${w.category}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    return items
  }, [query])

  // Group by category, preserving the canonical category order
  const grouped = useMemo(() => {
    const map = new Map()
    for (const w of filteredWidgets) {
      if (!map.has(w.category)) map.set(w.category, [])
      map.get(w.category).push(w)
    }
    return map
  }, [filteredWidgets])

  function handleAdd(id) {
    const meta = WIDGET_REGISTRY.find((w) => w.id === id)
    if (onAdd) onAdd(id, meta?.defaultSize ?? 'S')
  }

  if (!open) return null

  return (
    <>
      <div className="lib-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="lib-drawer" aria-label="Widget library" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="lib-header">
          <h2 className="lib-title">Add a widget</h2>
          <button className="lib-close-btn" onClick={onClose} aria-label="Close library">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
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
            placeholder="Search widgets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search widget library"
          />
          {query && (
            <button className="lib-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Gallery */}
        <div className="lib-gallery">
          {filteredWidgets.length === 0 && (
            <div className="lib-empty">
              <p>No widgets match "{query}"</p>
              <button className="lib-request-link">
                Request a widget
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {[...grouped.entries()].map(([cat, widgets]) => (
            <div key={cat} className="lib-section">
              <div className="lib-section-header">{cat}</div>
              <div className="lib-tile-grid">
                {widgets.map((w) => (
                  <WidgetTile
                    key={w.id}
                    widget={w}
                    isAdded={addedIds.has(w.id)}
                    onAdd={() => handleAdd(w.id)}
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
            Request a widget
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}
