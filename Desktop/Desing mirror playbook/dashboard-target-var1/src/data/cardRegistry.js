// Business impact card catalog — source of truth for Card Library
export const CARD_REGISTRY = [
  {
    id: 'insights',
    name: 'Insights',
    description: 'Proactive callouts surfaced by Studio AI — alerts, observations, and opportunities scoped to your GBSG dashboard.',
    whatItAnswers: 'What needs my attention right now? What patterns should I act on?',
    formula: 'Signals scored by recency, impact delta, and peer-pattern matching across active GBSG campaigns · Surfaced by Studio AI',
    category: 'Intelligence',
    defaultSize: 'L',
    source: 'Studio AI',
    freshness: 'Real-time',
    tags: ['insights', 'signals', 'AI', 'alerts', 'observations', 'opportunities'],
  },
  {
    id: 'bu-capital',
    name: 'Capital',
    description: 'Loan volume, applications, channel engagement, and revenue impact for Capital campaigns.',
    whatItAnswers: 'How is Capital performing against loan volume targets? Where is engagement?',
    formula: 'Loan volume = sum of disbursed loans from active Capital campaigns MTD · Source: QuickBase ledger + IPD impression-to-conversion attribution',
    category: 'Business impact',
    defaultSize: 'S',
    source: 'QuickBase + IPD',
    freshness: 'Hourly',
    tags: ['capital', 'loan volume', 'applications', 'revenue', 'ELM', 'LoC', 'IBCC'],
  },
  {
    id: 'bu-payments',
    name: 'Payments',
    description: 'TRON completions, GNA, active use, retention, and YTD attach for Payments campaigns.',
    whatItAnswers: 'Are Payments campaigns driving completions and attach? Is retention holding?',
    formula: 'TRON completions = unique Payments onboarding completions attributed to active campaigns MTD · Source: TRON ledger matched against CJA journey pipeline',
    category: 'Business impact',
    defaultSize: 'S',
    source: 'CJA + TRON',
    freshness: 'Hourly',
    tags: ['payments', 'TRON', 'GNA', 'active use', 'retention', 'attach', 'eS-19', 'ITP', 'GTP'],
  },
  {
    id: 'bu-billpay',
    name: 'Bill Pay',
    description: 'GNS subscriptions, upgrades, active use, revenue, and YTD attach for Bill Pay campaigns.',
    whatItAnswers: 'Are Bill Pay campaigns growing subscriptions and driving upgrades? How is revenue trending?',
    formula: 'GNS new subscribed = net-new GNS subscriptions attributed to active Bill Pay campaigns MTD · Source: QuickBase subscription ledger with campaign-level tagging',
    category: 'Business impact',
    defaultSize: 'S',
    source: 'QuickBase',
    freshness: 'Hourly',
    tags: ['bill pay', 'GNS', 'subscribed', 'upgrades', 'active use', 'revenue', 'attach', 'ITP', 'WP'],
  },
]

export const CARD_CATEGORIES = ['All', 'Intelligence', 'Business impact']

// Semantic intent map for mock smart-search
export const SEMANTIC_MAP = [
  { signals: ['capital', 'loan', 'loan volume', 'LoC', 'IBCC', 'applications'], ids: ['bu-capital'] },
  { signals: ['payments', 'TRON', 'completions', 'GNA', 'retention', 'attach'], ids: ['bu-payments'] },
  { signals: ['bill pay', 'GNS', 'subscribed', 'upgrades', 'revenue'], ids: ['bu-billpay'] },
  { signals: ['revenue', 'impact', 'business', 'active use'], ids: ['bu-capital', 'bu-payments', 'bu-billpay'] },
]
