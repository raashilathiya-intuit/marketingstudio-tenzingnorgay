import React, { useState, useRef, useEffect, useMemo } from 'react'
import './IpdImpressionsDrilldown.css'
import KpiCard from '../components/KpiCard'
import KpiPeriodDropdown from '../components/KpiPeriodDropdown'

// ─── Channel table data ────────────────────────────────────────────────────────

const CHANNEL_ROWS = [
  {
    channel: 'Email',
    icon: 'email',
    impressions: '28.1M',
    vsLastWk: '+6.9%',
    vsUp: true,
    uniqueReach: '10.2M',
    freq: '2.8×',
    openCtr: '22.4%',
    vsBench: '+4.2%',
    vsBenchUp: true,
    unsub: '0.12%',
    status: 'On track',
    statusOk: true,
  },
  {
    channel: 'Push',
    icon: 'push',
    impressions: '12.4M',
    vsLastWk: '+7.7%',
    vsUp: true,
    uniqueReach: '5.8M',
    freq: '2.1×',
    openCtr: '8.1%',
    vsBench: '+1.8%',
    vsBenchUp: true,
    unsub: '0.04%',
    status: 'On track',
    statusOk: true,
  },
  {
    channel: 'In-app',
    icon: 'inapp',
    impressions: '8.2M',
    vsLastWk: '+9.5%',
    vsUp: true,
    uniqueReach: '3.4M',
    freq: '2.4×',
    openCtr: '15.6%',
    vsBench: '+3.1%',
    vsBenchUp: true,
    unsub: '—',
    status: 'Review',
    statusOk: false,
  },
  {
    channel: 'Total',
    icon: null,
    impressions: '48.7M',
    vsLastWk: '+7.5%',
    vsUp: true,
    uniqueReach: '19.4M',
    freq: '2.5×',
    openCtr: '18.6%',
    vsBench: '+3.4%',
    vsBenchUp: true,
    unsub: '0.08%',
    status: 'On track',
    statusOk: true,
    isTotal: true,
  },
]

// ─── Sparkline data ────────────────────────────────────────────────────────────

const SPARKLINES = {
  email: [22.1, 23.4, 25.6, 24.2, 26.8, 27.5, 28.1],
  push:  [9.8, 10.2, 11.1, 11.5, 11.8, 12.1, 12.4],
  inapp: [6.2, 6.8, 7.1, 7.4, 7.8, 8.0, 8.2],
  total: [38.1, 40.4, 43.8, 43.1, 46.4, 47.6, 48.7],
}

// ─── Multi-line trend chart — dynamic width, no SVG distortion ───────────────

const AVENIR = "'AvenirNext_forINTUIT:Regular', 'Avenir Next', Avenir, sans-serif"

function TrendChart() {
  const containerRef = useRef(null)
  const [cw, setCw] = useState(700)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setCw(Math.floor(entry.contentRect.width))
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const H = 200
  const padL = 50, padR = 20, padT = 16, padB = 30
  const areaW = cw - padL - padR
  const areaH = H - padT - padB
  const yMin = 5, yMax = 30
  const yTicks = [5, 10, 15, 20, 25, 30]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const sx = (i, n) => padL + (i / (n - 1)) * areaW
  const sy = (v) => padT + areaH - ((v - yMin) / (yMax - yMin)) * areaH
  const mkPath = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i, data.length)},${sy(v)}`).join(' ')
  const mkArea = (data) => {
    const line = mkPath(data)
    const bottom = sy(yMin)
    return `${line} L ${sx(data.length - 1, data.length)},${bottom} L ${padL},${bottom} Z`
  }

  const { email, push, inapp } = SPARKLINES

  return (
    <div ref={containerRef} className="ipd-trend-chart-wrap">
      <svg width={cw} height={H} style={{ display: 'block', overflow: 'visible' }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={padL} y1={sy(v)} x2={cw - padR} y2={sy(v)} stroke="#E5E5EA" strokeWidth="1" />
            <text x={padL - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#B0B0B5" fontFamily={AVENIR}>{v}M</text>
          </g>
        ))}
        {days.map((d, i) => (
          <text key={d} x={sx(i, days.length)} y={H - padB + 16} textAnchor="middle" fontSize="11" fill="#B0B0B5" fontFamily={AVENIR}>{d}</text>
        ))}
        <path d={mkArea(email)} fill="#6B5BD6" fillOpacity="0.07" />
        <path d={mkArea(push)}  fill="#2DBABA" fillOpacity="0.07" />
        <path d={mkArea(inapp)} fill="#2DBA75" fillOpacity="0.07" />
        <path d={mkPath(email)} stroke="#6B5BD6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={mkPath(push)}  stroke="#2DBABA" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={mkPath(inapp)} stroke="#2DBA75" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {[
          { data: email, color: '#6B5BD6' },
          { data: push,  color: '#2DBABA' },
          { data: inapp, color: '#2DBA75' },
        ].map(({ data, color }) => (
          <circle key={color} cx={sx(data.length - 1, data.length)} cy={sy(data[data.length - 1])} r="4" fill={color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

// ─── Gauge (semi-circle, full tile width) ────────────────────────────────────

function FrequencyGauge({ value = 2.5, max = 5 }) {
  const pct = Math.min(value / max, 1)
  const r = 40, cx = 60, cy = 52
  const startAngle = Math.PI, endAngle = 0
  const angle = startAngle + (endAngle - startAngle) * pct
  function polar(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)] }
  const bgStart = polar(cx, cy, r, startAngle)
  const bgEnd   = polar(cx, cy, r, endAngle)
  const fillEnd = polar(cx, cy, r, angle)
  const largeArc = pct > 0.5 ? 1 : 0
  const ticks = [1, 2, 3, 4, 5].map(t => {
    const a = startAngle + (endAngle - startAngle) * (t / max)
    return { pos: polar(cx, cy, r + 11, a), active: value >= t, label: `${t}×` }
  })
  return (
    <svg viewBox="0 0 120 68" width="100%" height="68" style={{ display: 'block' }} fill="none">
      <path d={`M ${bgStart[0]},${bgStart[1]} A ${r},${r} 0 1,1 ${bgEnd[0]},${bgEnd[1]}`} stroke="#E5E5EA" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d={`M ${bgStart[0]},${bgStart[1]} A ${r},${r} 0 ${largeArc},1 ${fillEnd[0]},${fillEnd[1]}`} stroke="#6B5BD6" strokeWidth="8" fill="none" strokeLinecap="round" />
      {ticks.map((t, i) => (
        <text key={i} x={t.pos[0]} y={t.pos[1] + 3} textAnchor="middle" fontSize="8" fill={t.active ? '#6B5BD6' : '#B0B0B5'} fontFamily={AVENIR}>{t.label}</text>
      ))}
    </svg>
  )
}

// ─── Reach breakdown bar (Unique reach tile) ──────────────────────────────────

function ReachBreakdown() {
  const channels = [
    { label: 'Email', value: 10.2, color: '#6B5BD6' },
    { label: 'Push',  value: 5.8,  color: '#2DBABA' },
    { label: 'In-app',value: 3.4,  color: '#2DBA75' },
  ]
  const total = channels.reduce((s, c) => s + c.value, 0)
  return (
    <div className="ipd-reach-breakdown">
      <div className="ipd-reach-bar">
        {channels.map((c, i) => (
          <div
            key={c.label}
            className="ipd-reach-bar-seg"
            style={{
              width: `${(c.value / total) * 100}%`,
              background: c.color,
              borderRadius: i === 0 ? '99px 0 0 99px' : i === channels.length - 1 ? '0 99px 99px 0' : '0',
            }}
          />
        ))}
      </div>
      <div className="ipd-reach-legend">
        {channels.map(c => (
          <div key={c.label} className="ipd-reach-legend-item">
            <div className="ipd-reach-legend-channel">
              <span className="ipd-reach-dot" style={{ background: c.color }} />
              <span className="ipd-reach-ch-label">{c.label}</span>
            </div>
            <span className="ipd-reach-ch-value">{c.value}M</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Share of impressions bar ──────────────────────────────────────────────────

function ShareBar() {
  const segments = [
    { label: 'Email', pct: 57.7, color: '#6B5BD6' },
    { label: 'Push', pct: 25.5, color: '#2DBABA' },
    { label: 'In-app', pct: 16.8, color: '#2DBA75' },
  ]
  return (
    <div>
      <div className="ipd-share-bar-track">
        {segments.map(s => (
          <div key={s.label} className="ipd-share-bar-segment" style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label}: ${s.pct}%`} />
        ))}
      </div>
      <div className="ipd-share-legend">
        {segments.map(s => (
          <div key={s.label} className="ipd-share-legend-item">
            <span className="ipd-share-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className="ipd-share-legend-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Channel icon ──────────────────────────────────────────────────────────────

function ChannelIcon({ type }) {
  if (type === 'email') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 5.5l6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
  if (type === 'push') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4" y="1.5" width="8" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="12" r="0.75" fill="currentColor" />
    </svg>
  )
  if (type === 'inapp') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 6h13" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4" cy="4.2" r="0.75" fill="currentColor" />
      <circle cx="6.5" cy="4.2" r="0.75" fill="currentColor" />
    </svg>
  )
  return null
}

// ─── Sparkle icon ──────────────────────────────────────────────────────────────

function SparkleIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1738 7.63529C12.8792 6.05647 15.1204 6.05646 15.8258 7.63529L17.0715 10.4231C17.154 10.6079 17.3896 10.8421 17.6579 10.962L20.3644 12.1738C21.9425 12.8796 21.943 15.1205 20.3644 15.8258L17.5765 17.0715C17.3518 17.1719 17.1719 17.3518 17.0715 17.5765L15.8259 20.3644C15.1204 21.9432 12.8793 21.9432 12.1738 20.3644L10.9282 17.5765C10.8278 17.3518 10.6479 17.1719 10.4231 17.0715L7.63529 15.8258C6.05647 15.1204 6.05646 12.8793 7.63529 12.1738L10.4231 10.9282C10.6479 10.8278 10.8278 10.6479 10.9282 10.4231L12.1738 7.63529ZM15.2455 11.239L13.9998 8.45117L12.7542 11.239C12.4529 11.9134 11.9134 12.4529 11.239 12.7542L8.45117 13.9998L11.239 15.2455C11.9134 15.5468 12.4529 16.0863 12.7542 16.7607L13.9998 19.5485L15.2455 16.7607C15.5468 16.0863 16.0863 15.5468 16.7607 15.2455L19.5485 13.9998L16.8421 12.788C16.2112 12.5061 15.5646 11.9534 15.2455 11.239Z" fill="currentColor"/>
      <path d="M10.4838 2.31373C10.2969 1.89542 9.7031 1.89542 9.5162 2.31373L9.14485 3.14485L8.31373 3.5162C7.89542 3.7031 7.89542 4.2969 8.31373 4.4838L9.14485 4.85515L9.5162 5.68627C9.7031 6.10458 10.2969 6.10458 10.4838 5.68627L10.8552 4.85515L11.6863 4.4838C12.1046 4.2969 12.1046 3.7031 11.6863 3.5162L10.8552 3.14485L10.4838 2.31373Z" fill="currentColor"/>
      <path d="M5.7257 5.47059C5.44534 4.84314 4.55466 4.84313 4.2743 5.47059L3.71727 6.71727L2.47059 7.2743C1.84313 7.55466 1.84314 8.44534 2.47059 8.7257L3.71727 9.28273L4.2743 10.5294C4.55466 11.1569 5.44534 11.1569 5.7257 10.5294L6.28273 9.28273L7.52941 8.7257C8.15686 8.44534 8.15686 7.55466 7.52941 7.2743L6.28273 6.71727L5.7257 5.47059Z" fill="currentColor"/>
    </svg>
  )
}

// ─── Weekly campaign launches bar chart ────────────────────────────────────────

function WeeklyCampaignBars() {
  // Weeks Mon–Sun leading up to this week, campaigns launched per day
  const weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const counts = [0, 1, 0, 1, 0, 0, 1]  // 3 campaigns launched this week
  const maxV = Math.max(...counts, 1)
  const W = 120, H = 48
  const bw = 12, gap = 6
  const totalBars = counts.length
  const totalW = totalBars * bw + (totalBars - 1) * gap
  const startX = (W - totalW) / 2
  const padB = 16
  const chartH = H - padB
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }} fill="none">
      {counts.map((v, i) => {
        const x = startX + i * (bw + gap)
        const barH = v === 0 ? 3 : Math.max(6, (v / maxV) * (chartH - 4))
        const y = chartH - barH
        const isToday = i === 6
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} rx="3"
              fill={isToday ? '#6B5BD6' : v > 0 ? '#C4BCEF' : '#E5E5EA'} />
            <text x={x + bw / 2} y={H - 3} textAnchor="middle" fontSize="8"
              fill={isToday ? '#6B5BD6' : '#B0B0B5'} fontFamily={AVENIR}>{weeks[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Sort icon ─────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`ipd-sort-icon${active ? ' ipd-sort-icon--active' : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function parseNum(str) {
  if (!str || str === '—') return -Infinity
  return parseFloat(String(str).replace(/[^0-9.-]/g, '')) || 0
}

const IPD_TABLE_COLS = [
  { key: 'channel',     label: 'Channel',      numeric: false },
  { key: 'impressions', label: 'Impressions',   numeric: true },
  { key: 'vsLastWk',    label: 'vs last wk',   numeric: true },
  { key: 'uniqueReach', label: 'Unique reach',  numeric: true },
  { key: 'freq',        label: 'Frequency',     numeric: true },
  { key: 'openCtr',     label: 'Open / CTR',   numeric: true },
  { key: 'vsBench',     label: 'vs bench',      numeric: true },
  { key: 'unsub',       label: 'Unsub rate',    numeric: true },
  { key: 'status',      label: 'Status',        numeric: false },
]

// ─── IpdImpressionsDrilldown ───────────────────────────────────────────────────

export default function IpdImpressionsDrilldown() {
  const [period, setPeriod] = useState('week')
  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const sortedRows = useMemo(() => {
    const nonTotal = CHANNEL_ROWS.filter(r => !r.isTotal)
    const total    = CHANNEL_ROWS.filter(r => r.isTotal)
    if (!sortCol) return [...nonTotal, ...total]
    const colMeta = IPD_TABLE_COLS.find(c => c.key === sortCol)
    const sorted = [...nonTotal].sort((a, b) => {
      const av = colMeta?.numeric ? parseNum(a[sortCol]) : (a[sortCol] || '').toLowerCase()
      const bv = colMeta?.numeric ? parseNum(b[sortCol]) : (b[sortCol] || '').toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return [...sorted, ...total]
  }, [sortCol, sortDir])

  return (
    <div className="ipd-drilldown">

      {/* ── Header ── */}
      <div className="ipd-header">
        <div className="ipd-header-left">
          <h2 className="ipd-title">Impressions breakdown</h2>
          <p className="ipd-subtitle">QBO US Active IPD campaigns · Updated 8 min ago</p>
        </div>
        <KpiPeriodDropdown selected={period} onChange={setPeriod} />
      </div>

      {/* ── AI summary — animated gradient border ── */}
      <div className="ipd-ai-callout-border">
        <div className="ipd-ai-callout">
          <div className="ipd-ai-callout-header">
            <SparkleIcon className="ipd-ai-callout-sparkle" />
            <span>AI Summary</span>
          </div>
          <p className="ipd-ai-callout-body">
            IPD impressions grew <strong>7.5%</strong> vs last week, driven by a 9.5% lift in in-app channels. Email holds the majority share at 57.7%, with push growing fastest proportionally. Frequency is healthy at 2.5×, and audience coverage is up to 77%—from 71% last week.
          </p>
        </div>
      </div>

      {/* ── KPI tiles — using KpiCard ── */}
      <div className="ipd-section-header">
        <span className="ipd-section-label">Total impressions this week</span>
      </div>
      <div className="ipd-kpi-grid">
        <KpiCard
          label="Total"
          value="48.7M"
          pill={{ text: '↑ 3.4M this week', color: 'mint' }}
          sparkline={SPARKLINES.total}
          sparklineColor="var(--chart-purple)"
          sparklineLabel="All channels"
          vizKey={`total-${period}`}
        />
        <KpiCard
          label="Email"
          value="28.1M"
          pill={{ text: '↑ 1.8M', color: 'mint' }}
          sparkline={SPARKLINES.email}
          sparklineColor="var(--chart-purple)"
          sparklineLabel="QBO email sends"
          vizKey={`email-${period}`}
        />
        <KpiCard
          label="Push"
          value="12.4M"
          pill={{ text: '↑ 890K', color: 'mint' }}
          sparkline={SPARKLINES.push}
          sparklineColor="var(--chart-teal)"
          sparklineLabel="Mobile push"
          vizKey={`push-${period}`}
        />
        <KpiCard
          label="In-app"
          value="8.2M"
          pill={{ text: '↑ 710K', color: 'mint' }}
          sparkline={SPARKLINES.inapp}
          sparklineColor="var(--chart-green)"
          sparklineLabel="In-product banners"
          vizKey={`inapp-${period}`}
        />
      </div>

      {/* ── Trend chart ── */}
      <div className="ipd-chart-card">
        <div className="ipd-chart-card-header">
          <span className="ipd-chart-title">Impressions trend</span>
          <div className="ipd-chart-legend">
            <span><span className="ipd-legend-dot" style={{ background: '#6B5BD6' }} />Email</span>
            <span><span className="ipd-legend-dot" style={{ background: '#2DBABA' }} />Push</span>
            <span><span className="ipd-legend-dot" style={{ background: '#2DBA75' }} />In-app</span>
          </div>
        </div>
        <TrendChart />
      </div>

      {/* ── Share of impressions ── */}
      <div className="ipd-chart-card">
        <div className="ipd-chart-card-header">
          <span className="ipd-chart-title">Share of impressions</span>
        </div>
        <ShareBar />
      </div>

      {/* ── Detailed table ── */}
      <div className="ipd-table-card">
        <div className="ipd-table-card-header">
          <span className="ipd-chart-title">By channel — detailed breakdown</span>
        </div>
        <div className="ipd-table-scroll">
          <table className="ipd-table">
            <thead>
              <tr>
                {IPD_TABLE_COLS.map((col, i) => (
                  <th
                    key={col.key}
                    className={`ipd-th ipd-th--sortable${col.numeric && i > 0 ? ' ipd-th--right' : ''}${sortCol === col.key ? ' ipd-th--active' : ''}`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className={`ipd-th-inner${col.numeric && i > 0 ? ' ipd-th-inner--right' : ''}`}>
                      {col.label}
                      <SortIcon active={sortCol === col.key} dir={sortCol === col.key ? sortDir : 'asc'} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={row.channel} className={`ipd-tr${row.isTotal ? ' ipd-tr--total' : ''}`}>
                  <td className="ipd-td ipd-td--channel">
                    {row.icon && (
                      <span className="ipd-channel-icon-wrap">
                        <ChannelIcon type={row.icon} />
                      </span>
                    )}
                    <span>{row.channel}</span>
                  </td>
                  <td className="ipd-td ipd-td--right ipd-td--strong">{row.impressions}</td>
                  <td className={`ipd-td ipd-td--right ${row.vsUp ? 'ipd-td--up' : 'ipd-td--down'}`}>{row.vsLastWk}</td>
                  <td className="ipd-td ipd-td--right">{row.uniqueReach}</td>
                  <td className="ipd-td ipd-td--right">{row.freq}</td>
                  <td className="ipd-td ipd-td--right">{row.openCtr}</td>
                  <td className={`ipd-td ipd-td--right ${row.vsBenchUp ? 'ipd-td--up' : 'ipd-td--down'}`}>{row.vsBench}</td>
                  <td className="ipd-td ipd-td--right">{row.unsub}</td>
                  <td className="ipd-td">
                    <span className={`ipd-status-badge ${row.statusOk ? 'ipd-status-badge--ok' : 'ipd-status-badge--warn'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
