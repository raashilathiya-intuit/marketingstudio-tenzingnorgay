import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import './WorkflowLibraryPanel.css'
import { WORKFLOW_SECTIONS, ALL_WORKFLOWS } from '../data/workflowLibraryData'

// ─── Icon renderer (matches HomePage ActionIcon) ──────────────────────────────

function WorkflowIcon({ type, size = 16 }) {
  const s = size
  if (type === 'sparkle') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1738 7.63529C12.8792 6.05647 15.1204 6.05646 15.8258 7.63529L17.0715 10.4231C17.154 10.6079 17.3896 10.8421 17.6579 10.962L20.3644 12.1738C21.9425 12.8796 21.943 15.1205 20.3644 15.8258L17.5765 17.0715C17.3518 17.1719 17.1719 17.3518 17.0715 17.5765L15.8259 20.3644C15.1204 21.9432 12.8793 21.9432 12.1738 20.3644L10.9282 17.5765C10.8278 17.3518 10.6479 17.1719 10.4231 17.0715L7.63529 15.8258C6.05647 15.1204 6.05646 12.8793 7.63529 12.1738L10.4231 10.9282C10.6479 10.8278 10.8278 10.6479 10.9282 10.4231L12.1738 7.63529Z" />
    </svg>
  )
  if (type === 'flask') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M9 3v7l-5 9h14l-5-9V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="16" r="1" fill="currentColor" />
      <circle cx="13" cy="14" r="0.75" fill="currentColor" />
    </svg>
  )
  if (type === 'chart') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 20h18M3 20V9l5 4 4-6 5 3 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (type === 'people') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 8c1.5 0 3 1 3 3s-1.5 3-3 3M19 14c2.5 1 4 2.5 4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
  if (type === 'folder') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 7a2 2 0 0 1 2-2h4.5l2 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
  // robot
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="9" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 13h.01M15 13h.01M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 9V5M9 5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// ─── Workflow card — mirrors homepage action tile style ────────────────────────

function WorkflowCard({ workflow, isAdded, onAdd, onRemove }) {
  return (
    <div className={`wl-card${isAdded ? ' wl-card--added' : ''}`}>
      {/* Icon chip — mirrors homepage */}
      <div className="wl-card-icon-chip">
        <WorkflowIcon type={workflow.icon} size={16} />
      </div>

      {/* Body */}
      <div className="wl-card-body">
        <div className="wl-card-title">{workflow.title}</div>
        <span className="wl-card-description">{workflow.description}</span>
      </div>

      {/* Add / Added button — absolute top-right */}
      {isAdded ? (
        <button
          className="wl-added-pill-btn"
          onClick={() => onRemove(workflow.id)}
          aria-label={`Remove ${workflow.title} from quick actions`}
        >
          ✓ Added
        </button>
      ) : (
        <button
          className="wl-add-btn"
          onClick={() => onAdd(workflow)}
          aria-label={`Add ${workflow.title} to quick actions`}
        >
          + Add
        </button>
      )}
    </div>
  )
}

// ─── WorkflowLibraryPanel ─────────────────────────────────────────────────────

export default function WorkflowLibraryPanel({
  open,
  onClose,
  addedIds,
  onAdd,
  onRemove,
  pushToast,
  missingSeeds = [],
  onRestoreDefaults,
}) {
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)

  // Auto-focus search 250ms after open
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => searchRef.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [open])

  // Reset state on close
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Filtered workflow list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_WORKFLOWS.filter((w) => {
      if (q) {
        const haystack = [w.title, w.description, ...w.tools].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [query])

  // Group filtered results back into sections (preserving order)
  const sections = useMemo(() => {
    const filteredIds = new Set(filtered.map((w) => w.id))
    return WORKFLOW_SECTIONS
      .map((s) => ({
        ...s,
        workflows: s.workflows
          .filter((w) => filteredIds.has(w.id))
          .map((w) => ({ ...w, sectionLabel: s.label })),
      }))
      .filter((s) => s.workflows.length > 0)
  }, [filtered])

  function handleAdd(workflow) {
    onAdd(workflow)
    pushToast?.('Added to quick actions')
  }

  function handleRemove(workflowId) {
    onRemove(workflowId)
    // toast is fired by handleRemoveQuickAction in App.jsx
  }

  if (!open) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="wl-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="wl-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Your Shortcuts"
      >
        {/* Header */}
        <div className="wl-header">
          <div className="wl-header-left">
            <span className="wl-header-title">Your Shortcuts</span>
          </div>
          <button className="wl-close-btn" onClick={onClose} aria-label="Close panel">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="wl-search-wrap">
          <svg className="wl-search-icon" width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            className="wl-search-input"
            type="text"
            placeholder="Search workflows…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="wl-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Scrollable section list */}
        <div className="wl-body">
          {sections.length === 0 ? (
            <div className="wl-empty">No workflows match your search.</div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="wl-section">
                <div className="wl-section-label">{section.label}</div>
                <div className="wl-grid">
                  {section.workflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      isAdded={addedIds.has(workflow.id)}
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="wl-footer">
          <span className="wl-footer-text">Can't find a workflow?</span>
          <button className="wl-footer-link">Request a workflow ›</button>
        </div>
      </div>
    </>,
    document.body
  )
}
