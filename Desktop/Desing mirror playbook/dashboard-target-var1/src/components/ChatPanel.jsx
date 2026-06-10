import React, { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'
import './StudioPrompt.css'

const GREETING_MESSAGES = [
  {
    id: 'ai-1',
    role: 'ai',
    text: "Good morning, Jason! I'm your Marketing Studio AI.",
  },
  {
    id: 'ai-2',
    role: 'ai',
    text: 'How can I help you today:',
  },
]

const SUGGESTED_PROMPTS = [
  'Build campaign',
  'Create an audience',
  'Run experiment',
  'Create offer',
]

const APPROVALS = [
  {
    group: 'Today',
    items: [
      { title: '14 QBO Online experiences', email: 'jane_doe@intuit.com', status: 'pending', resolved: null },
      { title: '8 QB Payroll experiences',  email: 'john_doe@intuit.com', status: 'pending', resolved: null },
      { title: '27 QB Payroll experiences', email: 'john_doe@intuit.com', status: 'approved', resolved: '05/24' },
    ],
  },
  {
    group: 'This week',
    items: [
      { title: '12 QB Payroll experiences',  email: 'john_doe@intuit.com', status: 'approved', resolved: '05/22' },
      { title: '16 QBO Online experiences',  email: 'john_doe@intuit.com', status: 'approved', resolved: '05/21' },
      { title: '22 QB Payroll experiences',  email: 'john_doe@intuit.com', status: 'approved', resolved: '05/20' },
      { title: '27 QBO Online experiences',  email: 'john_doe@intuit.com', status: 'approved', resolved: '05/19' },
    ],
  },
]

const APPROVAL_COUNT = APPROVALS.flatMap(g => g.items).filter(i => i.status === 'pending').length

const HISTORY_ICON = {
  search: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  edit: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9.5 2.5a1.5 1.5 0 0 1 2 2L4 12H2v-2L9.5 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  create: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  delete: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const HISTORY = [
  {
    group: 'Last hour',
    dot: '#3b82f6',
    items: [
      { time: '18:02 pm', icon: 'search', text: 'Find all QB Payroll IPD experiences using Bottomdrawer template in the last 3 months', count: 18, active: true },
      { time: '14:44 pm', icon: 'edit',   text: 'Change CTA label from "50% discount" to "60% discount"', count: 5, active: false },
      { time: '14:44 pm', icon: 'create', text: 'Create 5 IPD Experiences using Hellobox template for thrify survivors in DIWM cancelled campaign', count: 5, active: false },
    ],
  },
  {
    group: 'Earlier today',
    dot: '#d1d5db',
    items: [
      { time: '22:02 pm', icon: 'search', text: 'Find all QBO IPD experiences using Bottomdrawer template last 3 months', count: 5, active: false },
      { time: '20:12 pm', icon: 'delete', text: 'Delete underperforming experiences from all QBO DIWM campaigns run in the last 3 months', count: 9, active: false },
    ],
  },
]

function HistoryPane() {
  return (
    <div className="history-pane">
      {HISTORY.map(group => (
        <div key={group.group} className="history-group">
          <div className="history-group-header">
            <span className="history-group-dot" style={{ background: group.dot }} />
            <span className="history-group-label">{group.group}</span>
          </div>
          <div className="history-list">
            {group.items.map((item, i) => (
              <div key={i} className={`history-card${item.active ? ' history-card--active' : ''}`}>
                <div className="history-card-row">
                  <span className="history-card-icon">{HISTORY_ICON[item.icon]}</span>
                  <span className="history-card-time">{item.time}</span>
                </div>
                <p className="history-card-text">{item.text}</p>
                <button className="history-card-btn">Show {item.count} experiences</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ApprovalsPane() {
  return (
    <div className="approvals-pane">
      {APPROVALS.map(group => (
        <div key={group.group} className="approvals-group">
          <p className="approvals-group-label">{group.group}</p>
          <div className="approvals-list">
            {group.items.map((item, i) => (
              <div key={i} className="approval-card">
                <div className="approval-card-body">
                  <span className="approval-card-title">{item.title}</span>
                  <span className="approval-card-meta">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <circle cx="6" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1.5 10c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {item.email}{item.resolved && <span className="approval-card-resolved"> · resolved {item.resolved}</span>}
                  </span>
                </div>
                <span className={`approval-badge approval-badge--${item.status}`}>
                  {item.status === 'pending' ? 'Pending' : 'Approved'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const TABS = [
  {
    id: 'Chat',
    label: 'Chat',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5C4.55 1.5 1.5 3.86 1.5 6.85c0 1.6.82 3.04 2.13 4.04L2.5 14l3.7-1.42c.57.14 1.17.22 1.8.22 3.45 0 6.5-2.36 6.5-5.95C14.5 3.86 11.45 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="5.5" cy="7" r="0.9" fill="currentColor"/>
        <circle cx="8" cy="7" r="0.9" fill="currentColor"/>
        <circle cx="10.5" cy="7" r="0.9" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'History',
    label: 'History',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'Approvals',
    label: 'Approvals',
    badge: APPROVAL_COUNT,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {/* Clipboard body */}
        <path d="M5 2h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Clip at top */}
        <path d="M6 1.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5Z" stroke="currentColor" strokeWidth="1.3"/>
        {/* Checklist rows */}
        <path d="M5.5 6l.8.8 1.2-1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 6.2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M5.5 9l.8.8 1.2-1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9.2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Check badge circle */}
        <circle cx="12" cy="12" r="3.2" fill="white" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M10.5 12l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function ChatPanel({ width, onResize, showTabs = false }) {
  const [activeTab, setActiveTab] = useState('Chat')
  const [messages, setMessages] = useState(GREETING_MESSAGES)
  const [input, setInput] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const [showSuggested, setShowSuggested] = useState(true)
  const messagesEndRef = useRef(null)
  const resizeStartX = useRef(null)
  const resizeStartWidth = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setShowSuggested(false)
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text },
    ])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text: "I'm analyzing your data now. In a live environment this would surface real-time insights from your campaigns and experiments.",
        },
      ])
    }, 800)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handlePromptClick(prompt) {
    setShowSuggested(false)
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: prompt },
    ])
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text: "I'm pulling that up for you. In a live environment this would connect to real-time campaign and experiment data.",
        },
      ])
    }, 800)
  }

  function handleNewChat() {
    setMessages(GREETING_MESSAGES)
    setInput('')
    setShowSuggested(true)
  }

  function handleResizeMouseDown(e) {
    e.preventDefault()
    resizeStartX.current = e.clientX
    resizeStartWidth.current = width

    function onMouseMove(e) {
      const delta = resizeStartX.current - e.clientX
      const newWidth = Math.max(320, Math.min(640, resizeStartWidth.current + delta))
      onResize(newWidth)
    }

    function onMouseUp() {
      setIsResizing(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    setIsResizing(true)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <aside className="chat-panel" style={{ width }}>
      {/* Resize handle */}
      <div
        className={`chat-panel-resize${isResizing ? ' chat-panel-resize--active' : ''}`}
        onMouseDown={handleResizeMouseDown}
        title="Drag to resize"
      />

      {/* Tab bar */}
      <div className={`chat-panel-tabs${showTabs ? ' chat-panel-tabs--visible' : ''}`}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`chat-panel-tab${activeTab === tab.id ? ' chat-panel-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            data-tooltip={tab.label}
          >
            {tab.icon}
            {tab.badge != null && (
              <span className="chat-panel-tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Pane — keyed so animation re-triggers on tab switch */}
      <div key={activeTab} className="chat-pane">
        {activeTab === 'Approvals' ? (
          <ApprovalsPane />
        ) : activeTab === 'History' ? (
          <HistoryPane />
        ) : (
          <>
            {/* Messages */}
            <div className="chat-panel-messages">
              {messages.map(msg => {
                if (msg.role === 'ai-card') {
                  return (
                    <div key={msg.id} className="chat-msg-card">
                      {msg.items.map((item, i) => (
                        <div key={i} className={`chat-msg-card-item chat-msg-card-item--${item.status}`}>
                          <span className="chat-msg-card-dot" />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )
                }
                return (
                  <div key={msg.id} className={`chat-msg chat-msg--${msg.role}`}>
                    <div className="chat-msg-bubble">{msg.text}</div>
                  </div>
                )
              })}

              {showSuggested && (
                <div className="chat-suggested-prompts">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      className="chat-suggested-prompt"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-panel-input-area">
              <div className="studio-prompt-border chat-panel-prompt-border">
                <div className="studio-prompt-card chat-panel-prompt-card">
                  <textarea
                    className="studio-prompt-input"
                    placeholder="Ask Studio AI anything..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <div className="studio-prompt-footer">
                    <button className="studio-prompt-attach" aria-label="Attach">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </button>
                    <button
                      className={`studio-prompt-send${!input.trim() ? ' studio-prompt-send--disabled' : ''}`}
                      onClick={handleSend}
                      disabled={!input.trim()}
                      aria-label="Send"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="chat-panel-disclaimer">Studio AI may make mistakes. Verify important information.</p>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
