import React, { useState, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import LeftNav from './components/LeftNav'
import CardLibrary from './components/CardLibrary'
import ToastStack from './components/Toast'
import SaveViewModal from './components/SaveViewModal'
import KpiEditPanel from './components/KpiEditPanel'
import WorkflowLibraryPanel from './components/WorkflowLibraryPanel'
import ContentHeader from './components/ContentHeader'
import ChatPanel from './components/ChatPanel'
import HomePage from './pages/HomePage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ExperienceDetailPage from './pages/ExperienceDetailPage'
import CampaignsPage from './pages/CampaignsPage'
import ExperimentsPage from './pages/ExperimentsPage'
import IpdImpressionsDrilldown from './pages/IpdImpressionsDrilldown'
import CampaignDetailPage from './pages/CampaignDetailPage'
import MetricDrilldown from './pages/MetricDrilldown'
import useAppState from './state/useAppState'
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

  const [route, setRoute] = useState({ page: 'home', sub: null, detail: null })
  const [navCollapsed, setNavCollapsed] = useState(true)
  const [chatWidth, setChatWidth] = useState(400)
  const [kpiPanelOpen, setKpiPanelOpen] = useState(false)
  const [workflowLibraryOpen, setWorkflowLibraryOpen] = useState(false)
  const railState = route.page === 'campaigns' ? 'campaigns' : route.page === 'experiments' ? 'experiments' : 'global'
  function navigate(path) {
    const parts = path.split('/')
    setRoute({ page: parts[0] || 'home', sub: parts[1] || null, detail: parts[2] ? decodeURIComponent(parts[2]) : null })
  }

  // ── Insights panel state ───────────────────────────────────────────────────
  const [activeInsights, setActiveInsights] = useState([])
  const [insightsLoading, setInsightsLoading] = useState(false)

  // ── Unified quick actions state — seeds + user-added ──────────────────────
  // Tiles have: { id, label, description, icon }
  const [quickActions, setQuickActions] = useState(() =>
    HOME_ACTION_TILES.map((t) => ({ ...t }))
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
        <div className="page-main">
          <div className="page-inner">
            {route.page === 'home' ? (
              <HomePage
                onOpenWorkflowLibrary={() => setWorkflowLibraryOpen(true)}
                quickActions={quickActions}
                activeInsights={activeInsights}
                insightsLoading={insightsLoading}
                pushToast={pushToast}
                onViewAll={() => navigate('insights')}
                onViewAllProjects={() => navigate('projects')}
                onRemoveAction={handleRemoveQuickAction}
                onReorderActions={handleReorderQuickActions}
                navigate={navigate}
              />
            ) : route.page === 'insights' ? (
              route.sub === 'ipd-impressions-drilldown' ? (
                <IpdImpressionsDrilldown />
              ) : route.sub ? (
                <MetricDrilldown metricId={route.sub} />
              ) : (
                <AnalyticsPage
                  cards={cards}
                  onRemove={handleRemoveCard}
                  onResize={resizeCard}
                  onDuplicate={duplicateCard}
                  onPin={pinCard}
                  onUnpin={unpinCard}
                  onReorder={reorderCards}
                  pushToast={pushToast}
                  openLibrary={openLibrary}
                  activeInsights={activeInsights}
                  insightsLoading={insightsLoading}
                  navigate={navigate}
                />
              )
            ) : route.page === 'projects' ? (
              route.detail
                ? <ExperienceDetailPage expName={route.detail} navigate={navigate} />
                : route.sub === 'detail'
                  ? <ProjectDetailPage navigate={navigate} />
                  : <ProjectsPage navigate={navigate} />
            ) : route.page === 'ipd-impressions-drilldown' ? (
              <IpdImpressionsDrilldown />
            ) : route.page === 'ipd-company-reach-drilldown'
              || route.page === 'ipd-clicks-drilldown'
              || route.page === 'ipd-ctr-drilldown'
              || route.page === 'ipd-frequency-drilldown'
              || route.page === 'camp-impressions-drilldown'
              || route.page === 'camp-ctr-drilldown'
              || route.page === 'camp-open-rate-drilldown'
              || route.page === 'camp-conversions-drilldown' ? (
              <MetricDrilldown metricId={route.page} />
            ) : route.page === 'campaigns' ? (
              route.sub === 'experience'
                ? <ExperienceDetailPage expName={route.detail} navigate={navigate} />
                : route.detail
                  ? <CampaignDetailPage campaignName={route.detail} navigate={navigate} />
                  : <CampaignsPage navigate={navigate} />
            ) : route.page === 'experiments' ? (
              <ExperimentsPage />
            ) : null}
          </div>
        </div>
      </div>
      <div className="chat-panel-outer" style={{ width: chatWidth }}>
        <ChatPanel
          width={chatWidth}
          onResize={setChatWidth}
          showTabs={route.page === 'projects' && (route.sub === 'detail' || !!route.detail)}
        />
      </div>
    </div>

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
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
