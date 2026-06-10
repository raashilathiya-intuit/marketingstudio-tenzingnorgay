import React from 'react'

// Renders inline comparison text matching the canonical widget primitive:
// "↑ 12.4%" in semantic color + " vs prior quarter · 94% of $51M target" in ink-3.
// No pill background, no chip. Arrow + leading metric is colored; rest is muted.
export default function ComparisonLine({ text }) {
  if (!text) return null

  const isUp = text.startsWith('↑')
  const isDown = text.startsWith('↓')
  const match = text.match(/^([↑↓]\s*[\d.,]+[%+]?)(\s*.*)$/s)

  if (match) {
    const leadClass = isUp
      ? 'comparison-line__lead--up'
      : 'comparison-line__lead--down'
    return (
      <div className="comparison-line">
        <span className={leadClass}>{match[1]}</span>
        <span className="comparison-line__rest">{match[2]}</span>
      </div>
    )
  }

  // No directional arrow — render all in ink-3
  return <div className="comparison-line comparison-line__rest">{text}</div>
}
