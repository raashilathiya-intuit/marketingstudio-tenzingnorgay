import React, { useState } from 'react'
import {
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './CardGrid.css'

import Card, { CardInner } from './Card'
import { CARD_REGISTRY } from '../data/cardRegistry'
import { WIDGET_REGISTRY } from '../data/widgetRegistry'
import WidgetContent, { getCardCategory, getTrendAccent } from './WidgetContent'

const GRID_EXCLUDED = new Set(['insights', 'insights-callouts'])

const BUSINESS_IMPACT_CATS = new Set(['Capital', 'Payments', 'Bill Pay'])

const COL_MAP = { S: 4, M: 6, ML: 8, L: 12 }

const SECTION_META = {
  'business-impact': { label: 'Business impact by product', cats: BUSINESS_IMPACT_CATS },
  'experiments':     { label: 'Experiments',                cats: new Set(['Experiments']) },
  'campaigns':       { label: 'My Campaigns',                cats: new Set(['Campaigns']) },
}

function getMeta(cardId) {
  const baseId = cardId.replace(/--copy-\d+$/, '')
  return (
    CARD_REGISTRY.find((c) => c.id === baseId) ??
    WIDGET_REGISTRY.find((w) => w.id === baseId)
  )
}

function toColSpan(size) {
  return COL_MAP[size] ?? 4
}

// ─── Grip icon (section drag handle) ─────────────────────────────────────────

function GripIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
      <circle cx="3" cy="2.5" r="1.1" fill="currentColor" />
      <circle cx="7" cy="2.5" r="1.1" fill="currentColor" />
      <circle cx="3" cy="7"   r="1.1" fill="currentColor" />
      <circle cx="7" cy="7"   r="1.1" fill="currentColor" />
      <circle cx="3" cy="11.5" r="1.1" fill="currentColor" />
      <circle cx="7" cy="11.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

// ─── SortableSection ─────────────────────────────────────────────────────────

function SortableSection({ sectionId, children, hasDrag, isInsertAbove, isInsertBelow }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionId,
    data: { type: 'section', sectionId },
  })

  // Ghost stays in place while DragOverlay handles the lifted visual
  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.2 : 1,
  }

  const wrapClass = [
    'sortable-section',
    isInsertAbove && 'sortable-section--insert-above',
    isInsertBelow && 'sortable-section--insert-below',
  ].filter(Boolean).join(' ')

  return (
    <div ref={setNodeRef} style={style} className={wrapClass}>
      {children({
        isDragging,
        dragHandleProps: hasDrag ? { ...attributes, ...listeners } : null,
      })}
    </div>
  )
}

// ─── CardGrid ─────────────────────────────────────────────────────────────────

export default function CardGrid({
  cards, onRemove, onResize, onDuplicate, onPin, onUnpin,
  sectionOrder, promotedCardIds,
  pushToast, activeDragId, overSectionId,
}) {
  // Filter out globally excluded IDs and currently-promoted cards
  const gridCards = cards.filter((c) => {
    const baseId = c.id.replace(/--copy-\d+$/, '')
    return !GRID_EXCLUDED.has(baseId) && !promotedCardIds?.has(c.id)
  })

  // Build ordered sections (only those that have cards)
  const sections = (sectionOrder ?? ['business-impact', 'experiments', 'campaigns'])
    .map((id) => {
      const meta = SECTION_META[id]
      if (!meta) return null
      const sectionCards = gridCards.filter((c) => meta.cats.has(getCardCategory(c.id)))
      if (sectionCards.length === 0) return null
      return { id, label: meta.label, cards: sectionCards }
    })
    .filter(Boolean)

  const hasSectionDrag = sections.length >= 2

  // Active section for DragOverlay (section drag takes priority over tile drag)
  const activeSectionId = activeDragId ? (sections.some(s => s.id === activeDragId) ? activeDragId : null) : null
  const activeSection = activeSectionId ? sections.find(s => s.id === activeSectionId) : null

  // Active card for DragOverlay (only when not a section drag)
  const activeCard = (!activeSectionId && activeDragId) ? gridCards.find((c) => c.id === activeDragId) : null
  const activeMeta = activeCard ? getMeta(activeCard.id) : null

  // Insertion indicator direction
  const activeSectionIdx = activeSectionId ? sections.findIndex(s => s.id === activeSectionId) : -1
  const overSectionIdx = overSectionId ? sections.findIndex(s => s.id === overSectionId) : -1

  // Uncategorized cards
  const knownCats = new Set([...BUSINESS_IMPACT_CATS, 'Experiments', 'Campaigns'])
  const otherCards = gridCards.filter((c) => {
    const cat = getCardCategory(c.id)
    return !cat || !knownCats.has(cat)
  })

  const allCardIds = gridCards.map((c) => c.id)

  if (gridCards.length === 0) {
    return (
      <section className="card-grid-section">
        <div className="card-grid-empty">
          <p className="card-grid-empty-text">No widgets in this view — use "+ Add widget" above to get started.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="card-grid-section">
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <SortableContext items={allCardIds} strategy={rectSortingStrategy}>

          {sections.map((section) => {
            const isInsertAbove = !!activeSectionId && overSectionId === section.id && activeSectionIdx > overSectionIdx
            const isInsertBelow = !!activeSectionId && overSectionId === section.id && activeSectionIdx < overSectionIdx
            return (
              <SortableSection
                key={section.id}
                sectionId={section.id}
                hasDrag={hasSectionDrag}
                isInsertAbove={isInsertAbove}
                isInsertBelow={isInsertBelow}
              >
                {({ isDragging, dragHandleProps }) => (
                  <div className={`card-band${isDragging ? ' card-band--dragging' : ''}`}>
                    <div
                      className={`card-band-header${hasSectionDrag && dragHandleProps ? ' card-band-header--draggable' : ''}`}
                      {...(hasSectionDrag && dragHandleProps ? dragHandleProps : {})}
                    >
                      {hasSectionDrag && (
                        <div className="section-drag-handle" aria-hidden="true">
                          <GripIcon />
                        </div>
                      )}
                      {section.label}
                    </div>
                    <div className="card-grid">
                      {section.cards.map((cardEntry) => (
                        <Card
                          key={cardEntry.id}
                          cardEntry={cardEntry}
                          onRemove={onRemove}
                          onResize={onResize}
                          onDuplicate={onDuplicate}
                          onPin={onPin}
                          onUnpin={onUnpin}
                          isPinnedToFavourite={false}
                        >
                          <WidgetContent
                            cardId={cardEntry.id}
                            accentColor={getTrendAccent(cardEntry.id)}
                            pushToast={pushToast}
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </SortableSection>
            )
          })}

          {/* Uncategorized fallback */}
          {otherCards.length > 0 && (
            <div className="card-band">
              <div className="card-grid">
                {otherCards.map((cardEntry) => (
                  <Card
                    key={cardEntry.id}
                    cardEntry={cardEntry}
                    onRemove={onRemove}
                    onResize={onResize}
                    onDuplicate={onDuplicate}
                    onPin={onPin}
                    onUnpin={onUnpin}
                    isPinnedToFavourite={false}
                  >
                    <WidgetContent
                      cardId={cardEntry.id}
                      accentColor="var(--chart-green)"
                      pushToast={pushToast}
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}

        </SortableContext>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
        {activeSection ? (
          <div
            style={{
              transform: 'scale(1.01)',
              transformOrigin: 'center top',
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              borderRadius: 'var(--r-card)',
            }}
          >
            <div className="card-band" style={{ marginBottom: 0 }}>
              <div className="card-band-header">{activeSection.label}</div>
              <div className="card-grid">
                {activeSection.cards.map((cardEntry) => {
                  const meta = getMeta(cardEntry.id)
                  return (
                    <div key={cardEntry.id} style={{ gridColumn: `span ${toColSpan(cardEntry.size)}` }}>
                      <CardInner
                        cardId={cardEntry.id}
                        title={meta?.name ?? cardEntry.id}
                        source={meta?.source}
                        size={cardEntry.size}
                        isPinned={cardEntry.pinned}
                        hideDragHandle
                      >
                        <WidgetContent
                          cardId={cardEntry.id}
                          accentColor={getTrendAccent(cardEntry.id)}
                        />
                      </CardInner>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : activeCard && activeMeta ? (
          <div
            style={{
              gridColumn: `span ${toColSpan(activeCard.size)}`,
              transform: 'scale(1.02)',
              transformOrigin: 'center top',
            }}
          >
            <CardInner
              cardId={activeCard.id}
              title={activeMeta.name}
              source={activeMeta.source}
              size={activeCard.size}
              isPinned={activeCard.pinned}
              className="card--dragging"
            >
              <WidgetContent
                cardId={activeCard.id}
                accentColor={getTrendAccent(activeCard.id)}
              />
            </CardInner>
          </div>
        ) : null}
      </DragOverlay>
    </section>
  )
}
