import React, { useState, useRef, useEffect } from 'react'
import './StudioAiPanel.css'

// ─── Suggested questions (scoped to GBSG / current dashboard state) ───────────

const SUGGESTED_QUESTIONS = [
  { id: 'q1', text: 'Why is avg click rate at the at-risk floor?' },
  { id: 'q2', text: "Compare ELM-8333 to last quarter's Capital cross-sell winners" },
  { id: 'q3', text: "What's driving the Bill Pay GNS slowdown?" },
  { id: 'q4', text: 'Which live campaigns have the best ROI this week?' },
  { id: 'q5', text: "Summarize this week's performance for GBSG" },
]

// ─── Mocked responses ─────────────────────────────────────────────────────────

const MOCK_RESPONSES = {
  q1: {
    text: 'Avg click rate dropped from 0.62% (4 weeks ago) to 0.50% today — driven primarily by ELM-8333 and ELM-8291, which account for 61% of send volume. ELM-8333 Treatment A has been underperforming its control by 0.18pp for 3 weeks.',
    data: [
      { label: 'ELM-8333 click rate', value: '0.31%', delta: '↓ 0.19pp', negative: true },
      { label: 'ELM-8291 click rate', value: '0.44%', delta: '↓ 0.08pp', negative: true },
      { label: 'All other campaigns', value: '0.72%', delta: '↑ 0.04pp', negative: false },
    ],
  },
  q2: {
    text: 'ELM-8333 Treatment B is your best-performing Capital cross-sell this year. Compared to Q3 top-performers, it exceeds the prior benchmark (0.71% CTR) by 2.4×. The key differentiator appears to be the offer sequencing — showing loan eligibility before rate.',
    data: [
      { label: 'ELM-8333 Treatment B CTR', value: '1.71%', delta: '2.4× avg', negative: false },
      { label: 'Q3 winner (ELM-7890)', value: '0.71%', delta: 'prior best', negative: false },
      { label: 'Current GBSG avg CTR', value: '0.50%', delta: 'at-risk floor', negative: true },
    ],
  },
  q3: {
    text: 'Bill Pay GNS net-new subscriptions have declined 11% over 3 weeks. The audience segment 35–54 / homeowner shows the steepest drop. This matches Q3 ESS fatigue behavior — the segment typically needs a 6-week refresh cycle before re-engaging.',
    data: [
      { label: 'Week −3 new subs', value: '2,140', delta: 'baseline', negative: false },
      { label: 'Week −1 new subs', value: '1,847', delta: '↓ 13.7%', negative: true },
      { label: 'Segment 35–54 drop', value: '−18%', delta: 'highest decline', negative: true },
    ],
  },
}

function getResponse(questionId) {
  return MOCK_RESPONSES[questionId] ?? {
    text: 'Based on current GBSG dashboard data, this analysis is being generated. In production, this would pull live signals from Eloqua, IPD, and QuickBase to surface a real-time answer.',
    data: [],
  }
}

// ─── Sparkle icon for header ──────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2l1.5 4.5H15l-3.75 2.75 1.5 4.5L9 11l-3.75 2.75 1.5-4.5L3 6.5h4.5L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function AiResponse({ response }) {
  return (
    <div className="ai-response">
      <div className="ai-response-icon" aria-hidden="true">
        <SparkleIcon />
      </div>
      <div className="ai-response-body">
        <p className="ai-response-text">{response.text}</p>
        {response.data.length > 0 && (
          <div className="ai-data-block">
            {response.data.map((row, i) => (
              <div key={i} className="ai-data-row">
                <span className="ai-data-label">{row.label}</span>
                <span className="ai-data-value tnum">{row.value}</span>
                <span className={`ai-data-delta${row.negative ? ' ai-data-delta--neg' : ' ai-data-delta--pos'}`}>
                  {row.delta}
                </span>
              </div>
            ))}
          </div>
        )}
        <span className="ai-response-source">Studio AI · GBSG context · Sources: Eloqua, IPD, QuickBase</span>
      </div>
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export default function StudioAiPanel({ open, onClose }) {
  const [input, setInput] = useState('')
  const [activeResponse, setActiveResponse] = useState(null)
  const [activeQuestionText, setActiveQuestionText] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      // Reset on close
      setInput('')
      setActiveResponse(null)
      setActiveQuestionText(null)
    }
  }, [open])

  function handleQuestion(q) {
    setActiveQuestionText(q.text)
    setActiveResponse(getResponse(q.id))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    setActiveQuestionText(input.trim())
    setActiveResponse(getResponse('generic'))
    setInput('')
  }

  return (
    <>
      {/* Backdrop */}
      {open && <div className="ai-panel-backdrop" onClick={onClose} aria-hidden="true" />}

      {/* Panel */}
      <aside
        className={`ai-panel${open ? ' ai-panel--open' : ''}`}
        aria-label="Studio AI"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="ai-panel-header">
          <div className="ai-panel-header-left">
            <span className="ai-panel-header-icon">
              <SparkleIcon />
            </span>
            <span className="ai-panel-title">Studio AI</span>
            <span className="ai-panel-scope-chip">GBSG</span>
          </div>
          <button className="ai-panel-close" onClick={onClose} aria-label="Close Studio AI">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="ai-panel-body">
          {!activeResponse ? (
            <>
              {/* Intro */}
              <p className="ai-panel-intro">
                Ask me about your GBSG campaigns — Capital, Payments, and Bill Pay. I can compare performance, explain anomalies, and surface patterns across Eloqua, IPD, and QuickBase.
              </p>

              {/* Suggested questions */}
              <div className="ai-suggestions-label">Suggested</div>
              <div className="ai-suggestions">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    className="ai-suggestion-chip"
                    onClick={() => handleQuestion(q)}
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="ai-conversation">
              {/* User question */}
              <div className="ai-user-message">
                <span className="ai-user-bubble">{activeQuestionText}</span>
              </div>

              {/* AI response */}
              <AiResponse response={activeResponse} />

              {/* Ask another */}
              <button
                className="ai-ask-another"
                onClick={() => { setActiveResponse(null); setActiveQuestionText(null) }}
              >
                ← Ask another question
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="ai-panel-input-area">
          <form className="ai-input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Studio AI about your campaigns…"
              aria-label="Ask Studio AI"
            />
            <button
              type="submit"
              className="ai-input-send"
              aria-label="Send"
              disabled={!input.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
          <p className="ai-input-disclaimer">Studio AI can make mistakes. Verify critical data in source systems.</p>
        </div>
      </aside>
    </>
  )
}
