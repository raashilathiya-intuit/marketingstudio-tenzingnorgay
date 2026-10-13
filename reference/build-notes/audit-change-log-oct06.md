---
name: audit-change-log-oct06
description: "Oct-06 Audit / Change log build in CCO-landing: find campaign by ID → Experiences → experience drill → version flyout 'View change log' → log table → Before/After compare; column order and copy decisions"
metadata: 
  node_type: memory
  type: project
  originSessionId: 85aa12ca-71d0-43d0-bcb3-bd28d322f6ca
  modified: 2026-10-06T15:35:09.962Z
---

`audit-change-log-oct06/` in the [[project-create-change-order]] CCO-landing repo, **cloned from
`export-experiences-aug31`** (its `exDetail` scene is the engine; the export ask/auto-type was
removed, `scenario='audit'`). Landing card "Audit / Change log" under a new **6 OCT** section
(New badge moved there off 30 SEP), `data-type="targeted" data-xd="1"`. **PUSHED 2026-10-07 in `2dbdcf2`** (master). The landing index was committed as HEAD + ONLY this card (staged via `git hash-object` / `update-index`), because the working-tree index.html also carries cards for untracked folders (audience-change-order-oct07, stop-processing-oct06, move-origin LOCAL ONLY); do the same next time rather than `git add index.html`. Preview `http://localhost:8090/audit-change-log-oct06/` (launch entry `cco-landing`).

**Flow:** prompt "I want to find the ELM 9071 campaign." → intake (disclosure "Found the campaign")
→ campaign on Campaign meta tab → Experiences tab (toolbar = Search + filter icon + **Group by**)
→ row click drills to the experience (tabs Creative / Experience meta / **Billing offer** /
Experiment / Audience) → version picker (`verSelect`, ported from rollback's `rb1VerSelect`:
v3 Published, v2 Unpublished, v1 Unpublished, `EXP_VERSIONS`) has a **footer action "View change
log"** (`[data-verlog]`, this workflow only) → `changeLogCanvas` replaces the canvas → row click →
`logCmpCanvas` (one change, NO sub-tabs). All inside `exDetail` keyed by state:
`expDrill`, `verOpen`, `log`/`logLoading`, `logDrill`/`logDrillLoading`.

**Change log table (`LOG_ENTRIES`, `LOG_COLS`), column order fixed by the user 2026-10-06:**
**What changed | Description | Changed by | Event | Date changed** (date LAST, "Event" not
"Change"). "What changed" = the area (Version / Creative / Experience meta / Audience /
Experiment / Billing offer / Experience / **Status**). **A publish changes the STATUS, not the
version** (user, 2026-10-06: "version does not change on publish bro") — the publish row is
area Status, Before Draft → After Published; there is NO "created version 3 as a draft" row
(user: "use some creative example instead"). Column widths are percentages (14/flex/15/11/18)
and `.tbl.tbl--log tbody td` overrides the base `.tbl tbody td{white-space:nowrap}` so cells wrap
(the lower-specificity `.tbl--log td` silently lost). Event badges: Create = purple `badge--info`, Update =
neutral, Delete = new `badge--neg` (#fdf3f2/#d52b1e), Publish = `badge--pos`. **Create is NOT the
Draft chip** (Draft in this build is blue #d6ebff/#0a73dc) — user asked to check. No sub-line
under the "Change log" title (user: "remove this extra info"); a Search + filter toolbar sits
above the table. Table footer = the DS `dsPager` (ported rollback pager CSS).

**Version FILTER on the log (Zhu + Raashi, Slack 2026-10-06):** ONE "View change log" in the
flyout (not one per version, which would be a hard filter), then a `logVerFilter` dropdown in the
log's toolbar: All versions (default) / v3 / v2 / v1 with status + date; `state.logVer`,
`state.logVerOpen`; `logEntries(state)` feeds the table and the pager count; the filter survives
opening/closing a change and clears on back. The change-log HEADER has NO version picker and reads
"Change log · experience name · status · ID" (user: "why do we have version dropdown if we're in
change log?" / "can change log come to the left of experience name?"). In the Audience builder the
OR chip's rule now runs BESIDE the chip (`.ab-orwrap` flex + `::after`), not above it.

**COMPARE = THE WHOLE EXPERIENCE, TABBED (user, 2026-10-07: "all I want to see is all my
subtabs ... and then the comparison view").** `logCmpCanvas` renders the five sub-tabs
(`CMP_TABS`, `[data-cmptab]`, `state.cmpTab`, lands on the changed area via `AREA_TAB`), every
tab as Fields | Before | After for THAT moment. State is DERIVED, not hand-written per entry:
`CMP_CURRENT` (the experience today) + `cmpAfter(tab,i)` rolls back every newer entry's
`fields` → `cmpRows` applies the opened entry's own Before. Status on meta = Draft except after
the publish (edits happen in a draft). An `initial:true` entry (creation) has "—" everywhere
Before. AUDIENCE is a condition list (`AUD_ROOT` AND-joined, OR into `AUD_GROUP`) with
`addedAt`/`removedAt` LOG INDICES; `audRows` emits Attribute/Operator/Value rows + 'join' rows,
missing side = muted "—" (highlighted when it is the change). Join chips/section heading CSS
ported from Building blocks (`.cmpConj`, `.cmpSec__join`, `.cmpSec__h`).
**TRAP hit 2026-10-07:** slicing app.js between two comment anchors deleted the `EX_ROWS…exSelbar`
block that sat between them ("EX_PROJECT is not defined" at runtime, `node --check` was clean).
Restored from the export source + re-applied edits. Check `grep -c "^const EX_PROJECT"` after any
block replacement in this file. Cache-buster v19.

**INTAKE IS BY EXPERIENCE ID NOW (user, 2026-10-07):** prompt "I want to find the
5a12bc41-9505-11f1-86ec-a3e651c6bc02 experience." → project named after the experience
(`EX_PROJECT = 'ELM9071-TO-QBOPayroll-HighPS-US'`) → disclosure "Found the experience" → lands
STRAIGHT on the experience drill (`expDrill:EX_OPEN_ROW`), NO campaign page and NO back arrow
(`expHead(r,state,'')` omits it; opened by name = nothing to go back to, same rule as rollback
scenario 4). Steps are home → experience → log → compare. The campaign page / Experiences tab
code is still in `exDetail` but unreachable. Log filter default is ALL versions (user tried
"latest" then said "for now go with all").
Creative compare tab has Detail | Preview (`cmpCreativePreview`, `.cmpPrev` two hellobox cards,
`helloboxCreative(hl, opts)` now takes content + per-field highlight flags). Audience group =
`.audGrp` box + `.ab-group__h.audGrp__h` heading with chevron (16/500/#393a3d), NOT Heading 3
(user: "since when is attribute group in all caps"). Cache-buster v23.

**Compare screen (older notes):** header = back arrow + the description as title; meta line = area · event
badge · Version n · date · **avatar + name** (user: "instead of saying by, use avatar").
Columns **Fields | Before | After** (my recommendation over Previously/Changed to and From/To;
user asked, applied, open to swap). Changed cells highlight in After only; a side the field did
not exist on is a muted `—` (`.cmpTbl__gone`), highlighted on After when deleted.

**Bug fixed here, applies to any copy of the version picker:** the outside-click
`document.addEventListener('click', …, {once:true})` must be registered in a `setTimeout(…,0)`,
or the click that opened the menu reaches document and closes it immediately.
Cache-buster at v6.
