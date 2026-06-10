import React, { useState, useEffect, useRef } from 'react'
import './SaveViewModal.css'

export default function SaveViewModal({ open, onClose, onSave, defaultName = '' }) {
  const [name, setName] = useState(defaultName)
  const [scope, setScope] = useState('personal')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setName(defaultName)
      setScope('personal')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, defaultName])

  useEffect(() => {
    if (!open) return
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim(), scope)
    onClose()
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="save-modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="save-modal-title">Save as new view</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label" htmlFor="view-name">Name</label>
            <input
              ref={inputRef}
              id="view-name"
              className="modal-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="e.g. Capital cross-sell — Q3"
              maxLength={50}
              required
            />
            <span className="modal-hint">{name.length}/50</span>
          </div>

          <div className="modal-field">
            <label className="modal-label">Scope</label>
            <div className="modal-radio-group">
              <label className="modal-radio-label">
                <input
                  type="radio" name="scope" value="personal"
                  checked={scope === 'personal'}
                  onChange={() => setScope('personal')}
                />
                <div className="modal-radio-content">
                  <span className="modal-radio-title">Personal</span>
                  <span className="modal-radio-desc">Only visible to you</span>
                </div>
              </label>
              <label className="modal-radio-label modal-radio-label--disabled" title="Requires publish permission">
                <input type="radio" name="scope" value="role" disabled />
                <div className="modal-radio-content">
                  <span className="modal-radio-title">Share to role</span>
                  <span className="modal-radio-desc">Visible to all in your role · Requires publish permission</span>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn modal-btn--save" disabled={!name.trim()}>Save view</button>
          </div>
        </form>
      </div>
    </>
  )
}
