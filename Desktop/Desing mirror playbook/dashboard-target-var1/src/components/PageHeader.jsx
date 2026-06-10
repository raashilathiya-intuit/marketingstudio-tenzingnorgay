import React from 'react'
import './PageHeader.css'

function PillButton({ children, primary = false, onClick }) {
  return (
    <button className={`pill-btn${primary ? ' pill-btn--primary' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function PageHeader({ onOpenLibrary, title, meta, hideActions, periodDropdown, rightSlot }) {
  const defaultTitle = 'Good morning, Jason'
  const defaultMeta = 'Tuesday, May 6 · 8 campaigns live · 1 experiment active'

  const showActions = rightSlot != null || !hideActions

  return (
    <div className="page-header">
      <div className="page-header-row">
        <div className="page-header-titles">
          <h1 className="page-title">{title ?? defaultTitle}</h1>
          {(meta ?? defaultMeta) && <p className="page-meta">{meta ?? defaultMeta}</p>}
        </div>
        {showActions && (
          <div className="page-header-actions">
            {rightSlot != null ? rightSlot : (
              <>
                <PillButton aria-label="Filter">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 4h12M4 8h8M7 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </PillButton>
                {periodDropdown ?? null}
                <PillButton primary onClick={onOpenLibrary}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Add widget
                </PillButton>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
