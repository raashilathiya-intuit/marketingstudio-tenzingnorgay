import React, { useState, useEffect, useRef } from 'react'
import './DotMenu.css'

const SIZES = ['S', 'M', 'ML', 'L']

export default function DotMenu({ cardId, cardName, currentSize, isPinned, isSuggested, onPin, onUnpin, onResize, onDuplicate, onRemove, onEdit, hideResize, isFavourite, onRemoveFromFavourite, onRestore }) {
  const [open, setOpen] = useState(false)
  const [resizeOpen, setResizeOpen] = useState(false)
  const menuRef = useRef(null)
  const btnRef = useRef(null)

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setOpen(false)
        setResizeOpen(false)
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') { setOpen(false); setResizeOpen(false) }
    }
    document.addEventListener('mousedown', handle)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function act(fn) {
    setOpen(false)
    setResizeOpen(false)
    fn?.()
  }

  return (
    <div className="dot-menu-root">
      <button
        ref={btnRef}
        className={`card-dot-menu${open ? ' card-dot-menu--open' : ''}`}
        aria-label="Card options"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => { setOpen((v) => !v); setResizeOpen(false) }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="3" r="1.25" fill="currentColor" />
          <circle cx="8" cy="8" r="1.25" fill="currentColor" />
          <circle cx="8" cy="13" r="1.25" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div ref={menuRef} className="dot-menu-dropdown" role="menu">
          {/* 0. Ask AI */}
          <button className="dot-menu-item dot-menu-item--ask-ai" role="menuitem" onClick={() => act(() => console.log(`Ask AI: ${cardName}`))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.1738 7.63529C12.8792 6.05647 15.1204 6.05646 15.8258 7.63529L17.0715 10.4231C17.154 10.6079 17.3896 10.8421 17.6579 10.962L20.3644 12.1738C21.9425 12.8796 21.943 15.1205 20.3644 15.8258L17.5765 17.0715C17.3518 17.1719 17.1719 17.3518 17.0715 17.5765L15.8259 20.3644C15.1204 21.9432 12.8793 21.9432 12.1738 20.3644L10.9282 17.5765C10.8278 17.3518 10.6479 17.1719 10.4231 17.0715L7.63529 15.8258C6.05647 15.1204 6.05646 12.8793 7.63529 12.1738L10.4231 10.9282C10.6479 10.8278 10.8278 10.6479 10.9282 10.4231L12.1738 7.63529ZM15.2455 11.239L13.9998 8.45117L12.7542 11.239C12.4529 11.9134 11.9134 12.4529 11.239 12.7542L8.45117 13.9998L11.239 15.2455C11.9134 15.5468 12.4529 16.0863 12.7542 16.7607L13.9998 19.5485L15.2455 16.7607C15.5468 16.0863 16.0863 15.5468 16.7607 15.2455L19.5485 13.9998L16.8421 12.788C16.2112 12.5061 15.5646 11.9534 15.2455 11.239Z" />
              <path d="M10.4838 2.31373C10.2969 1.89542 9.7031 1.89542 9.5162 2.31373L9.14485 3.14485L8.31373 3.5162C7.89542 3.7031 7.89542 4.2969 8.31373 4.4838L9.14485 4.85515L9.5162 5.68627C9.7031 6.10458 10.2969 6.10458 10.4838 5.68627L10.8552 4.85515L11.6863 4.4838C12.1046 4.2969 12.1046 3.7031 11.6863 3.5162L10.8552 3.14485L10.4838 2.31373Z" />
              <path d="M5.7257 5.47059C5.44534 4.84314 4.55466 4.84313 4.2743 5.47059L3.71727 6.71727L2.47059 7.2743C1.84313 7.55466 1.84314 8.44534 2.47059 8.7257L3.71727 9.28273L4.2743 10.5294C4.55466 11.1569 5.44534 11.1569 5.7257 10.5294L6.28273 9.28273L7.52941 8.7257C8.15686 8.44534 8.15686 7.55466 7.52941 7.2743L6.28273 6.71727L5.7257 5.47059Z" />
            </svg>
            Ask AI
          </button>
          <div className="dot-menu-divider" />

          {/* 1. Edit */}
          <button className="dot-menu-item" role="menuitem" onClick={() => act(onEdit)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
            Edit
          </button>
          <div className="dot-menu-divider" />

          {/* 1. Pin — only shown for suggested cards */}
          {isSuggested && (
            <button className="dot-menu-item" role="menuitem" onClick={() => act(onPin)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 2h4v5l2 2H3l2-2V2ZM7 9v3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              Pin to view
            </button>
          )}

          {/* 2. Resize (with submenu) */}
          {!hideResize && <div className="dot-menu-item-group">
            <button
              className={`dot-menu-item dot-menu-item--has-sub${resizeOpen ? ' dot-menu-item--sub-open' : ''}`}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={resizeOpen}
              onClick={() => setResizeOpen((v) => !v)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1" y="4" width="12" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 7h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Resize
              <svg className="sub-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ transform: resizeOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.12s' }}>
                <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {resizeOpen && (
              <div className="dot-menu-submenu" role="group" aria-label="Size options">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`dot-menu-subitem${currentSize === s ? ' dot-menu-subitem--active' : ''}`}
                    role="menuitemradio"
                    aria-checked={currentSize === s}
                    onClick={() => act(() => onResize(s))}
                  >
                    <span className="size-radio">
                      {currentSize === s && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <circle cx="5" cy="5" r="3" fill="var(--primary)"/>
                        </svg>
                      )}
                    </span>
                    <span className="size-label">{s}</span>
                    <span className="size-desc">
                      {s === 'S' ? '4 columns — compact' : s === 'M' ? '6 columns — standard' : s === 'ML' ? '8 columns — primary + sidebar' : '12 columns — full width'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>}

          {/* 4. Duplicate */}
          <button className="dot-menu-item" role="menuitem" onClick={() => act(onDuplicate)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="4" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 5v7a1 1 0 001 1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Duplicate
          </button>

          <div className="dot-menu-divider" />

          {/* 5. Remove / Restore */}
          {isFavourite && onRestore && (
            <button className="dot-menu-item" role="menuitem" onClick={() => act(onRestore)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 10V4M4 7l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Restore to section
            </button>
          )}
          {isFavourite ? (
            <button className="dot-menu-item dot-menu-item--destructive" role="menuitem" onClick={() => act(onRemoveFromFavourite)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4M8.5 6v4M3 3.5l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Remove
            </button>
          ) : (
            <button className="dot-menu-item dot-menu-item--destructive" role="menuitem" onClick={() => act(onRemove)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4M8.5 6v4M3 3.5l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Remove from dashboard
            </button>
          )}
        </div>
      )}
    </div>
  )
}
