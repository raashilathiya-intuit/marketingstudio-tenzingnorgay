import React, { useState, useMemo } from 'react'
import './Queue.css'
import { CAMPAIGNS, QUEUE_GROUPS } from '../data/mock'
import PastelPill from './PastelPill'

const STATUS_PILL = {
  Active: { color: 'live', text: 'Active' },
  Launching: { color: 'lavender', text: 'Launching' },
  Blocked: { color: 'pink', text: 'Blocked' },
  Waiting: { color: 'peach', text: 'Waiting' },
}

const CHANNEL_DOTS = {
  Email: '#2DBA75',
  IPD: '#6B5BD6',
  'Email + IPD': '#2DBABA',
}

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`queue-sort-icon${active ? ' queue-sort-icon--active' : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function parseMetric(str) {
  if (!str || str === '—') return -Infinity
  return parseFloat(String(str).replace(/[^0-9.-]/g, '')) || 0
}

function ChannelDot({ channel }) {
  const color = CHANNEL_DOTS[channel] || 'var(--ink-3)'
  return (
    <span className="channel-dot-wrap">
      <span className="channel-dot" style={{ background: color }} />
      <span className="channel-label">{channel}</span>
    </span>
  )
}

function AttentionFlag() {
  return (
    <span className="attention-flag" title="Needs attention" aria-label="Needs attention">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M6.5 1L12 11H1L6.5 1Z" stroke="var(--pill-peach-ink)" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M6.5 5v3" stroke="var(--pill-peach-ink)" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="6.5" cy="9.5" r="0.5" fill="var(--pill-peach-ink)" />
      </svg>
    </span>
  )
}

function QueueRow({ campaign }) {
  const pill = STATUS_PILL[campaign.status]
  return (
    <tr className={`queue-row${campaign.attention ? ' queue-row--attention' : ''}`}>
      <td className="queue-cell queue-cell--check">
        <input type="checkbox" className="queue-checkbox" aria-label={`Select ${campaign.id}`} />
      </td>
      <td className="queue-cell queue-cell--name">
        <div className="queue-campaign-name">
          {campaign.attention && <AttentionFlag />}
          <span className="queue-campaign-title">{campaign.name}</span>
        </div>
        <div className="queue-campaign-id">{campaign.id}</div>
      </td>
      <td className="queue-cell queue-cell--product">{campaign.product}</td>
      <td className="queue-cell queue-cell--status">
        <PastelPill color={pill.color} size="sm">{pill.text}</PastelPill>
      </td>
      <td className="queue-cell queue-cell--stage">{campaign.stage}</td>
      <td className="queue-cell queue-cell--channel">
        <ChannelDot channel={campaign.channel} />
      </td>
      <td className="queue-cell queue-cell--metric tnum">{campaign.openRate}</td>
      <td className="queue-cell queue-cell--metric tnum">{campaign.clickRate}</td>
      <td className="queue-cell queue-cell--metric tnum">{campaign.ipdCtr}</td>
      <td className="queue-cell queue-cell--action">
        <button className="queue-action-link">
          Open
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </td>
    </tr>
  )
}

function GroupHeader({ label, count, isOpen, onToggle }) {
  return (
    <tr className="queue-group-header">
      <td colSpan={10}>
        <button className="group-toggle" onClick={onToggle} aria-expanded={isOpen}>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
            aria-hidden="true"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="group-label">{label}</span>
          <span className="group-count">{count}</span>
        </button>
      </td>
    </tr>
  )
}

const QUEUE_SORT_COLS = [
  { key: 'name',      label: 'Campaign',  numeric: false },
  { key: 'product',   label: 'Product',   numeric: false },
  { key: 'status',    label: 'Status',    numeric: false },
  { key: 'stage',     label: 'Stage',     numeric: false },
  { key: 'channel',   label: 'Channel',   numeric: false },
  { key: 'openRate',  label: 'Open rate', numeric: true },
  { key: 'clickRate', label: 'Click rate',numeric: true },
  { key: 'ipdCtr',    label: 'IPD CTR',   numeric: true },
]

export default function Queue() {
  const [openGroups, setOpenGroups] = useState({ Active: true, Launching: true, Blocked: true, Waiting: true })
  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const toggleGroup = (status) => {
    setOpenGroups((prev) => ({ ...prev, [status]: !prev[status] }))
  }

  const meta = QUEUE_SORT_COLS.find(c => c.key === sortCol)

  const campaignsByStatus = useMemo(() => {
    return QUEUE_GROUPS.reduce((acc, group) => {
      let rows = CAMPAIGNS.filter((c) => c.status === group.status)
      if (sortCol) {
        rows = [...rows].sort((a, b) => {
          const av = meta?.numeric ? parseMetric(a[sortCol]) : (a[sortCol] || '').toLowerCase()
          const bv = meta?.numeric ? parseMetric(b[sortCol]) : (b[sortCol] || '').toLowerCase()
          if (av < bv) return sortDir === 'asc' ? -1 : 1
          if (av > bv) return sortDir === 'asc' ? 1 : -1
          return 0
        })
      }
      acc[group.status] = rows
      return acc
    }, {})
  }, [sortCol, sortDir])

  return (
    <section className="queue-section">
      <div className="queue-header">
        <div className="queue-header-left">
          <h2 className="queue-title">My campaigns</h2>
          <span className="queue-summary">8 live · sorted by attention needed</span>
        </div>
        <div className="queue-header-right">
          <button className="ghost-btn">Export CSV</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="queue-toolbar">
        <div className="queue-search-wrap">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="var(--ink-3)" strokeWidth="1.4" />
            <path d="M10 10l2.5 2.5" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input className="queue-search" type="text" placeholder="Search campaigns" aria-label="Search campaigns" />
        </div>
        <div className="queue-toolbar-right">
          <button className="toolbar-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2 4h9M4 6.5h5M6 9h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Sort
          </button>
          <button className="toolbar-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="4" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M1.5 2h10M1.5 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Group
          </button>
          <button className="toolbar-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="11" height="2" rx="1" fill="currentColor" />
              <rect x="1" y="5.5" width="11" height="2" rx="1" fill="currentColor" />
              <rect x="1" y="9" width="11" height="2" rx="1" fill="currentColor" />
            </svg>
            Density
          </button>
          <button className="toolbar-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="7" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="1" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Columns
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="queue-table-wrap">
        <table className="queue-table">
          <thead>
            <tr className="queue-head-row">
              <th className="queue-th queue-th--check">
                <input type="checkbox" className="queue-checkbox" aria-label="Select all" />
              </th>
              {QUEUE_SORT_COLS.map((col, i) => (
                <th
                  key={col.key}
                  className={`queue-th queue-th--sortable${i === 0 ? ' queue-th--name' : ''}${col.numeric ? ' queue-th--metric' : ''}${sortCol === col.key ? ' queue-th--active' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="queue-th-inner">
                    {col.label}
                    <SortIcon active={sortCol === col.key} dir={sortCol === col.key ? sortDir : 'asc'} />
                  </span>
                </th>
              ))}
              <th className="queue-th queue-th--action" />
            </tr>
          </thead>
          <tbody>
            {QUEUE_GROUPS.map((group) => (
              <React.Fragment key={group.status}>
                <GroupHeader
                  label={group.label}
                  count={group.count}
                  isOpen={openGroups[group.status]}
                  onToggle={() => toggleGroup(group.status)}
                />
                {openGroups[group.status] &&
                  campaignsByStatus[group.status].map((campaign) => (
                    <QueueRow key={campaign.id} campaign={campaign} />
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
