---
name: ms-dashboard-figma-assets
description: Figma icon/asset system for the MS dashboard (MS v2 - Raashi) — how icons render and where they live
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1dc40556-18f7-4e09-888e-5adc52649d6d
---

Figma file key for the MS dashboard designs: **q8Ilt6qhbLpdseL3nZvlfs**.

Assets live in `~/MS v2 - Raashi/public/figma/` — 39 files: 35 `icon-*.svg`, plus
`logo-mark.svg`, `logo-wordmark.svg`, `avatar.png`, `assist-loader.gif` (Intuit Assist
working animation). These are the source of truth; the standalone build inlines them as
base64 (see [[ms-dashboard-build-pipeline]]).

**Icon rendering** (`src/components/Icon.tsx`): each exported SVG is just the inner vector with
a tight viewBox. The `Icon` component renders a fixed square box and positions the vector via
Figma's per-icon `inset: [top,right,bottom,left]` percentages — without the inset, icons render
at inconsistent visual weights. The `ICONS` map holds the inset for every icon name. When adding
a new icon, download its SVG from Figma AND record its inset percentages, or it will look wrong.

**Key design tokens** (from `src/pages/ChangeOrder.css` :30+):
- text primary #000729, secondary #656A81, timestamps #8D91A5, placeholder #656A81
- agent bubble #F1F1F4 (14px Medium), user bubble #F0F3F9 (16px)
- change-highlight / Edited badge yellow #FFFF80, dark text #000729
- Draft chip #D6EBFF / #0A73DC, Published #D9F6D9 / #029900, Edited #FFFF80 / #000729
- prompt box: white fill, 2px blue→purple gradient border
  `linear-gradient(125deg,#478bff 0%,#5e7bf2 55%,#7668e9 100%)`, radius 16; blue Send #5183E6
- results table: rounded 12 border #E5E5EC, sticky header bg #F5F5F9, 14px cells, checkbox accent #5183E6
- `.cfskel` = shimmer skeleton class; `.detailList`/`.detailRow` = 200px key col + value col grid (17px gap, 24px row rhythm)
