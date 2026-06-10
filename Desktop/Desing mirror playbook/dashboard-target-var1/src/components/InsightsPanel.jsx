import React from 'react'
import InsightsCard, { CALLOUTS } from './widgets/InsightsCard'
import './InsightsPanel.css'

function SparkleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="insights-panel-sparkle"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1738 7.63529C12.8792 6.05647 15.1204 6.05646 15.8258 7.63529L17.0715 10.4231C17.154 10.6079 17.3896 10.8421 17.6579 10.962L20.3644 12.1738C21.9425 12.8796 21.943 15.1205 20.3644 15.8258L17.5765 17.0715C17.3518 17.1719 17.1719 17.3518 17.0715 17.5765L15.8259 20.3644C15.1204 21.9432 12.8793 21.9432 12.1738 20.3644L10.9282 17.5765C10.8278 17.3518 10.6479 17.1719 10.4231 17.0715L7.63529 15.8258C6.05647 15.1204 6.05646 12.8793 7.63529 12.1738L10.4231 10.9282C10.6479 10.8278 10.8278 10.6479 10.9282 10.4231L12.1738 7.63529ZM15.2455 11.239L13.9998 8.45117L12.7542 11.239C12.4529 11.9134 11.9134 12.4529 11.239 12.7542L8.45117 13.9998L11.239 15.2455C11.9134 15.5468 12.4529 16.0863 12.7542 16.7607L13.9998 19.5485L15.2455 16.7607C15.5468 16.0863 16.0863 15.5468 16.7607 15.2455L19.5485 13.9998L16.8421 12.788C16.2112 12.5061 15.5646 11.9534 15.2455 11.239Z" fill="currentColor"/>
      <path d="M10.4838 2.31373C10.2969 1.89542 9.7031 1.89542 9.5162 2.31373L9.14485 3.14485L8.31373 3.5162C7.89542 3.7031 7.89542 4.2969 8.31373 4.4838L9.14485 4.85515L9.5162 5.68627C9.7031 6.10458 10.2969 6.10458 10.4838 5.68627L10.8552 4.85515L11.6863 4.4838C12.1046 4.2969 12.1046 3.7031 11.6863 3.5162L10.8552 3.14485L10.4838 2.31373Z" fill="currentColor"/>
      <path d="M5.7257 5.47059C5.44534 4.84314 4.55466 4.84313 4.2743 5.47059L3.71727 6.71727L2.47059 7.2743C1.84313 7.55466 1.84314 8.44534 2.47059 8.7257L3.71727 9.28273L4.2743 10.5294C4.55466 11.1569 5.44534 11.1569 5.7257 10.5294L6.28273 9.28273L7.52941 8.7257C8.15686 8.44534 8.15686 7.55466 7.52941 7.2743L6.28273 6.71727L5.7257 5.47059Z" fill="currentColor"/>
    </svg>
  )
}

export default function InsightsPanel({ dynamicCallouts = [], isLoading = false, pushToast }) {
  const totalSignals = CALLOUTS.length + dynamicCallouts.length

  return (
    <div className="insights-panel-border" role="region" aria-label="AI Insights">
      <div className="insights-panel">
        <div className="insights-panel-header">
          <div className="insights-panel-title">
            <SparkleIcon />
            <span>AI Insights</span>
          </div>
          <span className="insights-panel-count">
            {totalSignals} signal{totalSignals !== 1 ? 's' : ''}
          </span>
        </div>
        <InsightsCard
          pushToast={pushToast}
          dynamicCallouts={dynamicCallouts}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
