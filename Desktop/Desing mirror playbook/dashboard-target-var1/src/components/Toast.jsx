import React from 'react'
import './Toast.css'

export default function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="toast-stack" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <span className="toast-message">{toast.message}</span>
          {toast.undoFn && (
            <button
              className="toast-undo"
              onClick={() => { toast.undoFn(); onDismiss(toast.id) }}
            >
              Undo
            </button>
          )}
          <button className="toast-dismiss" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
