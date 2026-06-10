import React, { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PageHeader from '../components/PageHeader'
import KpiCard from '../components/KpiCard'
import KpiPeriodDropdown from '../components/KpiPeriodDropdown'
import CampaignMetricLibrary, { CAMPAIGN_METRIC_SECTIONS } from '../components/CampaignMetricLibrary'
import '../components/KpiStrip.css'
import './ProjectsPage.css'
import './CampaignsPage.css'

// ─── KPI tiles (top strip) ──────────────────────────────────────────────────

const CAMPAIGNS_KPIS = [
  {
    id: 'active-campaigns',
    label: 'Active campaigns',
    value: '24',
    pill: { color: 'mint', text: '↑ 4 vs last week' },
    sparkline: [18, 19, 20, 21, 21, 22, 23, 24],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View all' },
  },
  {
    id: 'avg-ctr',
    label: 'Avg CTR',
    value: '3.8%',
    pill: { color: 'mint', text: '↑ 0.4% vs last month' },
    sparkline: [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.7, 3.8],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
  },
  {
    id: 'total-impressions',
    label: 'Total impressions',
    value: '2.1M',
    pill: { color: 'mint', text: '↑ 12% vs last month' },
    sparkline: [1.6, 1.7, 1.8, 1.85, 1.9, 2.0, 2.05, 2.1],
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View breakdown' },
  },
  {
    id: 'campaigns-at-risk',
    label: 'Campaigns at risk',
    value: '3',
    pill: { color: 'pink', text: '↑ 1 vs last week' },
    sparkline: [1, 2, 2, 2, 2, 3, 3, 3],
    sparklineColor: 'var(--pill-pink-ink)',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View at-risk' },
  },
]

// ─── Delivery & reach tiles ─────────────────────────────────────────────────

const DELIVERY_REACH_INIT = [
  {
    id: 'camp-dr-impressions',
    label: 'Total impressions',
    value: '2.1M',
    pill: { color: 'mint', text: '↑ 12% vs last month' },
    sparkline: [1.5, 1.6, 1.7, 1.75, 1.85, 1.95, 2.0, 2.1],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View breakdown' },
    popover: {
      summary: 'Total impressions served across all active campaigns this period, including email opens, IPD views, and push deliveries.',
      metrics: [
        { label: 'IPD impressions', value: '1.4M', delta: '↑ 10%' },
        { label: 'Email opens',     value: '520K', delta: '↑ 15%' },
        { label: 'Push impressions', value: '180K', delta: '↑ 8%' },
      ],
      actionLabel: 'View full breakdown',
    },
  },
  {
    id: 'camp-dr-unique-reach',
    label: 'Unique reach',
    value: '1.24M',
    pill: { color: 'mint', text: '↑ 8% vs last week' },
    sparkline: [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.24],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    tooltip: { description: 'Deduplicated unique users who were served at least one impression.' },
    popover: {
      summary: 'Deduplicated count of unique users reached across all channels. Each user is counted once regardless of how many times they were served.',
      metrics: [
        { label: 'Email reach',   value: '740K',  delta: '↑ 6%' },
        { label: 'IPD reach',     value: '480K',  delta: '↑ 12%' },
        { label: 'Push reach',    value: '90K',   delta: '↑ 4%' },
      ],
      actionLabel: 'View audience details',
    },
  },
  {
    id: 'camp-dr-deliverability',
    label: 'Deliverability rate',
    value: '97.4%',
    pill: { color: 'lavender', text: 'Industry avg 96.1%' },
    sparkline: [96.5, 96.8, 97.0, 97.1, 97.2, 97.3, 97.4, 97.4],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    popover: {
      summary: 'Percentage of sent messages that successfully reached inboxes. Reflects list health, sender reputation, and infrastructure quality.',
      metrics: [
        { label: 'Inbox rate',       value: '94.1%', delta: '↑ 0.8%' },
        { label: 'Spam rate',        value: '1.2%',  delta: '↓ 0.3% improved' },
        { label: 'Rejected/bounced', value: '1.4%',  delta: '↓ 0.1% improved' },
      ],
      actionLabel: 'View deliverability report',
    },
  },
  {
    id: 'camp-dr-frequency',
    label: 'Avg frequency',
    value: '3.2',
    pill: { color: 'lavender', text: 'Impressions per user' },
    sparkline: [2.8, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2, 3.2],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View details' },
    tooltip: { description: 'Average number of impressions delivered per unique reached user.' },
    popover: {
      summary: 'Average number of impressions delivered per unique reached user. Frequency above 5 signals potential fatigue risk.',
      metrics: [
        { label: 'Email frequency', value: '2.1',  delta: 'Stable' },
        { label: 'IPD frequency',   value: '4.8',  delta: '↑ 0.4 — monitor' },
        { label: 'Push frequency',  value: '1.6',  delta: '↓ 0.2 improved' },
      ],
      actionLabel: 'View frequency analysis',
    },
  },
  {
    id: 'camp-dr-audience-reach',
    label: 'Audience reach rate',
    value: '78%',
    pill: { color: 'mint', text: '1.24M of 1.6M reached' },
    progressValue: 78,
    progressMax: 100,
    progressColor: '#7B6FD8',
    progressLabel: 'of eligible audience reached',
    action: { label: 'View audience' },
    tooltip: { description: 'Share of the eligible audience that was successfully reached.' },
    popover: {
      summary: 'Share of the total eligible audience that was successfully reached at least once this period. The remaining 22% was suppressed or unreachable.',
      metrics: [
        { label: 'Reached',     value: '1.24M', delta: '↑ 8%' },
        { label: 'Suppressed',  value: '220K',  delta: '14% of eligible' },
        { label: 'Unreachable', value: '130K',  delta: '8% of eligible' },
      ],
      actionLabel: 'View audience breakdown',
    },
  },
]

// ─── Engagement tiles ────────────────────────────────────────────────────────

const ENGAGEMENT_INIT = [
  {
    id: 'camp-eng-open-rate',
    label: 'Open rate',
    value: '31.4%',
    pill: { color: 'mint', text: '↑ 3% vs last month' },
    sparkline: [27.5, 28.2, 29.0, 29.8, 30.2, 30.8, 31.1, 31.4],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    popover: {
      summary: 'Percentage of delivered emails that were opened. Reflects subject line quality, sender recognition, and send-time optimisation.',
      metrics: [
        { label: 'Desktop opens', value: '18.2%', delta: '↑ 1.4%' },
        { label: 'Mobile opens',  value: '13.2%', delta: '↑ 1.6%' },
        { label: 'Industry avg',  value: '24.1%', delta: '+7.3 pts above' },
      ],
      actionLabel: 'View open rate report',
    },
  },
  {
    id: 'camp-eng-ctr',
    label: 'Click rate (CTR)',
    value: '3.8%',
    pill: { color: 'mint', text: '↑ 0.4% vs last month' },
    sparkline: [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.7, 3.8],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    popover: {
      summary: 'Clicks as a share of total delivered messages across all active campaigns. Primary measure of content-audience fit.',
      metrics: [
        { label: 'Email CTR',  value: '3.1%', delta: '↑ 0.3%' },
        { label: 'IPD CTR',    value: '5.8%', delta: '↑ 0.7%' },
        { label: 'Push CTR',   value: '2.4%', delta: '↑ 0.2%' },
      ],
      actionLabel: 'View click report',
    },
  },
  {
    id: 'camp-eng-ctor',
    label: 'Click-to-open rate',
    value: '12.1%',
    pill: { color: 'mint', text: '↑ 1.2% vs last month' },
    sparkline: [10.2, 10.5, 10.8, 11.1, 11.4, 11.7, 11.9, 12.1],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View breakdown' },
    tooltip: { description: 'Percentage of openers who clicked. Measures email content effectiveness.' },
    popover: {
      summary: 'Clicks as a share of unique openers. Measures how effectively the email body converts interest into action after the initial open.',
      metrics: [
        { label: 'Top campaign CTOR',    value: '19.4%', delta: 'Intuit Assist upsell' },
        { label: 'Lowest campaign CTOR', value: '6.2%',  delta: 'Enterprise renewal' },
        { label: 'Industry avg',         value: '10.5%', delta: '+1.6 pts above' },
      ],
      actionLabel: 'View content analysis',
    },
  },
  {
    id: 'camp-eng-unique-ctr',
    label: 'Unique CTR by access point',
    value: '2.9%',
    pill: { color: 'lavender', text: 'Stable vs last month' },
    sparkline: [2.7, 2.8, 2.9, 2.8, 2.9, 2.9, 2.9, 2.9],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View details' },
    tooltip: { description: 'Unique clicks as a share of reach, broken down by surface (email, IPD, push).' },
    popover: {
      summary: 'Unique clicks as a percentage of total reach, broken down by the surface where the click occurred.',
      metrics: [
        { label: 'Email access point',  value: '2.4%', delta: 'Stable' },
        { label: 'IPD access point',    value: '4.9%', delta: '↑ 0.3%' },
        { label: 'Push access point',   value: '1.8%', delta: 'Stable' },
      ],
      actionLabel: 'View access point details',
    },
  },
  {
    id: 'camp-eng-bounce-rate',
    label: 'Bounce rate',
    value: '4.2%',
    pill: { color: 'mint', text: '↓ 0.8% improved' },
    sparkline: [4.2, 4.3, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View report' },
    tooltip: { description: 'Post-click bounce rate. Lower is better.' },
    popover: {
      summary: 'Post-click bounce rate — users who clicked through but left the landing page without any further interaction. Lower is better.',
      metrics: [
        { label: 'Hard bounces',    value: '1.1%', delta: '↓ 0.2% improved' },
        { label: 'Soft bounces',    value: '3.1%', delta: '↓ 0.6% improved' },
        { label: 'Industry avg',    value: '5.8%', delta: '1.6 pts below — good' },
      ],
      actionLabel: 'View bounce analysis',
    },
  },
  {
    id: 'camp-eng-unsubscribe',
    label: 'Unsubscribe rate',
    value: '0.3%',
    pill: { color: 'mint', text: '↓ 0.05% improved' },
    sparkline: [0.30, 0.30, 0.31, 0.30, 0.30, 0.30, 0.30, 0.30],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View details' },
    tooltip: { description: 'Opt-out rate. Lower is better. Industry benchmark <0.5%.' },
    popover: {
      summary: 'Percentage of recipients who unsubscribed. The industry benchmark threshold is 0.5% — staying below this protects sender reputation.',
      metrics: [
        { label: 'Current rate',       value: '0.3%',  delta: 'Well below threshold' },
        { label: 'Highest this period', value: '0.6%', delta: 'Enterprise renewal (1 campaign)' },
        { label: 'Industry benchmark', value: '<0.5%', delta: 'On track' },
      ],
      actionLabel: 'View opt-out details',
    },
  },
  {
    id: 'camp-eng-time-on-page',
    label: 'Avg time on page',
    value: '2m 14s',
    pill: { color: 'mint', text: '↑ 18s vs last month' },
    sparkline: [100, 106, 110, 114, 118, 122, 130, 134],
    sparklineColor: '#7B6FD8',
    sparklineLabel: 'Last 8 weeks',
    action: { label: 'View details' },
    tooltip: { description: 'Average post-click engagement depth, measured in seconds.' },
    popover: {
      summary: 'Average time users spend on the landing page after clicking through from a campaign. A proxy for content relevance and landing page quality.',
      metrics: [
        { label: 'Top landing page',    value: '3m 42s', delta: 'QBLive trial campaign' },
        { label: 'Lowest landing page', value: '0m 48s', delta: 'DIFM cancelled campaign' },
        { label: 'vs last month',       value: '+18s',   delta: '↑ trend' },
      ],
      actionLabel: 'View engagement details',
    },
  },
]

// ─── Mock data ──────────────────────────────────────────────────────────────

const ALL_CAMPAIGNS = [
  { id: 1,  name: 'DIFM cancelled_Campaign',                createdDate: 'August 19, 2025', createdBy: 'Moraya West',     lastModified: '1 min ago',    lastModifiedBy: 'John Doe',        impressions: '1.2M',  ctr: '3.1%' },
  { id: 2,  name: 'QuickBooks DIFM winback campaign setup', createdDate: 'August 19, 2025', createdBy: 'Jonathan Pine',   lastModified: '1 min ago',    lastModifiedBy: 'John Doe',        impressions: '890K',  ctr: '4.2%' },
  { id: 3,  name: 'Create 50% off QBLive offer',           createdDate: 'August 19, 2025', createdBy: 'Angela Burr',     lastModified: '1 min ago',    lastModifiedBy: 'John Doe',        impressions: '2.4M',  ctr: '5.8%' },
  { id: 4,  name: 'QuickBooks DIFM winback campaign setup', createdDate: 'August 19, 2025', createdBy: 'Richard Onslaw',  lastModified: '1 min ago',    lastModifiedBy: 'John Doe',        impressions: '740K',  ctr: '2.9%' },
  { id: 5,  name: 'Create 50% off QBLive offer',           createdDate: 'August 19, 2025', createdBy: 'John Doe',        lastModified: '1 min ago',    lastModifiedBy: 'John Doe',        impressions: '1.8M',  ctr: '6.1%' },
  { id: 18, name: 'QBO win-back email series',             createdDate: 'August 15, 2025', createdBy: 'John Doe',        lastModified: '2 hours ago',  lastModifiedBy: 'John Doe',        impressions: '920K',  ctr: '3.4%' },
  { id: 19, name: 'Payroll Q3 seasonal push',              createdDate: 'August 12, 2025', createdBy: 'John Doe',        lastModified: '4 hours ago',  lastModifiedBy: 'John Doe',        impressions: '1.1M',  ctr: '4.8%' },
  { id: 20, name: 'SMB trial extension offer',             createdDate: 'August 10, 2025', createdBy: 'John Doe',        lastModified: 'Yesterday',    lastModifiedBy: 'John Doe',        impressions: '670K',  ctr: '5.2%' },
  { id: 21, name: 'QBLive accountant partner promo',       createdDate: 'August 8, 2025',  createdBy: 'John Doe',        lastModified: 'Yesterday',    lastModifiedBy: 'John Doe',        impressions: '2.3M',  ctr: '3.9%' },
  { id: 22, name: 'DIFM onboarding nurture sequence',      createdDate: 'August 5, 2025',  createdBy: 'John Doe',        lastModified: '2 days ago',   lastModifiedBy: 'John Doe',        impressions: '880K',  ctr: '6.7%' },
  { id: 23, name: 'Tax season early-bird campaign',        createdDate: 'July 30, 2025',   createdBy: 'John Doe',        lastModified: '3 days ago',   lastModifiedBy: 'John Doe',        impressions: '3.4M',  ctr: '4.1%' },
  { id: 24, name: 'Capital 0% APR limited offer',          createdDate: 'July 25, 2025',   createdBy: 'John Doe',        lastModified: '4 days ago',   lastModifiedBy: 'John Doe',        impressions: '1.6M',  ctr: '7.3%' },
  { id: 25, name: 'Payments feature awareness blast',      createdDate: 'July 20, 2025',   createdBy: 'John Doe',        lastModified: '5 days ago',   lastModifiedBy: 'John Doe',        impressions: '2.9M',  ctr: '3.2%' },
  { id: 26, name: 'Mid-market upsell to Plus plan',        createdDate: 'July 15, 2025',   createdBy: 'John Doe',        lastModified: '1 week ago',   lastModifiedBy: 'John Doe',        impressions: '740K',  ctr: '5.6%' },
  { id: 27, name: 'Enterprise renewal early incentive',    createdDate: 'July 10, 2025',   createdBy: 'John Doe',        lastModified: '1 week ago',   lastModifiedBy: 'John Doe',        impressions: '560K',  ctr: '2.8%' },
  { id: 28, name: 'QBO Advanced feature spotlight',        createdDate: 'July 5, 2025',    createdBy: 'John Doe',        lastModified: '2 weeks ago',  lastModifiedBy: 'John Doe',        impressions: '1.2M',  ctr: '4.5%' },
  { id: 29, name: 'Self-employed upgrade push',            createdDate: 'June 30, 2025',   createdBy: 'John Doe',        lastModified: '2 weeks ago',  lastModifiedBy: 'John Doe',        impressions: '980K',  ctr: '6.0%' },
  { id: 30, name: 'Bill Pay launch awareness',             createdDate: 'June 25, 2025',   createdBy: 'John Doe',        lastModified: '3 weeks ago',  lastModifiedBy: 'John Doe',        impressions: '2.1M',  ctr: '3.7%' },
  { id: 31, name: 'Payroll compliance reminder series',    createdDate: 'June 20, 2025',   createdBy: 'John Doe',        lastModified: '3 weeks ago',  lastModifiedBy: 'John Doe',        impressions: '830K',  ctr: '4.9%' },
  { id: 32, name: 'DIFM Q3 re-engagement flow',           createdDate: 'June 15, 2025',   createdBy: 'John Doe',        lastModified: '1 month ago',  lastModifiedBy: 'John Doe',        impressions: '1.5M',  ctr: '5.3%' },
  { id: 33, name: 'QBO Simple Start trial push',           createdDate: 'June 10, 2025',   createdBy: 'John Doe',        lastModified: '1 month ago',  lastModifiedBy: 'John Doe',        impressions: '3.0M',  ctr: '3.1%' },
  { id: 34, name: 'Intuit Assist upsell campaign',         createdDate: 'June 5, 2025',    createdBy: 'John Doe',        lastModified: '1 month ago',  lastModifiedBy: 'John Doe',        impressions: '1.7M',  ctr: '6.4%' },
  { id: 35, name: 'Capital loan pre-approval offer',       createdDate: 'May 28, 2025',    createdBy: 'John Doe',        lastModified: '6 weeks ago',  lastModifiedBy: 'John Doe',        impressions: '2.4M',  ctr: '4.2%' },
  { id: 36, name: 'Accountant referral incentive blast',   createdDate: 'May 20, 2025',    createdBy: 'John Doe',        lastModified: '7 weeks ago',  lastModifiedBy: 'John Doe',        impressions: '690K',  ctr: '7.1%' },
  { id: 6,  name: 'QBO email re-engagement Q3',            createdDate: 'August 12, 2025', createdBy: 'Priya Nair',      lastModified: '3 hours ago',  lastModifiedBy: 'Priya Nair',      impressions: '3.1M',  ctr: '3.8%' },
  { id: 7,  name: 'SMB push notification test',            createdDate: 'August 10, 2025', createdBy: 'Marcus Lin',      lastModified: '2 hours ago',  lastModifiedBy: 'Marcus Lin',      impressions: '560K',  ctr: '7.4%' },
  { id: 8,  name: 'Payroll upsell experiment',             createdDate: 'August 8, 2025',  createdBy: 'Sarah Kim',       lastModified: 'Yesterday',    lastModifiedBy: 'John Doe',        impressions: '1.4M',  ctr: '2.6%' },
  { id: 9,  name: 'DIFM trial-to-paid nurture',            createdDate: 'August 5, 2025',  createdBy: 'David Chen',      lastModified: 'Yesterday',    lastModifiedBy: 'David Chen',      impressions: '980K',  ctr: '4.9%' },
  { id: 10, name: 'QBLive 30-day free trial campaign',     createdDate: 'July 28, 2025',   createdBy: 'Angela Burr',     lastModified: '2 days ago',   lastModifiedBy: 'Angela Burr',     impressions: '2.7M',  ctr: '5.2%' },
  { id: 11, name: 'Accountant partner onboarding flow',    createdDate: 'July 22, 2025',   createdBy: 'Moraya West',     lastModified: '3 days ago',   lastModifiedBy: 'John Doe',        impressions: '430K',  ctr: '3.3%' },
  { id: 12, name: 'Self-employed tax season push',         createdDate: 'July 15, 2025',   createdBy: 'Jonathan Pine',   lastModified: '5 days ago',   lastModifiedBy: 'Jonathan Pine',   impressions: '1.1M',  ctr: '4.7%' },
  { id: 13, name: 'Enterprise renewal reminder sequence',  createdDate: 'July 10, 2025',   createdBy: 'Richard Onslaw',  lastModified: '1 week ago',   lastModifiedBy: 'Richard Onslaw',  impressions: '670K',  ctr: '2.1%' },
  { id: 14, name: 'Payments feature launch campaign',      createdDate: 'July 3, 2025',    createdBy: 'Sarah Kim',       lastModified: '1 week ago',   lastModifiedBy: 'John Doe',        impressions: '4.2M',  ctr: '6.6%' },
  { id: 15, name: 'Mid-market win-back series',            createdDate: 'June 28, 2025',   createdBy: 'Marcus Lin',      lastModified: '2 weeks ago',  lastModifiedBy: 'Marcus Lin',      impressions: '810K',  ctr: '3.5%' },
  { id: 16, name: 'Intuit Assist beta invite campaign',    createdDate: 'June 20, 2025',   createdBy: 'Priya Nair',      lastModified: '3 weeks ago',  lastModifiedBy: 'Priya Nair',      impressions: '1.5M',  ctr: '8.2%' },
  { id: 17, name: 'Q2 seasonal promotions bundle',         createdDate: 'June 12, 2025',   createdBy: 'David Chen',      lastModified: '1 month ago',  lastModifiedBy: 'John Doe',        impressions: '3.6M',  ctr: '4.4%' },
]

const PAGE_SIZE = 10

// ─── Sortable KPI card ────────────────────────────────────────────────────────

function SortableKpiCard({ kpi }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: kpi.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        borderRadius: 'var(--r-card)',
      }}
      {...listeners}
      {...attributes}
    >
      <KpiCard
        label={kpi.label}
        value={kpi.value}
        pill={kpi.pill}
        sparkline={kpi.sparkline}
        sparklineColor={kpi.sparklineColor}
        sparklineLabel={kpi.sparklineLabel}
        progressValue={kpi.progressValue}
        progressMax={kpi.progressMax}
        progressColor={kpi.progressColor}
        progressLabel={kpi.progressLabel}
        action={kpi.action}
        tooltip={kpi.tooltip}
        popover={kpi.popover}
      />
    </div>
  )
}

// ─── Metric section with drag-reorder ────────────────────────────────────────

function DraggableMetricSection({ label, tiles, onReorder }) {
  const [draggingTile, setDraggingTile] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleDragStart({ active }) {
    setDraggingTile(tiles.find((t) => t.id === active.id) ?? null)
  }

  function handleDragEnd({ active, over }) {
    setDraggingTile(null)
    if (!over || active.id === over.id) return
    const oldIdx = tiles.findIndex((t) => t.id === active.id)
    const newIdx = tiles.findIndex((t) => t.id === over.id)
    onReorder(arrayMove(tiles, oldIdx, newIdx))
  }

  return (
    <div className="camp-metrics-section">
      <div className="camp-section-header">
        <span className="camp-section-label">{label}</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDraggingTile(null)}
      >
        <SortableContext items={tiles.map((t) => t.id)} strategy={rectSortingStrategy}>
          <div className="kpi-strip-section">
            <div className="kpi-strip">
              {tiles.map((kpi) => (
                <SortableKpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 160, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {draggingTile ? (
            <div style={{
              borderRadius: 'var(--r-card)',
              boxShadow: '0 0 0 2px #7B6FD8, 0 12px 32px rgba(0,0,0,0.14)',
              transform: 'scale(1.02)',
              cursor: 'grabbing',
            }}>
              <KpiCard
                label={draggingTile.label}
                value={draggingTile.value}
                pill={draggingTile.pill}
                sparkline={draggingTile.sparkline}
                sparklineColor={draggingTile.sparklineColor}
                sparklineLabel={draggingTile.sparklineLabel}
                progressValue={draggingTile.progressValue}
                progressMax={draggingTile.progressMax}
                progressColor={draggingTile.progressColor}
                progressLabel={draggingTile.progressLabel}
                action={draggingTile.action}
                tooltip={draggingTile.tooltip}
                popover={draggingTile.popover}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

// ─── Sort icon ───────────────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`proj-sort-icon${active ? ' proj-sort-icon--active' : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── CampaignsPage ───────────────────────────────────────────────────────────

export default function CampaignsPage({ navigate }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch]   = useState('')
  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage]       = useState(1)
  const [period, setPeriod]   = useState('week')
  const [libraryOpen, setLibraryOpen] = useState(false)

  // Metric section tile ordering
  const [deliveryReachTiles, setDeliveryReachTiles] = useState(DELIVERY_REACH_INIT)
  const [engagementTiles, setEngagementTiles]       = useState(ENGAGEMENT_INIT)

  // Extra sections added from the metric library: { [sectionId]: tile[] }
  const [extraSections, setExtraSections] = useState({})

  // All added tile IDs across extra sections
  const allAddedIds = useMemo(() => {
    const ids = new Set()
    Object.values(extraSections).forEach(tiles => tiles.forEach(t => ids.add(t.id)))
    return ids
  }, [extraSections])

  function handleAddMetric(sectionId, metric) {
    setExtraSections(prev => {
      const existing = prev[sectionId] ?? []
      if (existing.some(t => t.id === metric.id)) return prev
      return { ...prev, [sectionId]: [...existing, metric] }
    })
  }

  const BASE_CAMPAIGNS = activeTab === 'my-campaigns'
    ? ALL_CAMPAIGNS.filter(c => c.createdBy === 'John Doe')
    : ALL_CAMPAIGNS

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return BASE_CAMPAIGNS
    return BASE_CAMPAIGNS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.createdBy.toLowerCase().includes(q) ||
      c.lastModifiedBy.toLowerCase().includes(q)
    )
  }, [search, activeTab])

  const sorted = useMemo(() => {
    if (sortCol !== 'name') return filtered
    return [...filtered].sort((a, b) =>
      sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    )
  }, [filtered, sortCol, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageRows   = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
    setPage(1)
  }

  function handleSearch(val) {
    setSearch(val)
    setPage(1)
  }

  const COLS = [
    { key: 'name',           label: 'Name',             sortable: true },
    { key: 'impressions',    label: 'Impressions',      sortable: false },
    { key: 'ctr',            label: 'CTR',              sortable: false },
    { key: 'createdDate',    label: 'Created',          sortable: false },
    { key: 'createdBy',      label: 'Created by',       sortable: false },
    { key: 'lastModified',   label: 'Last modified',    sortable: false },
    { key: 'lastModifiedBy', label: 'Last modified by', sortable: false },
  ]

  const headerRight = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <KpiPeriodDropdown selected={period} onChange={setPeriod} />
      <button
        aria-label="Add metrics"
        onClick={() => setLibraryOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '34px', height: '34px', border: '1px solid #e5e5ea', borderRadius: '8px',
          background: 'var(--surface)', color: 'var(--ink-2)', cursor: 'pointer',
          flexShrink: 0, transition: 'background 0.12s, border-color 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = '#d0d0d5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = '#e5e5ea'; }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11.333 2a1.886 1.886 0 012.667 2.667L4.833 13.833 1.5 14.5l.667-3.333L11.333 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )

  return (
    <>
      <PageHeader title="All campaigns" meta={false} onOpenLibrary={() => {}} rightSlot={headerRight} />

      {/* Metric library side drawer */}
      <CampaignMetricLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        addedIds={allAddedIds}
        onAdd={handleAddMetric}
      />

      {/* Page tabs + Create campaign */}
      <div className="camp-tabs">
        <div className="camp-tabs-left">
          <button
            className={`camp-tab${activeTab === 'overview' ? ' camp-tab--active' : ''}`}
            onClick={() => { setActiveTab('overview'); setPage(1); setSearch('') }}
          >
            Insights
          </button>
          <button
            className={`camp-tab${activeTab === 'my-campaigns' ? ' camp-tab--active' : ''}`}
            onClick={() => { setActiveTab('my-campaigns'); setPage(1); setSearch('') }}
          >
            My campaigns
          </button>
        </div>
        <div className="camp-tabs-right">
          <button className="proj-create-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Create campaign
          </button>
        </div>
      </div>

      {/* ── Overview tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <>
          {/* Top KPI strip */}
          <div className="kpi-strip-section">
            <div className="kpi-strip">
              {CAMPAIGNS_KPIS.map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  pill={kpi.pill}
                  sparkline={kpi.sparkline}
                  sparklineColor={kpi.sparklineColor}
                  sparklineLabel={kpi.sparklineLabel}
                  action={kpi.action}
                />
              ))}
            </div>
          </div>

          {/* Delivery & reach */}
          <DraggableMetricSection
            label="Delivery & reach"
            tiles={deliveryReachTiles}
            onReorder={setDeliveryReachTiles}
          />

          {/* Engagement */}
          <DraggableMetricSection
            label="Engagement"
            tiles={engagementTiles}
            onReorder={setEngagementTiles}
          />

          {/* Extra sections from metric library */}
          {CAMPAIGN_METRIC_SECTIONS.map(section => {
            const tiles = extraSections[section.id]
            if (!tiles || tiles.length === 0) return null
            return (
              <DraggableMetricSection
                key={section.id}
                label={section.label}
                tiles={tiles}
                onReorder={updated => setExtraSections(prev => ({ ...prev, [section.id]: updated }))}
              />
            )
          })}
        </>
      )}

      {/* ── My campaigns tab ─────────────────────────────────────────────────── */}
      {activeTab === 'my-campaigns' && (
        <div className="proj-toolbar">
          <div className="proj-toolbar-left">
            <div className="proj-search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="proj-search-icon">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="proj-search-input"
                placeholder="Search campaigns…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                aria-label="Search campaigns"
              />
              {search && (
                <button className="proj-search-clear" onClick={() => handleSearch('')} aria-label="Clear search">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            <button className="proj-filter-btn" aria-label="Filter">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Filter
            </button>
          </div>
        </div>
      )}

      {/* Table — My campaigns only */}
      {activeTab === 'my-campaigns' && <div className="proj-table-wrap">
        <table className="proj-table">
          <thead>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  className={`proj-th${col.sortable ? ' proj-th--sortable' : ''}${sortCol === col.key ? ' proj-th--active' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="proj-th-inner">
                    {col.label}
                    {col.sortable && <SortIcon active={sortCol === col.key} dir={sortCol === col.key ? sortDir : 'asc'} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="proj-empty-cell">No campaigns match your search.</td>
              </tr>
            ) : pageRows.map(row => (
              <tr key={row.id} className="proj-row">
                <td className="proj-td proj-td--name">
                  <button className="camp-name-cell" onClick={() => navigate && navigate(`campaigns/my-campaigns/${encodeURIComponent(row.name)}`)}>{row.name}</button>
                </td>
                <td className="proj-td">{row.impressions}</td>
                <td className="proj-td">{row.ctr}</td>
                <td className="proj-td">{row.createdDate}</td>
                <td className="proj-td">{row.createdBy}</td>
                <td className="proj-td">{row.lastModified}</td>
                <td className="proj-td">{row.lastModifiedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Pagination — My campaigns only */}
      {activeTab === 'my-campaigns' && <div className="proj-pagination">
        <span className="proj-pagination-info">
          {sorted.length === 0 ? '0 campaigns' : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, sorted.length)} of ${sorted.length} campaigns`}
        </span>
        <div className="proj-pagination-controls">
          <button className="proj-page-btn" disabled={safePage <= 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`proj-page-btn proj-page-num${p === safePage ? ' proj-page-num--active' : ''}`}
              onClick={() => setPage(p)}
              aria-current={p === safePage ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button className="proj-page-btn" disabled={safePage >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Next page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>}
    </>
  )
}
