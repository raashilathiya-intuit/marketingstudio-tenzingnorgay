import React, { useState, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import LeftNav from './components/LeftNav'
import ContentHeader from './components/ContentHeader'
import CardLibrary from './components/CardLibrary'
import ToastStack from './components/Toast'
import SaveViewModal from './components/SaveViewModal'
import KpiEditPanel from './components/KpiEditPanel'
import WorkflowLibraryPanel from './components/WorkflowLibraryPanel'
import ChatPanel from './components/ChatPanel'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ExperienceDetailPage from './pages/ExperienceDetailPage'
import ExperimentsPage from './pages/ExperimentsPage'
import CampaignsPage from './pages/CampaignsPage'
import ComingSoon from './pages/ComingSoon'
import useAppState from './state/useAppState'
import useRoute from './hooks/useRoute'
import { WIDGET_INSIGHTS } from './data/widgetRegistry'
import { KPI_STRIP } from './data/mock'
import { HOME_ACTION_TILES } from './data/homeMock'


export default function App() {
  const {
    viewState,
    savedViews,
    toasts,
    libraryOpen,
    saveModalOpen,
    addCard,
    removeCard,
    resizeCard,
    duplicateCard,
    pinCard,
    unpinCard,
    reorderCards,
    switchView,
    saveCurrentView,
    saveAsNewView,
    discardChanges,
    openLibrary,
    closeLibrary,
    openSaveModal,
    closeSaveModal,
    pushToast,
    dismissToast,
  } = useAppState()

  const { activeViewId, cards, isDirty } = viewState

  const [route, navigate] = useRoute()
  const railState = route.page === 'campaigns' ? 'campaigns' : route.page === 'experiments' ? 'experiments' : 'global'
  const [navCollapsed, setNavCollapsed] = useState(true)
  const [kpiPanelOpen, setKpiPanelOpen] = useState(false)
  const [workflowLibraryOpen, setWorkflowLibraryOpen] = useState(false)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [chatPanelWidth, setChatPanelWidth] = useState(400)

  // ── Insights panel state ───────────────────────────────────────────────────
  const [activeInsights, setActiveInsights] = useState([])
  const [insightsLoading, setInsightsLoading] = useState(false)

  // ── Unified quick actions state — seeds + user-added ──────────────────────
  // Tiles have: { id, label, description, icon }
  const SHORTCUT_DEFAULTS = ['create-campaign', 'run-experiment', 'create-ipd']
  const [quickActions, setQuickActions] = useState(() =>
    HOME_ACTION_TILES.filter((t) => SHORTCUT_DEFAULTS.includes(t.id)).map((t) => ({ ...t }))
  )

  // Which workflow library IDs are currently in the grid (for panel "✓ Added" state)
  const addedWorkflowIds = useMemo(
    () => new Set(quickActions.map((t) => t.id)),
    [quickActions]
  )

  // Seeds that have been removed — for "Restore N defaults" in the panel
  const missingSeeds = useMemo(
    () => HOME_ACTION_TILES.filter((t) => !quickActions.some((q) => q.id === t.id)),
    [quickActions]
  )

  function handleAddWorkflow(workflow) {
    setQuickActions((prev) => {
      if (prev.some((t) => t.id === workflow.id)) return prev
      return [
        ...prev,
        {
          id: workflow.id,
          label: workflow.title,
          description: workflow.description,
          icon: workflow.icon,
        },
      ]
    })
  }

  function handleRemoveQuickAction(id) {
    const snapshot = quickActions
    setQuickActions(snapshot.filter((t) => t.id !== id))
    pushToast('Removed from quick actions', () => {
      setQuickActions(snapshot)
    })
  }

  function handleReorderQuickActions(activeId, overId) {
    setQuickActions((prev) => {
      const oldI = prev.findIndex((t) => t.id === activeId)
      const newI = prev.findIndex((t) => t.id === overId)
      if (oldI === -1 || newI === -1) return prev
      const next = arrayMove(prev, oldI, newI)
      console.log(`Quick actions reordered: ${next.map((t) => t.id).join(', ')}`)
      return next
    })
  }

  function handleRestoreDefaults() {
    setQuickActions((prev) => {
      const presentIds = new Set(prev.map((t) => t.id))
      const toRestore = HOME_ACTION_TILES.filter((t) => !presentIds.has(t.id))
      return [...toRestore, ...prev]
    })
  }

  // addedIds for the analytics widget gallery
  const addedWidgetIds = useMemo(() => {
    const ids = new Set(cards.map((c) => c.id))
    ids.add('insights-callouts')
    return ids
  }, [cards])

  function handleAddWidget(id, defaultSize = 'S') {
    addCard(id, defaultSize)
    const insight = WIDGET_INSIGHTS[id]
    if (insight) {
      setInsightsLoading(true)
      setTimeout(() => {
        setActiveInsights((prev) => {
          if (prev.some((i) => i._widgetId === id)) return prev
          return [...prev, { ...insight, id: `dynamic-${id}`, _widgetId: id }]
        })
        setInsightsLoading(false)
      }, 1400)
    }
  }

  function handleRemoveCard(cardId, cardName) {
    removeCard(cardId, cardName)
    const baseId = cardId.replace(/--copy-\d+$/, '')
    setActiveInsights((prev) => prev.filter((i) => i._widgetId !== baseId))
  }

  return (
    <div className="app-outer">
      <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(v => !v)}
        railState={railState}
        route={route}
        navigate={navigate}
      />
      <div className="content-right">
        <ContentHeader route={route} navigate={navigate} />
        <div className="content-main-col">
        <div className="page-main">
          <div className={`page-inner${route.page === 'projects' && (route.detail || route.sub === 'detail') ? ' page-inner--detail' : ''}`}>
            {route.page === 'home' && (
              <HomePage
                onOpenLibrary={openLibrary}
                onOpenWorkflowLibrary={() => setWorkflowLibraryOpen(true)}
                quickActions={quickActions}
                activeInsights={activeInsights}
                insightsLoading={insightsLoading}
                pushToast={pushToast}
                onRemoveAction={handleRemoveQuickAction}
                onReorderActions={handleReorderQuickActions}
                cards={cards}
                onRemoveCard={handleRemoveCard}
                navigate={navigate}
              />
            )}
            {route.page === 'projects' && (
              route.detail
                ? <ExperienceDetailPage expName={route.detail} navigate={navigate} />
                : route.sub === 'detail'
                  ? <ProjectDetailPage navigate={navigate} />
                  : <ProjectsPage navigate={navigate} />
            )}
            {route.page === 'experiments' && (
              route.sub === 'templates'    ? <ComingSoon title="Templates" /> :
              route.sub === 'test-reports' ? <ComingSoon title="Test reports" /> :
              route.sub === 'metrics'      ? <ComingSoon title="Metrics" /> :
              route.sub === 'routing'      ? <ComingSoon title="Routing" /> :
              <ExperimentsPage />
            )}
            {route.page === 'campaigns' && (
              route.sub === 'templates'     ? <ComingSoon title="Templates" /> :
              route.sub === 'reports'       ? <ComingSoon title="Reports" /> :
              route.sub === 'access-points' ? <ComingSoon title="Access points" /> :
              route.sub === 'attributes'    ? <ComingSoon title="Attribute catalog" /> :
              route.sub === 'ml-models'     ? <ComingSoon title="ML Models" /> :
              <CampaignsPage />
            )}
          </div>
        </div>
        </div>
      </div>
      {route.sub === 'detail' && route.page === 'projects' && (
        <div className="chat-panel-outer" style={{ width: chatPanelWidth }}>
          <ChatPanel width={chatPanelWidth} onResize={setChatPanelWidth} />
        </div>
      )}

      {/* Floating AI chat panel */}
      {aiChatOpen && (
        <div className="ai-chat-float-outer">
        <div className="ai-chat-float">
          <div className="ai-chat-float-header">
            <div className="ai-chat-float-title">
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                <path d="M9.88,14.88 Q12,7 14.12,14.88 Q22,17 14.12,19.12 Q12,27 9.88,19.12 Q2,17 9.88,14.88 Z" fill="#5238d6"/>
                <path d="M20.73,7.73 Q22,3 23.27,7.73 Q28,9 23.27,10.27 Q22,15 20.73,10.27 Q16,9 20.73,7.73 Z" fill="#5238d6" opacity="0.7"/>
                <path d="M20.83,22.83 Q22,18.5 23.17,22.83 Q27.5,24 23.17,25.17 Q22,29.5 20.83,25.17 Q16.5,24 20.83,22.83 Z" fill="#5238d6" opacity="0.5"/>
              </svg>
              <span>Studio AI</span>
            </div>
            <button className="ai-chat-float-close" onClick={() => setAiChatOpen(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="ai-chat-float-body">
            <p className="ai-chat-float-greeting">What would you like to do today?</p>
            <div className="ai-chat-float-chips">
              <button className="ai-chat-chip">Create campaign</button>
              <button className="ai-chat-chip">Run experiment</button>
              <button className="ai-chat-chip">Create IPD</button>
            </div>
          </div>
          <div className="ai-chat-float-input-row">
            <div className="studio-prompt-border ai-chat-float-prompt-border">
              <div className="studio-prompt-card">
                <textarea
                  className="studio-prompt-input"
                  placeholder="Ask Studio AI anything..."
                  rows={1}
                />
                <div className="studio-prompt-footer">
                  <button className="studio-prompt-attach" aria-label="Attach">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                  <button className="studio-prompt-send studio-prompt-send--disabled" aria-label="Send" disabled>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Floating AI chat button — hidden in this build */}
      {false && <button className="ai-fab" aria-label="Open AI assistant" onClick={() => setAiChatOpen(v => !v)}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large rounded sparkle — center (12,17), R=10, Q curves through tips */}
          <path d="M9.88,14.88 Q12,7 14.12,14.88 Q22,17 14.12,19.12 Q12,27 9.88,19.12 Q2,17 9.88,14.88 Z" fill="white"/>
          {/* Medium rounded sparkle — center (22,9), R=6 */}
          <path d="M20.73,7.73 Q22,3 23.27,7.73 Q28,9 23.27,10.27 Q22,15 20.73,10.27 Q16,9 20.73,7.73 Z" fill="white" opacity="0.85"/>
          {/* Small rounded sparkle — center (22,24), R=5.5 */}
          <path d="M20.83,22.83 Q22,18.5 23.17,22.83 Q27.5,24 23.17,25.17 Q22,29.5 20.83,25.17 Q16.5,24 20.83,22.83 Z" fill="white" opacity="0.65"/>
        </svg>
      </button>}

      <CardLibrary
        open={libraryOpen}
        onClose={closeLibrary}
        addedIds={addedWidgetIds}
        onAdd={handleAddWidget}
      />

      <SaveViewModal
        open={saveModalOpen}
        onClose={closeSaveModal}
        onSave={saveAsNewView}
      />

      <KpiEditPanel
        open={kpiPanelOpen}
        onClose={() => setKpiPanelOpen(false)}
        metrics={KPI_STRIP}
        onSave={() => {}}
      />

      <WorkflowLibraryPanel
        open={workflowLibraryOpen}
        onClose={() => setWorkflowLibraryOpen(false)}
        addedIds={addedWorkflowIds}
        onAdd={handleAddWorkflow}
        onRemove={handleRemoveQuickAction}
        pushToast={pushToast}
        missingSeeds={missingSeeds}
        onRestoreDefaults={handleRestoreDefaults}
        allowedIds={new Set(['create-campaign', 'run-experiment', 'create-ipd', 'campaign-analytics', 'audience-builder', 'asset-library', 'enterprise-ai'])}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  )

}
