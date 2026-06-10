import React, { useState, useMemo } from 'react'
import KpiCard from '../components/KpiCard'
import './CampaignDetailPage.css'
import '../components/KpiStrip.css'

// ─── Mock detail data ─────────────────────────────────────────────────────────

const CAMPAIGN_META_MAP = {
  default: {
    id: 'CAMP-2024-0034',
    status: 'Draft',
    version: 'v1',
    startDate: 'September 1, 2025',
    endDate: 'November 30, 2025',
    objective: 'Drive trial-to-paid conversions for QBLive',
    products: 'QuickBooks Live, QuickBooks Online',
    performanceGoal: 'CTR > 4.5% · Conversion rate > 2.8%',
    businessUnit: 'QuickBooks',
    campaignDetails: 'This campaign targets existing QBLive trial users approaching the end of their free trial period. The goal is to offer a compelling 50% discount to convert them to paid subscribers before the trial expires.',
    referenceNo: 'REF-QB-2024-0892',
    driver: 'Q3 Revenue Target',
    tactic: 'Limited-time discount offer',
    priority: 'High',
    sku: 'QBLIVE-50PCT-Q3',
  },
}

function getMeta(campaignName) {
  return CAMPAIGN_META_MAP[campaignName] || {
    ...CAMPAIGN_META_MAP.default,
    campaignDetails: `Campaign targeting key audience segments for "${campaignName}". Optimised for engagement and conversion across IPD and email channels.`,
  }
}

// ─── Mock linked data ────────────────────────────────────────────────────────

const AUDIENCES = [
  { id: 'AUD-001', name: 'QB Trial Users — Expiring 7 days',  size: '142K',  type: 'Behavioral',  status: 'Active' },
  { id: 'AUD-002', name: 'DIFM Subscribers — High intent',    size: '89K',   type: 'Lookalike',   status: 'Active' },
  { id: 'AUD-003', name: 'QBLive Churned — Last 90 days',     size: '34K',   type: 'Re-engagement', status: 'Paused' },
]

const OFFERS = [
  { id: 'OFF-001', name: '50% off QBLive — First 3 months', discount: '50%',  type: 'Subscription discount', status: 'Active' },
  { id: 'OFF-002', name: 'Free onboarding session',          discount: '$0',   type: 'Service add-on',        status: 'Active' },
  { id: 'OFF-003', name: '30-day trial extension',           discount: '+30d', type: 'Trial extension',       status: 'Draft' },
]

const EXPERIMENTS = [
  { id: 'EXP-A01', name: 'Subject line A/B — urgency vs benefit',  status: 'Running',   variants: 2, significance: '84%' },
  { id: 'EXP-A02', name: 'CTA button colour — green vs purple',     status: 'Running',   variants: 2, significance: '71%' },
  { id: 'EXP-A03', name: 'Send-time optimisation — morning vs eve', status: 'Completed', variants: 2, significance: '97%' },
]

// ─── Mock experiences ─────────────────────────────────────────────────────────

const EXPERIENCES = [
  { id: 'EXP-0001', name: 'PLM7781-IPD-MDIWM30DHigh',  status: 'Published',       lastModified: '1 min ago',   audience: 'QB Trial Users',       channel: 'IPD' },
  { id: 'EXP-0002', name: 'ZXC1109-IPD-epDiscount30',  status: 'Draft',           lastModified: '2 hours ago', audience: 'DIFM Subscribers',     channel: 'IPD' },
  { id: 'EXP-0003', name: 'WWS9021-IPD-DIWMDeepDisc',  status: 'Awaiting review', lastModified: 'Yesterday',   audience: 'Trial Expiring 7 Day', channel: 'Email' },
  { id: 'EXP-0004', name: 'PLM4421-IPD-AMDIWM60DLow',  status: 'Reviewed',        lastModified: '2 days ago',  audience: 'QB Trial Users',       channel: 'Push' },
  { id: 'EXP-0005', name: 'ZXC7732-IPD-epDiscount60',  status: 'Edited',          lastModified: '3 days ago',  audience: 'DIFM Subscribers',     channel: 'IPD' },
]

const STATUS_CONFIG = {
  'Draft':           { cls: 'cd-badge--draft' },
  'Edited':          { cls: 'cd-badge--edited' },
  'Error':           { cls: 'cd-badge--error' },
  'Published':       { cls: 'cd-badge--published' },
  'Awaiting review': { cls: 'cd-badge--awaiting' },
  'Accepted':        { cls: 'cd-badge--accepted' },
  'Reviewed':        { cls: 'cd-badge--reviewed' },
  'Unpublished':     { cls: 'cd-badge--unpublished' },
}

// ─── Mock insights KPIs ───────────────────────────────────────────────────────

const INSIGHTS_KPIS = [
  {
    id: 'cd-impressions',
    drilldownRoute: 'camp-impressions-drilldown',
    label: 'Total impressions',
    value: '2.4M',
    pill: { color: 'mint', text: '↑ 18% vs last month' },
    sparkline: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.35, 2.4],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Campaign duration',
    action: { label: 'View breakdown' },
  },
  {
    id: 'cd-ctr',
    drilldownRoute: 'camp-ctr-drilldown',
    label: 'Click-through rate',
    value: '5.8%',
    pill: { color: 'mint', text: '↑ 0.6% vs avg' },
    sparkline: [4.8, 5.0, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Campaign duration',
    action: { label: 'View breakdown' },
  },
  {
    id: 'cd-open-rate',
    drilldownRoute: 'camp-open-rate-drilldown',
    label: 'Email open rate',
    value: '34.2%',
    pill: { color: 'mint', text: '↑ 2.8% vs benchmark' },
    sparkline: [30.1, 31.0, 32.0, 32.5, 33.0, 33.6, 34.0, 34.2],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Campaign duration',
    action: { label: 'View breakdown' },
  },
  {
    id: 'cd-conversions',
    drilldownRoute: 'camp-conversions-drilldown',
    label: 'Conversions',
    value: '1,847',
    pill: { color: 'mint', text: '↑ 312 vs target' },
    sparkline: [800, 950, 1100, 1200, 1400, 1580, 1720, 1847],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Campaign duration',
    action: { label: 'View breakdown' },
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconChevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2.5 4l2.5 2.5L7.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 10V3a1 1 0 0 1 1-1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Tab: Campaign Meta ───────────────────────────────────────────────────────

function MetaField({ label, value, wide }) {
  return (
    <div className={`cd-meta-field${wide ? ' cd-meta-field--wide' : ''}`}>
      <span className="cd-meta-label">{label}</span>
      <span className="cd-meta-value">{value}</span>
    </div>
  )
}

function CampaignMetaTab({ meta }) {
  return (
    <div className="cd-meta-tab">
      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Basic information</h3>
        <div className="cd-meta-grid">
          <MetaField label="Campaign name"         value={meta.campaignDetails ? 'Create 50% off QBLive offer' : '—'} wide />
          <MetaField label="Campaign reference no" value={meta.referenceNo} />
          <MetaField label="Status"                value={meta.status} />
          <MetaField label="Priority"              value={meta.priority} />
        </div>
      </div>

      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Schedule & targeting</h3>
        <div className="cd-meta-grid">
          <MetaField label="Start date"     value={meta.startDate} />
          <MetaField label="End date"       value={meta.endDate} />
          <MetaField label="Business unit"  value={meta.businessUnit} />
          <MetaField label="Products"       value={meta.products} />
        </div>
      </div>

      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Goals & strategy</h3>
        <div className="cd-meta-grid">
          <MetaField label="Objective"         value={meta.objective} wide />
          <MetaField label="Performance goal"  value={meta.performanceGoal} wide />
          <MetaField label="Driver"            value={meta.driver} />
          <MetaField label="Tactic"            value={meta.tactic} />
          <MetaField label="SKU"               value={meta.sku} />
        </div>
      </div>

      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Campaign details</h3>
        <p className="cd-meta-body">{meta.campaignDetails}</p>
      </div>

      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Audiences</h3>
        <div className="cd-linked-list">
          {AUDIENCES.map(a => (
            <div key={a.id} className="cd-linked-row">
              <div className="cd-linked-row-main">
                <span className="cd-linked-name">{a.name}</span>
                <span className="cd-linked-meta">{a.type} · {a.size}</span>
              </div>
              <span className={`cd-badge ${a.status === 'Active' ? 'cd-badge--published' : 'cd-badge--unpublished'}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Offers</h3>
        <div className="cd-linked-list">
          {OFFERS.map(o => (
            <div key={o.id} className="cd-linked-row">
              <div className="cd-linked-row-main">
                <span className="cd-linked-name">{o.name}</span>
                <span className="cd-linked-meta">{o.type}</span>
              </div>
              <div className="cd-linked-row-right">
                <span className="cd-linked-discount">{o.discount}</span>
                <span className={`cd-badge ${o.status === 'Active' ? 'cd-badge--published' : 'cd-badge--draft'}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cd-meta-section">
        <h3 className="cd-meta-section-title">Experiments</h3>
        <div className="cd-linked-list">
          {EXPERIMENTS.map(e => (
            <div key={e.id} className="cd-linked-row">
              <div className="cd-linked-row-main">
                <span className="cd-linked-name">{e.name}</span>
                <span className="cd-linked-meta">{e.variants} variants · {e.significance} significance</span>
              </div>
              <span className={`cd-badge ${e.status === 'Running' ? 'cd-badge--reviewed' : 'cd-badge--accepted'}`}>{e.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir, prefix }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`${prefix}-sort-icon${active ? ` ${prefix}-sort-icon--active` : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Tab: Experiences ─────────────────────────────────────────────────────────

function ExperiencesTab({ navigate }) {
  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  const EXP_COLS = [
    { key: 'name',         label: 'Experience name' },
    { key: 'status',       label: 'Status' },
    { key: 'channel',      label: 'Channel' },
    { key: 'audience',     label: 'Audience' },
    { key: 'lastModified', label: 'Last modified' },
  ]

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    if (!sortCol) return EXPERIENCES
    return [...EXPERIENCES].sort((a, b) => {
      const av = (a[sortCol] || '').toLowerCase()
      const bv = (b[sortCol] || '').toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [sortCol, sortDir])

  return (
    <div className="cd-exp-tab">
      <div className="cd-exp-toolbar">
        <span className="cd-exp-count">{EXPERIENCES.length} experiences</span>
        <button className="cd-exp-add-btn">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add experience
        </button>
      </div>
      <div className="cd-exp-table-wrap">
        <table className="cd-exp-table">
          <thead>
            <tr>
              {EXP_COLS.map(col => (
                <th
                  key={col.key}
                  className={`cd-exp-th cd-exp-th--sortable${sortCol === col.key ? ' cd-exp-th--active' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="cd-exp-th-inner">
                    {col.label}
                    <SortIcon prefix="cd-exp" active={sortCol === col.key} dir={sortCol === col.key ? sortDir : 'asc'} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const sc = STATUS_CONFIG[row.status] || {}
              return (
                <tr key={row.id} className="cd-exp-row">
                  <td className="cd-exp-td cd-exp-td--name">
                    <button className="cd-exp-name-btn" onClick={() => navigate && navigate(`campaigns/experience/${encodeURIComponent(row.name)}`)}>{row.name}</button>
                    <span className="cd-exp-id">{row.id}</span>
                  </td>
                  <td className="cd-exp-td">
                    <span className={`cd-badge ${sc.cls || ''}`}>{row.status}</span>
                  </td>
                  <td className="cd-exp-td">{row.channel}</td>
                  <td className="cd-exp-td">{row.audience}</td>
                  <td className="cd-exp-td">{row.lastModified}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Tab: Insights ────────────────────────────────────────────────────────────

function InsightsTab({ navigate }) {
  return (
    <div className="cd-insights-tab">
      <div className="kpi-strip">
        {INSIGHTS_KPIS.map(kpi => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            pill={kpi.pill}
            sparkline={kpi.sparkline}
            sparklineColor={kpi.sparklineColor}
            sparklineLabel={kpi.sparklineLabel}
            action={kpi.action}
            onDrilldown={() => navigate && navigate(kpi.drilldownRoute)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── CampaignDetailPage ───────────────────────────────────────────────────────

const TABS = ['Campaign meta', 'Experiences', 'Insights']

export default function CampaignDetailPage({ campaignName, navigate }) {
  const [activeTab, setActiveTab] = useState('Campaign meta')
  const [copied, setCopied] = useState(false)

  const meta = getMeta(campaignName)
  const statusCfg = STATUS_CONFIG[meta.status] || {}

  function handleCopy() {
    navigator.clipboard?.writeText(meta.id).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="cd-detail-page">
      {/* Header bar */}
      <div className="cd-header-bar">
        <div className="cd-header-left">
          <h1 className="cd-page-title">{campaignName}</h1>
          <span className="cd-header-sep" />
          <span className={`cd-badge ${statusCfg.cls || ''}`}>{meta.status}</span>
          <span className="cd-meta-divider">|</span>
          <span className="cd-meta-inline">
            <span className="cd-meta-lbl">ID:</span>
            <span className="cd-meta-val">{meta.id}</span>
            <button className="cd-meta-copy" aria-label="Copy ID" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy ID'}>
              <IconCopy />
            </button>
          </span>
          <span className="cd-meta-divider">|</span>
          <button className="cd-version-btn">{meta.version} <IconChevron /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="cd-detail-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`cd-detail-tab${activeTab === tab ? ' cd-detail-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="cd-detail-content">
        {activeTab === 'Campaign meta' && <CampaignMetaTab meta={meta} />}
        {activeTab === 'Experiences'   && <ExperiencesTab navigate={navigate} />}
        {activeTab === 'Insights'      && <InsightsTab navigate={navigate} />}
      </div>
    </div>
  )
}
