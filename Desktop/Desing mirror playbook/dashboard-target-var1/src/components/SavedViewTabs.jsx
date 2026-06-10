import React from 'react'
import './SavedViewTabs.css'

export default function SavedViewTabs({ views = [], activeViewId = 'v1', onSwitch }) {
  return (
    <div className="saved-view-tabs">
      <div className="saved-view-tabs-inner">
        {views.map((view) => (
          <button
            key={view.id}
            className={`view-tab${view.id === activeViewId ? ' view-tab--active' : ''}`}
            onClick={() => onSwitch?.(view.id)}
          >
            {view.name}
          </button>
        ))}
        <button className="view-tab-add" aria-label="Add new view" title="Add new view">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
