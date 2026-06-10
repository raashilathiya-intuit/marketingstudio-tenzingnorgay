import React, { useState, useRef, useEffect, useMemo } from 'react'
import './IpdImpressionsDrilldown.css'
import KpiCard from '../components/KpiCard'
import KpiPeriodDropdown from '../components/KpiPeriodDropdown'

const AVENIR = "'AvenirNext_forINTUIT:Regular', 'Avenir Next', Avenir, sans-serif"

// ─── Per-metric config ─────────────────────────────────────────────────────────

const CONFIGS = {
  'ipd-company-reach-drilldown': {
    title: 'Company reach breakdown',
    subtitle: 'QBO US Active IPD campaigns · Updated 8 min ago',
    aiSummary: <>Company reach grew <strong>62K this month</strong>. SMB accounts for 71% of newly reached companies, with mid-market growing fastest proportionally at +5.2% week-over-week. Enterprise segment remains stable above 70K unique companies.</>,
    sectionLabel: 'Reach by segment this month',
    kpiTiles: [
      { label: 'Total',      value: '1.24M', pill: { color: 'mint', text: '↑ 62K this month' },  sparkline: [1.19, 1.20, 1.20, 1.21, 1.21, 1.22, 1.23, 1.24], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All segments' },
      { label: 'SMB',        value: '880K',  pill: { color: 'mint', text: '↑ 44K this month' },  sparkline: [840, 848, 854, 859, 864, 870, 875, 880],         sparklineColor: 'var(--chart-purple)', sparklineLabel: 'Small business' },
      { label: 'Mid-market', value: '290K',  pill: { color: 'mint', text: '↑ 14K this month' },  sparkline: [272, 275, 278, 281, 283, 286, 288, 290],         sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Mid-market' },
      { label: 'Enterprise', value: '70K',   pill: { color: 'mint', text: '↑ 4K this month' },   sparkline: [65, 66, 66, 67, 68, 68, 69, 70],                sparklineColor: 'var(--chart-green)',  sparklineLabel: 'Enterprise' },
    ],
    trendSeries: [
      { label: 'SMB',        color: '#6B5BD6', data: [840, 852, 858, 864, 869, 873, 880] },
      { label: 'Mid-market', color: '#2DBABA', data: [272, 276, 279, 283, 286, 289, 290] },
      { label: 'Enterprise', color: '#2DBA75', data: [65, 66, 67, 67, 68, 69, 70] },
    ],
    trendTitle: 'Company reach trend',
    yMin: 0, yMax: 1000, yTicks: [0, 200, 400, 600, 800, 1000], yFmt: v => `${v}K`,
    shareTitle: 'Reach by segment',
    shareSeries: [
      { label: 'SMB',        pct: 71.0, color: '#6B5BD6' },
      { label: 'Mid-market', pct: 23.4, color: '#2DBABA' },
      { label: 'Enterprise', pct: 5.6,  color: '#2DBA75' },
    ],
    tableColumns: ['Segment', 'Companies reached', 'vs last wk', 'New this wk', '% of total'],
    tableRows: [
      { name: 'SMB',        icon: null, cols: ['880K',  '+5.3%', '44K', '71.0%'], deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track' },
      { name: 'Mid-market', icon: null, cols: ['290K',  '+5.1%', '14K', '23.4%'], deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track' },
      { name: 'Enterprise', icon: null, cols: ['70K',   '+6.1%', '4K',  '5.6%'],  deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track' },
      { name: 'Total',      icon: null, cols: ['1.24M', '+5.3%', '62K', '100%'],  deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'ipd-clicks-drilldown': {
    title: 'Clicks breakdown',
    subtitle: 'QBO US Active IPD campaigns · Updated 8 min ago',
    aiSummary: <>IPD clicks up <strong>94K this week</strong>. Email drives 58% of total clicks. In-app shows the highest growth at +6.5% week-over-week, driven by 3 newly launched in-product banners.</>,
    sectionLabel: 'Clicks by channel this week',
    kpiTiles: [
      { label: 'Total',  value: '1.36M', pill: { color: 'mint', text: '↑ 94K this week' },  sparkline: [0.94, 1.18, 1.02, 1.28, 1.09, 1.32, 1.19, 1.36], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All channels' },
      { label: 'Email',  value: '790K',  pill: { color: 'mint', text: '↑ 58K this week' },  sparkline: [540, 690, 590, 745, 630, 760, 690, 790],          sparklineColor: 'var(--chart-purple)', sparklineLabel: 'Email' },
      { label: 'Push',   value: '340K',  pill: { color: 'mint', text: '↑ 22K this week' },  sparkline: [240, 300, 260, 325, 280, 320, 295, 340],          sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Mobile push' },
      { label: 'In-app', value: '230K',  pill: { color: 'mint', text: '↑ 14K this week' },  sparkline: [160, 188, 170, 208, 179, 212, 194, 230],          sparklineColor: 'var(--chart-green)',  sparklineLabel: 'In-product' },
    ],
    trendSeries: [
      { label: 'Email',  color: '#6B5BD6', data: [540, 620, 590, 705, 650, 730, 790] },
      { label: 'Push',   color: '#2DBABA', data: [240, 278, 260, 302, 280, 310, 340] },
      { label: 'In-app', color: '#2DBA75', data: [160, 178, 170, 192, 180, 204, 230] },
    ],
    trendTitle: 'Clicks trend',
    yMin: 0, yMax: 900, yTicks: [0, 150, 300, 450, 600, 750, 900], yFmt: v => `${v}K`,
    shareTitle: 'Share of clicks',
    shareSeries: [
      { label: 'Email',  pct: 58.1, color: '#6B5BD6' },
      { label: 'Push',   pct: 25.0, color: '#2DBABA' },
      { label: 'In-app', pct: 16.9, color: '#2DBA75' },
    ],
    tableColumns: ['Channel', 'Clicks', 'vs last wk', 'CTR', 'vs bench'],
    tableRows: [
      { name: 'Email',  icon: 'email', cols: ['790K',  '+7.9%', '3.4%', '+0.4%'], deltaIdxs: [1, 3], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Push',   icon: 'push',  cols: ['340K',  '+6.9%', '2.1%', '-0.4%'], deltaIdxs: [1, 3], deltaUp: [true, false], statusOk: false, status: 'Review' },
      { name: 'In-app', icon: 'inapp', cols: ['230K',  '+6.5%', '4.8%', '+0.6%'], deltaIdxs: [1, 3], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Total',  icon: null,    cols: ['1.36M', '+7.4%', '3.1%', '+0.4%'], deltaIdxs: [1, 3], deltaUp: [true, true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'ipd-ctr-drilldown': {
    title: 'CTR breakdown',
    subtitle: 'QBO US Active IPD campaigns · Updated 8 min ago',
    aiSummary: <>Overall CTR up <strong>0.3pts to 2.8%</strong>. In-app is the strongest channel at 4.8% CTR. Email subject line experiments are driving a 0.4% lift vs control. Push is below the 2.5% benchmark — 2 campaigns flagged for review.</>,
    sectionLabel: 'CTR by channel this week',
    kpiTiles: [
      { label: 'Total CTR',  value: '2.8%', pill: { color: 'mint', text: '↑ 0.3% vs last week' }, sparkline: [2.4, 2.4, 2.5, 2.4, 2.5, 2.5, 2.7, 2.8], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All channels' },
      { label: 'Email CTR',  value: '3.4%', pill: { color: 'mint', text: '↑ 0.4% vs last week' }, sparkline: [2.8, 2.9, 3.0, 2.9, 3.1, 3.1, 3.2, 3.4], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'Email' },
      { label: 'Push CTR',   value: '2.1%', pill: { color: 'mint', text: '↑ 0.1% vs last week' }, sparkline: [1.9, 2.0, 2.0, 1.9, 2.0, 2.0, 2.1, 2.1], sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Mobile push' },
      { label: 'In-app CTR', value: '4.8%', pill: { color: 'mint', text: '↑ 0.6% vs last week' }, sparkline: [3.8, 4.0, 4.1, 4.0, 4.3, 4.4, 4.5, 4.8], sparklineColor: 'var(--chart-green)',  sparklineLabel: 'In-product' },
    ],
    trendSeries: [
      { label: 'Email',  color: '#6B5BD6', data: [2.8, 2.9, 3.0, 2.9, 3.1, 3.2, 3.4] },
      { label: 'Push',   color: '#2DBABA', data: [1.9, 2.0, 2.0, 1.9, 2.0, 2.0, 2.1] },
      { label: 'In-app', color: '#2DBA75', data: [3.8, 4.0, 4.1, 4.0, 4.3, 4.5, 4.8] },
    ],
    trendTitle: 'CTR trend',
    yMin: 1, yMax: 6, yTicks: [1, 2, 3, 4, 5, 6], yFmt: v => `${v}%`,
    shareTitle: 'CTR by channel vs benchmark',
    shareSeries: [
      { label: 'Email',  pct: 34, color: '#6B5BD6' },
      { label: 'Push',   pct: 21, color: '#2DBABA' },
      { label: 'In-app', pct: 45, color: '#2DBA75' },
    ],
    tableColumns: ['Channel', 'CTR', 'vs last wk', 'Benchmark', 'vs bench'],
    tableRows: [
      { name: 'Email',  icon: 'email', cols: ['3.4%', '+0.4%', '3.0%', '+0.4%'], deltaIdxs: [1, 3], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Push',   icon: 'push',  cols: ['2.1%', '+0.1%', '2.5%', '-0.4%'], deltaIdxs: [1, 3], deltaUp: [true, false], statusOk: false, status: 'Review' },
      { name: 'In-app', icon: 'inapp', cols: ['4.8%', '+0.6%', '4.2%', '+0.6%'], deltaIdxs: [1, 3], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Total',  icon: null,    cols: ['2.8%', '+0.3%', '2.6%', '+0.2%'], deltaIdxs: [1, 3], deltaUp: [true, true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'camp-impressions-drilldown': {
    title: 'Total impressions breakdown',
    subtitle: 'Create 50% off QBLive offer · Campaign duration',
    aiSummary: <>Total impressions reached <strong>2.4M</strong>, up 18% vs last month. IPD is the dominant channel at 58% share. Email deliverability remains strong at 97.4%. Push is growing fastest at +22% week-over-week — headroom for reallocation.</>,
    sectionLabel: 'Impressions by channel this period',
    kpiTiles: [
      { label: 'Total',  value: '2.4M',  pill: { color: 'mint', text: '↑ 18% vs last month' }, sparkline: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.35, 2.4], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All channels' },
      { label: 'IPD',    value: '1.39M', pill: { color: 'mint', text: '↑ 15% vs last month' }, sparkline: [1.0, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.39], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'In-product' },
      { label: 'Email',  value: '760K',  pill: { color: 'mint', text: '↑ 21% vs last month' }, sparkline: [530, 580, 620, 660, 690, 720, 740, 760], sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Email' },
      { label: 'Push',   value: '250K',  pill: { color: 'mint', text: '↑ 22% vs last month' }, sparkline: [170, 185, 198, 210, 220, 232, 240, 250], sparklineColor: 'var(--chart-green)',  sparklineLabel: 'Mobile push' },
    ],
    trendSeries: [
      { label: 'IPD',   color: '#6B5BD6', data: [1.0, 1.1, 1.15, 1.2, 1.27, 1.32, 1.39] },
      { label: 'Email', color: '#2DBABA', data: [530, 600, 630, 670, 700, 730, 760] },
      { label: 'Push',  color: '#2DBA75', data: [170, 190, 200, 215, 228, 240, 250] },
    ],
    trendTitle: 'Impressions trend',
    yMin: 0, yMax: 1600, yTicks: [0, 400, 800, 1200, 1600], yFmt: v => `${v}K`,
    shareTitle: 'Share of impressions by channel',
    shareSeries: [
      { label: 'IPD',   pct: 57.9, color: '#6B5BD6' },
      { label: 'Email', pct: 31.7, color: '#2DBABA' },
      { label: 'Push',  pct: 10.4, color: '#2DBA75' },
    ],
    tableColumns: ['Channel', 'Impressions', 'vs last mo', 'Share', 'Deliverability'],
    tableRows: [
      { name: 'IPD',   icon: 'inapp', cols: ['1.39M', '+15%', '57.9%', '99.1%'], deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track' },
      { name: 'Email', icon: 'email', cols: ['760K',  '+21%', '31.7%', '97.4%'], deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track' },
      { name: 'Push',  icon: 'push',  cols: ['250K',  '+22%', '10.4%', '94.8%'], deltaIdxs: [1], deltaUp: [true],  statusOk: false, status: 'Monitor' },
      { name: 'Total', icon: null,    cols: ['2.4M',  '+18%', '100%',  '97.8%'], deltaIdxs: [1], deltaUp: [true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'camp-ctr-drilldown': {
    title: 'Click-through rate breakdown',
    subtitle: 'Create 50% off QBLive offer · Campaign duration',
    aiSummary: <>Overall CTR at <strong>5.8%</strong>, up 0.6pts vs campaign average. IPD leads at 7.2% — 3 in-product placements are outperforming the benchmark by over 2pts. Email subject line test (A/B running) is contributing +0.4% lift this week.</>,
    sectionLabel: 'CTR by channel this period',
    kpiTiles: [
      { label: 'Total CTR', value: '5.8%', pill: { color: 'mint', text: '↑ 0.6% vs avg' },       sparkline: [4.8, 5.0, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All channels' },
      { label: 'IPD CTR',   value: '7.2%', pill: { color: 'mint', text: '↑ 0.8% vs benchmark' }, sparkline: [5.9, 6.2, 6.5, 6.7, 6.9, 7.0, 7.1, 7.2], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'In-product' },
      { label: 'Email CTR', value: '4.9%', pill: { color: 'mint', text: '↑ 0.5% this week' },    sparkline: [4.0, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9], sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Email' },
      { label: 'Push CTR',  value: '3.8%', pill: { color: 'mint', text: '↑ 0.2% this week' },    sparkline: [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.7, 3.8], sparklineColor: 'var(--chart-green)',  sparklineLabel: 'Mobile push' },
    ],
    trendSeries: [
      { label: 'IPD',   color: '#6B5BD6', data: [5.9, 6.2, 6.4, 6.7, 6.9, 7.1, 7.2] },
      { label: 'Email', color: '#2DBABA', data: [4.0, 4.2, 4.4, 4.5, 4.6, 4.8, 4.9] },
      { label: 'Push',  color: '#2DBA75', data: [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8] },
    ],
    trendTitle: 'CTR trend',
    yMin: 2, yMax: 9, yTicks: [2, 3, 4, 5, 6, 7, 8, 9], yFmt: v => `${v}%`,
    shareTitle: 'CTR vs benchmark by channel',
    shareSeries: [
      { label: 'IPD',   pct: 44, color: '#6B5BD6' },
      { label: 'Email', pct: 35, color: '#2DBABA' },
      { label: 'Push',  pct: 21, color: '#2DBA75' },
    ],
    tableColumns: ['Channel', 'CTR', 'vs last wk', 'Benchmark', 'vs bench'],
    tableRows: [
      { name: 'IPD',   icon: 'inapp', cols: ['7.2%', '+0.8%', '5.5%', '+1.7%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Email', icon: 'email', cols: ['4.9%', '+0.5%', '4.5%', '+0.4%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Push',  icon: 'push',  cols: ['3.8%', '+0.2%', '4.0%', '-0.2%'], deltaIdxs: [1, 4], deltaUp: [true, false], statusOk: false, status: 'Review' },
      { name: 'Total', icon: null,    cols: ['5.8%', '+0.6%', '5.2%', '+0.6%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'camp-open-rate-drilldown': {
    title: 'Email open rate breakdown',
    subtitle: 'Create 50% off QBLive offer · Campaign duration',
    aiSummary: <>Email open rate at <strong>34.2%</strong>, up 2.8pts vs benchmark. Trial-expiring segment is the highest performer at 41.6% — urgency-framing in subject lines is driving opens. DIFM subscribers show the strongest week-over-week growth at +3.1pts.</>,
    sectionLabel: 'Open rate by audience segment',
    kpiTiles: [
      { label: 'Overall',            value: '34.2%', pill: { color: 'mint', text: '↑ 2.8% vs benchmark' }, sparkline: [30.1, 31.0, 32.0, 32.5, 33.0, 33.6, 34.0, 34.2], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All segments' },
      { label: 'Trial expiring',     value: '41.6%', pill: { color: 'mint', text: '↑ 4.1% vs avg' },       sparkline: [36.0, 37.5, 38.8, 39.5, 40.1, 40.8, 41.2, 41.6], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'Trial users' },
      { label: 'DIFM subscribers',   value: '31.4%', pill: { color: 'mint', text: '↑ 3.1% this week' },    sparkline: [26.8, 27.9, 28.8, 29.4, 30.0, 30.6, 31.0, 31.4], sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'DIFM' },
      { label: 'Churned re-engage',  value: '22.8%', pill: { color: 'lavender', text: 'Stable vs last wk' }, sparkline: [22.1, 22.4, 22.6, 22.5, 22.7, 22.8, 22.8, 22.8], sparklineColor: 'var(--chart-green)',  sparklineLabel: 'Re-engagement' },
    ],
    trendSeries: [
      { label: 'Trial expiring',    color: '#6B5BD6', data: [36.0, 37.8, 39.0, 39.8, 40.4, 41.0, 41.6] },
      { label: 'DIFM subscribers',  color: '#2DBABA', data: [26.8, 28.2, 29.1, 29.7, 30.2, 30.8, 31.4] },
      { label: 'Churned re-engage', color: '#2DBA75', data: [22.1, 22.3, 22.5, 22.6, 22.7, 22.7, 22.8] },
    ],
    trendTitle: 'Open rate trend by segment',
    yMin: 15, yMax: 50, yTicks: [15, 20, 25, 30, 35, 40, 45, 50], yFmt: v => `${v}%`,
    shareTitle: 'Opens by segment (share)',
    shareSeries: [
      { label: 'Trial expiring',    pct: 42.3, color: '#6B5BD6' },
      { label: 'DIFM subscribers',  pct: 38.1, color: '#2DBABA' },
      { label: 'Churned re-engage', pct: 19.6, color: '#2DBA75' },
    ],
    tableColumns: ['Segment', 'Open rate', 'vs last wk', 'Benchmark', 'vs bench'],
    tableRows: [
      { name: 'Trial expiring',    icon: null, cols: ['41.6%', '+4.1%', '37.5%', '+4.1%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'DIFM subscribers',  icon: null, cols: ['31.4%', '+3.1%', '29.0%', '+2.4%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Churned re-engage', icon: null, cols: ['22.8%', '+0.1%', '24.0%', '-1.2%'], deltaIdxs: [1, 4], deltaUp: [true, false], statusOk: false, status: 'Review' },
      { name: 'Overall',           icon: null, cols: ['34.2%', '+2.8%', '31.4%', '+2.8%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'camp-conversions-drilldown': {
    title: 'Conversions breakdown',
    subtitle: 'Create 50% off QBLive offer · Campaign duration',
    aiSummary: <><strong>1,847 conversions</strong>, 312 ahead of the 1,535 target. IPD-driven conversions are outperforming email by 2.4× on a per-impression basis. Trial-expiring audience segment is converting at 4.1%, nearly double the DIFM rate.</>,
    sectionLabel: 'Conversions by channel this period',
    kpiTiles: [
      { label: 'Total',  value: '1,847', pill: { color: 'mint', text: '↑ 312 vs target' },      sparkline: [800, 950, 1100, 1200, 1400, 1580, 1720, 1847], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All channels' },
      { label: 'IPD',    value: '1,048', pill: { color: 'mint', text: '56.7% of total' },        sparkline: [450, 540, 625, 685, 790, 895, 975, 1048],      sparklineColor: 'var(--chart-purple)', sparklineLabel: 'In-product' },
      { label: 'Email',  value: '621',   pill: { color: 'mint', text: '↑ 88 vs last month' },   sparkline: [270, 320, 370, 400, 470, 530, 580, 621],       sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Email' },
      { label: 'Push',   value: '178',   pill: { color: 'mint', text: '↑ 24 vs last month' },   sparkline: [80, 90, 105, 115, 140, 154, 165, 178],         sparklineColor: 'var(--chart-green)',  sparklineLabel: 'Mobile push' },
    ],
    trendSeries: [
      { label: 'IPD',   color: '#6B5BD6', data: [450, 560, 640, 710, 810, 900, 1048] },
      { label: 'Email', color: '#2DBABA', data: [270, 330, 375, 410, 480, 545, 621] },
      { label: 'Push',  color: '#2DBA75', data: [80, 95, 108, 120, 142, 158, 178] },
    ],
    trendTitle: 'Conversions trend',
    yMin: 0, yMax: 1200, yTicks: [0, 200, 400, 600, 800, 1000, 1200], yFmt: v => `${v}`,
    shareTitle: 'Share of conversions by channel',
    shareSeries: [
      { label: 'IPD',   pct: 56.7, color: '#6B5BD6' },
      { label: 'Email', pct: 33.6, color: '#2DBABA' },
      { label: 'Push',  pct: 9.6,  color: '#2DBA75' },
    ],
    tableColumns: ['Channel', 'Conversions', 'vs target', 'Conv rate', 'vs bench'],
    tableRows: [
      { name: 'IPD',   icon: 'inapp', cols: ['1,048', '+142', '7.5%', '+2.5%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Email', icon: 'email', cols: ['621',   '+130', '4.9%', '+0.9%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track' },
      { name: 'Push',  icon: 'push',  cols: ['178',   '+40',  '3.1%', '-0.9%'], deltaIdxs: [1, 4], deltaUp: [true, false], statusOk: false, status: 'Review'   },
      { name: 'Total', icon: null,    cols: ['1,847', '+312', '5.8%', '+1.4%'], deltaIdxs: [1, 4], deltaUp: [true, true],  statusOk: true,  status: 'On track', isTotal: true },
    ],
  },

  'ipd-frequency-drilldown': {
    title: 'Frequency breakdown',
    subtitle: 'QBO US Active IPD campaigns · Updated 8 min ago',
    aiSummary: <>Average frequency stable at <strong>3.2×</strong>, within the healthy 2–5× range. Email has the highest frequency at 4.1× — monitor for fatigue signals. In-app remains the lightest at 1.9×.</>,
    sectionLabel: 'Frequency by channel this week',
    kpiTiles: [
      { label: 'Total',  value: '3.2×', pill: { color: 'lavender', text: '↓ 0.2 vs 8w ago' },     sparkline: [3.4, 3.1, 3.6, 3.0, 3.5, 3.1, 3.3, 3.2], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'All channels' },
      { label: 'Email',  value: '4.1×', pill: { color: 'peach',    text: 'Monitor for fatigue' }, sparkline: [4.4, 4.0, 4.6, 3.9, 4.5, 4.0, 4.2, 4.1], sparklineColor: 'var(--chart-purple)', sparklineLabel: 'Email' },
      { label: 'Push',   value: '2.8×', pill: { color: 'mint',     text: '↓ 0.1 vs last week' },  sparkline: [3.0, 2.8, 3.1, 2.7, 3.0, 2.7, 2.9, 2.8], sparklineColor: 'var(--chart-teal)',   sparklineLabel: 'Mobile push' },
      { label: 'In-app', value: '1.9×', pill: { color: 'mint',     text: '↑ 0.1 vs last week' },  sparkline: [1.7, 1.8, 1.8, 1.7, 1.9, 1.8, 1.8, 1.9], sparklineColor: 'var(--chart-green)',  sparklineLabel: 'In-product' },
    ],
    trendSeries: [
      { label: 'Email',  color: '#6B5BD6', data: [4.4, 4.0, 4.6, 3.9, 4.3, 4.0, 4.1] },
      { label: 'Push',   color: '#2DBABA', data: [3.0, 2.8, 3.1, 2.7, 2.9, 2.7, 2.8] },
      { label: 'In-app', color: '#2DBA75', data: [1.7, 1.8, 1.8, 1.7, 1.9, 1.8, 1.9] },
    ],
    trendTitle: 'Frequency trend',
    yMin: 0, yMax: 6, yTicks: [0, 1, 2, 3, 4, 5, 6], yFmt: v => `${v}×`,
    shareTitle: 'Frequency distribution by channel',
    shareSeries: [
      { label: 'Email',  pct: 46.6, color: '#6B5BD6' },
      { label: 'Push',   pct: 31.8, color: '#2DBABA' },
      { label: 'In-app', pct: 21.6, color: '#2DBA75' },
    ],
    tableColumns: ['Channel', 'Avg freq', 'P75 freq', 'vs last wk', 'At-risk users'],
    tableRows: [
      { name: 'Email',  icon: 'email', cols: ['4.1×', '5.8×', '+0.1×', '3.2%'], deltaIdxs: [2], deltaUp: [true],  statusOk: false, status: 'Monitor' },
      { name: 'Push',   icon: 'push',  cols: ['2.8×', '3.9×', '-0.1×', '0.4%'], deltaIdxs: [2], deltaUp: [false], statusOk: true,  status: 'Healthy' },
      { name: 'In-app', icon: 'inapp', cols: ['1.9×', '2.6×', '+0.1×', '0.0%'], deltaIdxs: [2], deltaUp: [true],  statusOk: true,  status: 'Healthy' },
      { name: 'Total',  icon: null,    cols: ['3.2×', '4.8×', '-0.1×', '1.8%'], deltaIdxs: [2], deltaUp: [false], statusOk: true,  status: 'Healthy', isTotal: true },
    ],
  },
}

// ─── Trend chart ──────────────────────────────────────────────────────────────

function TrendChart({ series, yMin, yMax, yTicks, yFmt }) {
  const containerRef = useRef(null)
  const [cw, setCw] = useState(700)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => setCw(Math.floor(entry.contentRect.width)))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const H = 200
  const padL = 50, padR = 20, padT = 16, padB = 30
  const areaW = cw - padL - padR
  const areaH = H - padT - padB
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const sx = (i, n) => padL + (i / (n - 1)) * areaW
  const sy = v => padT + areaH - ((v - yMin) / (yMax - yMin)) * areaH
  const mkPath = data => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i, data.length)},${sy(v)}`).join(' ')
  const mkArea = data => {
    const bottom = sy(yMin)
    return `${mkPath(data)} L ${sx(data.length - 1, data.length)},${bottom} L ${padL},${bottom} Z`
  }

  return (
    <div ref={containerRef} className="ipd-trend-chart-wrap">
      <svg width={cw} height={H} style={{ display: 'block', overflow: 'visible' }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={padL} y1={sy(v)} x2={cw - padR} y2={sy(v)} stroke="#E5E5EA" strokeWidth="1" />
            <text x={padL - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#B0B0B5" fontFamily={AVENIR}>{yFmt(v)}</text>
          </g>
        ))}
        {days.map((d, i) => (
          <text key={d} x={sx(i, days.length)} y={H - padB + 16} textAnchor="middle" fontSize="11" fill="#B0B0B5" fontFamily={AVENIR}>{d}</text>
        ))}
        {series.map(s => (
          <path key={s.label + '-area'} d={mkArea(s.data)} fill={s.color} fillOpacity="0.07" />
        ))}
        {series.map(s => (
          <path key={s.label + '-line'} d={mkPath(s.data)} stroke={s.color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {series.map(s => (
          <circle key={s.label + '-dot'} cx={sx(s.data.length - 1, s.data.length)} cy={sy(s.data[s.data.length - 1])} r="4" fill={s.color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

// ─── Channel icon ──────────────────────────────────────────────────────────────

function ChannelIcon({ type }) {
  if (type === 'email') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 5.5l6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
  if (type === 'push') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4" y="1.5" width="8" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="12" r="0.75" fill="currentColor" />
    </svg>
  )
  if (type === 'inapp') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 6h13" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4" cy="4.2" r="0.75" fill="currentColor" />
      <circle cx="6.5" cy="4.2" r="0.75" fill="currentColor" />
    </svg>
  )
  return null
}

// ─── Sparkle icon ─────────────────────────────────────────────────────────────

function SparkleIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1738 7.63529C12.8792 6.05647 15.1204 6.05646 15.8258 7.63529L17.0715 10.4231C17.154 10.6079 17.3896 10.8421 17.6579 10.962L20.3644 12.1738C21.9425 12.8796 21.943 15.1205 20.3644 15.8258L17.5765 17.0715C17.3518 17.1719 17.1719 17.3518 17.0715 17.5765L15.8259 20.3644C15.1204 21.9432 12.8793 21.9432 12.1738 20.3644L10.9282 17.5765C10.8278 17.3518 10.6479 17.1719 10.4231 17.0715L7.63529 15.8258C6.05647 15.1204 6.05646 12.8793 7.63529 12.1738L10.4231 10.9282C10.6479 10.8278 10.8278 10.6479 10.9282 10.4231L12.1738 7.63529Z" fill="currentColor"/>
      <path d="M10.4838 2.31373C10.2969 1.89542 9.7031 1.89542 9.5162 2.31373L9.14485 3.14485L8.31373 3.5162C7.89542 3.7031 7.89542 4.2969 8.31373 4.4838L9.14485 4.85515L9.5162 5.68627C9.7031 6.10458 10.2969 6.10458 10.4838 5.68627L10.8552 4.85515L11.6863 4.4838C12.1046 4.2969 12.1046 3.7031 11.6863 3.5162L10.8552 3.14485L10.4838 2.31373Z" fill="currentColor"/>
      <path d="M5.7257 5.47059C5.44534 4.84314 4.55466 4.84313 4.2743 5.47059L3.71727 6.71727L2.47059 7.2743C1.84313 7.55466 1.84314 8.44534 2.47059 8.7257L3.71727 9.28273L4.2743 10.5294C4.55466 11.1569 5.44534 11.1569 5.7257 10.5294L6.28273 9.28273L7.52941 8.7257C8.15686 8.44534 8.15686 7.55466 7.52941 7.2743L6.28273 6.71727L5.7257 5.47059Z" fill="currentColor"/>
    </svg>
  )
}

// ─── Sort icon ─────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={`ipd-sort-icon${active ? ' ipd-sort-icon--active' : ''}`}>
      <path d={dir === 'asc' ? 'M6 9V3M3.5 5.5L6 3l2.5 2.5' : 'M6 3v6M3.5 6.5L6 9l2.5-2.5'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function parseNum(str) {
  if (!str || str === '—') return -Infinity
  return parseFloat(String(str).replace(/[^0-9.-]/g, '')) || 0
}

// ─── MetricDrilldown ──────────────────────────────────────────────────────────

export default function MetricDrilldown({ metricId }) {
  const [period, setPeriod] = useState('week')
  const [sortColIdx, setSortColIdx] = useState(null) // null = name col, 0..n-1 = data col, 'status' = status col
  const [sortDir, setSortDir] = useState('asc')
  const cfg = CONFIGS[metricId]

  function handleSort(colKey) {
    if (sortColIdx === colKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortColIdx(colKey); setSortDir('asc') }
  }

  const sortedRows = useMemo(() => {
    if (!cfg) return []
    const nonTotal = cfg.tableRows.filter(r => !r.isTotal)
    const total    = cfg.tableRows.filter(r => r.isTotal)
    if (sortColIdx === null) return [...nonTotal, ...total]
    const sorted = [...nonTotal].sort((a, b) => {
      let av, bv
      if (sortColIdx === 'name') {
        av = (a.name || '').toLowerCase(); bv = (b.name || '').toLowerCase()
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      } else if (sortColIdx === 'status') {
        av = (a.status || '').toLowerCase(); bv = (b.status || '').toLowerCase()
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      } else {
        av = parseNum(a.cols?.[sortColIdx]); bv = parseNum(b.cols?.[sortColIdx])
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return [...sorted, ...total]
  }, [cfg, sortColIdx, sortDir])

  if (!cfg) return <div className="ipd-drilldown"><p style={{ color: 'var(--ink-3)', padding: 24 }}>Page not found.</p></div>

  return (
    <div className="ipd-drilldown">

      {/* ── Header ── */}
      <div className="ipd-header">
        <div className="ipd-header-left">
          <h2 className="ipd-title">{cfg.title}</h2>
          <p className="ipd-subtitle">{cfg.subtitle}</p>
        </div>
        <KpiPeriodDropdown selected={period} onChange={setPeriod} />
      </div>

      {/* ── AI summary ── */}
      <div className="ipd-ai-callout-border">
        <div className="ipd-ai-callout">
          <div className="ipd-ai-callout-header">
            <SparkleIcon className="ipd-ai-callout-sparkle" />
            <span>AI Summary</span>
          </div>
          <p className="ipd-ai-callout-body">{cfg.aiSummary}</p>
        </div>
      </div>

      {/* ── KPI tiles ── */}
      <div className="ipd-section-header">
        <span className="ipd-section-label">{cfg.sectionLabel}</span>
      </div>
      <div className="ipd-kpi-grid">
        {cfg.kpiTiles.map((t, i) => (
          <KpiCard
            key={t.label}
            label={t.label}
            value={t.value}
            pill={t.pill}
            sparkline={t.sparkline}
            sparklineColor={t.sparklineColor}
            sparklineLabel={t.sparklineLabel}
            vizKey={`${metricId}-${i}-${period}`}
          />
        ))}
      </div>

      {/* ── Trend chart ── */}
      <div className="ipd-chart-card">
        <div className="ipd-chart-card-header">
          <span className="ipd-chart-title">{cfg.trendTitle}</span>
          <div className="ipd-chart-legend">
            {cfg.trendSeries.map(s => (
              <span key={s.label}>
                <span className="ipd-legend-dot" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
        <TrendChart series={cfg.trendSeries} yMin={cfg.yMin} yMax={cfg.yMax} yTicks={cfg.yTicks} yFmt={cfg.yFmt} />
      </div>

      {/* ── Share bar ── */}
      <div className="ipd-chart-card">
        <div className="ipd-chart-card-header">
          <span className="ipd-chart-title">{cfg.shareTitle}</span>
        </div>
        <div className="ipd-share-bar-track">
          {cfg.shareSeries.map(s => (
            <div key={s.label} className="ipd-share-bar-segment" style={{ width: `${s.pct}%`, background: s.color }} />
          ))}
        </div>
        <div className="ipd-share-legend">
          {cfg.shareSeries.map(s => (
            <div key={s.label} className="ipd-share-legend-item">
              <span className="ipd-share-dot" style={{ background: s.color }} />
              <span>{s.label}</span>
              <span className="ipd-share-legend-pct">{s.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Detailed table ── */}
      <div className="ipd-table-card">
        <div className="ipd-table-card-header">
          <span className="ipd-chart-title">Detailed breakdown</span>
        </div>
        <div className="ipd-table-scroll">
          <table className="ipd-table">
            <thead>
              <tr>
                {/* Name column (index 'name') */}
                <th
                  className={`ipd-th ipd-th--sortable${sortColIdx === 'name' ? ' ipd-th--active' : ''}`}
                  onClick={() => handleSort('name')}
                >
                  <span className="ipd-th-inner">
                    {cfg.tableColumns[0]}
                    <SortIcon active={sortColIdx === 'name'} dir={sortColIdx === 'name' ? sortDir : 'asc'} />
                  </span>
                </th>
                {/* Data columns (index 0..n-2, skip first which is the name column) */}
                {cfg.tableColumns.slice(1).map((col, i) => (
                  <th
                    key={col}
                    className={`ipd-th ipd-th--right ipd-th--sortable${sortColIdx === i ? ' ipd-th--active' : ''}`}
                    onClick={() => handleSort(i)}
                  >
                    <span className="ipd-th-inner ipd-th-inner--right">
                      {col}
                      <SortIcon active={sortColIdx === i} dir={sortColIdx === i ? sortDir : 'asc'} />
                    </span>
                  </th>
                ))}
                {/* Status column */}
                <th
                  className={`ipd-th ipd-th--sortable${sortColIdx === 'status' ? ' ipd-th--active' : ''}`}
                  onClick={() => handleSort('status')}
                >
                  <span className="ipd-th-inner">
                    Status
                    <SortIcon active={sortColIdx === 'status'} dir={sortColIdx === 'status' ? sortDir : 'asc'} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map(row => (
                <tr key={row.name} className={`ipd-tr${row.isTotal ? ' ipd-tr--total' : ''}`}>
                  <td className="ipd-td ipd-td--channel">
                    {row.icon && <span className="ipd-channel-icon-wrap"><ChannelIcon type={row.icon} /></span>}
                    <span>{row.name}</span>
                  </td>
                  {row.cols.map((v, i) => {
                    const dIdx = row.deltaIdxs?.indexOf(i)
                    const isUp = dIdx >= 0 ? row.deltaUp?.[dIdx] : null
                    return (
                      <td key={i} className={`ipd-td ipd-td--right${i === 0 ? ' ipd-td--strong' : ''}${isUp === true ? ' ipd-td--up' : isUp === false ? ' ipd-td--down' : ''}`}>{v}</td>
                    )
                  })}
                  <td className="ipd-td">
                    <span className={`ipd-status-badge ${row.statusOk ? 'ipd-status-badge--ok' : 'ipd-status-badge--warn'}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
