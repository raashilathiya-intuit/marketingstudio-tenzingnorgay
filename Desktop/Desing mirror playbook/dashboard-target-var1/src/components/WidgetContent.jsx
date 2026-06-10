import React from 'react'
import { WIDGET_REGISTRY } from '../data/widgetRegistry'
import BuCapitalCard from './widgets/BuCapitalCard'
import BuPaymentsCard from './widgets/BuPaymentsCard'
import BuBillPayCard from './widgets/BuBillPayCard'
import MetricCard from './widgets/MetricCard'

export const WIDGET_COMPONENTS = {
  'bu-capital':  BuCapitalCard,
  'bu-payments': BuPaymentsCard,
  'bu-billpay':  BuBillPayCard,
}

export const SECTION_ACCENT = {
  'Capital':     'var(--chart-green)',
  'Payments':    'var(--chart-purple)',
  'Bill Pay':    'var(--chart-teal)',
  'Experiments': 'var(--chart-orange)',
  'Campaigns':   'var(--chart-green)',
}

// Derive accent color from widget's preview type and trend direction.
// Distributions (horizontal-bar, stacked-bar) → AI violet (visible against chart-grid track)
// Progress/comparison-bar → AI violet
// Comparison-cards / bar-month → green (winner / upward monthly shape)
// number-sparkline / area-chart → green if up, red if down, neutral if no delta
export function getTrendAccent(widgetId) {
  const baseId = widgetId.replace(/--copy-\d+$/, '')
  const meta = WIDGET_REGISTRY.find((w) => w.id === baseId)
  if (!meta) return 'var(--chart-green)'

  switch (meta.preview) {
    case 'horizontal-bar':
    case 'stacked-bar':
    case 'progress-bar':
    case 'comparison-bar':
      return 'var(--chart-purple)'
    case 'comparison-cards':
    case 'bar-month':
      return 'var(--chart-green)'
    default:
      if (meta.previewDeltaUp === true)  return 'var(--chart-green)'
      if (meta.previewDeltaUp === false) return 'var(--pill-pink-ink)'
      return 'var(--chart-grid)'
  }
}

const CATEGORY_OVERRIDE = {
  'bu-capital':  'Capital',
  'bu-payments': 'Payments',
  'bu-billpay':  'Bill Pay',
}

export function getCardCategory(cardId) {
  const baseId = cardId.replace(/--copy-\d+$/, '')
  if (CATEGORY_OVERRIDE[baseId]) return CATEGORY_OVERRIDE[baseId]
  const widget = WIDGET_REGISTRY.find((w) => w.id === baseId)
  return widget?.category ?? null
}

export default function WidgetContent({ cardId, accentColor, pushToast, inFavourite }) {
  const baseId = cardId.replace(/--copy-\d+$/, '')
  const Comp = WIDGET_COMPONENTS[baseId]
  if (Comp) return <Comp pushToast={pushToast} inFavourite={inFavourite} />
  if (WIDGET_REGISTRY.find((w) => w.id === baseId)) {
    return <MetricCard widgetId={baseId} accentColor={accentColor} />
  }
  return <div className="card-placeholder">Widget content</div>
}
