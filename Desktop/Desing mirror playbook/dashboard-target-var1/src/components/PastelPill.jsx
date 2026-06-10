import React from 'react'
import './PastelPill.css'

export default function PastelPill({ color = 'teal', children, size = 'default' }) {
  return (
    <span className={`pastel-pill pastel-pill--${color} pastel-pill--${size}`}>
      {children}
    </span>
  )
}
