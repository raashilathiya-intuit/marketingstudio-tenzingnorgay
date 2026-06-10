import React, { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import KpiCard from '../components/KpiCard'
import KpiPeriodDropdown from '../components/KpiPeriodDropdown'
import '../components/KpiStrip.css'
import './ExperimentsPage.css'

// ─── KPI tiles ─────────────────────────────────────────────────────────────────

const EXPERIMENTS_KPIS = [
  {
    id: 'active-experiments',
    label: 'Active experiments',
    value: '7',
    pill: { color: 'lavender', text: '2 near significance' },
    sparkline: [6, 7, 6, 7, 7, 6, 7, 7],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View all' },
  },
  {
    id: 'win-rate',
    label: 'Win rate',
    value: '43%',
    pill: { color: 'mint', text: '↑ 5% vs last quarter' },
    sparkline: [36, 38, 39, 40, 41, 42, 43, 43],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
  },
  {
    id: 'avg-cycle-time',
    label: 'Avg cycle time',
    value: '21d',
    pill: { color: 'pink', text: '↑ 3d vs last quarter' },
    sparkline: [18, 19, 19, 20, 20, 21, 21, 21],
    sparklineColor: 'var(--pill-pink-ink)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View breakdown' },
  },
  {
    id: 'near-significance',
    label: 'Near significance',
    value: '2',
    pill: { color: 'lavender', text: 'Review recommended' },
    sparkline: [2, 1, 2, 2, 1, 2, 2, 2],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'Review now' },
  },
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

const ALL_EXPERIMENTS = [
  { id: 606874, name: 'ELM7501_Commerce_Hero_State_Recurring_Payments_Experiment', key: 'IXP2_606874', owner: 'bot-gtm-mha-4642761', app: 'MarketingHub', startDate: '5/13/26 09:12 AM', endDate: '5/20/26 05:30 AM', lastEdited: '5/13/26 09:12 AM', status: 'DRAFT' },
  { id: 606873, name: 'ELM7501_Recurring_Payments_Experiment',                     key: 'IXP2_606873', owner: 'bot-gtm-mha-4642761', app: 'MarketingHub', startDate: '5/13/26 08:49 AM', endDate: '5/27/26 08:49 AM', lastEdited: '5/13/26 08:49 AM', status: 'DRAFT' },
  { id: 606872, name: 'QB_Live_Beta_DFY_Cat_Experiment_1',                         key: 'IXP2_606872', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/13/26 08:42 AM', endDate: '5/27/26 08:42 AM', lastEdited: '5/13/26 08:42 AM', status: 'DRAFT' },
  { id: 606871, name: 'QB_Live_Beta_DFY_Cat_Experiment_1',                         key: 'IXP2_606871', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/13/26 08:42 AM', endDate: '5/27/26 08:42 AM', lastEdited: '5/13/26 08:42 AM', status: 'DRAFT' },
  { id: 606870, name: 'ELM9587_IAS_Beta_Mitigation_Experiment',                    key: 'IXP2_606870', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/13/26 08:25 AM', endDate: '5/27/26 08:17 AM', lastEdited: '5/13/26 08:25 AM', status: 'RUNNING' },
  { id: 606867, name: 'IPD_Subscription_Card_Upgrade_Test_-_ELM9565_v2',           key: 'IXP2_606867', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/13/26 07:57 AM', endDate: '5/27/26 07:57 AM', lastEdited: '5/13/26 07:57 AM', status: 'DRAFT' },
  { id: 606866, name: 'IPD_Subscription_Card_Upgrade_Test_-_ELM9565',              key: 'IXP2_606866', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/13/26 07:56 AM', endDate: '5/27/26 07:49 AM', lastEdited: '5/13/26 07:56 AM', status: 'DRAFT' },
  { id: 606865, name: 'ELM9559_QuickBooks_Capital_Term_Loan_APR_Test',             key: 'IXP2_606865', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/13/26 07:35 AM', endDate: '6/30/26 05:30 AM', lastEdited: '5/13/26 07:35 AM', status: 'RUNNING' },
  { id: 606859, name: 'mcp-smoke-2026-05-12-B10-MC_PROSPECT_ID',                   key: 'IXP2_606859', owner: 'moginsky',            app: 'APP1',         startDate: '6/1/26 05:30 AM',  endDate: '9/1/26 05:30 AM',  lastEdited: '5/13/26 07:18 AM', status: 'DRAFT' },
  { id: 606858, name: 'mcp-smoke-2026-05-12-B09-MC_USER_ID',                       key: 'IXP2_606858', owner: 'moginsky',            app: 'APP1',         startDate: '5/13/26 07:26 AM', endDate: '9/1/26 05:30 AM',  lastEdited: '5/13/26 07:26 AM', status: 'RUNNING' },
  { id: 606850, name: 'ELM9201_Holiday_Promo_Email_Variant_Test',                  key: 'IXP2_606850', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/12/26 03:10 PM', endDate: '5/26/26 03:10 PM', lastEdited: '5/12/26 03:10 PM', status: 'DRAFT' },
  { id: 606845, name: 'QB_Payroll_Onboarding_Step2_Optimization',                  key: 'IXP2_606845', owner: 'jsmith-qbo',          app: 'QBO',          startDate: '5/12/26 01:45 PM', endDate: '6/12/26 01:45 PM', lastEdited: '5/12/26 02:00 PM', status: 'RUNNING' },
  { id: 606840, name: 'IPD_Banner_CTR_Uplift_Test_v3',                             key: 'IXP2_606840', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/12/26 11:30 AM', endDate: '5/26/26 11:30 AM', lastEdited: '5/12/26 11:30 AM', status: 'DRAFT' },
  { id: 606835, name: 'ELM8890_Self_Employed_Tax_CTA_Experiment',                  key: 'IXP2_606835', owner: 'bot-gtm-mha-4642761', app: 'MarketingHub', startDate: '5/11/26 04:22 PM', endDate: '5/25/26 04:22 PM', lastEdited: '5/11/26 04:22 PM', status: 'RUNNING' },
  { id: 606820, name: 'QBO_Dashboard_Upsell_Modal_A_B',                            key: 'IXP2_606820', owner: 'pnair-intuit',        app: 'QBO',          startDate: '5/10/26 09:00 AM', endDate: '6/10/26 09:00 AM', lastEdited: '5/10/26 09:05 AM', status: 'RUNNING' },
  { id: 606810, name: 'ELM8801_DIFM_Welcome_Email_Subject_Line_Test',              key: 'IXP2_606810', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/9/26 02:15 PM',  endDate: '5/23/26 02:15 PM', lastEdited: '5/9/26 02:15 PM',  status: 'DRAFT' },
  { id: 606800, name: 'QB_Capital_Offer_Tile_Placement_Test',                      key: 'IXP2_606800', owner: 'dchen-qbo',           app: 'QBO',          startDate: '5/8/26 10:00 AM',  endDate: '6/8/26 10:00 AM',  lastEdited: '5/8/26 10:12 AM',  status: 'RUNNING' },
  { id: 606790, name: 'IPD_InApp_Nudge_Frequency_Cap_Experiment',                  key: 'IXP2_606790', owner: 'bot-mkt-mwa-4838820', app: 'MarketingHub', startDate: '5/7/26 08:30 AM',  endDate: '5/21/26 08:30 AM', lastEdited: '5/7/26 08:30 AM',  status: 'DRAFT' },
  { id: 606780, name: 'ELM8750_Accountant_Partner_Referral_Test',                  key: 'IXP2_606780', owner: 'mwest-intuit',        app: 'MarketingHub', startDate: '5/6/26 03:00 PM',  endDate: '6/6/26 03:00 PM',  lastEdited: '5/6/26 03:00 PM',  status: 'RUNNING' },
  { id: 606770, name: 'QB_Payments_Feature_Discovery_Modal_Test',                  key: 'IXP2_606770', owner: 'jdoe-intuit',         app: 'QBO',          startDate: '5/5/26 11:00 AM',  endDate: '6/5/26 11:00 AM',  lastEdited: '5/5/26 11:00 AM',  status: 'DRAFT' },
]

const PAGE_SIZE = 10

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={`exp-status exp-status--${status.toLowerCase()}`}>
      {status}
    </span>
  )
}

// ─── Key pill ──────────────────────────────────────────────────────────────────

function KeyPill({ value }) {
  return <span className="exp-key-pill">{value}</span>
}

// ─── Sort icon ─────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`exp-sort-icon${active ? ' exp-sort-icon--active' : ''}`}>
      <path
        d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── ExperimentsPage ───────────────────────────────────────────────────────────

export default function ExperimentsPage() {
  const [search, setSearch]   = useState('')
  const [sortCol, setSortCol] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage]       = useState(1)
  const [period, setPeriod]   = useState('week')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return ALL_EXPERIMENTS
    return ALL_EXPERIMENTS.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.key.toLowerCase().includes(q) ||
      e.owner.toLowerCase().includes(q) ||
      e.app.toLowerCase().includes(q) ||
      e.status.toLowerCase().includes(q)
    )
  }, [search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol]
      if (sortCol === 'id') { av = Number(av); bv = Number(bv) }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
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

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    if (safePage <= 3) {
      pages.push(1, 2, 3, 4, 5, '…', totalPages)
    } else if (safePage >= totalPages - 2) {
      pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '…', safePage - 1, safePage, safePage + 1, '…', totalPages)
    }
    return pages
  }, [safePage, totalPages])

  const COLS = [
    { key: 'id',          label: 'ID',           sortable: true },
    { key: 'name',        label: 'Name',         sortable: true },
    { key: 'key',         label: 'Key',          sortable: false },
    { key: 'owner',       label: 'Owner',        sortable: true },
    { key: 'app',         label: 'App',          sortable: true },
    { key: 'startDate',   label: 'Start date',   sortable: true },
    { key: 'endDate',     label: 'End date',     sortable: true },
    { key: 'lastEdited',  label: 'Last edited',  sortable: true },
    { key: 'status',      label: 'Status',       sortable: true },
    { key: 'results',     label: 'Results',      sortable: false },
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
      <PageHeader title="Experiments" meta={false} onOpenLibrary={() => {}} rightSlot={headerRight} />

      {/* KPI strip */}
      <div className="kpi-strip-section">
        <div className="kpi-strip">
          {EXPERIMENTS_KPIS.map((kpi) => (
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
      <div className="exp-toolbar">
        <div className="exp-toolbar-left">
          <div className="exp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="exp-search-icon">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="exp-search-input"
              placeholder="Search experiments…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              aria-label="Search experiments"
            />
            {search && (
              <button className="exp-search-clear" onClick={() => handleSearch('')} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <button className="exp-filter-btn" aria-label="Filter">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Filter
          </button>
        </div>
        <button className="exp-create-btn">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Create experiment
        </button>
      </div>

      {/* Table */}
      <div className="exp-table-wrap">
        <div className="exp-table-scroll">
          <table className="exp-table">
            <thead>
              <tr>
                {COLS.map(col => (
                  <th
                    key={col.key}
                    className={`exp-th${col.sortable ? ' exp-th--sortable' : ''}${sortCol === col.key ? ' exp-th--active' : ''}`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="exp-th-inner">
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
                  <td colSpan={COLS.length} className="exp-empty-cell">No experiments match your search.</td>
                </tr>
              ) : pageRows.map(row => (
                <tr key={row.id} className="exp-row">
                  <td className="exp-td exp-td--id"><a href="#" className="exp-id-link" onClick={e => e.preventDefault()}>{row.id}</a></td>
                  <td className="exp-td exp-td--name">
                    <a href="#" className="exp-name-link" onClick={e => e.preventDefault()}>{row.name}</a>
                  </td>
                  <td className="exp-td"><KeyPill value={row.key} /></td>
                  <td className="exp-td">{row.owner}</td>
                  <td className="exp-td">{row.app}</td>
                  <td className="exp-td exp-td--date">{row.startDate}</td>
                  <td className="exp-td exp-td--date">{row.endDate}</td>
                  <td className="exp-td exp-td--date">{row.lastEdited}</td>
                  <td className="exp-td"><StatusBadge status={row.status} /></td>
                  <td className="exp-td exp-td--results">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="exp-pagination">
        <span className="exp-pagination-info">
          {sorted.length === 0
            ? '0 experiments'
            : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, sorted.length)} of ${sorted.length.toLocaleString()} experiments`
          }
        </span>
        <div className="exp-pagination-controls">
          <button className="exp-page-btn" disabled={safePage <= 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {pageNumbers.map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="exp-page-ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={`exp-page-btn exp-page-num${p === safePage ? ' exp-page-num--active' : ''}`}
                onClick={() => setPage(p)}
                aria-current={p === safePage ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}
          <button className="exp-page-btn" disabled={safePage >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Next page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
