import { useState, useEffect, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { CARD_REGISTRY } from '../data/cardRegistry'
import { WIDGET_REGISTRY } from '../data/widgetRegistry'

const KNOWN_IDS = new Set([
  ...CARD_REGISTRY.map((c) => c.id),
  ...WIDGET_REGISTRY.map((w) => w.id),
])

// ─── Default card sets per view ───────────────────────────────────────────────
// Insights is now rendered as a standalone panel above the KPI strip (not in the grid).
// BU cards fill the Business Impact section.

const ALL_CARDS = [
  { id: 'bu-capital', size: 'S', pinned: true, suggested: false },
  { id: 'bu-payments', size: 'S', pinned: true, suggested: false },
  { id: 'bu-billpay', size: 'S', pinned: true, suggested: false },
]

const LAUNCHING_CARDS = [
  { id: 'bu-capital', size: 'S', pinned: true, suggested: false },
  { id: 'bu-payments', size: 'S', pinned: true, suggested: false },
  { id: 'bu-billpay', size: 'S', pinned: true, suggested: false },
]

const BLOCKED_CARDS = [
  { id: 'bu-capital', size: 'S', pinned: true, suggested: false },
  { id: 'bu-payments', size: 'S', pinned: true, suggested: false },
  { id: 'bu-billpay', size: 'S', pinned: true, suggested: false },
]

const WAITING_CARDS = [
  { id: 'bu-capital', size: 'S', pinned: true, suggested: false },
  { id: 'bu-payments', size: 'S', pinned: true, suggested: false },
  { id: 'bu-billpay', size: 'S', pinned: true, suggested: false },
]

// ─── Grid repair: after removing a card, redistribute band sizes to sum = 12 ──

const COL_MAP = { S: 4, M: 6, ML: 8, L: 12 }

function repairGridRows(cards, removedId) {
  const baseRemovedId = removedId.replace(/--copy-\d+$/, '')
  const removedMeta = CARD_REGISTRY.find((c) => c.id === baseRemovedId)
  if (!removedMeta?.category) return cards

  const targetCategory = removedMeta.category
  const inBand = cards.filter((c) => {
    const baseId = c.id.replace(/--copy-\d+$/, '')
    const meta = CARD_REGISTRY.find((r) => r.id === baseId)
    return meta?.category === targetCategory
  })

  if (inBand.length === 0) return cards
  const currentSum = inBand.reduce((s, c) => s + (COL_MAP[c.size] ?? 4), 0)
  if (currentSum === 12) return cards

  let newSizes
  if (inBand.length === 1) newSizes = ['L']
  else if (inBand.length === 2) newSizes = ['M', 'M']
  else if (inBand.length === 3) newSizes = ['S', 'S', 'S']
  else return cards // can't auto-repair 4+ cards

  const bandIds = new Set(inBand.map((c) => c.id))
  let i = 0
  return cards.map((c) => (bandIds.has(c.id) ? { ...c, size: newSizes[i++] } : c))
}

const DEFAULT_QUEUE = { sort: { column: 'attention', dir: 'desc' }, group: 'status', density: 'comfortable', filters: {} }

const DEFAULT_SAVED_VIEWS = [
  { id: 'v1', name: 'My active', scope: 'personal', cards: ALL_CARDS, queue: DEFAULT_QUEUE, updatedAt: Date.now() },
  { id: 'v2', name: 'Launching this week', scope: 'personal', cards: LAUNCHING_CARDS, queue: DEFAULT_QUEUE, updatedAt: Date.now() },
  { id: 'v3', name: 'Blocked', scope: 'personal', cards: BLOCKED_CARDS, queue: DEFAULT_QUEUE, updatedAt: Date.now() },
  { id: 'v4', name: 'Waiting on approval', scope: 'personal', cards: WAITING_CARDS, queue: DEFAULT_QUEUE, updatedAt: Date.now() },
]

const DEFAULT_VIEW_STATE = {
  activeViewId: 'v1',
  cards: ALL_CARDS,
  queue: DEFAULT_QUEUE,
  isDirty: false,
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

// v8: Experiments section absent on load; previousItem restore in Top Metrics
const STORAGE_KEYS = { view: 'ms-ops-v8.view', user: 'ms-ops-v8.user' }

function sanitizeCards(cards) {
  return cards
    .filter((c) => KNOWN_IDS.has(c.id.replace(/--copy-\d+$/, '')))
    .map((c) => ({ ...c, suggested: false }))
}

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (parsed.cards) {
      const valid = sanitizeCards(parsed.cards)
      if (valid.length === 0) return fallback
      parsed.cards = valid
    }
    return parsed
  } catch {
    return fallback
  }
}

function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ─── Main state hook ──────────────────────────────────────────────────────────

export default function useAppState() {
  const [viewState, setViewState] = useState(() => loadStorage(STORAGE_KEYS.view, DEFAULT_VIEW_STATE))
  const [savedViews, setSavedViews] = useState(() => {
    const loaded = loadStorage(STORAGE_KEYS.user, DEFAULT_SAVED_VIEWS)
    return loaded.map((v, i) => {
      const validCards = (v.cards || []).filter((c) => {
        const baseId = c.id.replace(/--copy-\d+$/, '')
        return KNOWN_IDS.has(baseId)
      })
      return validCards.length > 0 ? { ...v, cards: validCards } : DEFAULT_SAVED_VIEWS[i] ?? v
    })
  })

  const [toasts, setToasts] = useState([])
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)

  const persistTimer = useRef(null)
  useEffect(() => {
    clearTimeout(persistTimer.current)
    persistTimer.current = setTimeout(() => {
      saveStorage(STORAGE_KEYS.view, viewState)
      saveStorage(STORAGE_KEYS.user, savedViews)
    }, 500)
  }, [viewState, savedViews])

  // ─── Toast ────────────────────────────────────────────────────────────────

  const pushToast = useCallback((message, undoFn = null) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, undoFn }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 8000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ─── Card mutations ───────────────────────────────────────────────────────

  const addCard = useCallback((cardId, defaultSize = 'S') => {
    setViewState((prev) => {
      if (prev.cards.find((c) => c.id === cardId)) return prev
      return {
        ...prev,
        cards: [...prev.cards, { id: cardId, size: defaultSize, pinned: false }],
        isDirty: true,
      }
    })
  }, [])

  const removeCard = useCallback((cardId) => {
    setViewState((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== cardId),
      isDirty: true,
    }))
  }, [])

  const resizeCard = useCallback((cardId, size) => {
    setViewState((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, size } : c)),
      isDirty: true,
    }))
  }, [])

  const duplicateCard = useCallback((cardId) => {
    setViewState((prev) => {
      const idx = prev.cards.findIndex((c) => c.id === cardId)
      if (idx === -1) return prev
      const orig = prev.cards[idx]
      const copy = { ...orig, id: `${cardId}--copy-${Date.now()}`, pinned: false }
      const next = [...prev.cards]
      next.splice(idx + 1, 0, copy)
      return { ...prev, cards: next, isDirty: true }
    })
  }, [])

  const pinCard = useCallback((cardId, cardName) => {
    let snapshot
    setViewState((prev) => {
      snapshot = prev.cards
      return {
        ...prev,
        cards: prev.cards.map((c) => c.id === cardId ? { ...c, pinned: true, suggested: false } : c),
        isDirty: true,
      }
    })
    pushToast(`Pinned "${cardName}" to your view`, () => {
      setViewState((prev) => ({ ...prev, cards: snapshot, isDirty: true }))
    })
  }, [pushToast])

  const unpinCard = useCallback((cardId, cardName) => {
    let snapshot
    setViewState((prev) => {
      snapshot = prev.cards
      const filtered = prev.cards.filter((c) => c.id !== cardId)
      const repaired = repairGridRows(filtered, cardId)
      return { ...prev, cards: repaired, isDirty: true }
    })
    pushToast(`Unpinned "${cardName}"`, () => {
      setViewState((prev) => ({ ...prev, cards: snapshot, isDirty: true }))
    })
  }, [pushToast])

  const reorderCards = useCallback((activeId, overId) => {
    setViewState((prev) => {
      const oldIdx = prev.cards.findIndex((c) => c.id === activeId)
      const newIdx = prev.cards.findIndex((c) => c.id === overId)
      if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev
      return {
        ...prev,
        cards: arrayMove(prev.cards, oldIdx, newIdx),
        isDirty: true,
      }
    })
  }, [])

  // ─── View management ──────────────────────────────────────────────────────

  const switchView = useCallback((viewId) => {
    const view = savedViews.find((v) => v.id === viewId)
    if (!view) return
    setViewState({
      activeViewId: viewId,
      cards: view.cards,
      queue: view.queue,
      isDirty: false,
    })
  }, [savedViews])

  const saveCurrentView = useCallback(() => {
    setViewState((prev) => {
      setSavedViews((views) =>
        views.map((v) =>
          v.id === prev.activeViewId
            ? { ...v, cards: prev.cards, queue: prev.queue, updatedAt: Date.now() }
            : v
        )
      )
      return { ...prev, isDirty: false }
    })
  }, [])

  const saveAsNewView = useCallback((name, scope = 'personal') => {
    const newId = `v-${Date.now()}`
    setViewState((prev) => {
      const newView = {
        id: newId,
        name,
        scope,
        cards: prev.cards,
        queue: prev.queue,
        updatedAt: Date.now(),
      }
      setSavedViews((views) => [...views, newView])
      return { ...prev, activeViewId: newId, isDirty: false }
    })
  }, [])

  const discardChanges = useCallback(() => {
    setViewState((prev) => {
      const view = savedViews.find((v) => v.id === prev.activeViewId)
      if (!view) return { ...prev, isDirty: false }
      return { ...prev, cards: view.cards, queue: view.queue, isDirty: false }
    })
  }, [savedViews])

  const renameView = useCallback((viewId, name) => {
    setSavedViews((views) => views.map((v) => (v.id === viewId ? { ...v, name } : v)))
  }, [])

  const deleteView = useCallback((viewId) => {
    setSavedViews((views) => views.filter((v) => v.id !== viewId))
    setViewState((prev) => {
      if (prev.activeViewId !== viewId) return prev
      const remaining = savedViews.filter((v) => v.id !== viewId)
      if (remaining.length === 0) return { ...DEFAULT_VIEW_STATE }
      const fallback = remaining[0]
      return { activeViewId: fallback.id, cards: fallback.cards, queue: fallback.queue, isDirty: false }
    })
  }, [savedViews])

  // ─── Remove with undo ─────────────────────────────────────────────────────

  const removeCardWithUndo = useCallback((cardId, cardName) => {
    let snapshot
    setViewState((prev) => {
      snapshot = prev.cards
      return { ...prev, cards: prev.cards.filter((c) => c.id !== cardId), isDirty: true }
    })
    pushToast(`Removed "${cardName}"`, () => {
      setViewState((prev) => ({ ...prev, cards: snapshot, isDirty: true }))
    })
  }, [pushToast])

  return {
    viewState,
    savedViews,
    toasts,
    libraryOpen,
    saveModalOpen,
    addCard,
    removeCard: removeCardWithUndo,
    resizeCard,
    duplicateCard,
    pinCard,
    unpinCard,
    reorderCards,
    switchView,
    saveCurrentView,
    saveAsNewView,
    discardChanges,
    renameView,
    deleteView,
    openLibrary: () => setLibraryOpen(true),
    closeLibrary: () => setLibraryOpen(false),
    openSaveModal: () => setSaveModalOpen(true),
    closeSaveModal: () => setSaveModalOpen(false),
    pushToast,
    dismissToast,
  }
}
