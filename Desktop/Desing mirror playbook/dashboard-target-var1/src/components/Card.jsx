import React, { useState, useRef, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './Card.css'
import DotMenu from './DotMenu'
import { CARD_REGISTRY } from '../data/cardRegistry'
import { WIDGET_REGISTRY } from '../data/widgetRegistry'
import { WIDGET_DATA } from '../data/mock'

// ─── Staleness helpers (⑤) ───────────────────────────────────────────────────

// Dot only renders when state is non-fresh (amber = stale, red = error)
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

// ─── Source chip (①) ─────────────────────────────────────────────────────────

function SourceChip({ source, onClick }) {
  return (
    <button
      className="card-source-chip"
      title={onClick ? `Open ${source}` : `View source: ${source}`}
      onClick={onClick}
      tabIndex={0}
    >
      <span>{source}</span>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
        <path d="M2 7L7 2M7 2H3.5M7 2V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// ─── Info tooltip ─────────────────────────────────────────────────────────────

function InfoTooltip({ text }) {
  if (!text) return null
  return (
    <div className="card-info-wrap">
      <button className="card-info-btn" aria-label="Metric definition" type="button" tabIndex={-1}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M8 7.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="8" cy="4.5" r="0.85" fill="currentColor"/>
        </svg>
      </button>
      <div className="card-info-tooltip" role="tooltip">{text}</div>
    </div>
  )
}

// ─── Inner presentation shell (also used by DragOverlay clone) ────────────────

export function CardInner({ cardId, title, titleIcon, titleSubtitle, formula, source, onSourceClick, staleness, action, size, children, className = '', dragHandleProps = {}, isPinned, isSuggested, onPin, onUnpin, onResize, onDuplicate, onRemove, onEdit, onResizeStart, dragSizeLabel, isPinnedToFavourite, onFavPinClick, isFavourite, onRemoveFromFavourite, hideDragHandle }) {
  const cardClass = `card${isSuggested ? ' card--suggested' : ''}${className ? ` ${className}` : ''}`
  return (
    <div className={cardClass}>
      {/* ① Header: drag handle + title + subtitle + source chip + dot menu */}
      <div className="card-header">
        <div className="card-header-left">
          {!hideDragHandle && (
            <div className="card-drag-handle" aria-label="Drag to reorder" {...dragHandleProps}>
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
                <circle cx="3" cy="3" r="1.2" fill="currentColor" />
                <circle cx="7" cy="3" r="1.2" fill="currentColor" />
                <circle cx="3" cy="7" r="1.2" fill="currentColor" />
                <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                <circle cx="3" cy="11" r="1.2" fill="currentColor" />
                <circle cx="7" cy="11" r="1.2" fill="currentColor" />
              </svg>
            </div>
          )}
          <div className="card-title-block">
            <div className="card-title-row">
              {titleIcon && <span className="card-title-icon">{titleIcon}</span>}
              <span className="card-title">{title}</span>
              <InfoTooltip text={formula} />
              {isSuggested && <span className="card-suggested-tag">Suggested</span>}
            </div>
            {titleSubtitle && <span className="card-header-subtitle">{titleSubtitle}</span>}
          </div>
        </div>
        <div className="card-header-right">
          {isPinnedToFavourite && (
            <button
              className="card-fav-pin"
              onClick={() => onFavPinClick?.(cardId)}
              aria-label="Pinned to Favourite — click to remove"
              title="Pinned to Favourite — click to remove"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M9.5 1.5L14.5 6.5L11 10L6.5 9L4 13L2.5 11.5L6.5 8.5L5 4L9.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {source && <SourceChip source={source} onClick={onSourceClick} />}
          <DotMenu
            cardId={cardId}
            cardName={title}
            currentSize={size}
            isPinned={isPinned}
            isSuggested={isSuggested}
            onPin={onPin}
            onUnpin={onUnpin}
            onResize={onResize}
            onDuplicate={onDuplicate}
            onEdit={onEdit ?? (() => console.log(`Edit: ${title}`))}
            onRemove={onRemove}
            isFavourite={isFavourite}
            onRemoveFromFavourite={onRemoveFromFavourite}
          />
        </div>
      </div>

      {/* ②③④ Body: primary value, comparison context, trend — rendered by widget */}
      <div className="card-body">{children}</div>

      {/* ⑤⑥ Footer: staleness dot + ago + action affordance */}
      {staleness && (
        <div className="card-footer">
          <div className="card-footer-staleness">
            <StalenessDot state={staleness.state} />
            <span className="card-footer-ago">{stalenessLabel(staleness)}</span>
          </div>
          {action && (
            <button className="card-footer-action">{action.label}<ChevronRight /></button>
          )}
        </div>
      )}

      {/* ⑦ AI sidecar slot — structurally present, empty in R1 */}
      <div className="card-ai-sidecar" aria-hidden="true" />

      {/* Resize handle — right edge drag */}
      {onResizeStart && (
        <div
          className="card-resize-handle"
          onPointerDown={onResizeStart}
          aria-label="Drag to resize card"
          role="separator"
          aria-orientation="vertical"
        >
          <span className="card-resize-handle-bar" />
          {dragSizeLabel && (
            <span className="card-resize-preview">{dragSizeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Snap helpers ─────────────────────────────────────────────────────────────

const SNAP_COLS = [4, 6, 8, 12]
const SIZE_LABELS = { 4: 'S', 6: 'M', 8: 'ML', 12: 'L' }

function snapCols(targetCols) {
  return SNAP_COLS.reduce((a, b) =>
    Math.abs(b - targetCols) < Math.abs(a - targetCols) ? b : a
  )
}

function colsToSize(cols) {
  return SIZE_LABELS[cols] ?? 'S'
}

function sizeToLabel(size) {
  const cols = size === 'S' ? 4 : size === 'ML' ? 8 : size === 'L' ? 12 : 6
  return `${size} · ${cols} cols`
}

// ─── Sortable wrapper — grid placement + dnd-kit ──────────────────────────────

export default function Card({ cardEntry, onRemove, onResize, onDuplicate, onPin, onUnpin, children, isPinnedToFavourite, onFavPinClick }) {
  const { id, size, pinned, suggested } = cardEntry
  const baseId = id.replace(/--copy-\d+$/, '')
  const meta = CARD_REGISTRY.find((c) => c.id === baseId) ?? WIDGET_REGISTRY.find((w) => w.id === baseId)
  const widgetData = WIDGET_DATA[baseId]
  const isInsights = baseId === 'insights'

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: 'card-tile', cardEntry, meta },
  })

  // Combined ref: dnd-kit needs setNodeRef, resize needs element dimensions
  const cardOuterRef = useRef(null)
  const combinedRef = useCallback((el) => {
    setNodeRef(el)
    cardOuterRef.current = el
  }, [setNodeRef])

  // Drag-resize state
  const [dragSize, setDragSize] = useState(null)
  const resizeDragRef = useRef(null)

  const activeSize = dragSize ?? size
  const colSpan = activeSize === 'S' ? 4 : activeSize === 'ML' ? 8 : activeSize === 'L' ? 12 : 6

  function handleResizeStart(e) {
    e.stopPropagation() // prevent dnd-kit from picking this up
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)

    const el = cardOuterRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const currentCols = size === 'S' ? 4 : size === 'ML' ? 8 : size === 'L' ? 12 : 6
    const colUnit = rect.width / currentCols

    resizeDragRef.current = {
      startX: e.clientX,
      colUnit,
      currentCols,
      pendingSize: size,
    }
    setDragSize(size)

    function onMove(ev) {
      if (!resizeDragRef.current) return
      const dx = ev.clientX - resizeDragRef.current.startX
      const targetCols = resizeDragRef.current.currentCols + dx / resizeDragRef.current.colUnit
      const snapped = snapCols(targetCols)
      const newSize = colsToSize(snapped)
      resizeDragRef.current.pendingSize = newSize
      setDragSize(newSize)
    }

    function onUp() {
      const finalSize = resizeDragRef.current?.pendingSize ?? size
      resizeDragRef.current = null
      setDragSize(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (finalSize !== size) onResize(id, finalSize)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: dragSize ? 'none' : transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 10 : dragSize ? 5 : undefined,
    gridColumn: `span ${colSpan}`,
    height: '100%',
  }

  const formula = meta?.formula ?? widgetData?.formula

  const isGuardrail = baseId === 'promote-auto-publish-incidents'
  const guardrailStatus = widgetData?.status ?? 'clear'
  let extraClass = isGuardrail ? `guardrail-card guardrail-card--${guardrailStatus}` : ''
  if (isInsights) extraClass = (extraClass ? extraClass + ' ' : '') + 'card--insights'

  const titleIcon = isInsights ? (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2l1.5 4.5H15l-3.75 2.75 1.5 4.5L9 11l-3.75 2.75 1.5-4.5L3 6.5h4.5L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ) : null

  return (
    <div ref={combinedRef} style={style} {...attributes} {...listeners}>
      <CardInner
        cardId={id}
        title={meta?.name ?? id}
        titleIcon={titleIcon}
        titleSubtitle={isInsights ? '3 signals worth your attention · Updated 4 min ago' : undefined}
        formula={formula}
        source={isInsights ? null : meta?.source}
        onSourceClick={undefined}
        staleness={widgetData?.staleness}
        action={widgetData?.action}
        size={activeSize}
        isPinned={pinned}
        isSuggested={suggested}
        className={extraClass}
        onPin={() => onPin(id, meta?.name ?? id)}
        onUnpin={() => onUnpin(id, meta?.name ?? id)}
        onResize={(newSize) => onResize(id, newSize)}
        onDuplicate={() => onDuplicate(id)}
        onEdit={() => console.log(`Edit: ${meta?.name ?? id}`)}
        onRemove={() => onRemove(id, meta?.name ?? id)}
        hideDragHandle
        onResizeStart={handleResizeStart}
        dragSizeLabel={dragSize ? sizeToLabel(dragSize) : null}
        isPinnedToFavourite={isPinnedToFavourite}
        onFavPinClick={onFavPinClick}
      >
        {children}
      </CardInner>
    </div>
  )
}
