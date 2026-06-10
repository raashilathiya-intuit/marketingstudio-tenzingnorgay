import React from 'react'
import './ContentHeader.css'


function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 8H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2a5.5 5.5 0 0 1 5.5 5.5c0 2.5.75 3.75 1.5 4.5H2c.75-.75 1.5-2 1.5-4.5A5.5 5.5 0 0 1 9 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M7 14a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}

const PAGE_LABELS = {
  home: 'Home',
  projects: 'Projects',
  insights: 'Insights',
  campaigns: 'All campaigns',
  experiments: 'All experiments',
  audiences: 'Audiences',
  offers: 'Offers',
  content: 'Content',
  'ipd-impressions-drilldown':   'IPD Impressions breakdown',
  'ipd-company-reach-drilldown': 'Company reach breakdown',
  'ipd-clicks-drilldown':        'IPD Clicks breakdown',
  'ipd-ctr-drilldown':           'IPD CTR breakdown',
  'ipd-frequency-drilldown':     'IPD Frequency breakdown',
  'camp-impressions-drilldown':  'Total impressions breakdown',
  'camp-ctr-drilldown':          'CTR breakdown',
  'camp-open-rate-drilldown':    'Email open rate breakdown',
  'camp-conversions-drilldown':  'Conversions breakdown',
}

// Section names for the parent context label (separate from PAGE_LABELS)
const SECTION_LABELS = {
  campaigns:   'Campaigns',
  experiments: 'Experiments',
  projects:    'Projects',
  insights:    'Insights',
}

// Sub-pages that are side-nav selections → Level 1 (Home / Section: Sub)
const NAV_SUB_LABELS = {
  templates:       'Templates',
  reports:         'Reports',
  'access-points': 'Access points',
  attributes:      'Attribute catalog',
  'ml-models':     'ML Models',
  'test-reports':  'Test reports',
  metrics:         'Metrics',
  routing:         'Routing',
}

// Sub-pages that are record drill-downs → Level 2 (Home / [page] / [sub label])
const RECORD_SUB_LABELS = {
  detail: 'DIFM cancelled_Campaign',
  // Insights drilldowns
  'ipd-impressions-drilldown':   'IPD Impressions breakdown',
  'ipd-company-reach-drilldown': 'Company reach breakdown',
  'ipd-clicks-drilldown':        'IPD Clicks breakdown',
  'ipd-ctr-drilldown':           'IPD CTR breakdown',
  'ipd-frequency-drilldown':     'IPD Frequency breakdown',
}

export default function ContentHeader({ route, navigate }) {
  const pageLabel = PAGE_LABELS[route?.page] || 'Home'
  const isHome = !route?.page || route.page === 'home'
  const isNavSub = route?.sub && NAV_SUB_LABELS[route.sub] != null
  const isRecordSub = route?.sub && RECORD_SUB_LABELS[route.sub] != null

  function handleBack() {
    if (!navigate) return
    if (route?.detail) navigate(route.page)         // Level 2 record → back to Level 1 page
    else if (isRecordSub) navigate(route.page)       // Level 2 record sub → back to Level 1 page
    else navigate('home')                            // Level 1 (page or nav sub) → back to Home
  }

  // Build breadcrumb crumbs
  const crumbs = []
  if (!isHome) {
    crumbs.push({ label: 'Home', onClick: () => navigate && navigate('home') })
    if (route?.detail) {
      // Level 2: record drill-down — parent is the Level 1 page
      crumbs.push({ label: pageLabel, onClick: () => navigate && navigate(route.page) })
      crumbs.push({ label: route.detail, onClick: null })
    } else if (isRecordSub) {
      // Level 2: record sub-page (e.g. projects/detail)
      crumbs.push({ label: pageLabel, onClick: () => navigate && navigate(route.page) })
      crumbs.push({ label: RECORD_SUB_LABELS[route.sub], onClick: null })
    } else if (isNavSub) {
      // Level 1: side-nav sub-section — show "Section: Sub" so user knows their context
      const section = SECTION_LABELS[route.page]
      const subName = NAV_SUB_LABELS[route.sub]
      const label = section ? `${section}: ${subName}` : subName
      crumbs.push({ label, onClick: null })
    } else {
      // Level 1: top-level page
      crumbs.push({ label: pageLabel, onClick: null })
    }
  }

  return (
    <div className="content-header">
      <div className="content-header-left">
        {!isHome && (
          <button className="content-header-back" onClick={handleBack} aria-label="Go back">
            <IconBack />
          </button>
        )}
        {isHome ? (
          <span className="content-header-label">{pageLabel}</span>
        ) : (
          <nav className="content-header-breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="content-header-breadcrumb-sep" aria-hidden="true">/</span>}
                {crumb.onClick ? (
                  <button className="content-header-breadcrumb-parent" onClick={crumb.onClick}>
                    {crumb.label}
                  </button>
                ) : (
                  <span className="content-header-label">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
      <div className="content-header-right">
        <button className="content-header-icon-btn" aria-label="Notifications">
          <IconBell />
          <span className="content-header-notif-dot" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
