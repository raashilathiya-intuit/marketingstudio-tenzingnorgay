---
name: cco-aug28-experience-workflows
description: "The three Aug-28 \"XD only\" experience-workflow builds in CCO-landing — scenarios, state keys, and shared conventions added on top of the aug27 base"
metadata: 
  node_type: memory
  type: project
  originSessionId: 442f5aa6-e30e-4f77-8a87-c7710ef58871
  modified: 2026-08-31T03:02:54.386Z
---

Three builds added 2026-08-28 in [[project-create-change-order]] repo (CCO-landing), all copied
from change-order-ipd-aug27 (its scenes remain as dead code — expected). Landing page has an
"XD only" filter tab; these cards carry `data-xd="1"` + an "XD only" chip.

- `delete-experiences-aug28` — scene `delSearch`, state key `del` ('checking'|'confirm'|'denied'|'deleting'|'done'). Sims: `delOK`/`delNo`. Search: QB Payroll drafts on Banking - hellobox.
- `pause-experiences-aug28` — scenes `pxSearch`/`pcSearch`/`pcDetail`, state key `pz` ('checking'|'confirm'|'denied'|'working'|'done'). Sims: `pauseCamp`/`pauseExp`/`pauseNo` (permission denied, mirrors delete). Campaign holds 48 experiences (`UNPUB_TOTAL`), real pagination (5 pages, global selection indices, select-all-48 → campaign Draft); confirm card + "Reviewing your request" check loader; done: "remaining {48-n} …" + "To publish them again, go to Campaign Manager." + CM link (medium weight).
- `export-experiences-aug31` — scene `exDetail`, state key `ex` ('working'|'done'). Single sim `export`: open ELM 9071 TO campaign by prompt (lands on Campaign meta tab), user navigates to Experiences, selects, "I want to export these experiences." → loader → "Your export of n experiences is ready…" + Download as CSV / Download as XLSX (link-dl). Landing card under 31 AUG, data-type targeted + XD only.
- `rollback-experiences-aug28` — scenes `rxSearch`/`rcSearch`/`rcDetail`, state key `rb` ('checking'|'confirm'|'infeasible'|'working'|'done'). Sims: `rbCamp`/`rbExp`/`rbNo` (not feasible: reason in [<placeholder>] brackets, flow ends, no pill). Version column v3→v2; rolled rows move to **Draft** and must be published again (no auto-republish); confirm card = From/To + warnNote "will be in Draft state", no "feasible"/campaign-object wording anywhere.

**Rollback scenario 4 (added 2026-09-02): single experience by ID.** Sim item `rbOne`, scene
`rb1`, state key `r1` (`reading|confirm|working|planning|plan|comparing|cmp|rolling|done`) plus
`path` ('direct'|'compare'), `cmp`, `rolled`. Prompt `show me 0c1f0179-6e06-4aeb-8e18-254d8395e5ce
experience` opens ONE experience straight on the canvas at v3/Published (no search table, no back
button). Ask "I want to rollback to v2." → intent From/To + purple info note (a published v3 can't
be overwritten, so the rollback forks **v4 in Draft**) + numbered options and TWO pills:
"Compare and roll back" / "Roll back now".
- direct → canvas + panel both load → v4/Draft, no plan, no task tracker.
- compare → 2-task plan (Review the comparison / Review the rolled back experience) → `.cmpTbl`
  side-by-side (Fields | Version 3 (current) | Version 4 (new draft)) with the yellow highlight in
  the NEW column only on the fields that change (CTA text, CTA URL) → approve → v4/Draft.
v4 = v2's content re-versioned, which is why the columns read v3/v4 rather than v3/v2.

**Rollback scenario 5 (added 2026-09-07): a MIXED draft + published selection.** Sim item `rbMix`,
scene `rxMixed`, reusing the `rb` state key (`checking|confirm|working|done`) plus `pubN`/`drfN`.
Built INSIDE this build, not as a new folder: the user pushed back on a separate `rollback-mixed-sep07`
folder ("why a new entry point when we have an item for rollback?"), which was correct — one rollback
card on the index, all five scenarios in its sim menu. **When a new scenario fits an existing build's
flow, add it to that build's sim menu rather than forking a folder.**

The two statuses roll back DIFFERENTLY, and that contrast is the whole scenario:
- **Published vN** → forks a NEW **v(N+1) in Draft** holding v(N-1)'s content (a live version can't
  be overwritten; the current one stays live until the new draft is published). Same model as
  scenario 4.
- **Draft vN** → **stays vN**; v(N-1)'s content overrides what is in the draft.
Both end in Draft. One helper, `rmRolledRow(r)`; `rmRows(rolled)` maps it over the selected indices
so the rows change IN PLACE (no new view, heading and crumb stay put).
- `RM_ROWS` carry their OWN status+version (unlike `RX_ROWS`, uniformly Published with the version
  applied by `rxRows`). `rmSplit(sel)` gives the published/draft counts.
- **No From/To pair**, unlike the other scenarios' `ftRows('v3','v2')`: with a mixed selection every
  row rolls to its own previous version, so one pair would misrepresent it.
- `rmNote(pub,drf)` renders the two rules as SEPARATE LINES (`.rmNote`/`.rmNote__l`), omitting a line
  whose count is 0, so an all-published or all-draft selection shows only its own rule. All copy
  branches singular/plural. **`.warnNote` in this build is ALREADY the white container with the
  purple i** (`WARN_ICON` is `#6f5ade` despite the name), so the user's "white container with purple
  i" needed no new class.
- **Refactors to shared code** (all verified not to break scenarios 1-4): the `rxSearch` wire block
  now serves both scenes via a local `SC=name`; `runIntakeRX(sceneName)` takes an optional scene;
  `runRbRoll(scene, carry)` takes state to carry forward.
- Declaration order matters: `rmNote` uses `WARN_ICON`, so the scenario-5 block must sit AFTER it.
- **Its own SEARCH PROMPT** (user caught this 2026-09-07): the scene originally inherited
  `FIND_PUBEXP_PROMPT` ("Find all **published** …") from scenario 3, which contradicted its own
  half-Draft table. Scenario 5 now has `RM_FIND_PROMPT` = "Find all QB Payroll live IPD experiences
  created in the last 30 days." and `RM_SEARCH_CONV`. The prompt appears in FOUR places that all had
  to change together: the sim-menu `autotype` on home, the `home` trigger's `inp.textContent`, the
  scene's `uPrompt`, and the search conversation. Scenario 3 keeps the published-only ask (its rows
  ARE all Published) — verified unchanged.
  A second pass was needed because "**live**" means published too: `RX_PROJECT` is
  "QB Payroll **live** IPD experiences", which cannot name a half-Draft list. Scenario 5 now has
  `RM_PROJECT` = "QB Payroll IPD experiences" + `RM_CRUMB`, used by its intake bubble, crumb,
  page heading, search-result card and `RM_CARD_NAME`. Scenario 3 keeps RX_PROJECT/"published"/
  "live" throughout (its rows ARE all published) — verified unchanged.
  **General rule: when a scenario's data differs from the one it was copied from, re-read its
  intake copy — the prompt, the project name, the crumb and the heading all encode assumptions
  about the data. Grep the status words ("published", "live", "draft") across the scene, not just
  the prompt.**
- **PAGINATED with cross-page selection** (user, 2026-09-07): `RM_ALL` is 40 rows over 4 pages of
  10 (`RM_TOTAL`/`RM_PAGES`/`RM_PER_PAGE`), generated from the base `RM_ROWS` with a per-page ELM
  number and ID, and the status/version rotated by page so EVERY page mixes Draft and Published.
  Selection indices are GLOBAL; the table gets the local slice (`localSel`), row checkboxes add the
  page offset (`off`), `wireSelAllRM` selects/clears all 40 across pages, and `wireRMPager` flips
  pages carrying selection + flow state with a ~900ms skeleton. Same convention as the pause build's
  48-row list. The shared rxSearch/rxMixed wire block branches on `paged = SC==='rxMixed'`, so
  rxSearch stays single-page (verified unchanged).
- **After the rollback the list shows ONLY the rolled-back rows** (user, 2026-09-07): `rmRows(rolled)`
  returns `rolled.map(...)` rather than mapping over the whole list, so 40 rows collapse to the n
  that were rolled. Heading flips to "Rolled back experiences", the pager re-sizes ("1-4 of 4"),
  the selection chip is dropped and the selbar reads 0 of n — it is a result, not a picker. NOTE:
  once done, a row's index is an index into the COLLAPSED list, so the drill-down must not add the
  page offset (`state.rb==='done' ? 0 : off`).
- **The done card is `objectCard('changeDoc', RM_CARD_NAME)`** (user, 2026-09-07): a rollback is a
  CHANGE action, so NOT the `'search'` glass. `RM_CARD_NAME` = `` `Rollback experiences - ${RX_PROJECT}` ``
  → "Rollback experiences - QB Payroll live IPD experiences" (name the thing the action produced).
  New asset `figma/icon-change-doc.svg` (IDS document-with-lines, `#6B6C72`, 20x20 viewBox, artwork
  spanning 2.5→17.5) registered in `ICONS` as `changeDoc` with `inset:[12.5,12.5,12.5,12.5]`.
  **To add an icon:** write the SVG into `figma/`, add an `ICONS` entry, then call `icon('name',size)`
  — `icon()` renders an `<img>`, so inline SVG will not work.
  **SIZING TRAP (hit 2026-09-07):** the DS assets are CROPPED to their artwork (e.g. icon-search.svg
  is `viewBox="0 0 13.394 13.424"`) and their ~8% inset only nudges them. A pasted Figma SVG usually
  has a padded viewBox (`0 0 20 20` with art spanning 2.5→17.5); giving it an inset equal to that
  padding (12.5%) shrinks it TWICE, and it renders visibly smaller than its neighbours (12px vs
  13.4px in a 16px tile). Fix: crop the viewBox to the artwork (`viewBox="2.5 2.5 15 15"`) and use
  an inset matching the other icons (~8%). Verify by measuring `getBoundingClientRect().width` of
  the `<img>` against a known-good icon in the same tile, not by eye.
  NOTE: every OTHER change action in this build still uses `'edit'` (pencil) and search results use
  `'search'`; `changeDoc` is currently scenario 5 only. Left the others alone deliberately.
- **`RM_DONE` copy is deliberately short** (user cut it 2026-09-07): after the object card it is ONLY
  "The published ones have a new version in Draft. The draft ones keep their version with the
  previous content restored." The trailing "To make them live, publish them from Campaign Manager."
  was removed as redundant with the `cmLink()` sitting directly beneath it. Each sentence is still
  dropped when its count is 0, so a single-kind selection shows only the relevant one.

**Table pagination row = IDS MS Theme 1.2.0 node `3044:63872`** (user gave the ref 2026-09-07;
`qsTBIhxlLaXLmrMEzQJbCS`). The pager is the table's FOOTER, not a floating row: same shaded ground
as the header (`#f4f5f8`), 1px `#e9e9ec` border with no top border, `border-radius:0 0 12px 12px`,
`padding:12px 20px`, `margin-top:-1px`, right-aligned with a 16px gap. `.tbl-wrap:has(+ .pager)`
squares its bottom corners so table+pager read as ONE container. Text 14px/1.3: "Page" and the
totals `#6b6c72`, the **current page number bold `#3a393d`** (`.count b`), "of" 600, total 500,
4px gaps. A chevron with nowhere to go gets `.is-off` (`opacity:.4; pointer-events:none`).
**The old markup used a bordered `.box` around the page number — that was invented, not DS.**
Applied to all 5 pager sites in this build (1 functional + 4 static).

**`.cd-attr` had a hardcoded `max-width:1305px`** (removed 2026-09-07). That pinned the grey
attribute/value container to one Figma frame width while `.cd-row` beneath it had no cap, so past
~1305px viewport the container visibly stopped short of the content (345px short at 2400px).
Removing the cap makes it track the rows at every width. **Watch for other px `max-width`s copied
from a Figma frame — they are the usual cause of "why does this container end early".** Note a
residual ~6px offset between the attr grid's 2nd column and the row's 2nd column: the two
components use different padding (23px vs 0) and gap (20px vs 40px). That is inherent to the
components and predates the fix; left alone.

Shared conventions these builds introduced (reuse in future workflow builds):
- Selection-thread: `<div class="convoTurn">` (min-height:100%) wraps `selThread(n)` (divider + "↳ Selected n experiences", 14px; 60px above stroke, 10px stroke→label, 60px label→bubble) + the user ask + tail — snaps conversation to top.
- `scheduleAskType(scene,text)` token-guarded auto-type into composer after first selection (fixes mid-type re-render race); `state.typed` keeps the draft.
- `wireSelAll` tri-state header checkbox (indeterminate when partial; click = all/none; frozen mid-flow).
- `expDrillCanvas` — row click drills to experience detail (Creative default w/ Detail|Preview, Experience meta, Audience, Experiment); checkbox still selects.
- Executing states show a canvas table skeleton (pager hidden).
- Arrow keys use per-scenario STEPS arrays + `stepIndex()` (key STATES, not scenes — the old FLOW_ARR scene-name nav doesn't work for single-scene flows).
- Warning notice = IDS Page Message Warning tertiary (white bg, 1px #c9500f border, r8, p16, 14/1.5 #6b6c72, icon #d94e00).
- Eye icon `figma/icon-eye-blue.svg` recolored to #5d47d5 in these three builds ONLY (older builds still #5183E6).

**ROLLBACK BLOCKED BY ISSUES (added 2026-09-09), sim `rbIssue`, scene `rxMixed`, state key `rb`.**
The feasibility check finds real blockers and the agent WORKS THE LIST instead of refusing outright
(which is what the older `rbNo`/`RB_INFEASIBLE` stub does — that card is still a literal
`<reason goes here>` placeholder). User's spec, dictated 2026-09-09.
States: `checking → confirm → checking2 → issues → dating → issue2 → blocked`.
- **It runs on the MIXED list (`rxMixed`), not `rxSearch`** — the playback has to show the real
  published/draft split, and only that scene computes it (`rmSplit`).
- **The PLAYBACK COMES FIRST, and keeps its Approve pill** (user, 2026-09-09: "bring this message
  up after the playback widget"). `RM_CONFIRM` is reused as-is; approving it is what surfaces the
  blockers (`runRbiIssues`, a real check of campaign + linkages, so it runs its own loader
  `checking2`). An earlier pass put the issues card first and then wrote a pill-less intent card
  with a v3→v2 `ftRows` — BOTH were wrong: the user wants the existing widget, and **a From/To is
  meaningless on a multi-selection** ("not the from to since this has multiple selections") because
  the rows sit on different versions.
- **PRE-FLIGHT, not post-hoc** (user asked which; answer: before). Both blockers are knowable from
  state — the campaign's end date and the current linkage — so nothing should be mutated first.
  This is what makes "I haven't rolled anything back" a clean ending. Contrast the CLONE build,
  where creatives can only be known to break AFTER cloning against the new template: pre-flight
  what is knowable from state, report after only what can be known by doing.
- **Not built, discussed:** the 8-good/2-blocked partial case. Recommended shape is "report the
  split, then ask" (`Roll back the 8` / `Hold`) rather than auto-proceeding, because only the user
  knows whether the selection is coupled. Would be a SEPARATE scenario; `rbIssue`'s all-or-nothing
  story stays intact.
- **The issues card is NOT an error message** (user asked, 2026-09-09). It is a request for input
  and the flow continues from it, so an error treatment would contradict the ask sitting underneath;
  the only error styling in this scenario is on the terminal `blocked` card, and that contrast is
  the point. Middle ground taken: **just the COUNT is red** (`.issueCount`, `#d52b1e`, ported
  verbatim from the clone build), the rest of the card is plain.
- **`RBI_LIST` is the single source for the issues**: both the disclosure's count and the
  sentence's count derive from `RBI_LIST.length` (via `rbiN()`), so they cannot drift if an issue
  is added or removed.
- **THE DOMAIN RULE: the CAMPAIGN date supersedes the experience date** (user confirmed
  2026-09-09). So the conflict in issue 1 is that the restored version runs PAST the campaign's
  end, and it would be cut short. **The fix changes the EXPERIENCE's end date, never the
  campaign's** — an earlier pass had the agent moving the campaign window, which is backwards.
  Demo dates all sit in the FUTURE relative to Sep 2026: campaign ends `10/31` (the fixed ceiling),
  the restored version runs to `12/15`, the user supplies `10/15`. An earlier 7/31 was in the past
  and read as a historical problem rather than a live one.
- **Each issue line shows the CONFLICT, not a bare fact** (user: "I want it to be clear this is the
  problem and what exactly the problem is"). Shape: what is true now, what the rollback restores,
  why they cannot both hold — in two SHORT sentences. Rejected along the way: a three-sentence
  version that narrated the rule itself ("The campaign date wins, so...") — the user called it
  "weird for an AI response". Do not explain system rules in the agent's voice; state the facts and
  let the consequence carry it ("...so it would be cut short").
- **Both issues are named up front** in a numbered `.issueList`, so the user knows the size of the
  problem before answering the first: (1) previous campaign's end date is 7/31, (2) an experience
  was unlinked from IXP123456 and linked to IXP345678. Then "Let's start with issue 1. Can you
  provide a new end date for this campaign?"
- **Issue 1 is answerable in-conversation**: the date reply auto-types (`RBI_DATE_PROMPT`, flag
  `dateTyped`) and Send routes to `rbiSendDate`. `scheduleAskType` gained an optional third `flag`
  argument for this — it previously hardcoded `state.typed`.
- **Issue 2 is FLAGGED, NOT FIXED** (user's call). It is a linkage error this workflow cannot
  resolve, so **NOTHING rolls back** — the flow ends at `blocked` naming what has to happen
  elsewhere. The user explicitly chose this over rolling back the unaffected experiences.
- **`.errNote` + `ERR_ICON` are new**: `.warnNote`/`WARN_ICON` in this build are INFORMATIONAL
  (purple `#6f5ade`, baked into the SVG fill, so CSS `color` cannot recolour it). A real blocker
  needed a red twin — `#fdf3f2` ground, `#d52b1e` icon, matching the clone build's error treatment.
- **The DRAFT line borrows the current tool's wording** (user supplied a screenshot of the
  "Create new draft?" dialog): "N experiences have a version in progress (draft, in review, verify,
  or approved). Rolling back will override them." The parenthetical earns its place because a row
  showing Draft may actually be in review or approved, and "override" is the verb users know.
  **Scoped to `rbIssue` via a `scenario===` test inside `rmNote`** — the plain `rbMix` flow keeps
  its original line until the user reviews it ("that is only much later").
  The reference dialog says "offer"; **we always say "experience"** (user, 2026-09-09).
- **Sim menu: `rbNo` un-muted** (user asked directly), new scenario listed above it; `rbCamp` and
  `rbExp` stay muted at the bottom.
- **`blocked` joins `infeasible` in the chip-clear guard** — both are dead ends where nothing was
  rolled back, so the user is free to clear the selection and start over.

**A `const` array literal referencing something declared LOWER in app.js throws at load.**
`STEPS_RB_ISSUE` used `RM_SEL` (declared ~40 lines further down) and died with "Cannot access
'RM_SEL' before initialization" — the page still rendered, because the throw landed after the scene
definitions, so it was invisible until `read_console_messages`. Build such step lists LAZILY (a
function called from `FLOW_STEPS()`), as this one now is. **Check the console after adding
top-level constants, not just the visible UI.**

**`go()` CALLS `clearTimers()`.** Two timers queued in the same runner do NOT both survive: the
first `go()` wipes the second. Chain the follow-up from INSIDE the first callback instead. This cost
a debug cycle here — the flow stalled at `issue2` and the `blocked` message never arrived, for any
send timing. Any multi-message runner in this build must chain, not queue in parallel.
