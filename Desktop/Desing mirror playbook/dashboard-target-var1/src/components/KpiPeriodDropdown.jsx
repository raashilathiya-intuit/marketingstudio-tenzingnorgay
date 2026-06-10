import React, { useState, useRef, useEffect } from 'react'

export const KPI_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'last-week', label: 'Last Week' },
  { key: 'month', label: 'This Month' },
  { key: 'last-month', label: 'Last Month' },
  { key: 'custom', label: 'Custom' },
]

export function getPeriodDateLabel(period) {
  const now = new Date()
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`
  const dow = now.getDay()

  if (period === 'today') return fmt(now)

  if (period === 'week') {
    const mon = new Date(now)
    mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    return `${fmt(mon)} – ${fmt(sun)}`
  }

  if (period === 'last-week') {
    const thisMon = new Date(now)
    thisMon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
    const lastMon = new Date(thisMon)
    lastMon.setDate(thisMon.getDate() - 7)
    const lastSun = new Date(lastMon)
    lastSun.setDate(lastMon.getDate() + 6)
    return `${fmt(lastMon)} – ${fmt(lastSun)}`
  }

  if (period === 'month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    return `${fmt(first)} – ${fmt(now)}`
  }

  if (period === 'last-month') {
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
    const firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth(), 1)
    return `${fmt(firstDay)} – ${fmt(lastDay)}`
  }

  return null
}

export default function KpiPeriodDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = KPI_PERIODS.find(p => p.key === selected) ?? KPI_PERIODS[1]

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function handleKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="kpi-period-dropdown" ref={rootRef}>
      <button
        className={`kpi-period-btn${open ? ' kpi-period-btn--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {current.label}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`kpi-period-chevron${open ? ' kpi-period-chevron--open' : ''}`}>
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="kpi-period-menu" role="listbox">
          {KPI_PERIODS.map(p => (
            <button
              key={p.key}
              className={`kpi-period-option${p.key === selected ? ' kpi-period-option--active' : ''}`}
              role="option"
              aria-selected={p.key === selected}
              onClick={() => { onChange(p.key); setOpen(false) }}
            >
              {p.label}
              {p.key === selected && (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
