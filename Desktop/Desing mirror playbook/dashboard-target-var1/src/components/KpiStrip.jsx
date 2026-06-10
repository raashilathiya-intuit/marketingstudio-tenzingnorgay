import React from 'react'
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './KpiStrip.css'
import KpiCard from './KpiCard'
import { getTrendAccent } from './WidgetContent'
import { WIDGET_DATA } from '../data/mock'

function parsePill(comparison) {
  if (!comparison) return null
  const color = comparison.startsWith('↑') ? 'mint' : comparison.startsWith('↓') ? 'pink' : 'neutral'
  return { color, text: comparison }
}

// ─── Sortable fav slot (used in AnalyticsPage, requires DndContext) ──────────

function FavSlot({ slot, slotIndex, onRemoveFromFavourite, onRestore, isGlowing, isDropTarget, isDraggingCard }) {
  const isDraggable = !!slot.item
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    attributes,
    listeners,
  } = useSortable({
    id: slot.slotId,
    data: { type: 'kpi-slot', slotIndex },
    disabled: !isDraggable,
  })

  const over = isOver || isDropTarget

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
    cursor: isDraggable ? (isDragging ? 'grabbing' : 'grab') : undefined,
    zIndex: isDragging ? 5 : undefined,
  }

  // ── Empty placeholder ────────────────────────────────────────────────────
  if (!slot.item) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`fav-empty-slot${over ? ' fav-empty-slot--over' : ''}${isDraggingCard ? ' fav-empty-slot--active' : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="fav-empty-icon">
          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="fav-empty-text">Drag a tile here to promote</span>
      </div>
    )
  }

  const wrapClass = `fav-slot-wrap${isGlowing ? ' fav-slot--glow' : ''}${over ? ' fav-slot--over' : ''}`

  // ── KPI-type slot (original Hero KPI tiles) ──────────────────────────────
  if (slot.item.type === 'kpi') {
    const kpi = slot.item.data
    return (
      <div ref={setNodeRef} style={style} className={wrapClass} {...attributes} {...listeners}>
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
          isFavourite
          onRemoveFromFavourite={() => onRemoveFromFavourite(slotIndex)}
        />
      </div>
    )
  }

  // ── Card-type slot (tile dragged in from dashboard) ──────────────────────
  if (slot.item.type === 'card') {
    const { data } = slot.item
    const baseId = data.id.replace(/--copy-\d+$/, '')
    const widgetData = WIDGET_DATA[baseId]
    if (!widgetData) return null
    const accentColor = getTrendAccent(data.id)
    return (
      <div ref={setNodeRef} style={style} className={wrapClass} {...attributes} {...listeners}>
        <KpiCard
          label={widgetData.title}
          value={widgetData.primaryValue}
          pill={parsePill(widgetData.comparison)}
          sparkline={widgetData.sparkline}
          sparklineColor={accentColor}
          staleness={widgetData.staleness}
          action={widgetData.action}
          tooltip={{ description: `${widgetData.primaryLabel}. Source: ${widgetData.source}.` }}
          popover={widgetData.metrics ? {
            summary: widgetData.summary,
            metrics: widgetData.metrics.map((m) => ({ label: m.label, value: m.value, delta: m.delta })),
            actionLabel: widgetData.action?.label,
          } : undefined}
          isFavourite
          onRemoveFromFavourite={() => onRemoveFromFavourite(slotIndex)}
          onRestore={onRestore ? () => onRestore(slotIndex) : undefined}
        />
      </div>
    )
  }

  return null
}

// ─── KpiStrip ────────────────────────────────────────────────────────────────
//
// Two modes:
//   • Static (HomePage):   pass `metrics` — renders KpiCards with no DnD
//   • Droppable (Analytics): pass `slots`  — renders FavSlots with useDroppable
//
export default function KpiStrip({
  // droppable mode (AnalyticsPage)
  slots,
  onRemoveFromFavourite,
  onRestoreFromSlot,
  glowSlotIndex,
  overFavSlot,
  isDraggingCard,
  // static mode (HomePage)
  metrics,
}) {
  // ── Static mode ──────────────────────────────────────────────────────────
  if (metrics) {
    return (
      <div className="kpi-strip-section">
        <div className="kpi-strip">
          {metrics.map((kpi) => (
            <KpiCard
              key={kpi.id}
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
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Droppable mode (requires DndContext ancestor) ─────────────────────────
  return (
    <div className="kpi-strip-section">
      <div className="kpi-strip-label">Your Top Metrics</div>
      <SortableContext items={(slots ?? []).map((s) => s.slotId)} strategy={rectSortingStrategy}>
        <div className="kpi-strip">
          {(slots ?? []).map((slot, i) => (
            <FavSlot
              key={slot.slotId}
              slot={slot}
              slotIndex={i}
              onRemoveFromFavourite={onRemoveFromFavourite}
              onRestore={onRestoreFromSlot}
              isGlowing={glowSlotIndex === i}
              isDropTarget={overFavSlot === i}
              isDraggingCard={isDraggingCard}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
