import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './KpiEditPanel.css'

const MAX_METRICS = 5

// Metadata for all available metrics (source + category)
const METRIC_META = {
  'live-campaigns':    { label: 'Live campaigns',       source: 'IPD',       category: 'Campaigns'   },
  'avg-open-rate':     { label: 'Avg open rate',        source: 'Eloqua',    category: 'Email'       },
  'avg-click-rate':    { label: 'Avg click rate',       source: 'Eloqua',    category: 'Email'       },
  'ipd-ctr':           { label: 'Avg IPD CTR',          source: 'IPD',       category: 'Campaigns'   },
  'experiments-active':{ label: 'Active experiments',   source: 'IPD',       category: 'Experiments' },
  'conversion-rate':   { label: 'Avg conversion rate',  source: 'QuickBase', category: 'Campaigns'   },
  'audience-reach':    { label: 'Audience reach',       source: 'IPD',       category: 'Reach'       },
  'approvals-pending': { label: 'Pending approvals',    source: 'Internal',  category: 'Campaigns'   },
  'revenue-impact':    { label: 'Revenue impact',       source: 'QuickBase', category: 'Experiments' },
  'emails-sent':       { label: 'Emails sent',          source: 'Eloqua',    category: 'Email'       },
}

function getMetaLabel(metric) {
  return metric.label ?? METRIC_META[metric.id]?.label ?? metric.id
}
function getMetaSource(metric) {
  return metric.source ?? METRIC_META[metric.id]?.source ?? ''
}

function SortableMetricRow({ metric, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: metric.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }
  const label = getMetaLabel(metric)
  const source = getMetaSource(metric)
  return (
    <div ref={setNodeRef} style={style} className="kpi-panel-metric-row">
      <span className="kpi-panel-drag-handle" {...attributes} {...listeners} aria-label="Drag to reorder">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
          <circle cx="3" cy="3" r="1.2" fill="currentColor" />
          <circle cx="7" cy="3" r="1.2" fill="currentColor" />
          <circle cx="3" cy="7" r="1.2" fill="currentColor" />
          <circle cx="7" cy="7" r="1.2" fill="currentColor" />
          <circle cx="3" cy="11" r="1.2" fill="currentColor" />
          <circle cx="7" cy="11" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <span className="kpi-panel-metric-label">{label}</span>
      {source && <span className="kpi-panel-source-chip">{source}</span>}
      <button
        className="kpi-panel-remove-btn"
        onClick={() => onRemove(metric.id)}
        aria-label={`Remove ${label}`}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export default function KpiEditPanel({ open, onClose, metrics, onSave }) {
  const [draftMetrics, setDraftMetrics] = useState(metrics)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open) {
      setDraftMetrics(metrics)
      setSearch('')
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    setDraftMetrics((prev) => {
      const oldIdx = prev.findIndex((m) => m.id === active.id)
      const newIdx = prev.findIndex((m) => m.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  function removeMetric(id) {
    setDraftMetrics((prev) => prev.filter((m) => m.id !== id))
  }

  function addMetric(id) {
    if (draftMetrics.length >= MAX_METRICS) return
    const meta = METRIC_META[id]
    // Try to find full KPI data from current metrics prop (if re-adding a removed one)
    const existing = metrics.find((m) => m.id === id)
    const stub = existing ?? {
      id,
      label: meta?.label ?? id,
      value: '—',
      pill: null,
      sparkline: [],
      sparklineColor: 'var(--ink-4)',
      staleness: null,
      action: null,
    }
    setDraftMetrics((prev) => [...prev, stub])
  }

  const draftIds = new Set(draftMetrics.map((m) => m.id))
  const q = search.toLowerCase()
  const filtered = Object.entries(METRIC_META).filter(([id, meta]) =>
    !draftIds.has(id) &&
    (q === '' || meta.label.toLowerCase().includes(q) || meta.category.toLowerCase().includes(q))
  )
  const grouped = filtered.reduce((acc, [id, meta]) => {
    if (!acc[meta.category]) acc[meta.category] = []
    acc[meta.category].push({ id, ...meta })
    return acc
  }, {})

  const atLimit = draftMetrics.length >= MAX_METRICS

  if (!open) return null

  return createPortal(
    <div
      className="kpi-edit-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="kpi-edit-panel kpi-edit-panel--open">
        {/* Header */}
        <div className="kpi-panel-header">
          <span className="kpi-panel-title">Edit hero metrics</span>
          <button className="kpi-panel-close" onClick={onClose} aria-label="Close panel">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="kpi-panel-body">
          {/* Currently shown */}
          <div className="kpi-panel-section">
            <div className="kpi-panel-section-header">
              <span className="kpi-panel-section-title">Currently shown</span>
              <span className="kpi-panel-section-count">{draftMetrics.length} / {MAX_METRICS}</span>
            </div>
            {atLimit && (
              <div className="kpi-panel-limit-warn">
                Maximum {MAX_METRICS} metrics — remove one to add another.
              </div>
            )}
            {draftMetrics.length === 0 && (
              <div className="kpi-panel-empty">No metrics shown. Add some below.</div>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={draftMetrics.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                {draftMetrics.map((metric) => (
                  <SortableMetricRow key={metric.id} metric={metric} onRemove={removeMetric} />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Available metrics */}
          <div className="kpi-panel-section kpi-panel-section--available">
            <div className="kpi-panel-section-header">
              <span className="kpi-panel-section-title">Available metrics</span>
            </div>
            <div className="kpi-panel-search-wrap">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                className="kpi-panel-search"
                type="text"
                placeholder="Search metrics"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {Object.keys(grouped).length === 0 && (
              <div className="kpi-panel-empty">
                {search ? 'No metrics match your search.' : 'All available metrics are already shown.'}
              </div>
            )}
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="kpi-panel-catalog-group">
                <div className="kpi-panel-catalog-group-label">{category}</div>
                {items.map((item) => (
                  <div key={item.id} className="kpi-panel-catalog-row">
                    <span className="kpi-panel-metric-label">{item.label}</span>
                    <span className="kpi-panel-source-chip">{item.source}</span>
                    <button
                      className={'kpi-panel-add-btn' + (atLimit ? ' kpi-panel-add-btn--disabled' : '')}
                      onClick={() => addMetric(item.id)}
                      disabled={atLimit}
                      aria-label={`Add ${item.label}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Add
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="kpi-panel-footer">
          <button
            className="kpi-panel-save"
            onClick={() => { onSave(draftMetrics); onClose() }}
          >
            Save
          </button>
          <button className="kpi-panel-discard" onClick={onClose}>
            Discard
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
