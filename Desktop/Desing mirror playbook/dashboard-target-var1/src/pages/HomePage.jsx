import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import KpiCard from '../components/KpiCard'
import InsightsPanel from '../components/InsightsPanel'
import { HOME_KPI_TILES } from '../data/homeMock'
import './HomePage.css'

// ─── Sort icon (shared by tables on this page) ─────────────────────────────────

function SortIcon({ active, dir, prefix }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`${prefix}-sort-icon${active ? ` ${prefix}-sort-icon--active` : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Recent projects data ─────────────────────────────────────────────────────

const RECENT_PROJECTS = [
  { id: 1, name: 'DIFM cancelled_Campaign',                createdDate: 'August 19, 2025', createdBy: 'Moraya West',    lastModified: '1 min ago', lastModifiedBy: 'John Doe' },
  { id: 2, name: 'QuickBooks DIFM winback campaign setup', createdDate: 'August 19, 2025', createdBy: 'Jonathan Pine',  lastModified: '1 min ago', lastModifiedBy: 'John Doe' },
  { id: 3, name: 'Create 50% off QBLive offer',           createdDate: 'August 19, 2025', createdBy: 'Angela Burr',    lastModified: '1 min ago', lastModifiedBy: 'John Doe' },
  { id: 4, name: 'QuickBooks DIFM winback campaign setup', createdDate: 'August 19, 2025', createdBy: 'Richard Onslaw', lastModified: '1 min ago', lastModifiedBy: 'John Doe' },
  { id: 5, name: 'Create 50% off QBLive offer',           createdDate: 'August 19, 2025', createdBy: 'John Doe',       lastModified: '1 min ago', lastModifiedBy: 'John Doe' },
]

// ─── KPI period dropdown ───────────────────────────────────────────────────────

const KPI_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'last-week', label: 'Last Week' },
  { key: 'month', label: 'This Month' },
  { key: 'last-month', label: 'Last Month' },
  { key: 'custom', label: 'Custom' },
]

function getPeriodDateLabel(period) {
  const now = new Date()
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`
  const dow = now.getDay()

  if (period === 'today') return fmt(now)

  if (period === 'week') {
    const mon = new Date(now)
    mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    return `${fmt(mon)} – ${fmt(sun)}`
  }

  if (period === 'last-week') {
    const thisMon = new Date(now)
    thisMon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
    const lastMon = new Date(thisMon)
    lastMon.setDate(thisMon.getDate() - 7)
    const lastSun = new Date(lastMon)
    lastSun.setDate(lastMon.getDate() + 6)
    return `${fmt(lastMon)} – ${fmt(lastSun)}`
  }

  if (period === 'month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    return `${fmt(first)} – ${fmt(now)}`
  }

  if (period === 'last-month') {
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
    const firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth(), 1)
    return `${fmt(firstDay)} – ${fmt(lastDay)}`
  }

  return null
}

function KpiPeriodDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = KPI_PERIODS.find(p => p.key === selected) ?? KPI_PERIODS[1]

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function handleKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="kpi-period-dropdown" ref={rootRef}>
      <button
        className={`kpi-period-btn${open ? ' kpi-period-btn--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {current.label}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`kpi-period-chevron${open ? ' kpi-period-chevron--open' : ''}`}>
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="kpi-period-menu" role="listbox">
          {KPI_PERIODS.map(p => (
            <button
              key={p.key}
              className={`kpi-period-option${p.key === selected ? ' kpi-period-option--active' : ''}`}
              role="option"
              aria-selected={p.key === selected}
              onClick={() => { onChange(p.key); setOpen(false) }}
            >
              {p.label}
              {p.key === selected && (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── KPI tile drilldown routes ────────────────────────────────────────────────

const KPI_DRILLDOWN_ROUTES = {
  'home-ipd-impressions':   'ipd-impressions-drilldown',
  'home-ipd-company-reach': 'ipd-company-reach-drilldown',
  'home-ipd-clicks':        'ipd-clicks-drilldown',
  'home-ipd-ctr':           'ipd-ctr-drilldown',
  'home-ipd-frequency':     'ipd-frequency-drilldown',
}

// ─── Sortable KPI card (no grip — whole card drags) ───────────────────────────

function SortableKpiCard({ kpi, vizKey, onDrilldown }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: kpi.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        borderRadius: 'var(--r-card)',
      }}
      {...listeners}
      {...attributes}
    >
      <KpiCard
        label={kpi.label}
        value={kpi.value}
        pill={kpi.pill}
        sparkline={kpi.sparkline}
        sparklineColor={kpi.sparklineColor}
        sparklineLabel={kpi.sparklineLabel}
        progressValue={kpi.progressValue}
        progressMax={kpi.progressMax}
        progressColor={kpi.progressColor}
        progressLabel={kpi.progressLabel}
        progressLabelStrong={kpi.progressLabelStrong}
        staleness={kpi.staleness}
        action={kpi.action}
        descriptor={kpi.descriptor}
        descriptorSuffix={kpi.descriptorSuffix}
        descriptorSuffixAtRisk={kpi.descriptorSuffixAtRisk}
        tooltip={kpi.tooltip}
        popover={kpi.popover}
        vizKey={vizKey}
        onDrilldown={onDrilldown}
      />
    </div>
  )
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ label, subtext, rightSlot }) {
  return (
    <div className="home-section-header">
      <div className="home-section-header-left">
        <span className="home-section-label">{label}</span>
        {subtext && <p className="home-section-subtext">{subtext}</p>}
      </div>
      {rightSlot && <div className="home-section-right">{rightSlot}</div>}
    </div>
  )
}

// ─── Action tile icons ──────────────────────────────────────────────────────────

function ActionIcon({ type }) {
  if (type === 'sparkle') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1738 7.63529C12.8792 6.05647 15.1204 6.05646 15.8258 7.63529L17.0715 10.4231C17.154 10.6079 17.3896 10.8421 17.6579 10.962L20.3644 12.1738C21.9425 12.8796 21.943 15.1205 20.3644 15.8258L17.5765 17.0715C17.3518 17.1719 17.1719 17.3518 17.0715 17.5765L15.8259 20.3644C15.1204 21.9432 12.8793 21.9432 12.1738 20.3644L10.9282 17.5765C10.8278 17.3518 10.6479 17.1719 10.4231 17.0715L7.63529 15.8258C6.05647 15.1204 6.05646 12.8793 7.63529 12.1738L10.4231 10.9282C10.6479 10.8278 10.8278 10.6479 10.9282 10.4231L12.1738 7.63529Z" />
    </svg>
  )
  if (type === 'flask') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M9 3v7l-5 9h14l-5-9V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="16" r="1" fill="currentColor" />
      <circle cx="13" cy="14" r="0.75" fill="currentColor" />
    </svg>
  )
  if (type === 'chart') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 20h18M3 20V9l5 4 4-6 5 3 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (type === 'people') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 8c1.5 0 3 1 3 3s-1.5 3-3 3M19 14c2.5 1 4 2.5 4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
  if (type === 'folder') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 7a2 2 0 0 1 2-2h4.5l2 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
  // robot / enterprise AI
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="9" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 13h.01M15 13h.01M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 9V5M9 5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// ─── Grip dots icon ────────────────────────────────────────────────────────────

function GripDots() {
  return (
    <svg width="12" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
      <circle cx="3" cy="2.5"  r="1.1" fill="currentColor" />
      <circle cx="7" cy="2.5"  r="1.1" fill="currentColor" />
      <circle cx="3" cy="7"    r="1.1" fill="currentColor" />
      <circle cx="7" cy="7"    r="1.1" fill="currentColor" />
      <circle cx="3" cy="11.5" r="1.1" fill="currentColor" />
      <circle cx="7" cy="11.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

// ─── Minimal kebab (quick actions — "Remove from quick actions" only) ──────────

function ActionKebab({ onRemove }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    function handleKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="dot-menu-root action-tile-kebab-root">
      <button
        ref={btnRef}
        className={`card-dot-menu${open ? ' card-dot-menu--open' : ''}`}
        aria-label="Card options"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="3"  r="1.25" fill="currentColor" />
          <circle cx="8" cy="8"  r="1.25" fill="currentColor" />
          <circle cx="8" cy="13" r="1.25" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div ref={menuRef} className="dot-menu-dropdown" role="menu">
          <button
            className="dot-menu-item dot-menu-item--destructive"
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onRemove() }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4M8.5 6v4M3 3.5l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Remove from quick actions
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sortable action tile ──────────────────────────────────────────────────────

function ActionTile({ tile, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={`home-action-tile home-action-tile--${tile.icon}${isDragging ? ' home-action-tile--dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="home-action-tile-left">
        <div className="home-action-icon-chip">
          <ActionIcon type={tile.icon} />
        </div>
        <div className="home-action-text">
          <span className="home-action-title">{tile.label}</span>
          <span className="home-action-description">{tile.description}</span>
        </div>
      </div>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="home-action-chevron">
        <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <ActionKebab onRemove={() => onRemove(tile.id)} />
    </div>
  )
}

function AddActionTile({ onClick }) {
  return (
    <button className="home-action-tile home-action-tile--add" onClick={onClick}>
      <span className="home-action-add-label">+ Add</span>
    </button>
  )
}

// ─── HomePage ──────────────────────────────────────────────────────────────────

export default function HomePage({
  onOpenLibrary,
  onOpenWorkflowLibrary,
  quickActions = [],
  activeInsights = [],
  insightsLoading = false,
  pushToast,
  onViewAll,
  onViewAllProjects,
  onRemoveAction,
  onReorderActions,
  navigate,
}) {
  const [draggingTile, setDraggingTile] = useState(null)
  const [projectSearch, setProjectSearch] = useState('')
  const [projSortCol, setProjSortCol] = useState('')
  const [projSortDir, setProjSortDir] = useState('asc')

  function handleProjSort(col) {
    if (projSortCol === col) {
      setProjSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setProjSortCol(col)
      setProjSortDir('asc')
    }
  }

  // ── KPI strip sortable state ───────────────────────────────────────────────
  const [kpiTiles, setKpiTiles] = useState(() => HOME_KPI_TILES.slice(0, 5))
  const [draggingKpi, setDraggingKpi] = useState(null)
  const [kpiPeriod, setKpiPeriod] = useState('week')
  const [stripKey, setStripKey] = useState(0)

  function handlePeriodChange(newPeriod) {
    if (newPeriod === kpiPeriod) return
    setKpiPeriod(newPeriod)
    setStripKey(k => k + 1)
  }

  const activeKpiTiles = useMemo(() => {
    const dateLabel = getPeriodDateLabel(kpiPeriod)
    return kpiTiles.map(tile => {
      const overrides = tile.periodOverrides?.[kpiPeriod]
      const merged = overrides ? { ...tile, ...overrides } : tile
      if (dateLabel && merged.sparkline?.length > 0) {
        return { ...merged, sparklineLabel: dateLabel }
      }
      return merged
    })
  }, [kpiTiles, kpiPeriod])

  const kpiSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleKpiDragStart({ active }) {
    setDraggingKpi(activeKpiTiles.find((t) => t.id === active.id) ?? null)
  }

  function handleKpiDragEnd({ active, over }) {
    setDraggingKpi(null)
    if (!over || active.id === over.id) return
    setKpiTiles((prev) => {
      const oldI = prev.findIndex((t) => t.id === active.id)
      const newI = prev.findIndex((t) => t.id === over.id)
      return arrayMove(prev, oldI, newI)
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart({ active }) {
    setDraggingTile(quickActions.find((t) => t.id === active.id) ?? null)
  }

  function handleDragEnd({ active, over }) {
    setDraggingTile(null)
    if (!over || active.id === over.id) return
    onReorderActions?.(active.id, over.id)
  }

  function handleDragCancel() {
    setDraggingTile(null)
  }

  return (
    <>
      {/* ── Hero: greeting + prompt + chips ── */}
      <div className="home-hero">
        <div className="home-hero-text">
          <h1 className="home-hero-title">Good morning, Jason!</h1>
          <p className="home-hero-subtitle">Last updated 8 min ago · Data: as of May 8, 2026 8:14 AM</p>
        </div>
        <KpiPeriodDropdown selected={kpiPeriod} onChange={handlePeriodChange} />
      </div>

      <InsightsPanel
        dynamicCallouts={activeInsights}
        isLoading={insightsLoading}
        pushToast={pushToast}
      />

      <SectionHeader
        label="Your Top Metrics"
        subtext="Insights only for QBO US Active IPD campaigns"
        rightSlot={
          <button className="home-section-viewall" onClick={() => onViewAll?.()}>
            View all
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />
      <DndContext
        sensors={kpiSensors}
        collisionDetection={closestCenter}
        onDragStart={handleKpiDragStart}
        onDragEnd={handleKpiDragEnd}
        onDragCancel={() => setDraggingKpi(null)}
      >
        <SortableContext items={activeKpiTiles.map((t) => t.id)} strategy={rectSortingStrategy}>
          <div className="kpi-strip-section">
            <div className="kpi-strip">
              {activeKpiTiles.map((kpi) => (
                <SortableKpiCard
                  key={kpi.id}
                  kpi={kpi}
                  vizKey={stripKey}
                  onDrilldown={navigate && KPI_DRILLDOWN_ROUTES[kpi.id]
                    ? () => navigate(KPI_DRILLDOWN_ROUTES[kpi.id])
                    : undefined}
                />
              ))}
            </div>
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 160, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {draggingKpi ? (
            <div style={{
              borderRadius: 'var(--r-card)',
              boxShadow: '0 0 0 2px var(--chart-purple), 0 12px 32px rgba(0,0,0,0.14)',
              transform: 'scale(1.02)',
              cursor: 'grabbing',
            }}>
              <KpiCard
                label={draggingKpi.label}
                value={draggingKpi.value}
                pill={draggingKpi.pill}
                sparkline={draggingKpi.sparkline}
                sparklineColor={draggingKpi.sparklineColor}
                sparklineLabel={draggingKpi.sparklineLabel}
                progressValue={draggingKpi.progressValue}
                progressMax={draggingKpi.progressMax}
                progressColor={draggingKpi.progressColor}
                progressLabel={draggingKpi.progressLabel}
                progressLabelStrong={draggingKpi.progressLabelStrong}
                tooltip={draggingKpi.tooltip}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <SectionHeader label="Your Shortcuts" />

      {quickActions.length === 0 ? (
        <div className="home-actions-empty">
          <p className="home-actions-empty-title">Your quick actions are empty</p>
          <p className="home-actions-empty-sub">Add workflows from the library to get started</p>
          <AddActionTile onClick={onOpenWorkflowLibrary} />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={quickActions.map((t) => t.id)} strategy={rectSortingStrategy}>
            <div className="home-action-grid">
              {quickActions.map((tile) => (
                <ActionTile key={tile.id} tile={tile} onRemove={onRemoveAction} />
              ))}
              <AddActionTile onClick={onOpenWorkflowLibrary} />
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 160, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
            {draggingTile ? (
              <div
                className={`home-action-tile home-action-tile--${draggingTile.icon}`}
                style={{ transform: 'scale(1.02)', boxShadow: '0 0 0 2px var(--chart-purple), 0 12px 32px rgba(0,0,0,0.14)', cursor: 'grabbing' }}
              >
                <div className="home-action-tile-left">
                  <div className="home-action-icon-chip">
                    <ActionIcon type={draggingTile.icon} />
                  </div>
                  <div className="home-action-text">
                    <span className="home-action-title">{draggingTile.label}</span>
                    <span className="home-action-description">{draggingTile.description}</span>
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="home-action-chevron">
                  <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <SectionHeader
        label="Your Recent Projects"
        rightSlot={
          <button className="home-section-viewall" onClick={() => onViewAllProjects?.()}>
            View all
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />
      <div className="home-projects-toolbar">
        <div className="home-projects-search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="home-projects-search-icon">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="home-projects-search-input"
            placeholder="Search projects…"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
          />
          {projectSearch && (
            <button className="home-projects-search-clear" onClick={() => setProjectSearch('')} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <button className="home-projects-filter-btn" aria-label="Filter">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Filter
        </button>
      </div>
      <div className="home-projects-table-wrap">
        <table className="home-projects-table">
          <thead>
            <tr>
              {[
                { key: 'name',           label: 'Name' },
                { key: 'createdDate',    label: 'Created' },
                { key: 'createdBy',      label: 'Created by' },
                { key: 'lastModified',   label: 'Last modified' },
                { key: 'lastModifiedBy', label: 'Last modified by' },
              ].map(col => (
                <th
                  key={col.key}
                  className={`home-projects-th home-projects-th--sortable${projSortCol === col.key ? ' home-projects-th--active' : ''}`}
                  onClick={() => handleProjSort(col.key)}
                >
                  <span className="home-projects-th-inner">
                    {col.label}
                    <SortIcon prefix="home-projects" active={projSortCol === col.key} dir={projSortCol === col.key ? projSortDir : 'asc'} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              const q = projectSearch.trim().toLowerCase()
              let rows = q
                ? RECENT_PROJECTS.filter(r =>
                    r.name.toLowerCase().includes(q) ||
                    r.createdBy.toLowerCase().includes(q) ||
                    r.lastModifiedBy.toLowerCase().includes(q)
                  )
                : [...RECENT_PROJECTS]
              if (projSortCol) {
                rows = [...rows].sort((a, b) => {
                  const av = (a[projSortCol] || '').toLowerCase()
                  const bv = (b[projSortCol] || '').toLowerCase()
                  return projSortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
                })
              }
              if (rows.length === 0) {
                return (
                  <tr>
                    <td colSpan={5} className="home-projects-empty">No projects match &ldquo;{projectSearch}&rdquo;</td>
                  </tr>
                )
              }
              return rows.map((row) => (
                <tr key={row.id} className="home-projects-row">
                  <td className="home-projects-td home-projects-td--name">
                    <a href="#" className="home-projects-link">{row.name}</a>
                  </td>
                  <td className="home-projects-td">{row.createdDate}</td>
                  <td className="home-projects-td">{row.createdBy}</td>
                  <td className="home-projects-td">{row.lastModified}</td>
                  <td className="home-projects-td">{row.lastModifiedBy}</td>
                </tr>
              ))
            })()}
          </tbody>
        </table>
      </div>
    </>
  )
}
