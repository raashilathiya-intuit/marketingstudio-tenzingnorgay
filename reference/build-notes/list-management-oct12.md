---
name: list-management-oct12
description: "List management building block (Oct-12): search, filter popover (Figma 134:42584), group by, live on one table; copy link kept, browser frame removed"
metadata:
  type: project
---

**LIST MANAGEMENT** (created 2026-10-12), a Building Blocks entry in the [[project-create-change-order]]
CCO-landing repo, folder `list-management-oct12/`, landing card "Search, filter and group by" listed
FIRST on the Building Blocks tab (see [[building-blocks-sep24]]). Title "Marketing Studio - List
management". **Copied from `export-share-artifacts-oct08/`** (see [[export-share-artifacts-oct08]]) so the
copy-link button stays on the toolbar (user, 2026-10-12: "we will retain copy link experience") but
`var chromeOn = false` — **no browser frame, no Go-to-browser ghost, ever** ("we dont need browser
panels"). The copied link uses a new `SHARE_ARTS.list` entry and opens `scenes.lm` directly.

**ONE scene, `scenes.lm`, state-driven and LIVE** (the block IS the interaction): CL4's 18 rows across 6
access points (`LM_ROWS` = `CL4_ROWS` with statuses Draft 6 / Published 8 / In progress 2 / Error 2 and
templates varied, Banner - Shell → "Shell banner"). Sim menu label "List management", ONE entry `lm` (user, 2026-10-12: "1 should work for all 3"; the three presets below were collapsed into it, the plain list at rest)
(`LM_PRESET`): `lm-search` (q "Banner", 3 rows, matches the Figma's typed "Banner"), `lm-filter`
(Status: Draft applied AND the popover open, as the Figma frame shows), `lm-group` (grouped by access
point). Panel = `aiPanel({body: CL4_SEARCH_CONV()})`, real, not blurred.
- **Search** is a real `<input>` inside `.search` (`#lmSearch`); matches exp/eid/status/ap/tmpl/by;
  an X clears it; empty state row "No experiences match. Clear the search or the filters…". Re-render
  keeps focus + caret via module var `lmFocus` (selector of the focused input) → `refocus()`.
- **Filter popover** (Figma `Filter_option` 134:42597): 260 wide, left edge ON the filter button, 9px
  below it (measured), header "Filter" + close, body scroll (max 316), footer Clear all (outline) /
  Apply (primary). Sections `LM_FILTERS` in Figma order: Status (its search field sits right under the
  header, per Figma), Access point, Template (each with its own search field under the label). `more`
  = options shown before "Show more" (3 / 4 / 4). Status options in Figma order via `LM_STATUS_ORDER`.
  **Checkbox edits go to `state.draft`; only Apply commits to `state.filters`** (Clear all empties the
  draft). Filter button shows `--on` + a purple count badge while filters are applied or the popover
  is open.
- **Chip row** under the toolbar, only when filters are applied: one `.lmChip` per value
  ("Status: Draft ×") + outline "Clear All" (Figma 134:42588). Chip × removes that value, Clear All
  empties everything.
- **Group by**: `LM_GROUP_OPTS` (None / Access point / Status / Template live, two inert); groups are
  built from the VISIBLE rows via `tableHTML(..., {groups, collapsed})` (sparse row array keeps global
  indices); group header click collapses via `state.collapsed`; AP groups keep `CL4_APS` order.
- Escape and any outside click close the popover / group menu. Selection + tri-state header work on
  the visible rows (`wireSelAll`). `wire` is wrapped (`wire = function(){ _wire(); if lm → wireLM }`)
  rather than edited, since the copied file's `wire()` is 300 lines of the clone flow.
- Verified in-browser 2026-10-12 (18 checks incl. focus retention, draft→Apply, chip ×, Show more,
  section search, Esc, group by status → Draft 6 / Published 8 / In progress 2 / Error 2, collapse).
- `shareArtKey()` returns `list` on the lm scene, so the copied link is `?open=list` and a pasted link runs the share intake and lands back on the full list (verified). Cache-buster `?v=3`. Uncommitted.
