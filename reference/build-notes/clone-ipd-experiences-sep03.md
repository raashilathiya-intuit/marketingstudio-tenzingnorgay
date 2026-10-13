---
name: clone-ipd-experiences-sep03
description: "The Sep-03 clone-IPD-experiences build in CCO-landing: scenarios cl3-cl6, their decisions, and the 1:n variants cl3n/cl4n (Oct-07: per-SET loop with its own access point ask; Oct-08: cl3n = 4 clones, cl4n = 2)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 91daf772-49c5-4b28-866d-075d09aed4fa
  modified: 2026-09-03T13:51:28.120Z
---

`clone-ipd-experiences-sep03/` in the [[project-create-change-order]] CCO-landing repo, copied from
`placement-change-sep01` (see [[placement-change-sep01]] and [[cco-aug28-experience-workflows]] for
the inherited conventions: selection thread, `scheduleAskType`, STEPS step-nav, `expDrillCanvas`).
Landing card under a new **3 SEP** section, `data-type="ipd"` + XD only, New badge moved there off
1 SEP. Page title "Marketing Studio - Clone IPD Experiences".

**Four planned scenarios** (user's framing, 2026-09-03):
1. Same placement, no changes while cloning  ← BUILT (sim `pc`, state key `pc`)
2. Same placement, want to change it         ← BUILT (sim `cl2`, state key `cl2`)
3. Agent OFFERS the choice (3a clone directly / 3b change placement) ← BUILT (sim `cl3`, key `cl3`)
4. Varying access points (grouped, retargeted group by group) ← BUILT (sim `cl4`, key `cl4`)

**THE FLOW DIAGRAM IS THE SOURCE OF TRUTH** (user shared it 2026-09-08). Its shape:
search → select → **"Same access points?"** → YES: "make access point changes?" (NO → playback +
clone; YES → carry field values + list of required fields for the destination → playback → clone →
validation loop) · NO: Marketing Studio groups by access point and plays back ("50 experiences
across 6 access points"), shown either as an object on canvas (**Option 1, the one we build**) or
in chat (Option 2) → "make access point changes?" (NO → clone all at once; YES → per-GROUP loop:
ask destination → carry fields → playback → clone → validation → "Starting on next group").
Deliberate divergences, all user-confirmed 2026-09-08:
- **Naming is a SUFFIX: `CLONE_SUFFIX = '-Clone'`, appended to the END of the name** (corrected
  2026-09-25 — this note previously said a `Clone-` PREFIX, which was fixed in the code long ago
  and misled a later build). Read `CLONE_SUFFIX` rather than trusting prose.
- **`cl6` — "Fix validation errors before creating" — IS THE CURRENT PATTERN** for anything
  clone-shaped (user, 2026-09-25). States: `w1 → t1err → fixing → t1fixed → w2 → done →
  publishing → published`. Task 1 STAGES the change and fails validation; the user sends the
  copy; only once it passes does task 2 create the experiences. **Nothing broken is ever
  created**, so there is no post-creation QA error. Earlier scenarios' flag-after-create shapes
  are superseded — copy `cl6`, not them.
- Validation stays **flag-all + fix one**, NOT the diagram's per-experience resolve-until-clean loop.
- The "list of required fields (GoogleSheet?)" is realised as the **`dlLink()` change summary**.
- **Scenario 2 (`cl2`) is NOT in the diagram** — there the agent always asks; the user never
  pre-declares the change in the prompt. Kept anyway as a variant.

**Scenario 1 as built.** Deliberately the SHORTEST flow in the repo: nothing changes, so there is
NO name card, NO field card, NO plan, NO task tracker, and NO QA error. One confirm, one clone.
Scene `pcSearch` (name kept from the copy), state key `pc`: `reading → understood → cloning → done`.

Flow: search results (filtered to Banking - hellobox) → **MULTI-select** → clone ask auto-types →
Send → confirm card (prose, no table) → "Looks good" → clone loader → a NEW view listing only the copies.

Key decisions (all four revised 2026-09-03 after review):
- **Multi-select, not single.** Placement-change was single-select; cloning N at once is the point.
  `wireSelAll` restored for the tri-state header checkbox; selection freezes once `state.pc` is set.
- **NO table on the confirm card.** First pass had an Action/Placement/Copies-land-in key-value
  block; the user cut it. Nothing is being changed, so there is nothing to compare and no From/To
  or kv block anywhere in this build. The card is prose only. User-approved copy, verbatim:
  "I'll clone these experiences for you." / "I'll add "Clone" to the start of each name so you can
  tell them apart. Each copy keeps the same placement, template, audience, creative, and experiment
  settings." / info note / "Does this look right? I'll clone once you approve."
  The count is NOT in the copy (it is already in the selection chip and the checked rows).
  **The pill is "Approve", not "Looks good"** (the DOM id stays `pcLooksGood`, so wiring is
  unchanged — `replyBtn(text,id)` takes the id as its SECOND arg). Every other card in this repo
  uses "Looks good"; this flow approves an action rather than agreeing with a readback.
- **(superseded 2026-09-11) `Clone-` PREFIX, not a `-Copy` suffix.** The marker now goes at the
  END: `CLONE_SUFFIX = '-Clone'` (plus `CLONE_WORD = 'Clone'` for prose), e.g.
  `ELM9684-IPD-QBPayroll-Banking-HighPS-Clone`. User's call, 2026-09-11; they picked `-Clone` over
  `-Copy` and `_Clone`. Every card's copy changed from "to the start of each name" to "to the end
  of each name", and cl2's pill/typed reply dropped the word "prefix" ("Add Clone to the name" /
  "Add Clone to the end of each name") — the DOM id `cl2KeepPrefix` stays, so wiring is unchanged.
- **The clone result is its OWN view, showing ONLY the copies.** First pass appended them to the
  search table; the user changed this. `onCloneResults` (state.pc==='done') swaps heading
  ("Cloned experiences"), crumb (`CLONE_CRUMB`, a third level under the search), and rows
  (clone list, not PC_ROWS). Row click drills into the COPY. Three things had to follow the view
  swap and are easy to miss: the selection chip is dropped, `wireSelAll` gets an EMPTY set (or the
  header checkbox renders checked over unchecked rows), and the selbar reads 0 of n.
- **NO yellow highlight.** Nothing is edited — these are new objects. `row-edited` is the EDIT
  convention in every other build, so using it for "newly created" overloaded it.
- All count-dependent copy branches on n for singular/plural ("Here is the copy" / "Here are the
  copies", "publish it" / "publish them"). Verified both branches.
- `onTask2` hardcoded to `false`: state `'done'` here means the clone-results LIST, not an
  experience review, so the inherited `onTask2` test would have bound experience sub-tab handlers
  onto the results table.

**Version column on the search results** (added 2026-09-03), `{label:'Version',key:'ver'}` right
after Status per the rollback build's column order. Originals carry a deliberate **MIX of v3 and
v4** (`ver` is now the 3rd tuple field in PC_ROWS); every clone resets to **v1**, set explicitly in
`cloneRows` because the `...PC_ROWS[i]` spread would otherwise inherit the source's version. Side
benefit: `expDrillCanvas` reads `opts.ver||r.ver`, so drill-downs now show each experience's real
version instead of the hardcoded v1 they showed before the column existed.

**The clone view is named `CLONE_VIEW_NAME` = "Cloned experiences - Banking hellobox"** (one
constant feeding both the page heading and the panel's object card, so they can't drift). The
crumb stays the short "Cloned experiences" because the level above it already ends in
"- Banking hellobox".

**`.objectCard__name` has only ~177px for a label** (286px card − 16px padding − icon tile − eye
button) and is `overflow:hidden; text-overflow:ellipsis; white-space:nowrap`. Nothing longer than
about "Cloned experiences" fits: even "Cloned experiences - B…" measures 186px. So a long view name
IS clipped there and that is expected — the page heading carries the full string. Two traps:
- **Do NOT hand-type a "…" into an object-card label.** The container already ellipsises, so a
  typed ellipsis only moves the cut earlier. (The older `'QB Payroll IPD experiences - Banki…'`
  search-card string measures 270px and has always been CSS-clipped anyway — its typed "…" is
  decorative and never renders.)
- Do not widen the card to fit a label; the style is shared across every build.

**SCENARIO 2 (built 2026-09-03), sim item `cl2`, state key `cl2`.** One prompt carries BOTH the
clone and the change: `CLONE2_PROMPT` = "I want to clone these and change placement to Batch save -
hellobox." Unlike the placement-change flow, the **TEMPLATE is NOT changed** — only the placement,
so the creative carries over on helloboxThirdParty with no new fields.
States: `reading → naming → planning → plan → w0 → t0err → t0fix → t0fixed → w1 → t1 → … →
wall → allrev → done`. `w*` = executing, `t*` = resting review of clone i (the index is IN the
state string, so ONE branch renders every per-clone task).
- **Naming card offers a choice, not a fixed name:** "I'll add Clone to the start of each name, or
  send me a name and I'll use that instead." Pill "Use the Clone prefix" (`cl2KeepPrefix`).
- **Plan is n+1 tasks, built from the SELECTION** (`cl2TaskLabels`): "Review experience 1..n" then
  "Review all newly created clones". **Smart-copy collapse** (`cl2PlanRowsFor`): at n>4 the table
  shows rows 1, 2, a collapsed "Review experiences 3-{n}" span, the last one, then the final
  review — the per-task STATES still walk every experience, and the tracker always names the real
  task even when the table row is a span.
- **Task 1 carries the body-copy error, tasks 2..n pass clean.** Reuses `BODY_LIMIT`/`BODY_ERR`/
  `BODY_FIXED` from the placement flow. Task 1's message has NO approve pill (the copy must be
  fixed first); the fix ask auto-types via `scheduleAskType(...,'fixTyped')` and Send routes to
  `cl2SendBodyFix`. New helper `cloneCreative(view,over)` renders the creative with the field-level
  error; `expDrillCanvas` gained `hlAp` (highlight the changed placement), `bodyOver`, and
  `qaBadge` (QA Error → Verified).
- **Per-task canvases are drill-downs with `noBack:true`** on the clone being reviewed; the final
  task lands on the clone-results TABLE. `CL2_VIEW_NAME` = "Cloned experiences - Batch save
  hellobox" (the copies live on the NEW placement, so the view is named for that, not the search's).
- Nothing is highlighted on a clone's creative except the changed PLACEMENT: a clone is a new
  object, not an edit.
- **Shared wiring that had to learn about `cl2`** (each was a real bug caught in review): the
  auto-typed ask, the Send handler, the chip-clear guard, the row-checkbox freeze, `wireSelAll`'s
  empty set, the heading, and `FLOW_STEPS`/`stepIndex`. Guards must test
  `state.pc!==undefined||state.cl2!==undefined`, NOT the truthy `state.pc`.
- **Verification gotcha:** the per-task loaders are 2.6-2.9s, so a polling check that samples too
  early reads a `w*` state and looks like a missing pill. Poll until the state stops matching
  `/^w/` before asserting.

**SCENARIO 3 (built 2026-09-08), sim `cl3`, state key `cl3` + `path` ('direct'|'change').**
The user's ask is the PLAIN clone prompt — it says nothing about changing anything — so the AI
offers the choice. This is the user's full spec, dictated 2026-09-08.
`CL3_CHOICE` card: states the `Clone` prefix up front (user added this mid-turn: "also inform the
user that you'll add the prefix clone"), then two pills in a `.replyRow` — **"Change the placement"**
/ **"Clone as they are"**. `.replyRow` is the EXISTING two-pill convention (from rollback scenario 4);
do not invent a `.pillRow`.
- **3a** (`cl3Direct`) → `cloning` → `done3a`. Same ending as scenario 1, originals' placement kept.
- **3b** (`cl3Change`) → `asking` (AI asks WHICH placement; no loader, it is a question not work)
  → the user's reply names a placement AND a **template** (`CL3_TARGET_PROMPT`), which is what makes
  the creatives break later → `targeting` → `intent` (From/To for BOTH) → `plan` → the 3-task plan:
  1. **Review the updated placement** — task 1's canvas is the PLACEMENT itself, ONE screen, not a
     per-experience review. Carries `dlLink()` so the user can send the change summary to marketers
     and request copy BEFORE any clones exist. This is the heart of the user's spec.
  2. **Create and review the clones** — every clone lands with the SAME validation error, because
     changing the TEMPLATE (not the placement) invalidates creative fields. `CL3_CLONES_ERR` says
     "found n issues" / "Body copy is missing on all n clones" and offers the summary again. The
     user fixes ONE by prompt (`cl3SendFix`), and the message then says "n-1 still need copy".
  3. **Review all newly created clones** — the finished list, summary offered a third time.
- Scenarios 1 and 2 kept as-is (user's call); all three verified still working after this landed.
- The clone rows get `ap: CL3_NEW_PLACEMENT` AND `tmpl: CL3_NEW_TEMPLATE` via `isCl3b`.
- **Verification note:** long `for` polling loops inside `javascript_tool` blow the 45s cap when the
  Browser pane is hidden. Split the walk into several short calls instead.

**SCENARIO 4 (built 2026-09-08), sim `cl4`, state key `cl4` + `path`.** The diagram's
"Same access points? NO" branch.
- **Its own search + data:** `CL4_FIND_PROMPT` ("Find all QB Payroll IPD experiences." — NOT
  placement-filtered), `CL4_PROJECT`/`CL4_CRUMB`, `CL4_SEARCH_CONV`, and `CL4_ROWS` = 18 rows,
  3 on each of 6 access points (`CL4_APS`). The scene reads `SRC = isCl4 ? CL4_ROWS : PC_ROWS`.
- `cl4Groups(sel)` buckets the selection by access point in AP order; each group is retargeted to
  its own destination from `CL4_DEST` (`cl4Dest(g)`), so the clones do NOT all land in one place.
- **The grouping object is the canvas (diagram Option 1)**, built from the EXISTING `treeNode`
  renderer: one `placement` node per access point, experience children, the count in the `offers`
  chip, the active group auto-expanded, and a `node__meta` "→ destination" once a group is cloned.
  Chevrons need `wireTreeChevrons(main)` bound in the pcSearch wiring.
- States: `reading → grouped`, then 4a `intentall → wall4 → doneall`, or 4b
  `g{i}ask → g{i}map → g{i}int → g{i}wcl → g{i}done` per group, then `done`. The group index is IN
  the state string, so one branch renders any number of groups. `runCl4NextGroup(g)` either starts
  group g+1 or finishes — that check is what stops the loop.
- **One pill id (`cl4ApproveGroup`) serves both of a group's approvals**; the stage in the state
  (`int` vs `done`) decides whether it clones the group or advances to the next.
- The destination auto-type flag is **per group** (`dTyped{g}`), or group 2 would inherit group 1's
  typed draft and never re-type.

**Object cards name the thing specifically**, never a bare "Cloned experiences" (user: "why is the
name of the object so vague"). Per batch: `Cloned experiences - {full destination placement}` (an
earlier version truncated it with `.split(' -')[0]`, giving "Cloned experiences - Batch save").
Final/overall: `Cloned experiences - {CL4_PROJECT}`.

**Scenario 4's typed reply says "Change to X.", not "Move them to X."** (user, 2026-09-08).

**NO subline under a canvas heading** (user: "why have we randomly introduced this subtext?").
`cl4Head` used to render a `.cd-sub` count line; it repeated the heading and the counts already
live in the pager and the group bands. Other tables in this build have no subline either.

**A loader in ONE pane reads as a stall.** Any state whose outcome is NEW CANVAS CONTENT must
skeleton the canvas as well as run the conversation loader — `canvasBusy` covers `cl3` `fixingAll`/
`cloning`/`wclones`, `pc==='cloning'`, and `cl4==='wall4'` (the per-group and final-review loaders
already had theirs). The user caught this twice in one round.

**A growing composer must not hide the conversation.** `.ai` is a flex column
(`.ai__tabs` / `.ai__body` flex:1 / `.ai__composer`), so a multi-line draft correctly SHRINKS
`.ai__body` — but the scroll position stays put, so the newest message drops out of view below.
`pinConvo()` (scrolls `.ai__body` to its bottom) is called on every `typeInto` tick and at the end,
so the response moves UP as the composer grows. Verified: composer 119px→215px, pinned throughout.

**The changed BODY carries the highlight too.** After the copy is supplied it is a changed field
like the placement and template, so `cloneCreative(view, over, edited)` wraps it in `.cd-hl` when
`edited` (passed as `bodyEdited: cl3Edited` from the drill-down). At `verified` the drill-down
shows THREE highlights: Placement, Template, BODY.

**Supplying copy EDITS the clone**, it does not just clear the error (user, 2026-09-08): at
`verified` the rows read **Edited / v2** (created at v1, edited to v2) and the changed Placement/
Template cells keep their yellow highlight. `cl3Edited` gates it; `verified` had to join
`CL3_FLAGGED_STATES` so the highlighted column set (`PC_COLS_QA`) still applies there.

**`.chatMsgGroup + .chatMsgGroup{margin-top:60px}` is an ADJACENT-SIBLING rule**, so a message
appended after a `.convoTurn` rather than after another group got NO margin and sat flush against
the previous message (measured: 0px where every other gap was 40-60px). Fixed with
`.convoTurn + .chatMsgGroup{margin-top:60px}`. **Watch for this whenever a message is appended
outside a convoTurn wrapper** — it is the cause of "spacing issue" on a trailing message.

**Sim menu: the two ACTIVE scenarios lead, earlier drafts are muted at the bottom**
(`.simMenu__item--muted`, `#8a8b93`, borrowed from the rollback build). Order: cl3, cl4, then
muted pc and cl2. **CSS GOTCHA:** the muted rule MUST be written after `.simMenu__item` — same
specificity, so source order decides. Inserted above it, the class applied but the colour never
changed (verified via `getComputedStyle`, not by eye).

**Scenario 4b's FINAL REVIEW is terminal.** It previously asked "Does this look ok?" with an
Approve, and a near-identical `CL4_DONE` message followed carrying the publish guidance — the user
asked "where is the if you want to publish go to cm message that we usually have?" because it sat
one click past where the flow visibly ended. Merged: `CL4_ALL_REVIEW` now closes with "…The copies
are in Draft. / If you want to publish them, go to Campaign Manager." + `.link-cm` and NO pill,
matching scenario 3's terminal `verified` message. `cl4ApproveAll`/`runCl4Done` deleted; `done`
renders the same as `allrev`. `CL4_DONE` is still used by **4a** (`doneall`).

**Naming: REVERSED 2026-09-11 — this build now says "ACCESS POINT", never "placement."** The
Sep-08 call (below) was undone; the user confirmed the reversal was deliberate when I flagged it.
The WHOLE FILE was renamed, including the leftover change-order/targeted-offers scenarios copied in
from the earlier build (user's explicit call: "rename the whole file"), because those scenes share
table columns and the experience drill-down with the clone flows, so a partial rename showed both
terms on one screen. Other builds (rollback, delete, pause, export) are untouched.
**HOW to do this rename safely — two failed attempts first:**
- A plain regex on the word BREAKS the file: `const placements=[`, `placements.forEach`, and
  `{placement:'...'}` are code. First attempt produced `const access points=[`.
- Masking identifiers by regex also failed (missed `segments.forEach(s=>placements.forEach(...))`).
- **What worked:** a small tokenizer that renames only inside string literals and comments, and
  treats `${...}` inside template literals as code. THEN hand-fix the two leftover classes:
  (a) quoted strings that are actually CODE — `type:'placement'`, `key:'placement'`, `pc:'placement'`
      — which the tokenizer wrongly renamed;
  (b) display strings that live INSIDE `${...}` — pill labels (`replyBtn('Change the placement')`),
      `agentLoader('Checking the placements')`, `pcFtBlk('Placement:')`, the group-by label, and a
      ternary's " I'll move on to the next placement once you approve." — which it wrongly skipped.
- `index.html`'s four hits are a CSS var (`--node-placement`) and comments: leave them.
- Verify by reading `document.body.innerText` per scenario and grepping for the word, NOT by eye.

**(superseded 2026-09-11) Naming: this build says "PLACEMENT", never "access point"** (user,
2026-09-08). Scenario 4 was built with "access point" and renamed wholesale. Matches
[[placement-change-sep01]], where the same call was made. The rollback build still says
"Access point" — that is a different build.

**A pill click NEVER produces a user bubble, and ALWAYS runs a loader** (user, 2026-09-08: "we
never trigger a user prompt on selecting a pill, why this new interaction" + "need loading state
between selection and ai response"). Two transitions were using bare `go()` with no loader —
`runCl3Ask` (now via state `reading2`) and `runCl4AskGroup` (now via `g{i}load`). The canvas keeps
its current view through those loaders (the cl4 grouped-table condition includes `planning`,
`plan`, and `g{i}load`, or the grouping vanishes mid-flow).

**SCENARIO 4 REBUILT 2026-09-08** (second review round). What changed and why:
- **Grouping is the TABLE's own group-by, NOT a tree.** The first pass used `treeNode` to render
  ACCESS POINT nodes; the user rejected it ("group by in canvas on table... this is not the way it
  should be" / "i should not be seeing this view in clone flows"). `tableHTML` now takes
  `opts.groups = [{label, idx}]` and renders a chevron + "Group name (n)" band (`.grp__cell`)
  above each group's rows; row indices stay GLOBAL so selection and drill-down still work. The
  shared row renderer was extracted as `rowHTML` so both paths use identical markup.
  **Do not reach for the tree/node renderer in a clone flow.**
- **The grouped canvas gets an OBJECT CARD in the conversation** ("where is the object in the
  conversation?") — `objectCard('search', CL4_GROUPED_TITLE)` on the grouping playback.
- **4a does NOT confirm twice** ("why are we asking for confirmation again?"). The
  "Clone as they are" pill IS the approval, so `runCl4Direct` clones immediately; the second
  intent card (`CL4_ALL_INTENT`) and the `intentall` state are gone.
- **4b has a PLAN naming each access point** (user's spec): `cl4TaskLabels(G)` →
  "Clone and review <access point>" per group, then "Review all cloned experiences" last.
  `grouped → plan → g{i}ask → g{i}int → g{i}done … → allrev → done`.
- **Scenario 4's canvas has THREE modes** (user, 2026-09-08). Getting this wrong was the source of
  four separate complaints:
  1. **choice / plan → the table does NOT change.** The search results stay exactly as they were.
     An earlier pass swapped in the grouped view here; the user rejected that.
  2. **THE CANVAS IS STICKY ON THE LAST THING CREATED.** This is the rule and I got it wrong twice
     — first by swapping the canvas on a question, then by over-correcting so it REVERTED to the
     search results. The user's exact words: "the object in the canvas doesnt change unless
     something is created. doesnt mean you go back to search results. just means you're looking at
     what you last created." So:
       nothing created yet   → the search results
       `g{i}wcl`             → skeleton
       `g{i}done`            → THAT batch's clones
       `g{i+1}load`/`ask`    → STILL batch i's clones (asking creates nothing)
       `wallrev`             → skeleton
       `allrev`/`done`       → every clone, accordion by placement
     Implemented via `cl4Display` ({rows, cols, groups, title, busy}) computed once per render.
     **This is how every other workflow in the repo already behaved — do not re-derive it.**
  2b. **`cl4Display.rows` is ALSO what the drill-down must index.** The cl4 canvases render their
     own row arrays, not the scene's `rows`, so a clone row was drilling into its SOURCE experience
     (Published / v3 / old placement) — the user caught it as "why is an experience in the cloned
     table when drilled down showing as published?". The drill-down now prefers
     `cl4Display.rows[state.expDrill]` and passes that row's `status`/`ver`/`eid` through.
  3. **final review → the accordion**, every clone grouped by destination placement. Only here.
- **(REVERSED 2026-09-11) NO playback inside a task** (user, 2026-09-08): naming the destination
  applied the change directly, and `CL4_GROUP_INTENT` plus the `g{i}int`/`g{i}map` states were
  deleted. **The user reversed this on 2026-09-11 for 4b only** — see below.
- **The done message names its object** (`objectCard('edit','Cloned experiences')`) — it had none,
  which the user caught as "where is the object getting created in the last message".
- **NO TEMPLATE CHANGE in scenario 4, therefore NO validation errors.** `cl4DestPrompt` still said
  "with the hellobox - text template" long after the rest of the flow dropped it — the user caught
  it twice. The conversation now never mentions a template; the table's Template COLUMN stays
  (unchanged data, not a change). The group ask says only
  "Which access point should these copies go to?", the intent shows a single Access point From/To
  (no Template row), and the group-done message reads "the creative carried over with no issues"
  with no error block and no summary download.
- **Header checkbox fix:** `onCloneList` did not include any `cl4` state, so scenario 4's clone
  results rendered the header checkbox CHECKED over unchecked rows ("why is this randomly
  checked"). Now includes `doneall`/`allrev`/`done`.

**SCENARIO 3b REVISED 2026-09-08 (user overrode their own earlier spec).** The plan and the
single-placement review are GONE:
- **No plan, no placement-review task.** The user's reasoning: "we should not be looking at a single
  placement since they all could have different copies. we dont create a plan here. we just clone
  and all clones have error." So `CL3_TASKS`/`CL3_PLAN`/`cl3PlanRows`/`CL3_PLACEMENT_REVIEW` and the
  placement canvas were deleted, and scenario 3 shows NO task tracker. The change-summary download
  moved onto the clones message (it was on the placement review).
  States are now just: `reading → choice → asking → targeting → intent → wclones → clonesErr → done`.
- **The copy arrives in ONE prompt naming every clone** (user, 2026-09-08, superseding the
  open-each-clone interaction below). States: `clonesErr → fixingAll → verified`.
  `cl3FixPrompt(names)` builds "For <clone 1> use "<copy 1>"; For <clone 2> use "<copy 2>"; …" from
  `CL3_FIX_COPY` — three DISTINCT strings, because the whole point is that creatives differ.
  `cloneNamesW()` is a module-level helper so wire() can build the prompt (the scene's closure is
  not visible there). Both panes load during `fixingAll` (conversation loader + `skeletonTable` on
  the canvas). At `verified` every clone is back to `Draft` with no errors, and the message is
  "I've applied the copy. All n clones are verified." + object card + "If you want to publish them,
  go to Campaign Manager." + `.link-cm`. NO approve pill — publishing is the user's call elsewhere.
- **Intent card intro is "Here's what I understood CHANGES."** (user wrote this themselves,
  2026-09-08, rejecting four suggested alternatives). Bare "Here's what I understood." read as
  incomplete. Scenario 4's per-group card matches: "Here's what I understood changes for this group."
- **The copy prompt is a LIST, not a run-on sentence.** `cl3FixPrompt` (plain text with `\n` +
  bullets, for the composer — `.promptBox__input--filled` gained `white-space:pre-wrap`) and
  `cl3FixBubble` (real `<ul class="msgList">` markup, for the bubble) render the same pairs from
  `cl3FixPairs`. Lead line "Use this copy:", then one item per clone: name, then the copy beneath.
  NO em dashes between name and copy (see [[no-em-dash-in-ui-copy]]) — a colon in the plain-text
  form, a line break in the bubble.
- **ONE status badge on the drill-down too.** It was rendering `Draft` + a separate `QA Error`
  chip. Now `status: dr.status` (already 'Error' when flagged) with `qaBadge:false`, so the canvas
  matches the table's single-status rule.
- **The error message must not be presumptuous** (user's wording, picked from options):
  "Send me the copy for each one, or download the summary to share." The earlier
  "Open a clone to add its copy, or download the summary and come back once marketing sends it
  over." was rejected for scripting the user's next move and assuming marketing is involved.
- **THREE state lists must stay in sync when 3b's states change** — this cost two bugs in one pass:
  `CL3_LIST` (drives `onCloneResults`, i.e. whether the clone list or the search shows),
  `CL3_FLAGGED_STATES` (drives `needsCopy`), `CL3_ORDER` (step-nav), plus the `onCloneList` array in
  wire() that keeps the header checkbox unchecked. Renaming a state and missing one of these makes
  the canvas silently fall back to the search results, or re-checks the header checkbox.
- **(superseded) Fixes were PER EXPERIENCE.** "this message should appear when user opens 1 experience and is
  looking at 1 creative. real use case means all creatives wont be the same." So the copy ask
  auto-types ONLY while a flagged clone is open in the drill-down (flag `fx{i}`, per clone), Send
  routes to `cl3SendFix` which reads `state.expDrill`, and `runCl3FixOne(target)` resolves that one.
  `state.fixes` is the ordered list of resolved clone indices — it drives the per-clone Validation
  cell, the transcript's one-turn-per-fix replay, the "N still need copy" count, and the final
  Approve pill, which appears only once every clone has copy. Fixes work in ANY order.
- **The changed Placement and Template CELLS are highlighted in the clone table** via
  `tableHTML`'s `editedKey` (`apChanged`/`tmplChanged` on the clone rows) — the user asked for this
  directly. Note this overrides the scenario-1 "NO yellow highlight" decision for the CHANGE flows:
  the highlight there means "this differs from the source", which is real information on a clone.
- `needsCopyW(i)` is a MODULE-LEVEL twin of the scene's `needsCopy` because `wire()` cannot see the
  scene's closure.

**Four bugs the user caught on review (2026-09-08), all fixed:**
1. **The recorded reply on a two-pill card was HARDCODED to one option** — picking "Clone as they
   are" recorded "Change the placement". `CL3_CHOICE`/`CL4_GROUPED` now take a `chose` argument and
   the callers derive it from `state.path`. (The rollback build solved the same problem by writing a
   whole duplicate card function, `RB1_CONFIRM_DIRECT`; parameterising the label is cleaner.)
2. **The choice was recorded TWICE** — the pill converts in place AND a separate `userBubble`
   repeated it. Per the repo convention a pill records in place only, so the bubbles were removed
   (this also retired `CL3_ASK_PLACEMENT_PROMPT`).
3. **ONE status column, cells read `Error`** (user's final call, 2026-09-08). An intermediate pass
   added a separate **Validation** column (QA Error / Verified) beside Status on the theory that
   publish status and validation are different axes — the user rejected that: a flagged clone's
   STATUS is simply `Error`, and it returns to `Draft` once its copy is supplied. New
   `badge--err` (`#fad7d6`/`#d52b1e`, matching `.qaBadge--err`) and an `Error` case in `badge()`.
   `PC_COLS_QA` now differs from `PC_COLS` only by carrying the highlighted Placement/Template
   columns. The drill-down still shows the `qaBadge` next to the status chip — that is the canvas,
   not the list.
4. **Validation state lived only in the chat.** The clone list showed `Draft` and nothing else, and
   drilling into a flagged clone rendered CLEAN — no badge, no field error, original copy. Fixed by
   putting the state on the clones: `needsCopy(i)` drives a `qa` field on each clone row, a new
   `PC_COLS_QA` column set adds a **Validation** column (QA Error / Verified) to the clone results,
   and the row-click drill-down now passes `bodyOver`/`qaBadge`. **Status and validation are
   different axes** — Draft is correct for a never-published clone; the error is separate.
   `needsCopy` MUST be declared before `cloneRows`, whose `.map()` calls it.
5. **The changed-field highlight was inconsistent** — `hlAp` was passed only on the fix canvas, and
   the placement review highlighted the TEMPLATE while the clone highlighted the PLACEMENT. Any
   clone canvas in 3b/4b now highlights BOTH changed fields (`hlAp` + `hlTmpl`), meaning "this
   differs from the experience it was cloned from".

**Bug fixed while building this:** scenario 3's autopilot branch had no `return`, so it fell through
to the bare `else t(()=>trigger.pcSend())` at the end of the chain and re-fired the clone ask. Any
new scenario branch added to `scheduleAuto`'s pcSearch block MUST return.

**Open copy nit (flagged to user, not changed):** the confirm card reads "these experiences" even
when one row is selected, because the approved copy is fixed text. Only shows in single-select.

**Pre-existing bug found, NOT fixed (needs a call):** `.badge--draft` is `#d6ebff`/`#0a73dc` (blue)
in ALL builds — clone, placement-change, delete, create-ipd. Per [[create-change-order-new-repo]]
Figma says the Draft chip is container-background-neutral `#eeeeef` / ui-neutral `#6b6c72` GREY,
and the Vite `#d6ebff` was supposed to have been reverted. Left alone so this build stays
consistent with the other four; fixing it is a one-line change per build.

**CONVERSATION RESEQUENCED 2026-09-09 (scenarios 3 and 4).** The naming statement and the Draft
info note used to ride on the FIRST card, which meant the user agreed to the naming before they had
said what was changing. The new order, on both scenarios:

  choice card (clone statement + the placement QUESTION only, no naming, no info note)
    → [Change the placement] → ask placement → user names placement + template
    → **playback card + the info note in the SAME message** → Approve
    → **naming card on its own** ("I'll add Clone to the start of each name. Shall I go ahead?" + Proceed)
    → clone

- **The info note moved onto the playback/confirm card**, off the choice card. Scenario 3's intent
  card question shortened to "Does this look right?" (it no longer needs to promise the clone,
  because the naming step now sits between the approval and the cloning).
- **Scenario 4 has NO playback widget** (the placements are mixed, so there is no single From/To to
  show). `CL4_CONFIRM` stands in for it: "You've selected n experiences across k placements. / I'll
  set the new placement for each group as we go, so you can pick a destination one placement at a
  time." + info note + **Proceed**. User picked this over a plain restatement because it is honest
  that no destination is known yet. THEN the naming card, THEN the existing plan table, unchanged.
- **The naming pill is "Proceed"**, not Approve or Looks good (user's call).
- **The naming card is on the DIRECT paths too** (3a and 4a). Moving it off the choice card left
  "Clone as they are" never mentioning the prefix before cloning; the user chose to route the direct
  branch through the same card rather than fix it in the done message. Both cards take a
  `direct` argument that swaps the pill id (`cl3ApproveNamingDirect`/`cl4ApproveNamingDirect`), and
  the transcript branches on `state.path` because there is no intent/confirm card before it there.
- New states: cl3 `wnaming`/`naming`, cl4 `confirming`/`confirm`/`wnaming`/`naming`. All four are
  "created nothing" states, so the canvas correctly stays on the search results (`cl4Display`
  stays null) — the sticky-canvas rule needed no change.
- `BEFORE4()` in the cl4 transcript replays grouped + confirm + naming; every 4b state after the
  plan uses it instead of `GROUPED()`.

**A pill id alone does NOT wire a pill.** There is an explicit `pills` selector→trigger table in
`wire()` (~line 2800); a new `replyBtn(text,id)` renders and looks right but does nothing until its
`['#id','trigger']` pair is added there. This cost a full debug cycle — the card rendered, the
click did nothing, and the state never moved. Autopilot's `scheduleAuto` chain needs the new
resting states too, and where one state serves two paths it must pick the trigger off `state.path`.

**NEVER trust a cache-buster number written down anywhere, including here.** It was v77 when this
file said v34, and it moved 83->85 mid-session because ANOTHER session was editing the same build.
Always `grep -o 'app\.js?v=[0-9]*' index.html` and increment what you actually read.

**COPY + CARD PASS 2026-09-09 (after the resequencing above).**
- **Scenario 3's choice card is the QUESTION ALONE.** The intro "I'll clone these experiences for
  you." was cut: the question ("Do you want to change the placement while I clone them, or clone
  them as they are?") already establishes the cloning, so the line was pure preamble. The user
  rejected five "Before I clone these..." openings and two rounds of voice options before picking
  the no-intro version. Scenario 1's card keeps ITS intro (different card, still approved copy).
- **Scenario 4's choice card lost its OBJECT CARD and its "I've grouped them by placement" line.**
  Both were left over from the pre-sticky-canvas version where the canvas really did swap to a
  grouped view here. Under the sticky rule nothing is created at this point, so the card announced
  an object that did not exist and pointed at a view the user could not see (the user caught it:
  "why do I see a new object in the conversation"). The disclosure ('Read your request, grouped the
  experiences' / 'Grouping them by placement') and `runCl4Understand`'s loader made the same stale
  claim and were changed to 'checked the experiences' / 'Checking their placements'.
  `CL4_GROUPED_TITLE` is now deleted, not just unused. **Whenever a card stops creating something,
  check its object card, its disclosure AND its preceding loader — all three make the claim.**
- **The selection count appears ONCE**, on the choice card. `CL4_CONFIRM` repeated it verbatim one
  message later ("we're repeating the selection count in both the messages") and now leads with its
  own line instead.
- **`CL4_CONFIRM`'s line is the user's own wording**: "I'll take you through one placement at a
  time, so you can tell me what each one changes to." Two earlier drafts were rejected: "I'll set
  the new placement for each group as we go, so you can pick a destination one placement at a time"
  (the AI and the user were both doing the choosing in one sentence), then the user's own first
  pass with "experiences within one placement" (the experiences are implied by the groups, so the
  phrase was doing needless work).
- **Scenario 4's per-group ask is "What is the new placement for these experiences?"** (was "Which
  placement should these copies go to?"). "New" marks it as a change, and the user types a name
  rather than picking from a visible set, so "what" beats "which". **Scenario 3's `CL3_ASK_TARGET`
  was deliberately left UNCHANGED** ("Which placement do you want the copies on? Tell me the
  placement and the template to use.") — the user called a stop after three passes. It has two known
  nits if it is ever revisited: it asks for the placement twice, and any rewrite must keep the
  template MANDATORY (an optional "if you'd like to change that too" was rejected, because the
  template change is what breaks every creative and drives the rest of 3b).
- **The Draft info note rides on the DIRECT paths' naming card** (`CL3_NAMING`/`CL4_NAMING` take a
  `direct` flag). Moving the note onto the intent/confirm card put it on the CHANGE path only, so 3a
  and 4a never saw it before cloning (user: "I'm missing that message where it tells the clones will
  be in draft"). The change paths do NOT repeat it on the naming card.

**The composer caps at FOUR lines then scrolls** (`.promptBox__input{max-height:96px;overflow-y:auto}`
— 24px per line at 16px/1.5). The 12-line `cl3FixPrompt` draft was pushing the box to ~360px and
shoving the conversation off screen. `pinDraft(input)` (input.scrollTop = scrollHeight) is called
next to `pinConvo()` on every `typeInto` tick, or the caret types out of view inside the capped box.
Measured: 288px of content, 96px box, conversation intact.

**SCENARIO 5 (built 2026-09-09), sim `cl5`, state key `cl5`.** The GUARDRAIL: the same input as
scenario 4 (a selection spanning several placements) with the OPPOSITE answer — instead of grouping
and retargeting, the agent declines the batch and asks the user to narrow to one placement.
**Both are kept deliberately** (user's call when I flagged the contradiction): they are alternative
design directions for the same situation, shown side by side. cl4 was left untouched.
- **NOT terminal after all** (user, later the same day): the user clicks the **Group by dropdown**,
  picks Placement, the table regroups, and they continue the workflow from there. This is what
  makes the flow work WITHOUT the agent violating the canvas rule — the USER regroups the table,
  the agent never does. No pill and no tracker (it is still a question, not a task).
**cl5 GAINED A CHOICE CARD FIRST (user, 2026-09-10).** The limit is no longer the opening move:
`reading → choice`, and only then do the paths split. States:
`reading → choice`, then **direct**: `wall → doneall` · **change**: `reading2 → mixed` → (user
narrows) → cl3's choice.
- `CL5_CHOICE` is CL4_GROUPED's copy verbatim ("You've selected n experiences across x placements."
  / "Do you want to change the placement while I clone them, or clone them as they are?") with a
  two-pill `.replyRow`. Same question, so it must read identically.
- **"Clone as they are" → 4a's behaviour**: `wnaming → naming → wall → doneall`. Clone every group
  at once, each copy keeping its own placement, ending on `CL4_DONE`. Nothing changes, so the
  one-placement-at-a-time limit never applies — that is the whole reason this branch exists.
- **The Clone- PREFIX CONFIRMATION is part of that branch** (user caught it missing, 2026-09-10:
  "in workflow 4 we confirm the clone prefix. why is that skipped?"). I had copied `runCl4Direct`'s
  loader without noticing 4a's pill actually goes to `runCl4NamingDirect` FIRST. `CL5_NAMING`
  duplicates `CL4_NAMING(active, direct=true)`'s copy exactly ("I'll add "Clone" to the start of
  each name…" + info note + "Shall I go ahead?" + Proceed); only the pill id differs.
  **The standing rule this violated: the prefix must be stated and confirmed before any copy
  exists, on EVERY path.** When mirroring a scenario-4 branch, trace its trigger chain rather than
  its runner.
- **"Change the placement" → the guardrail**, then the existing narrow-and-continue flow.
- The `doneall` view is named `Cloned experiences - ${CL4_PROJECT}`, NOT `CLONE_VIEW_NAME`: the
  copies span several placements, so scenario 1's single-placement view name was wrong.
- **Selection freezes everywhere EXCEPT `mixed`.** The guard is now
  `state.cl5!==undefined && state.cl5!=='mixed'` — `mixed` is the only state that asks the user to
  re-pick, and the old `cl5==='reading'` test left the checkboxes live during the choice card.
- **EVERY new pill id must be added to the `pills` binding table in wire()** (~line 2874). The
  cl5 pills rendered perfectly and did nothing until `['#cl5Direct','cl5Direct']` and
  `['#cl5Change','cl5Change']` were added there. There is no delegated handler.
- `cl5Base()` mirrors `cl3Base()`, carrying `cl5Prior`, `groupBy` and `path` across transitions.
- `onCloneList` and `onCloneResults` both needed `state.cl5==='doneall'` (the standing
  header-checkbox trap).

- **cl5 is a REAL SYSTEM LIMIT, not the agent declining** (user's call, 2026-09-09). This is the
  whole key to the copy. Early versions read as the agent refusing work it obviously CAN do —
  scenario 4 clones across placements right there in the same build — and the user's reaction was
  "man how are these good ai responses to the user". Naming the limit FIRST is what makes it a
  constraint rather than reluctance. When offered "explain the limit and offer to start on the
  first placement" (a pill), the user chose **explain only, no pill**: the user re-selects however
  they like. FINAL copy: "Cloning runs one placement at a time, and the {n} experiences you
  selected are across {g} placements." / "Select experiences that share a placement and I'll clone
  those together."
- **Do NOT script the user's method.** An intermediate version ended "Group the table by placement,
  pick one, and send again" and the user cut it: "dont ask user to group by. then can choose to do
  it however they want." The group-by dropdown is ONE route to a single-placement selection, not an
  instruction — sorting, searching or just unchecking rows all work too.
- **Say "the {n} experiences you selected", never "user selected experiences"** (third person about
  the person you are addressing), and make the ask a request ("Select experiences that…") not a
  permission ("You can select…").
- **The counts must come from the STAMP, never the live selection.** The live cl5 branch recomputed
  `G` from `sel`; regrouping CLEARS the selection, so the on-screen sentence rewrote itself to
  "spans 0 placements" while the user was picking new rows. `state.cl5Prior` now feeds the live
  message as well as the replay; the live fallback is only for the `reading` loader.
- **(superseded) The message carries the COUNT ONLY, never a list of placement names.** Three copy rounds got
  here. "I can clone a batch that shares one placement…" was too explain-y; naming the placements
  inline ("Banking, Chart of Accounts, and Expenses") does not SCALE — six in the demo data, twenty
  in real life — and a CAPPED list ("and 4 more") is worst of all because it hides exactly the
  placements the user needs in order to act ("too vague"). A bulleted list in chat was rejected for
  the same reason ("this is not scalable"). Final: "Your selection spans {n} placements." /
  "Select the experiences on one placement and send again, and I'll clone those together."
  The breakdown belongs in the TABLE, which sorts and stays legible at any size.
- **NO object card on this message** (user: "why have you created an object?"). The agent produced
  nothing — it declined to act — so there is no artifact to name. Carried over unthinkingly from
  cl4's grouping playback, where it IS earned. Same principle as the canvas rule: an object card
  names something created, not a question asked.
- **Not an error and not a warning** (asked and answered 2026-09-09): the user made a valid
  selection, nothing failed, nothing is at risk. `badge--err`/`.warnNote` stay for real failures
  and pre-approval consequences. Plain agent prose.
- **The dropdown is INTERACTIVE in cl5 only.** `groupByCtl(by, open)` gained a `.groupByMenu` with
  one option (Placement); `[data-groupby]` toggles `state.groupByOpen` and `[data-groupopt]` sets
  `state.groupBy`. Elsewhere it stays display-only, so `state.groupBy` (set only by a click) is
  what drives both the label and the table's `groups` — the agent cannot regroup the canvas.
- **Picking Placement CLEARS the selection** (user's call): it spanned several placements, which is
  what the guardrail objected to, so the user starts clean inside one group.
- **Then the flow continues into SCENARIO 3's CHOICE CARD**, not scenario 1's clone. I routed it to
  scenario 1 first and the user pushed back hard ("bruh we've fixed that workflow where ai will
  first ask if you want to change placement"): a plain clone ask ALWAYS means the agent asks
  whether to change the placement, and the answer drives the rest. Routing to scenario 1 hardcoded
  "no changes" and skipped the settled question. `trigger.pcSend` re-tests the live selection with
  `cl4Groups`: still >1 group → the guardrail again; down to 1 → `runCl3Understand({cl5Prior})`.
  So the guardrail is a loop the user exits by narrowing, not a dead end.
  **Lesson: when a flow already exists for "user sent a plain clone ask", reuse it — do not offer
  a fresh continuation as if the question were open.**
- **`cl5Prior` keeps the guardrail turn in the transcript.** Bug the user caught: continuing into
  cl3 cleared `state.cl5`, so the guardrail message VANISHED from the conversation
  ("my previous conversation is disappearing"). Three things were needed:
  1. `runCl5Understand` STAMPS `cl5Prior:{n,g}` when the guardrail fires — by continuation time the
     selection is narrowed to one placement, so recomputing renders "spans 1 placements".
  2. `cl3Base()` carries `cl5Prior` (and `groupBy`) forward like `path`, or the replay dies one
     step later.
  3. `isCl5` tests `state.cl5Prior!==undefined` too, or the search conversation, heading, crumb and
     ROW DATA all revert to scenario 1's 6-row single-placement set mid-flow.
  `cl5Prelude()` in the cl3 branch replays it above the new selection thread. `CL5_MIXED` only
  reads `G.length`, so the replay passes `{length:cl5Prior.g}`.
- **The user's grouping must SURVIVE the continuation** — it reset to unset when the flow moved
  into cl3 until `cl3Base` carried `groupBy`, and the table's `groups` condition gained
  `&& !onCloneResults` so the flat clone-results list is never banded.
- **The dropdown lists SIX options** (user, from the real product's menu): Placement, Audience Set,
  Status, Promotion Offer, Experiment ID, Treatment ID. **Template is deliberately SKIPPED.**
  `GROUP_BY_OPTS` carries an `on` flag: **only Placement is wired** — it is the only field the row
  data holds, and the user confirmed the rest should be listed but inert rather than greyed out or
  backed by invented data ("only placement works tho"). An inert item renders as a button with no
  `data-groupopt`, so clicking it does nothing.
- **cl5 must NOT freeze the selection** — the opposite of every other scenario. The three freeze
  guards test `state.cl5==='reading'` (a loader is running), not `state.cl5!==undefined`, or the
  checkboxes stay dead and the user can never re-pick.
- **The clone ask has to auto-type a SECOND time** and `typed` is already true from the first ask,
  so the retry needs its own flag (`retyped`), cleared by the regroup along with the selection.
  Caught in verification: without it the composer sat empty and the user would have to type.
- States are just `reading → mixed`. Reuses `CL4_ROWS`/`CL4_APS`/`cl4Groups`/`CL4_FIND_PROMPT`/
  `CL4_PROJECT`/`CL4_CRUMB` wholesale — a selection must be ABLE to span placements for the
  guardrail to fire, and cl4's 18-row data is the only set that does.
- `CL5_MIXED(nSel,G)`: "{n} experiences you selected sit on {G.length} different placements." +
  object card + "I can clone a batch that shares one placement. Select experiences on the same
  placement and I'll clone them together." BOTH counts derive from the live selection.
- **`isCl5` had to join every place `isCl4` selects the data source**: `SRC`, `cl4G`, the search
  conversation, `uPrompt`, `createdBubble`, the heading, and the crumb. Miss one and the scene
  falls back to the 6-row single-placement PC_ROWS, where nothing can span placements.
- **The same shared-wiring list as cl2/cl3/cl4** (memory's standing warning, paid again): the three
  selection-freeze guards (row checkbox, wireSelAll, chip-clear), the auto-typed draft guard,
  `trigger.pcSend`, both `go('home',{autotype})` sites, `FLOW_STEPS`/`stepIndex`, and the sim menu.
- **Sim labels had to name the OUTCOME, not the selection.** cl4 was "Clone experiences across
  several placements" and cl5 "…with mixed placements" — the same input, so the menu could not tell
  them apart. Now "Mixed placements, group and retarget each one" / "Mixed placements, ask for one
  placement".

**Landing-card copy is ONE SHORT LINE** (user, 2026-09-09, after two rounds of trimming). The clone
card went 335 → 186 → 63 chars: "Clone IPD experiences as-is, or change placement while cloning."
Rollback's went 294 → 69: "Roll experiences back to the previous version, one or many at a time."
Do NOT enumerate scenarios or describe mechanics on a landing card; name what the flow does. Also
cut from the clone card: "per the clone flow diagram" (an internal reference) and "access points"
(this build says placement).

**The panel step tracker has THREE markers, not two** (user, 2026-09-09, three rounds). `aiPanel`
took only `stepLoading` (spinner) vs nothing (green check), so scenario 4b's mid-task waiting state
had no honest marker — the check claimed the task was FINISHED and the spinner claimed work was
RUNNING. New `stepNum` option renders the plan table's own `.planNum` dashed circle, scoped to 20px
in `.ai__step` so the row does not shift. The rule, matching the plan table's row states:
`g{i}load`/`g{i}wcl` = spinner (working) · `g{i}ask` = dashed number (started, idle, waiting on the
user) · `g{i}done` = check (that group's clones exist). `stepPair` is now a 3-tuple.
- **4b needed the tracker at all** — it has a per-group plan but `stepPair` only knew about cl2.
- **`CL4_PLAN`'s `done` argument counts FINISHED tasks, not the group index.** It was being passed
  `g`, so a group's own plan row never turned green while the user was looking at its result.
  Now `g+1` at stage `done`, `g` otherwise. Tracker and plan table must always agree.

**Group-by dropdown on every clone-flow table** (user, 2026-09-09), Figma node
`bql5nKwOL0ng1iBoWconOS` 919:48122 "Search + Sort + Filter": a 200x40 input-shaped control, 12px
inline padding, 10px radius, label left + chevron right, borrowing `.search`'s border so the
toolbar reads as one set. `groupByCtl(by)` — named that because `groupBy` is already a local in the
tree builder. Unset it reads placeholder "Group by" in grey; when the table actually renders group
bands it reads **"Group by: Placements"** in primary text. Driven off the SAME `cl4Display.groups`
that decides whether the table groups, so the label cannot drift from the view; passed as a string,
not a boolean, so a future grouped view just names its key. Only 4b's final review is grouped.
**The sort-lines icon button was removed from the clone tables** (user) — it existed only in
`pcSearch`'s toolbar; `rxToolbarCl4` never had it, so the two now match.
Both changes were scoped to the CLONE flows: the shared `searchMultiple` scene in the same file
(the change-order flows) still has the sort button and no group-by, by design.

**Rollback build copy fix** (2026-09-09, `rollback-experiences-aug28` app.js v111): the mixed-
selection note's draft line now reads "…The content from the previous version replaces what is in
the draft now." The user's own draft said "the previous experience", which reads as a DIFFERENT
experience; it is the same experience at an earlier version. "replaces" not "overrides" because the
draft content is gone, not merely outranked. The count was already dynamic.

**Version drift:** `index.html`'s `?v=` was at 82 when this session found it (memory said 34), so
another session had been editing. **Read the current value before bumping** rather than assuming.
Now at v90.

**PER-GROUP PLAYBACK REINSTATED 2026-09-11 (scenario 4b only).** Naming a destination no longer
clones straight away: it plays the change back first.
  `g{i}ask` → user names the destination → `g{i}map` (loader) → **`g{i}int`** (From/To + Approve)
  → `g{i}wcl` → `g{i}done`
- `CL4_GROUP_INTENT(g,groups,active)` is ONE `pcFtBlk('Access point:', grp.ap, cl4Dest(g))` — the
  group's access point is the only thing changing. Intro matches scenario 3's wording: "Here's what
  I understood changes for this group."
- `runCl4MapGroup` now MAPS (→`g{i}int`); the new `runCl4CloneGroup` does the cloning, fired by the
  new pill `cl4ApproveGroupIntent`. Both pills needed entries in wire()'s `pills` table.
- **4a is untouched** — one destination for the whole set, and the choice pill already approved it.
- **Five places test the stage string** and all had to learn `map`/`int`: the transcript regex
  (`mm4`), `priorGroups` (completed groups must replay the playback or a turn vanishes), the step
  label regex, the canvas `mWait` regex, and `stepIndex`'s resolver (+ `CL4_ORDER`, since `int` is
  a RESTING state and becomes its own step). `map`/`int` create nothing, so they join `load`/`ask`
  in `mWait` and the canvas correctly stays on the previous batch's clones.

**BOTH "BUGS" I FLAGGED ON 2026-09-11 WERE WRONG — I trusted this file over the code.** Verified
against app.js; the build is correct and consistent on both. Recorded so nobody re-flags them:
1. **The build says "ACCESS POINT", not "placement"** — 221 occurrences vs 14, and those 14 are
   internal constant NAMES (`OLD_PLACEMENT`, `CL2_NEW_PLACEMENT`) whose rendered label is
   "Access point:". The 2026-09-08 note below saying this build renamed to "placement" is STALE;
   it was renamed back. **The constant names do not match the UI copy — do not infer the copy from
   them.**
2. **The naming is a SUFFIX, not a prefix**: `CLONE_SUFFIX = '-Clone'`, applied as
   `exp + CLONE_SUFFIX`, so every card correctly reads "I'll add "Clone" to the END of each name".
   The `CLONE_PREFIX` / `Clone-` described elsewhere in this file is from the original Sep-03 build
   and no longer exists.

**→ READ THE CODE BEFORE FLAGGING COPY AS A BUG.** This file lags the build; two wholesale renames
(placement→access point, prefix→suffix) have happened since the notes above were written.

**3b GAINED A MISSING-FIELDS READBACK (2026-09-11)**, between the naming card and the clones:
`naming → wfields → fields → wclones → clonesErr → …`. `CL3_FIELDS_CARD` plays back the field the
new template needs BEFORE anything is created, so the flagged clones are not a surprise. Ported
from the placement-change build's `pc2FieldCard` (see [[placement-change-sep01]]), same shape:
"The new template needs content this one doesn't carry over." / an `.ft-label` "Missing fields:"
above a single-column `.fldTbl` of numbered rows / "I'll create the n clones and flag this field,
so you can fill it in as soon as you have the copy." / `dlLink()` / "Shall I go ahead and create
the clones?" + Proceed.
- `beforeClone3b()` = `beforeClone3() + CL3_FIELDS_CARD(nSel,false)` — every state from `wclones`
  on replays it. `beforeClone3` opens a `convoTurn` it does not close, so the card joins that turn.
- `CL3_ORDER` gains `'fields'`; **`CL3_LIST` and `CL3_FLAGGED_STATES` deliberately do NOT** — at
  `fields` no clone exists yet, so the canvas must stay on the search results.
- `wfields` resolves to `fields` in `stepIndex`'s R map; autopilot approves at `fields`; and
  `['#cl3ApproveFields','cl3ApproveFields']` had to join the pills table.
- The `.fldTbl` CSS was ported into this build's index.html too (it lives beside `.ft-label`).

**A SINGLE-COLUMN TABLE'S TITLE GOES ABOVE IT, as an `.ft-label`** — never as a header ROW. Four
attempts inside the box all read as an empty first row (16px grey matching the data rows, then a
12px uppercase label on a grey fill); the user pointed at the existing "Access point:" From/To
block as the pattern to copy. `.fldTbl` therefore has NO head element.
**Inside a `.summaryCard` the label and table carry NO margins**: the card is a flex column with
`gap:12px`, so any margin ADDS to it (2px + 6px gave a 20px gap where the reference had 12px).

Preview: launch.json entry `cco-clone-sep03` on :8093 (root `/Users/rlathiya/Trial/.claude/launch.json`;
`cco-landing`:8090 is usually held by another session). **app.js is cache-busted — bump `?v=N` in
index.html after every app.js edit** (currently v34).

Not committed or pushed (manual-only per [[project-create-change-order]]).

**1:n CLONES (built 2026-10-01), sim `cl3n` (10 copies each) and `cl4n` (3 copies each), under
"Post-clone validation".** NOT new scenes: they are cl3 and cl4 with a MULTIPLIER. `CLONE_MULT`
maps scenario → m; `sc()` returns the parent key (every former `scenario==='cl3'/'cl4'` test now
reads `sc()==='…'`), `mult()`/`isMulti()`/`nCopies(nSel)` drive the counts. Shared states, runners,
triggers, step lists and the `path` flag, so STEPS_CL3/CL4 arrow-nav works unchanged.
- Prompt carries the count: `CLONE_PROMPT_N(m)` = "I want 10 copies of each of these experiences."
  (`clonePrompt()` picks it; `PC_REQ`, the auto-typed ask and `draft` all go through it).
- Names are NUMBERED: `cloneSuffix(c)` → `-Clone-1 … -Clone-10` (plain scenarios keep `-Clone`).
  `cloneEid(k)` varies the leading byte past the 10 fixture IDs so no two copies share one.
- `cloneRows` and cl4's `batchClones` flatMap each source into m rows (flat index `k` preserved, so
  `needsCopy(k)`, drill-down and the eid lookup still work). 3 selected → 30 rows; 5 → 15 in cl4n.
- Copy counts COPIES: choice/grouped card adds "I'll make 10 copies of each of the 3 selected
  experiences, 30 in total."; `cloningLabel()` = "Creating 30 copies"; fields card / clones error /
  verified get `nCopies(nSel)`; `CL4_GROUP_INTENT` "I'll create 6 copies once you approve.";
  `CL4_GROUP_DONE` "Created 6 copies of 2 experiences on X"; `CL4_DONE`/`CL4_ALL_REVIEW` state the
  per-experience × total. `namingLine()` is the ONE naming sentence used by every naming card
  (CLONE_UNDERSTOOD, CL3/CL4/CL5_NAMING): "I'll number the copies, adding "Clone-1" through
  "Clone-10" to the end of each name so you can tell them apart."
- The 3b copy prompt names each SOURCE's run once, not every copy: `fixNamesFor(sel, SRC)` →
  "ELM…-HighPS-Clone-1 to Clone-10" (`cloneNamesW` now delegates to it; the scene's `allNames` too).
  The error message says "Send me the copy for each experience and I'll apply it to all of its copies."
- **Gotcha hit:** a replace-all of the old naming sentence also rewrote `namingLine`'s own fallback
  into `${namingLine()}` → infinite recursion in every PLAIN scenario while the 1:n ones looked fine.
  Always re-run a plain cl3/cl4 state after touching shared copy.
- Verified in-browser 2026-10-01: cl3n 3a + 3b (30 rows, Error → Edited/v2), cl4n 4a (15 rows) +
  4b (6/6/3 accordion, tracker "4. Review all cloned experiences"), plain cl3/cl4/cl6 unchanged.
  `index.html` cache-buster now `?v=152`. Uncommitted.
- **A flagged 3b clone's BODY is MISSING, not over the limit** (user, 2026-10-01: "if error is body
  copy missing, how can error have body copy exceeds character limit?"). `cloneCreative(view,
  missing, edited, copy)` now renders the dash + "Content is missing." pair (`cl6Missing`) and a
  "Body copy missing" preview while flagged; after the fix it shows THAT SOURCE's copy
  (`CL3_FIX_COPY[dr.si]`, `si` = source position carried on every clone row) with the `.cd-hl`
  highlight. `BODY_ERR` (over the limit) is now only cl2's and the placement-change flow's error.
  Applies to plain cl3 as well as cl3n. Cache-buster `?v=154`.
- **Naming line (user's pick, 2026-10-01):** `I'll name the copies "Clone-1" through "Clone-10",
  added to the end of each name, so each one is easy to tell apart.`
- **Every clone flow's closing message offers Publish here OR Campaign Manager** (user, 2026-10-01).
  `publishFoot(n, pub)` = "I can publish them for you, or you can do it from Campaign Manager." +
  Publish pill (`clonePublish`) + `.link-cm`, appended to CLONE_DONE (pc + 3a), CL3_VERIFIED (3b),
  CL4_DONE (4a + cl5) and CL4_ALL_REVIEW (4b). `state.pub` ('publishing' | 'published') is
  ORTHOGONAL to the scenario key: `runClonePublish()` copies the whole terminal state and layers
  `pub` on it, the scene appends one turn (loader → `CLONE_PUBLISHED(n, view)`), rows flip to
  Published (cloneRows AND cl4's `batchClones`), and `canvasBusy` / cl4Display `busy` skeleton the
  canvas while publishing. cl6 keeps its own `cl6Publish`. Cache-buster `?v=155`.

**1:n REWORKED 2026-10-07: SETS, each retargeted on its own.** User's calls, all 2026-10-07:
- **Say "clones", never "copies", in the 1:n flows.** Prompt is `I want 2 clones of each of these
  experiences.`; every isMulti() branch, `cloningLabel`, `namingLine` ("Clone-1" AND "Clone-2"
  for m=2), CLONE_PUBLISHED, CL4_GROUPED/DONE/ALL_REVIEW, CL3_CHOICE say clones. Shared loader
  subtasks + `cloneInfoNote` go through `copiesW()` (copies in plain flows, clones in 1:n), so the
  plain flows' standing wording is untouched. Verified by grepping innerText of every 1:n resting
  state for `\bcopies\b`: zero hits.
- **`CLONE_MULT = {cl3n:2, cl4n:2}`** (was 10 / 3): "the scenario otherwise blows up" once every set
  is asked for separately. 3 selected → 2 sets → 6 clones (cl3n); 5 selected across 3 APs → 6 sets
  → 10 clones (cl4n).
- **A SET = the c-th clone of every experience in a group**, and each set gets ITS OWN access point
  (cl3n also its own template) asked for when its turn comes. `cl4Sets(sel)` = groups × m,
  group-major; `cl3Sets(sel)` = m sets of the whole (single-AP) selection; `setLabel(st)` =
  "set 1 of 2". Destinations = `cl4Dest(setIndex)` over the six-entry `CL4_DEST`; cl3n's typed reply
  is `cl3nTargetPrompt(s)` ("Use Invoice - hellobox with the hellobox - text template.").
- **cl4 / cl4n share ONE loop.** The 4b branch, the display block, `cl4TaskLabels`, the tracker,
  `runCl4CloneGroup`/`runCl4NextGroup` (`cl4NSets`) and the step nav (`cl4Order()` = `cl4OrderFor(
  CL4_NG*mult())`, `stepsCl4()`) all walk `S = cl4Sets(sel)`; in plain cl4 a set IS a group (c=0),
  so nothing there changed. Only GROUPED/CONFIRM/DONE still read the GROUPS (`G`) for "across N
  access points". The plan reads "Clone and review Banking -hellobox, set 1 of 2" per set.
- **cl3n's change path is 4b's shape with 3b's change inside it** — a NEW branch in the scene
  ahead of the generic cl3 one (`isMulti() && path==='change'`, states other than
  reading/choice/reading2): `confirming → confirm` (CL3N_CONFIRM, pill `cl3nApproveConfirm`) →
  `wnaming → naming` (CL3_NAMING, `cl3ApproveNaming` now branches on isMulti) → `planning → plan`
  (CL3N_PLAN, `cl3nApprovePlan`) → per set `s{i}load → s{i}ask → s{i}map → s{i}int → s{i}wcl →
  s{i}err → s{i}fix → s{i}done` → `wallrev → allrev`. Messages CL3N_ASK_SET / CL3N_SET_INTENT
  (From/To for AP + template PLUS the "Missing fields: 1. Body copy" block and dlSummary — plain
  3b's fields card folded in so a set needs one approval, not two) / CL3N_SET_ERR / CL3N_SET_VERIFIED
  / CL3N_ALL_REVIEW ("…across 2 access points, every one verified." + publishFoot). Runners
  `runCl3n*`; Send routes `s\d+ask` → `cl3nSendTarget`, `s\d+err` → `cl3nSendFix`; auto-type flags
  are per set (`tTyped{i}`, `fTyped{i}`), and the copy prompt per set is `cl3FixPrompt(
  cl3nSetNamesW(i))`. Step nav: `cl3nOrder()`/`stepsCl3n()`, own `stepIndex` branch. The 3a path
  of cl3n is untouched (generic branch, 6 Draft rows).
- **The display block is shared** (`loopKey` = 'cl4' for any cl4 state, 'cl3' for cl3n-change) and
  keeps the sticky rule: ask/map/int show the PREVIOUS set's clones, wcl/fix skeleton, err/done that
  set, allrev the accordion by destination. cl3n rows: Error (+ tmplChanged highlight) through
  wcl/err/fix, then Edited / v2; cl4 rows Draft / v1; Published once `pub`. The drill-down now reads
  the flag off the ROW (`dr.status==='Error'`) instead of `needsCopy`, which had been returning true
  for every 4b clone.
- **Pill ids MUST be added to the `pills` list in wire()** (`cl3nApproveConfirm`, `cl3nApprovePlan`,
  `cl3nApproveSetIntent`, `cl3nApproveSet`) — the button rendered and did nothing until they were.
  Autopilot (`p`) learned the cl3n states too. Cache-buster `?v=157`. Uncommitted.
- **The per-set ask has NO preamble** (user, 2026-10-07, after rejecting "Starting with the first
  set: set 1 of 2, one clone of each…" as redundant and four reworded leads): it is one question.
  cl3n: "For the first set, which access point and template should the 3 clones use?" then
  "For set 2 of 2, …". cl4n: "For Banking -hellobox, the first set, which access point should the
  2 clones go to?" then "For Banking -hellobox, set 2 of 2, …". Loaders before it say
  "Starting with the first set" / "Moving on to the next set". Cache-buster `?v=160`.
- **Sets are named after their clone suffix** (user had no preference, my recommendation,
  2026-10-07): `setLabel(st)` = "Clone-1 set" / "Clone-2 set", never "set 1 of 2" (it read as two
  sets in total when cl4n has six). Plan rows: "Clone and review Banking -hellobox, Clone-1 set"
  (cl4n), "Clone and review the Clone-1 set" (cl3n). Ask: "For the Clone-1 set, which access point
  and template should the 3 clones use?" / "For Banking -hellobox, the Clone-2 set, which access
  point should the 2 clones go to?". Cache-buster `?v=161`.

**SPLIT 2026-10-07: the 1:n flows now live in their OWN build, `clone-ipd-1n-experiences-oct07/`**
(a straight copy of this folder; `let scenario = 'cl3n'`, title "Marketing Studio - 1:n Clone IPD
Experiences"). Landing card "IPD - 1:n Clone experiences" sits beside Audience - Change order under
7 OCT. Its sim menu has ONLY the "Post-clone validation" label + cl3n + cl4n (no pre-clone group at
all); the Sep-03 menu keeps cl6 / cl3 / cl4 / cl5 and lost the cl3n/cl4n buttons. **The cl3n/cl4n
code was NOT removed from either folder** (it shares states/runners with cl3/cl4), so each build
still carries the other's scenarios as unreachable code; a fix to shared clone copy must be made in
BOTH folders. **Cross-links** (user's ask): last item of each sim menu is an `<a class="simMenu__link">`
with a `→` — Sep-03 says "1:n clone flows", the 1:n build says "September release clone flows" —
pointing at the sibling folder. CSS for it sits after `.simMenu__item--muted` in each index.html.
Cache-busters both `?v=162`. Uncommitted.

**2026-10-08: cl3n scaled to 4 clones** (user: "instead of making 2 copies, make 4 copies, scale up the
example"). `CLONE_MULT = {cl3n:4, cl4n:2}` in `clone-ipd-1n-experiences-oct07/app.js` ONLY; the Sep-03
folder still says 2 (its cl3n is unreachable). Nothing else needed changing: prompt, naming line
("Clone-1" through "Clone-4"), 4-row plan, 4 set asks (Batch save / Invoice / Reports / Payroll via
`cl4Dest`), and "4 clones across 4 access points" all derive from `mult()`. Cache-buster `?v=163`.
Verified via autopilot in the browser. PUSHED 2026-10-08 in `0b939ee`.

**1:n DOWNLOAD SUMMARY MOVES TO AFTER CREATION (user, 2026-10-09), 1:n build only.** The set's
intent card (`CL3N_SET_INTENT`) used to carry `dlSummary()` BEFORE the clones existed, yet the
summary lists the NEW experience IDs, which cannot be in a file produced before they are
generated. Live `cl3n` now shows "Download summary" on the created-set message
(`CL3N_SET_ERR`, "Created 3 clones on X, found 3 issues") and NOT on the intent card. The old
behaviour is kept as scenario **`cl3nd`** (deprecated), a muted-but-clickable entry under a
"Deprecated" label at the bottom of the sim menu; `DL_BEFORE()` (= scenario==='cl3nd') is the
ONLY difference, `isCl3n()` covers both keys everywhere `scenario==='cl3n'` was tested,
`CLONE_MULT.cl3nd = 4`. cl4n has no download link at all (creative carries over cleanly), so
nothing changed there. Plain 3b's `CL3_FIELDS_CARD` in the Sep-03 build still offers the
summary before creation — out of scope, not touched. Cache-buster `?v=164`. Uncommitted.
