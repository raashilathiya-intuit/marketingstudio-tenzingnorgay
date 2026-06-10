import React from 'react'

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCampaignsHeader() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 5h14M2 9h10M2 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconAllCampaigns() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 5h14M2 9h10M2 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconTemplates() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconReports() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 11l2.5-3 2.5 2 2-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconAccessPoints() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M5.8 5.8a4.5 4.5 0 0 0 0 6.4M12.2 5.8a4.5 4.5 0 0 1 0 6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3.2 3.2a8 8 0 0 0 0 11.6M14.8 3.2a8 8 0 0 1 0 11.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconAttributes() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 6h12M3 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="13.5" cy="12" r="1.5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="14" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function IconMlModels() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2l1.1 3.3a1.3 1.3 0 0 0 .8.8L14.5 7.3l-3.6 1.2a1.3 1.3 0 0 0-.8.8L9 13l-1.1-3.7a1.3 1.3 0 0 0-.8-.8L3.5 7.3l3.6-1.2a1.3 1.3 0 0 0 .8-.8L9 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Sub-nav item (same visual treatment as global NavItem) ───────────────────

function SubNavItem({ icon, label, active, collapsed, onClick }) {
  const ref = React.useRef(null)

  function handleMouseEnter() {
    if (!collapsed || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--tooltip-top', `${rect.top + rect.height / 2}px`)
  }

  return (
    <div
      ref={ref}
      className={`leftnav-item${active ? ' leftnav-item--active' : ''}`}
      data-tooltip={collapsed ? label : undefined}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick && onClick() }}
    >
      <span className="leftnav-item-icon">{icon}</span>
      <span className="leftnav-item-label">{label}</span>
    </div>
  )
}

// ─── CampaignsRailItems ───────────────────────────────────────────────────────

export default function CampaignsRailItems({ collapsed, sub, navigate }) {
  const activeSub = sub || 'all-campaigns'

  return (
    <>
      {/* Back link */}
      <div
        className={`campaigns-rail-back${collapsed ? ' campaigns-rail-back--collapsed' : ''}`}
        onClick={() => navigate('home')}
        role="button"
        tabIndex={0}
        aria-label="Back to Marketing Studio"
        data-tooltip={collapsed ? 'Back to Marketing Studio' : undefined}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('home') }}
      >
        <IconBack />
        {!collapsed && <span>Back</span>}
      </div>

      {/* Section header */}
      {!collapsed && (
        <>
          <div className="campaigns-rail-header">
            <span>Campaigns</span>
          </div>
          <div className="campaigns-rail-divider" aria-hidden="true" />
        </>
      )}

      {/* Primary sub-nav */}
      <SubNavItem
        icon={<IconAllCampaigns />}
        label="All campaigns"
        active={activeSub === 'all-campaigns'}
        collapsed={collapsed}
        onClick={() => navigate('campaigns')}
      />
      <SubNavItem
        icon={<IconTemplates />}
        label="Templates"
        active={activeSub === 'templates'}
        collapsed={collapsed}
        onClick={() => navigate('campaigns/templates')}
      />
      <SubNavItem
        icon={<IconReports />}
        label="Reports"
        active={activeSub === 'reports'}
        collapsed={collapsed}
        onClick={() => navigate('campaigns/reports')}
      />

      {/* Configuration group */}
      <div className="campaigns-rail-config-divider" aria-hidden="true" />

      <SubNavItem
        icon={<IconAccessPoints />}
        label="Access points"
        active={activeSub === 'access-points'}
        collapsed={collapsed}
        onClick={() => navigate('campaigns/access-points')}
      />
      <SubNavItem
        icon={<IconAttributes />}
        label="Attribute catalog"
        active={activeSub === 'attributes'}
        collapsed={collapsed}
        onClick={() => navigate('campaigns/attributes')}
      />
      <SubNavItem
        icon={<IconMlModels />}
        label="ML Models"
        active={activeSub === 'ml-models'}
        collapsed={collapsed}
        onClick={() => navigate('campaigns/ml-models')}
      />
    </>
  )
}
