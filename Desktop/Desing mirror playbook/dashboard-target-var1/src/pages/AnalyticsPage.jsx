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
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PageHeader from '../components/PageHeader'
import InsightsPanel from '../components/InsightsPanel'
import KpiCard from '../components/KpiCard'
import CardGrid from '../components/CardGrid'
import { CARD_REGISTRY } from '../data/cardRegistry'
import { WIDGET_REGISTRY } from '../data/widgetRegistry'
import { HOME_KPI_TILES } from '../data/homeMock'
import './HomePage.css'

function getMeta(cardId) {
  const baseId = cardId.replace(/--copy-\d+$/, '')
  return CARD_REGISTRY.find((c) => c.id === baseId) ?? WIDGET_REGISTRY.find((w) => w.id === baseId)
}

const SECTION_ORDER_DEFAULT = ['business-impact', 'experiments', 'campaigns']

// Custom collision: route droppable candidates by drag type to avoid cross-type interference
function typedCollision({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates }) {
  const type = active.data?.current?.type
  let containers = droppableContainers
  if (type === 'section') {
    containers = droppableContainers.filter((c) => c.data?.current?.type === 'section')
  } else if (type === 'card-tile') {
    containers = droppableContainers.filter((c) => c.data?.current?.type === 'card-tile')
  }
  return closestCenter({ active, collisionRect, droppableRects, droppableContainers: containers, pointerCoordinates })
}

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

// ─── Drilldown route map ───────────────────────────────────────────────────────

const DRILLDOWN_ROUTES = {
  'home-ipd-impressions':   'insights/ipd-impressions-drilldown',
  'home-ipd-company-reach': 'insights/ipd-company-reach-drilldown',
  'home-ipd-clicks':        'insights/ipd-clicks-drilldown',
  'home-ipd-ctr':           'insights/ipd-ctr-drilldown',
  'home-ipd-frequency':     'insights/ipd-frequency-drilldown',
}

// ─── Sortable KPI card ────────────────────────────────────────────────────────

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

export default function AnalyticsPage({
  cards, onRemove, onResize, onDuplicate, onPin, onUnpin, onReorder,
  pushToast, openLibrary, activeInsights, insightsLoading, navigate,
}) {
  const [sectionOrder, setSectionOrder] = useState(SECTION_ORDER_DEFAULT)
  const [activeDrag, setActiveDrag] = useState(null)
  const [overSectionId, setOverSectionId] = useState(null)

  // ── KPI strip state ───────────────────────────────────────────────────────
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

  // ── Card/section drag ─────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart({ active }) {
    setActiveDrag({ id: active.id, data: active.data.current })
  }

  function handleDragOver({ over }) {
    const od = over?.data?.current
    setOverSectionId(od?.type === 'section' ? over.id : null)
  }

  function handleDragEnd({ active, over }) {
    const ad = active.data.current
    setActiveDrag(null)
    setOverSectionId(null)
    if (!over) return
    const od = over.data.current

    if (ad?.type === 'section' && od?.type === 'section' && active.id !== over.id) {
      const oldI = sectionOrder.indexOf(active.id)
      const newI = sectionOrder.indexOf(over.id)
      if (oldI !== newI) setSectionOrder(arrayMove(sectionOrder, oldI, newI))
      return
    }

    if (ad?.type === 'card-tile' && od?.type === 'card-tile' && active.id !== over.id) {
      onReorder(active.id, over.id)
    }
  }

  function handleDragCancel() {
    setActiveDrag(null)
    setOverSectionId(null)
  }

  const activeDragId = activeDrag?.id ?? null

  return (
    <>
      <PageHeader
        onOpenLibrary={openLibrary}
        title="Insights"
        meta=""
        periodDropdown={<KpiPeriodDropdown selected={kpiPeriod} onChange={handlePeriodChange} />}
      />

      <InsightsPanel dynamicCallouts={activeInsights} isLoading={insightsLoading} pushToast={pushToast} />

      <SectionHeader
        label="Your Top Metrics"
        subtext="Insights only for QBO US Active IPD campaigns"
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
                  onDrilldown={DRILLDOWN_ROUTES[kpi.id] && navigate ? () => navigate(DRILLDOWN_ROUTES[kpi.id]) : undefined}
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
                tooltip={draggingKpi.tooltip}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DndContext
        sensors={sensors}
        collisionDetection={typedCollision}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <CardGrid
          cards={cards}
          onRemove={onRemove}
          onResize={onResize}
          onDuplicate={onDuplicate}
          onPin={onPin}
          onUnpin={onUnpin}
          sectionOrder={sectionOrder}
          promotedCardIds={new Set()}
          pushToast={pushToast}
          activeDragId={activeDragId}
          overSectionId={overSectionId}
        />
      </DndContext>
    </>
  )
}
