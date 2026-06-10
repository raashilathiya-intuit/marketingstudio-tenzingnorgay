import React from 'react'
import PastelPill from '../PastelPill'
import { WIDGET_DATA } from '../../data/mock'
import './widgets.css'

const STAGE_COLORS = ['var(--pill-lavender-ink)', 'var(--pill-teal-ink)', 'var(--chart-green)']
const STAGE_BG = ['var(--pill-lavender-bg)', 'var(--pill-teal-bg)', 'var(--active-bg)']

export default function PromoteBatchesInFlight() {
  const data = WIDGET_DATA['promote-batches-in-flight']
  return (
    <div>
      <div className="widget-metric-value tnum">{data.value}</div>
      <div className="widget-metric-label">{data.valueLabel}</div>
      <div className="chart-summary-row">
        <PastelPill color={data.summary.pill.color} size="sm">{data.summary.pill.text}</PastelPill>
        <span className="chart-summary-text">{data.summary.text}</span>
      </div>
      <div className="batch-list">
        <div className="batch-stage-header">
          {data.stages.map((stage, i) => (
            <div key={stage} className="batch-stage-label" style={{ color: STAGE_COLORS[i] }}>
              {stage}
            </div>
          ))}
        </div>
        {data.batches.map((batch) => (
          <div key={batch.id} className="batch-row">
            <div className="batch-id">{batch.id}</div>
            <div className="batch-campaigns">{batch.campaigns} campaign{batch.campaigns !== 1 ? 's' : ''}</div>
            <div className="batch-stage-indicator">
              {data.stages.map((_, i) => (
                <div
                  key={i}
                  className={`batch-stage-pip ${i === batch.stageIndex ? 'batch-stage-pip--active' : ''} ${i < batch.stageIndex ? 'batch-stage-pip--done' : ''}`}
                  style={i === batch.stageIndex ? { background: STAGE_BG[i], borderColor: STAGE_COLORS[i] } : {}}
                />
              ))}
            </div>
            <div
              className="batch-current-stage"
              style={{ color: STAGE_COLORS[batch.stageIndex], background: STAGE_BG[batch.stageIndex] }}
            >
              {batch.stage}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
