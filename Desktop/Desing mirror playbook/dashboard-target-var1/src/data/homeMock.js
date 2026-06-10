// ─── Home page KPI tiles ──────────────────────────────────────────────────────
// Base values = 8w defaults. periodOverrides keys: '4w' | 'week'

export const HOME_KPI_TILES = [
  {
    // Whole number — clickstream count. Shape: accelerating S-curve
    id: 'home-ipd-impressions',
    label: 'IPD Impressions',
    value: '48.7M',
    pill: { color: 'mint', text: '↑ 3.4M this week' },
    sparkline: [29.8, 33.1, 36.9, 40.2, 43.4, 45.8, 47.3, 48.7],
    sparklineColor: 'var(--chart-green)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View breakdown' },
    tooltip: {
      description: 'Total clickstream impressions served via IPD across all channels.',
      formula: 'Sum of all delivered impressions (email, push, in-app)',
    },
    popover: {
      summary: 'Impressions up 3.4M this week. In-app saw the largest relative jump (+9%) from 3 newly launched campaigns.',
      metrics: [
        { label: 'Email', value: '28.1M', delta: '↑ 1.8M' },
        { label: 'Push', value: '12.4M', delta: '↑ 890K' },
        { label: 'In-app', value: '8.2M', delta: '↑ 710K' },
      ],
      actionLabel: 'View impressions breakdown',
    },
    periodOverrides: {
      '4w': {
        value: '24.8M',
        pill: { color: 'mint', text: '↑ 1.9M this week' },
        sparkline: [20.4, 22.1, 23.6, 24.8],
        sparklineLabel: 'Last 4 weeks',
      },
      'week': {
        value: '6.4M',
        pill: { color: 'mint', text: '↑ 820K vs last week' },
        sparkline: [0.78, 0.95, 0.91, 0.98, 0.88, 1.02, 0.88],
        sparklineLabel: 'Mon – Sun',
      },
    },
  },
  {
    // Whole number — unique companies. Shape: slow, nearly flat linear climb
    id: 'home-ipd-company-reach',
    label: 'IPD Company Reach',
    value: '1.24M',
    pill: { color: 'mint', text: '↑ 62K this month' },
    sparkline: [1.19, 1.20, 1.20, 1.21, 1.21, 1.22, 1.23, 1.24],
    sparklineColor: 'var(--chart-green)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View reach' },
    tooltip: {
      description: 'Number of unique companies reached via IPD campaigns.',
      formula: 'Count of distinct company IDs exposed to at least one impression',
    },
    popover: {
      summary: 'Company reach up 62K this month. SMB segment accounts for 71% of newly reached companies.',
      metrics: [
        { label: 'SMB', value: '880K', delta: '↑ 44K' },
        { label: 'Mid-market', value: '290K', delta: '↑ 14K' },
        { label: 'Enterprise', value: '70K', delta: '↑ 4K' },
      ],
      actionLabel: 'View reach breakdown',
    },
    periodOverrides: {
      '4w': {
        value: '1.18M',
        pill: { color: 'mint', text: '↑ 34K this month' },
        sparkline: [1.15, 1.16, 1.17, 1.18],
        sparklineLabel: 'Last 4 weeks',
      },
      'week': {
        value: '1.22M',
        pill: { color: 'mint', text: '↑ 9K this week' },
        sparkline: [1.210, 1.211, 1.213, 1.214, 1.216, 1.218, 1.220],
        sparklineLabel: 'Mon – Sun',
      },
    },
  },
  {
    // Whole number — click events. Shape: volatile zigzag with upward drift
    id: 'home-ipd-clicks',
    label: 'IPD Clicks',
    value: '1.36M',
    pill: { color: 'mint', text: '↑ 94K this week' },
    sparkline: [0.94, 1.18, 1.02, 1.28, 1.09, 1.32, 1.19, 1.36],
    sparklineColor: 'var(--chart-green)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View clicks' },
    tooltip: {
      description: 'Total number of clicks generated from IPD campaign impressions.',
      formula: 'Sum of all click events across email, push, and in-app',
    },
    popover: {
      summary: 'Clicks up 94K this week, driven by a high-performing email subject line experiment with a 22% lift.',
      metrics: [
        { label: 'Email', value: '790K', delta: '↑ 58K' },
        { label: 'Push', value: '340K', delta: '↑ 22K' },
        { label: 'In-app', value: '230K', delta: '↑ 14K' },
      ],
      actionLabel: 'View clicks by channel',
    },
    periodOverrides: {
      '4w': {
        value: '641K',
        pill: { color: 'mint', text: '↑ 48K this week' },
        sparkline: [548, 618, 571, 641],
        sparklineLabel: 'Last 4 weeks',
      },
      'week': {
        value: '179K',
        pill: { color: 'mint', text: '↑ 12K vs last week' },
        sparkline: [18.6, 20.1, 21.4, 22.3, 23.1, 23.8, 24.2],
        sparklineLabel: 'Mon – Sun',
      },
    },
  },
  {
    // Percentage. Shape: flat baseline then uptick in final 3 weeks
    id: 'home-ipd-ctr',
    label: 'IPD CTR',
    value: '2.8%',
    pill: { color: 'mint', text: '↑ 0.3% vs last week' },
    sparkline: [2.4, 2.4, 2.5, 2.4, 2.5, 2.5, 2.7, 2.8],
    sparklineColor: 'var(--chart-green)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    tooltip: {
      description: 'Click-through rate across all IPD campaign impressions.',
      formula: 'Total clicks ÷ total impressions × 100',
    },
    popover: {
      summary: 'CTR trending up steadily. Subject line experiments are showing a +0.4% lift on email CTR vs control.',
      metrics: [
        { label: 'Email', value: '3.4%', delta: '↑ 0.4%' },
        { label: 'Push', value: '2.1%', delta: '↑ 0.1%' },
        { label: 'In-app', value: '4.8%', delta: '↑ 0.6%' },
      ],
      actionLabel: 'View CTR by campaign',
    },
    periodOverrides: {
      '4w': {
        value: '2.6%',
        pill: { color: 'mint', text: '↑ 0.2% vs prior 4w' },
        sparkline: [2.4, 2.5, 2.5, 2.6],
        sparklineLabel: 'Last 4 weeks',
      },
      'week': {
        value: '2.8%',
        pill: { color: 'mint', text: '↑ 0.1% vs Mon' },
        sparkline: [2.64, 2.66, 2.68, 2.68, 2.70, 2.74, 2.80],
        sparklineLabel: 'Mon – Sun',
      },
    },
  },
  {
    // Decimal multiplier. Shape: peaks and dips oscillating around stable baseline
    id: 'home-ipd-frequency',
    label: 'IPD Frequency',
    value: '3.2',
    pill: { color: 'lavender', text: '↓ 0.2 vs 8w ago' },
    sparkline: [3.4, 3.1, 3.6, 3.0, 3.5, 3.1, 3.3, 3.2],
    sparklineColor: 'var(--chart-green)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    tooltip: {
      description: 'Average number of times a company is exposed to an IPD impression per week.',
      formula: 'Total impressions ÷ unique companies reached',
    },
    popover: {
      summary: 'Frequency is healthy at 3.2, within the ≤5 target. Email is the heaviest channel — monitor for fatigue.',
      metrics: [
        { label: 'Email', value: '4.1', delta: null },
        { label: 'Push', value: '2.8', delta: null },
        { label: 'In-app', value: '1.9', delta: null },
      ],
      actionLabel: 'View frequency report',
    },
    periodOverrides: {
      '4w': {
        value: '3.4',
        pill: { color: 'lavender', text: 'Within target range' },
        sparkline: [3.2, 3.5, 3.1, 3.4],
        sparklineLabel: 'Last 4 weeks',
      },
      'week': {
        value: '3.1',
        pill: { color: 'lavender', text: '↓ 0.2 vs last week' },
        sparkline: [3.3, 3.0, 3.2, 3.4, 2.9, 3.2, 3.1],
        sparklineLabel: 'Mon – Sun',
      },
    },
  },
  {
    id: 'home-awaiting-approval',
    label: 'Awaiting approval',
    value: '7',
    pill: { color: 'pink', text: '↓ Oldest: 2 days' },
    descriptor: 'SLA target: 2 days',
    descriptorSuffix: ' · At risk',
    descriptorSuffixAtRisk: true,
    action: { label: 'View queue' },
  },
  {
    id: 'home-reachable-audience',
    label: 'Reachable audience',
    value: '847K',
    pill: { color: 'mint', text: '↑ 6.2K this month' },
    progressValue: 71,
    progressMax: 100,
    progressColor: 'var(--chart-green)',
    progressLabel: '847K of 1.2M · 71%',
    action: { label: 'View audience' },
  },
  {
    id: 'home-ann-ecosystem-revenue',
    label: 'Ann. Ecosystem Revenue',
    value: '$9.6M',
    pill: { color: 'mint', text: '↑ $23K vs last month' },
    sparkline: [9.2, 9.3, 9.35, 9.4, 9.45, 9.5, 9.55, 9.6],
    sparklineColor: 'var(--chart-green)',
    sparklineLabel: 'Last 4 weeks',
    action: { label: 'View revenue' },
  },
]

// ─── Home page action tiles ────────────────────────────────────────────────────

export const HOME_ACTION_TILES = [
  {
    id: 'create-campaign',
    label: 'Create campaign',
    description: 'Build email, push, or in-app campaigns with AI-assisted copy.',
    icon: 'sparkle',
  },
  {
    id: 'run-experiment',
    label: 'Run experiment',
    description: 'A/B test subject lines, offers and send times at scale.',
    icon: 'flask',
  },
  {
    id: 'campaign-analytics',
    label: 'Campaign analytics',
    description: 'Opens, clicks, conversions and revenue attribution.',
    icon: 'chart',
  },
  {
    id: 'audience-builder',
    label: 'Audience builder',
    description: 'Segment customers by behavior, attributes and predicted LTV.',
    icon: 'people',
  },
  {
    id: 'asset-library',
    label: 'Asset library',
    description: 'Approved templates, copy blocks and brand modules.',
    icon: 'folder',
  },
  {
    id: 'enterprise-ai',
    label: 'Enterprise AI tools',
    description: 'Access Claude, Cowork and AI-powered marketing workflows.',
    icon: 'robot',
  },
]
