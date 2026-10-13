---
name: ms-dashboard-decisions
description: Product/behavior decisions for the MS dashboard R1D1 Jun15 build (overrides Figma where noted)
metadata: 
  node_type: memory
  type: project
  originSessionId: 1dc40556-18f7-4e09-888e-5adc52649d6d
---

Decisions for the R1D1 **Jun 15** build (the user's, overriding Figma "examples" where stated).
Index entry is dated 15 JUN (renamed from 12 JUN — same slot, not a new date). The Jun15 link
must contain BOTH the Create flow AND the Change order workflow.

**Create flow:**
- Campaign-level tabs: ONLY "Campaign meta" + "Experiences" (Audience/Promotion/IPD-Creative hidden at campaign level). Inside an experience, ALL sub-tabs remain.
- Opening an experience row lands on **Campaign meta** tab (Figma showed Creative — that was just an example; intended default is Campaign meta). Applies to BOTH create and change-order experience detail.
- Loading states must reflect REAL transitions only, never re-load already-loaded content:
  - Project creation: title bar shows a SHIMMER (no name) during `creating`; name appears only after creation completes, with the chat bubble.
  - Page-load skeleton on first open follows the screen STRUCTURE (title + tab bar + body).
  - Per-tab skeleton on FIRST VISIT only (revisits instant). Renders BELOW the tabs, content area only.
  - Skeletons must MIRROR each tab's real layout: detailList tabs → 200px key + value rows; Experiences tab → table (toolbar+header+rows); Creative → preview card. NOT a generic stack of random short lines.
  - Conversation/rail should also show a loading beat during these create transitions.

**Change order (NOT create):**
- User prompt wording: "Show me these experiences" (was "I want to view and edit these").
- TWO distinct result tables:
  1. Initial search results: columns = checkbox / Experience / Experience ID (7-digit random) / Status / Start date / End date / Last modified (all real dates, vary per row).
  2. After "Show me these experiences": switch to the detailed table = Experience / Status / Audience / Promotion / Creative (the existing one).
- Remove the filter dot/thought from filters.
- Scroll: after the plan is approved, the NEWEST user/agent message must stay in view without manual scroll (this has been a recurring unfixed bug — verify carefully).
- Edit mode: the persistent top task bar (shows current task) needs an EXPANDABLE version too — show the expanded task list/progress.

**Creative pager (‹ 1 / N ›):** appears across ALL experience sub-tabs (not just Creative), and
ONLY when multiple experiences were opened/selected to view together (count = rows opened together);
hidden when exactly one. Check Figma parity; loading-state padding must match the real content padding.

**Home page (Jun15):** NO "Good Morning" greeting — just "What would you like to do today?" +
the prompt box, then 3 quick-start CHIPS (June 02 shortcuts: Create campaign / Run experiment /
Create IPD, NEW icons) that launch the shared Create flow, then "Your Top Metrics" (Jun02 KPI
cards, static; NO "dev only" toggle — removed), then My Projects table.

**Projects nav item** (`/r1d1/projects` → same CreateFlow component, `onProjects` view): June 02
reference — "Projects" heading + a view-ONLY primary-blue "New project" button (hover only, no
action; blue #5183e6, NOT purple), a search + filter bar, then the projects table. Row click
launches the SAME shared Create flow.

**One shared Create flow:** Home and Projects are both the `home` step of CreateFlow; both call
`setStep('creating')`. Do NOT fork into separate Create implementations.

**Create loaders pacing:** building (canvas skeleton) ~4.2s, then campaign name + tabs appear,
then Campaign meta first-visit loader ~2.6s. Must feel natural, not rushed. Project-creation
loader has NO sub-steps/accordion.

**Back-to-index link:** standalone build only (gated on `window.__MS_NEW_SEARCH`, read at RENDER
time not module load). A distinct bottom-of-nav "Back to builds" link → `./index.html`, tooltip
"Not part of the build — navigation only".

**Build order:** build & verify the **:8080 standalone (R1D1_Jun15.html) FIRST**, then update
:5173 later. The shareable :8080 file is the deliverable that goes to git.

**Home vs Projects (corrected):** HOME keeps "Good Morning, Raashi." + "What would you like to
do today?" + prompt + metrics + My Projects, and has NO chips. PROJECTS has prompt + 3 chips +
"Projects" heading/blue New-project button/search+filter/table, and NO greeting.

**Chips:** simple pills (light border, leading LEFT-NAV icon: megaphone=Create campaign,
beaker=Run experiment, image=Create IPD) — NOT gradient icon-chips. View-only, need not work.

**Experience pager:** opened via View(n) it pages between EXACTLY the selected experiences,
keeping the current sub-tab; ‹/› change the index (title/ID update). Single open = no pager.
Pager is a Figma SEGMENTED pill: one rounded container with vertical dividers between ‹ | n/N | ›.

**Experience-detail action bar:** single experience → Keep/Remove/View ACTIVE with NO count;
multiple → show "(n)". View-only no-op for now. (Distinct from the CO results action bar, which
is selection-gated and shows (0) disabled at 0 selected — that's correct there.)

**Edit-mode loader:** sequential — task-1 loader renders before task-1 result bubble; task-2
loader renders AFTER task-1 bubble, before task-2 bubble. Not floating above the next message.

**Edit-mode task bar:** non-expandable for now (accordion bar shows current task; chevron is
decorative; the expand interaction is parked).

**CO search table:** fills the panel width exactly (table width:100%, checkbox col fixed 60px,
data cols proportional %) — no right whitespace, no horizontal scroll.

**Nav collapse persistence (sessionStorage `ms.navCollapsed`):** the user's
explicit collapse choice persists across routes so navigating between nav items
(via collapsed icons + tooltips) doesn't pop the nav open. BUT the change-order
flow has its OWN auto-collapse (expanded during `boot`, collapsed once past it).
A persisted EXPANDED (`0`) must NOT seed/pin change-order open or it defeats that
auto-collapse — only a persisted COLLAPSED (`true`) seeds the initial state there,
and the stage-transition effect clears the override to null so `autoCollapsed`
wins. (CreateFlow home/projects seeds from the persisted value either way, since
those have no boot auto-collapse.) See [[ms-dashboard-loader-and-nav-feedback]].

See [[ms-dashboard-build-pipeline]] and [[ms-dashboard-figma-assets]].
