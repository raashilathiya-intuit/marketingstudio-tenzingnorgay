import React, { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import KpiCard from '../components/KpiCard'
import KpiPeriodDropdown from '../components/KpiPeriodDropdown'
import '../components/KpiStrip.css'
import './ProjectsPage.css'

// ─── KPI tiles ─────────────────────────────────────────────────────────────────

const PROJECTS_KPIS = [
  {
    id: 'active-projects',
    label: 'Active projects',
    value: '42',
    pill: { color: 'mint', text: '↑ 3 vs last week' },
    sparkline: [30, 33, 35, 36, 38, 37, 40, 42],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View all' },
  },
  {
    id: 'ontrack-rate',
    label: 'On-track rate',
    value: '74%',
    pill: { color: 'pink', text: '↓ 2% vs last month' },
    sparkline: [82, 80, 79, 78, 78, 77, 76, 74],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
  },
  {
    id: 'avg-time-launch',
    label: 'Avg time to launch',
    value: '18d',
    pill: { color: 'mint', text: '↓ 2d vs last month' },
    sparkline: [20, 19, 19, 18, 18, 18, 18, 18],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View breakdown' },
  },
  {
    id: 'at-risk-projects',
    label: 'At-risk projects',
    value: '5',
    pill: { color: 'pink', text: '↑ 2 vs last week' },
    sparkline: [2, 2, 3, 4, 4, 5, 5, 5],
    sparklineColor: 'var(--pill-pink-ink)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View at-risk' },
  },
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

const ALL_PROJECTS = [
  { id: 1,  name: 'DIFM cancelled_Campaign',                createdDate: 'August 19, 2025', createdBy: 'Moraya West',     lastModified: '1 min ago',    lastModifiedBy: 'John Doe' },
  { id: 2,  name: 'QuickBooks DIFM winback campaign setup', createdDate: 'August 19, 2025', createdBy: 'Jonathan Pine',   lastModified: '1 min ago',    lastModifiedBy: 'John Doe' },
  { id: 3,  name: 'Create 50% off QBLive offer',           createdDate: 'August 19, 2025', createdBy: 'Angela Burr',     lastModified: '1 min ago',    lastModifiedBy: 'John Doe' },
  { id: 4,  name: 'QuickBooks DIFM winback campaign setup', createdDate: 'August 19, 2025', createdBy: 'Richard Onslaw',  lastModified: '1 min ago',    lastModifiedBy: 'John Doe' },
  { id: 5,  name: 'Create 50% off QBLive offer',           createdDate: 'August 19, 2025', createdBy: 'John Doe',        lastModified: '1 min ago',    lastModifiedBy: 'John Doe' },
  { id: 6,  name: 'QBO email re-engagement Q3',            createdDate: 'August 12, 2025', createdBy: 'Priya Nair',      lastModified: '3 hours ago',  lastModifiedBy: 'Priya Nair' },
  { id: 7,  name: 'SMB push notification test',            createdDate: 'August 10, 2025', createdBy: 'Marcus Lin',      lastModified: '2 hours ago',  lastModifiedBy: 'Marcus Lin' },
  { id: 8,  name: 'Payroll upsell experiment',             createdDate: 'August 8, 2025',  createdBy: 'Sarah Kim',       lastModified: 'Yesterday',    lastModifiedBy: 'John Doe' },
  { id: 9,  name: 'DIFM trial-to-paid nurture',            createdDate: 'August 5, 2025',  createdBy: 'David Chen',      lastModified: 'Yesterday',    lastModifiedBy: 'David Chen' },
  { id: 10, name: 'QBLive 30-day free trial campaign',     createdDate: 'July 28, 2025',   createdBy: 'Angela Burr',     lastModified: '2 days ago',   lastModifiedBy: 'Angela Burr' },
  { id: 11, name: 'Accountant partner onboarding flow',    createdDate: 'July 22, 2025',   createdBy: 'Moraya West',     lastModified: '3 days ago',   lastModifiedBy: 'John Doe' },
  { id: 12, name: 'Self-employed tax season push',         createdDate: 'July 15, 2025',   createdBy: 'Jonathan Pine',   lastModified: '5 days ago',   lastModifiedBy: 'Jonathan Pine' },
  { id: 13, name: 'Enterprise renewal reminder sequence',  createdDate: 'July 10, 2025',   createdBy: 'Richard Onslaw',  lastModified: '1 week ago',   lastModifiedBy: 'Richard Onslaw' },
  { id: 14, name: 'Payments feature launch campaign',      createdDate: 'July 3, 2025',    createdBy: 'Sarah Kim',       lastModified: '1 week ago',   lastModifiedBy: 'John Doe' },
  { id: 15, name: 'Mid-market win-back series',            createdDate: 'June 28, 2025',   createdBy: 'Marcus Lin',      lastModified: '2 weeks ago',  lastModifiedBy: 'Marcus Lin' },
  { id: 16, name: 'Intuit Assist beta invite campaign',    createdDate: 'June 20, 2025',   createdBy: 'Priya Nair',      lastModified: '3 weeks ago',  lastModifiedBy: 'Priya Nair' },
  { id: 17, name: 'Q2 seasonal promotions bundle',         createdDate: 'June 12, 2025',   createdBy: 'David Chen',      lastModified: '1 month ago',  lastModifiedBy: 'John Doe' },
]

const PAGE_SIZE = 10

// ─── Sort icon ─────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`proj-sort-icon${active ? ' proj-sort-icon--active' : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── ProjectsPage ──────────────────────────────────────────────────────────────

export default function ProjectsPage({ navigate }) {
  const [search, setSearch]   = useState('')
  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage]       = useState(1)
  const [period, setPeriod]   = useState('week')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return ALL_PROJECTS
    return ALL_PROJECTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.createdBy.toLowerCase().includes(q) ||
      p.lastModifiedBy.toLowerCase().includes(q)
    )
  }, [search])

  const sorted = useMemo(() => {
    if (sortCol !== 'name') return filtered
    return [...filtered].sort((a, b) =>
      sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    )
  }, [filtered, sortCol, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageRows   = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
    setPage(1)
  }

  function handleSearch(val) {
    setSearch(val)
    setPage(1)
  }

  const COLS = [
    { key: 'name',           label: 'Name',             sortable: true },
    { key: 'createdDate',    label: 'Created',          sortable: false },
    { key: 'createdBy',      label: 'Created by',       sortable: false },
    { key: 'lastModified',   label: 'Last modified',    sortable: false },
    { key: 'lastModifiedBy', label: 'Last modified by', sortable: false },
  ]

  const headerRight = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <KpiPeriodDropdown selected={period} onChange={setPeriod} />
      <button
        aria-label="Edit"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '34px', height: '34px', border: '1px solid #e5e5ea', borderRadius: '8px',
          background: 'var(--surface)', color: 'var(--ink-2)', cursor: 'pointer',
          flexShrink: 0, transition: 'background 0.12s, border-color 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = '#d0d0d5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = '#e5e5ea'; }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11.333 2a1.886 1.886 0 012.667 2.667L4.833 13.833 1.5 14.5l.667-3.333L11.333 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )

  return (
    <>
      <PageHeader title="Projects" meta={false} onOpenLibrary={() => {}} rightSlot={headerRight} />

      {/* KPI strip */}
      <div className="kpi-strip-section">
        <div className="kpi-strip">
          {PROJECTS_KPIS.map((kpi) => (
            <KpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              pill={kpi.pill}
              sparkline={kpi.sparkline}
              sparklineColor={kpi.sparklineColor}
              sparklineLabel={kpi.sparklineLabel}
              action={kpi.action}
            />
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="proj-toolbar">
        <div className="proj-toolbar-left">
          <div className="proj-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="proj-search-icon">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="proj-search-input"
              placeholder="Search projects…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              aria-label="Search projects"
            />
            {search && (
              <button className="proj-search-clear" onClick={() => handleSearch('')} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <button className="proj-filter-btn" aria-label="Filter">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Filter
          </button>
        </div>
        <button className="proj-create-btn">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Create project
        </button>
      </div>

      {/* Table */}
      <div className="proj-table-wrap">
        <table className="proj-table">
          <thead>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  className={`proj-th${col.sortable ? ' proj-th--sortable' : ''}${sortCol === col.key ? ' proj-th--active' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="proj-th-inner">
                    {col.label}
                    {col.sortable && <SortIcon active={sortCol === col.key} dir={sortCol === col.key ? sortDir : 'asc'} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="proj-empty-cell">No projects match your search.</td>
              </tr>
            ) : pageRows.map(row => (
              <tr
                key={row.id}
                className="proj-row"
                onClick={() => navigate && navigate('projects/detail')}
                style={{ cursor: 'pointer' }}
              >
                <td className="proj-td proj-td--name">{row.name}</td>
                <td className="proj-td">{row.createdDate}</td>
                <td className="proj-td">{row.createdBy}</td>
                <td className="proj-td">{row.lastModified}</td>
                <td className="proj-td">{row.lastModifiedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="proj-pagination">
        <span className="proj-pagination-info">
          {sorted.length === 0 ? '0 projects' : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, sorted.length)} of ${sorted.length} projects`}
        </span>
        <div className="proj-pagination-controls">
          <button className="proj-page-btn" disabled={safePage <= 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`proj-page-btn proj-page-num${p === safePage ? ' proj-page-num--active' : ''}`}
              onClick={() => setPage(p)}
              aria-current={p === safePage ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button className="proj-page-btn" disabled={safePage >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Next page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
