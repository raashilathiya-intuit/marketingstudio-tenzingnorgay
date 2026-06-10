import React, { useState, useMemo } from 'react'
import './ProjectsPage.css'

// ─── Mock rows (18 total, based on reference design) ───────────────────────

const ROWS = [
  { id: 1,  exp: 'PLM7781-IPD-MDIWM30DHigh',    status: 'Draft',            audience: 'QBSP Active Customers',       promotion: 'QB Payroll 5…3 Month $115',      ipd: 'ELM5-129 IPD-Bottomdrawer' },
  { id: 2,  exp: 'ZXC1109-IPD-epDiscount30',     status: 'Edited',           audience: 'S Corp Partn…cct Attached',   promotion: 'QBO Plus US…w Price $110',       ipd: '76454-129 IPD-Bottomdrawer' },
  { id: 3,  exp: 'WWS9021-IPD-DIWMDeepDisc',     status: 'Error',            audience: 'Sole Proprie…cct-Attached',   promotion: 'QBSE Annual 30% Off Promo',      ipd: '1232-129 IPD-Bottomdrawer' },
  { id: 4,  exp: 'PLM4421-IPD-AMDIWM60DLow',     status: 'Published',        audience: 'QBO Advanced…ve Customers',   promotion: 'QB Live 20% First Month',        ipd: '2089-211 IPD-TopExpander' },
  { id: 5,  exp: 'ZXC7732-IPD-epDiscount60',     status: 'Awaiting review',  audience: 'QBO DIWM No Accountant',      promotion: 'QBO Advanced…sion 60 Days',      ipd: 'ELM7-882 IPD-Card' },
  { id: 6,  exp: 'WWS3308-IPD-DIWMDeepDisc',     status: 'Accepted',         audience: 'IAS Accelera…se Customers',   promotion: 'Payroll 35%…Month Bundle',        ipd: '44621-129 IPD-Bottomdrawer' },
  { id: 7,  exp: 'PLM9912-IPD-MDIWM30DHigh',     status: 'Reviewed',         audience: 'Non FTU QBSE Subscribers',    promotion: 'QBSP Loyalty Discount $89',      ipd: 'ELM2-553 IPD-Inline' },
  { id: 8,  exp: 'ZXC5547-IPD-epDiscount30',     status: 'Unpublished',      audience: 'QBSP Lapsed Trial Users',     promotion: 'DIFM Cancell… Winback 40%',      ipd: '98231-441 IPD-Sidebar' },
  { id: 9,  exp: 'WWS6620-IPD-DIWMDeepDisc',     status: 'Sharing',          audience: 'QBO Plus Mid…rket Tenured',   promotion: 'Mid-Market Bundle $199',         ipd: 'ELM9-117 IPD-Fullscreen' },
  { id: 10, exp: 'PLM1184-IPD-MDIWM90DHigh',     status: 'Publishing',       audience: 'QBSE Mobile Active Users',    promotion: 'QBO Essentia…Promo $25/mo',      ipd: '55712-128 IPD-Bottomdrawer' },
  { id: 11, exp: 'PLM1184-IPD-MDIWM90DHigh',     status: 'Publishing',       audience: 'QBSE Mobile Active Users',    promotion: 'QBO Essentia…Promo $25/mo',      ipd: '55712-128 IPD-Bottomdrawer' },
  { id: 12, exp: 'ZXC4412-IPD-epDiscount45',     status: 'Draft',            audience: 'QBO Self-Employed Users',     promotion: 'QBO Plus Annual Save 40%',       ipd: 'ELM3-221 IPD-Card' },
  { id: 13, exp: 'WWS8801-IPD-DIWMDeepDisc',     status: 'Accepted',         audience: 'QBSE New Trial Users',        promotion: 'Payroll Essentials $15/mo',      ipd: '33241-119 IPD-Bottomdrawer' },
  { id: 14, exp: 'PLM3392-IPD-AMDIWM30DLow',     status: 'Reviewed',         audience: 'QBO Advanced Customers',      promotion: 'QB Live Free Trial 30 Days',     ipd: '7721-311 IPD-Inline' },
  { id: 15, exp: 'ZXC9931-IPD-epDiscount20',     status: 'Published',        audience: 'QBSP Mid-Market Segment',     promotion: 'QB Payroll Premium $45/mo',      ipd: 'ELM6-445 IPD-TopExpander' },
  { id: 16, exp: 'WWS2214-IPD-DIWMDeepDisc',     status: 'Unpublished',      audience: 'QBO Lapsed Trial Customers',  promotion: 'DIFM Winback 50% Bundle',        ipd: '12341-229 IPD-Card' },
  { id: 17, exp: 'PLM6673-IPD-MDIWM60DHigh',     status: 'Edited',           audience: 'IAS Advanced Subscribers',    promotion: 'Payroll 25% Off Annual Plan',    ipd: 'ELM1-887 IPD-Bottomdrawer' },
  { id: 18, exp: 'ZXC3341-IPD-epDiscount15',     status: 'Awaiting review',  audience: 'QBSE S Corp Segment',         promotion: 'QBO Essentials $17/mo Promo',    ipd: '88213-331 IPD-Sidebar' },
]

// ─── Status badge ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  'Draft':           { cls: 'pd-badge--draft' },
  'Edited':          { cls: 'pd-badge--edited' },
  'Error':           { cls: 'pd-badge--error' },
  'Published':       { cls: 'pd-badge--published' },
  'Awaiting review': { cls: 'pd-badge--awaiting' },
  'Accepted':        { cls: 'pd-badge--accepted' },
  'Reviewed':        { cls: 'pd-badge--reviewed' },
  'Unpublished':     { cls: 'pd-badge--unpublished' },
  'Sharing':         { cls: 'pd-badge--in-progress', label: 'Sharing…' },
  'Publishing':      { cls: 'pd-badge--in-progress', label: 'Publishing…' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {}
  const isProgress = status === 'Sharing' || status === 'Publishing'
  return (
    <span className={`pd-badge ${cfg.cls || ''}`}>
      {isProgress && (
        <svg className="pd-badge-spinner" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="14 10" strokeLinecap="round"/>
        </svg>
      )}
      {cfg.label || status}
    </span>
  )
}

// ─── ProjectDetailPage ──────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`proj-sort-icon${active ? ' proj-sort-icon--active' : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ProjectDetailPage({ navigate }) {
  const [search, setSearch]             = useState('')
  const [selectedIds, setSelectedIds]   = useState(new Set())
  const [sortCol, setSortCol]           = useState('')
  const [sortDir, setSortDir]           = useState('asc')

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = q
      ? ROWS.filter(r =>
          r.exp.toLowerCase().includes(q) ||
          r.audience.toLowerCase().includes(q)
        )
      : ROWS
    if (!sortCol) return base
    return [...base].sort((a, b) => {
      const av = (a[sortCol] || '').toLowerCase()
      const bv = (b[sortCol] || '').toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [search, sortCol, sortDir])

  function toggleRow(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(r => r.id)))
    }
  }

  const allChecked = filtered.length > 0 && selectedIds.size === filtered.length
  const someChecked = selectedIds.size > 0 && !allChecked

  return (
    <div className="pd-page">
      {/* Page heading */}
      <p className="pd-heading">Showing the 18 most recently created experiences...</p>

      {/* Toolbar row */}
      <div className="pd-toolbar">
        <div className="pd-toolbar-left">
          {/* Search */}
          <div className="proj-search" style={{ width: 220 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="proj-search-icon">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="proj-search-input"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter + sort icon buttons */}
          <button className="pd-icon-btn" aria-label="Filter">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1.5 4.5h4m5 0h4M5.5 4.5a2 2 0 104 0 2 2 0 00-4 0zM1.5 11.5h7m3 0h3m-3 0a2 2 0 10-4 0 2 2 0 004 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="pd-icon-btn" aria-label="Sort">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="proj-table-wrap">
        <table className="proj-table pd-table">
          <thead>
            <tr>
              <th className="proj-th pd-th-check">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  className="pd-checkbox"
                  aria-label="Select all"
                />
              </th>
              {[
                { key: 'exp',       label: 'Experience' },
                { key: 'status',    label: 'Status' },
                { key: 'audience',  label: 'Audience' },
                { key: 'promotion', label: 'Promotion' },
                { key: 'ipd',       label: 'IPD Creative' },
              ].map(col => (
                <th
                  key={col.key}
                  className={`proj-th proj-th--sortable${sortCol === col.key ? ' proj-th--active' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="proj-th-inner">
                    {col.label}
                    <SortIcon active={sortCol === col.key} dir={sortCol === col.key ? sortDir : 'asc'} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr
                key={row.id}
                className={`proj-row${selectedIds.has(row.id) ? ' pd-row--selected' : ''}`}
                onClick={() => navigate && navigate(`projects/detail/${encodeURIComponent(row.exp)}`)}
                style={{ cursor: 'pointer' }}
              >
                <td className="proj-td pd-td-check">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                    onClick={e => e.stopPropagation()}
                    className="pd-checkbox"
                    aria-label={`Select ${row.exp}`}
                  />
                </td>
                <td className="proj-td pd-td-exp">
                  <span className="proj-name-link">{row.exp}</span>
                </td>
                <td className="proj-td"><StatusBadge status={row.status} /></td>
                <td className="proj-td pd-td-truncate">{row.audience}</td>
                <td className="proj-td pd-td-truncate">{row.promotion}</td>
                <td className="proj-td pd-td-truncate">{row.ipd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
