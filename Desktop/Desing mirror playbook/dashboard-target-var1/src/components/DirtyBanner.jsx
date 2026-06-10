import React from 'react'
import './DirtyBanner.css'

export default function DirtyBanner({ isDirty, onSave, onSaveAs, onDiscard }) {
  if (!isDirty) return null
  return (
    <div className="dirty-banner" role="status" aria-live="polite">
      <span className="dirty-banner-dot" aria-hidden="true" />
      <span className="dirty-banner-label">Unsaved changes</span>
      <div className="dirty-banner-actions">
        <button className="dirty-action dirty-action--save" onClick={onSave}>Save</button>
        <span className="dirty-sep" aria-hidden="true">·</span>
        <button className="dirty-action" onClick={onSaveAs}>Save as new</button>
        <span className="dirty-sep" aria-hidden="true">·</span>
        <button className="dirty-action dirty-action--discard" onClick={onDiscard}>Discard</button>
      </div>
    </div>
  )
}
