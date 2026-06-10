import React, { useState } from 'react'
import './ExperienceDetailPage.css'

const ROWS = [
  { exp: 'PLM7781-IPD-MDIWM30DHigh',  status: 'Draft',           id: '492060' },
  { exp: 'ZXC1109-IPD-epDiscount30',  status: 'Edited',          id: '492061' },
  { exp: 'WWS9021-IPD-DIWMDeepDisc',  status: 'Error',           id: '492062' },
  { exp: 'PLM4421-IPD-AMDIWM60DLow',  status: 'Published',       id: '492063' },
  { exp: 'ZXC7732-IPD-epDiscount60',  status: 'Awaiting review', id: '492064' },
  { exp: 'WWS3308-IPD-DIWMDeepDisc',  status: 'Accepted',        id: '492065' },
  { exp: 'PLM9912-IPD-MDIWM30DHigh',  status: 'Reviewed',        id: '492066' },
  { exp: 'ZXC5547-IPD-epDiscount30',  status: 'Unpublished',     id: '492067' },
  { exp: 'WWS6620-IPD-DIWMDeepDisc',  status: 'Sharing',         id: '492068' },
  { exp: 'PLM1184-IPD-MDIWM90DHigh',  status: 'Publishing',      id: '492069' },
  { exp: 'ZXC4412-IPD-epDiscount45',  status: 'Draft',           id: '492070' },
  { exp: 'WWS8801-IPD-DIWMDeepDisc',  status: 'Accepted',        id: '492071' },
  { exp: 'PLM3392-IPD-AMDIWM30DLow',  status: 'Reviewed',        id: '492072' },
  { exp: 'ZXC9931-IPD-epDiscount20',  status: 'Published',       id: '492073' },
  { exp: 'WWS2214-IPD-DIWMDeepDisc',  status: 'Unpublished',     id: '492074' },
  { exp: 'PLM6673-IPD-MDIWM60DHigh',  status: 'Edited',          id: '492075' },
  { exp: 'ZXC3341-IPD-epDiscount15',  status: 'Awaiting review', id: '492076' },
]

const STATUS_CONFIG = {
  'Draft':           { cls: 'exp-badge--draft' },
  'Edited':          { cls: 'exp-badge--edited' },
  'Error':           { cls: 'exp-badge--error' },
  'Published':       { cls: 'exp-badge--published' },
  'Awaiting review': { cls: 'exp-badge--awaiting' },
  'Accepted':        { cls: 'exp-badge--accepted' },
  'Reviewed':        { cls: 'exp-badge--reviewed' },
  'Unpublished':     { cls: 'exp-badge--unpublished' },
  'Sharing':         { cls: 'exp-badge--in-progress', label: 'Sharing…' },
  'Publishing':      { cls: 'exp-badge--in-progress', label: 'Publishing…' },
}

const TABS = ['Campaign meta', 'Experience meta', 'Audience', 'Promotion', 'Creative', 'Experiment']

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 10V3a1 1 0 0 1 1-1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2.5 4l2.5 2.5L7.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconImagePlaceholder() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="56" height="56" rx="8" stroke="#c8d0d8" strokeWidth="2"/>
      <circle cx="26" cy="26" r="7" stroke="#c8d0d8" strokeWidth="2"/>
      <path d="M8 52l18-18 12 12 10-10 16 14" stroke="#c8d0d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CreativeTab() {
  return (
    <div className="exp-creative">
      <div className="exp-creative-preview">
        <div className="exp-creative-left">
          <h2 className="exp-creative-headline">Flexible solutions for<br />growth</h2>
          <p className="exp-creative-sub">Streamline your business with powerful tools and insights.</p>
          <ol className="exp-creative-list">
            <li>
              <span className="exp-list-num">1</span>
              <span className="exp-list-body"><strong>Automated Workflows</strong><br />Save time with reminders, approvals, and less manual work.</span>
            </li>
            <li>
              <span className="exp-list-num">2</span>
              <span className="exp-list-body"><strong>Custom Reports</strong><br />Get key KPIs with presentation-ready customizable reports.</span>
            </li>
            <li>
              <span className="exp-list-num">3</span>
              <span className="exp-list-body"><strong>Seamless Integration</strong><br />Work easily with apps designed for QuickBooks Advanced.</span>
            </li>
          </ol>
          <div className="exp-creative-ctas">
            <button className="exp-cta-primary">Start Your Free Trial</button>
            <button className="exp-cta-secondary">Explore Features</button>
          </div>
        </div>
        <div className="exp-creative-right">
          <div className="exp-creative-img">
            <IconImagePlaceholder />
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceholderTab({ label }) {
  return (
    <div className="exp-placeholder-tab">
      <p>{label}</p>
    </div>
  )
}

const CREATIVES = [
  'ELM 200_Hellobox Creative_Deep Discount',
  'ELM 201_Hellobox Creative_Free Trial',
  'ELM 202_Hellobox Creative_50% Off',
]

export default function ExperienceDetailPage({ expName }) {
  const [activeTab, setActiveTab] = useState('Creative')
  const [copied, setCopied] = useState(false)
  const [creativeIdx, setCreativeIdx] = useState(0)

  const rowData = ROWS.find(r => r.exp === expName) || { status: 'Draft', id: '492060' }
  const statusCfg = STATUS_CONFIG[rowData.status] || {}

  function handleCopy() {
    navigator.clipboard?.writeText(rowData.id).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="exp-detail-page">
      {/* Compact header bar — title only, no nav chevrons */}
      <div className="exp-header-bar">
        <div className="exp-header-left">
          <span className="exp-title-label">{expName}</span>
          <span className="exp-header-sep" />
          <span className={`exp-badge ${statusCfg.cls || ''}`}>{statusCfg.label || rowData.status}</span>
          <span className="exp-meta-divider">|</span>
          <span className="exp-meta-field">
            <span className="exp-meta-label">ID:</span>
            <span className="exp-meta-val">{rowData.id}</span>
            <button className="exp-meta-copy" aria-label="Copy ID" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy ID'}>
              <IconCopy />
            </button>
          </span>
          <span className="exp-meta-divider">|</span>
          <button className="exp-version-btn">v1 <IconChevron /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="exp-detail-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`exp-detail-tab${activeTab === tab ? ' exp-detail-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="exp-tabs-border" />

      {/* Creative title — 16px medium, top of content */}
      {activeTab === 'Creative' && (
        <div className="exp-creative-topbar">
          <span className="exp-creative-name">{CREATIVES[creativeIdx]}</span>
        </div>
      )}

      {/* Tab content */}
      <div className="exp-detail-content">
        {activeTab === 'Creative'  && <CreativeTab />}
        {activeTab !== 'Creative'  && <PlaceholderTab label={activeTab} />}
      </div>

      {/* Bottom nav — creative pagination, sticky + centered in white container */}
      {activeTab === 'Creative' && (
        <div className="exp-creative-nav-wrap">
          <div className="exp-creative-nav-float">
            <button
              className="exp-creative-nav-btn"
              onClick={() => setCreativeIdx(i => Math.max(0, i - 1))}
              disabled={creativeIdx === 0}
              aria-label="Previous creative"
            >
              <IconChevronLeft />
            </button>
            <span className="exp-creative-nav-label">
              {creativeIdx + 1} / {CREATIVES.length}
            </span>
            <button
              className="exp-creative-nav-btn"
              onClick={() => setCreativeIdx(i => Math.min(CREATIVES.length - 1, i + 1))}
              disabled={creativeIdx === CREATIVES.length - 1}
              aria-label="Next creative"
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
