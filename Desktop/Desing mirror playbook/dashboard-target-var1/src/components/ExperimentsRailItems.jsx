import React from 'react'

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconExperimentsHeader() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M6.5 2h5M6.5 2v5.5L3 14a1 1 0 0 0 .85 1.5h10.3A1 1 0 0 0 15 14l-3.5-6.5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7.5" cy="12" r="0.9" fill="currentColor"/>
      <circle cx="10.5" cy="10.5" r="0.75" fill="currentColor"/>
    </svg>
  )
}

function IconAllExperiments() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M6.5 2h5M6.5 2v5.5L3 14a1 1 0 0 0 .85 1.5h10.3A1 1 0 0 0 15 14l-3.5-6.5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7.5" cy="12" r="0.9" fill="currentColor"/>
      <circle cx="10.5" cy="10.5" r="0.75" fill="currentColor"/>
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

function IconTestReports() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 11l2.5-3 2.5 2 2-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconMetrics() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconRouting() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 6h4a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M13 4l2 2-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Sub-nav item ─────────────────────────────────────────────────────────────

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

// ─── ExperimentsRailItems ─────────────────────────────────────────────────────

export default function ExperimentsRailItems({ collapsed, sub, navigate }) {
  const activeSub = sub || 'all-experiments'

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
            <span>Experiments</span>
          </div>
          <div className="campaigns-rail-divider" aria-hidden="true" />
        </>
      )}

      {/* Primary sub-nav */}
      <SubNavItem
        icon={<IconAllExperiments />}
        label="All experiments"
        active={activeSub === 'all-experiments'}
        collapsed={collapsed}
        onClick={() => navigate('experiments')}
      />
      <SubNavItem
        icon={<IconTemplates />}
        label="Templates"
        active={activeSub === 'templates'}
        collapsed={collapsed}
        onClick={() => navigate('experiments/templates')}
      />
      <SubNavItem
        icon={<IconTestReports />}
        label="Test reports"
        active={activeSub === 'test-reports'}
        collapsed={collapsed}
        onClick={() => navigate('experiments/test-reports')}
      />

      {/* Configuration group */}
      <div className="campaigns-rail-config-divider" aria-hidden="true" />

      <SubNavItem
        icon={<IconMetrics />}
        label="Metrics"
        active={activeSub === 'metrics'}
        collapsed={collapsed}
        onClick={() => navigate('experiments/metrics')}
      />
      <SubNavItem
        icon={<IconRouting />}
        label="Routing"
        active={activeSub === 'routing'}
        collapsed={collapsed}
        onClick={() => navigate('experiments/routing')}
      />
    </>
  )
}
