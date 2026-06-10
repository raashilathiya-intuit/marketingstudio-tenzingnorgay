import React, { useState, useEffect, useRef } from 'react'
import './StudioPrompt.css'

export default function StudioPrompt({ floating = true, suggestions = [], label }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  function handleChange(e) {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, floating ? 72 : 120) + 'px'
  }

  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const isEmpty = !value.trim()

  return (
    <div className={`studio-prompt-wrap${floating ? ' studio-prompt-wrap--floating' : ''}`} role="search" aria-label="Studio AI prompt">
      {label && <p className="studio-prompt-label">{label}</p>}
      <div className="studio-prompt-border">
        <div className="studio-prompt-card">
          <textarea
            ref={textareaRef}
            className="studio-prompt-input"
            value={value}
            onChange={handleChange}
            placeholder="Ask Studio AI"
            rows={floating ? 1 : 2}
            aria-label="Ask Studio AI"
          />
          <div className="studio-prompt-footer">
            <button
              className="studio-prompt-attach"
              onClick={() => console.log('Attach clicked')}
              aria-label="Attach file"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className={`studio-prompt-send${isEmpty ? ' studio-prompt-send--disabled' : ''}`}
              onClick={() => { if (!isEmpty) console.log('Send clicked:', value) }}
              disabled={isEmpty}
              aria-label="Send message"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="studio-prompt-chips">
              {suggestions.map((s) => (
                <button key={s} className="studio-prompt-chip" onClick={() => console.log('Suggestion clicked:', s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
