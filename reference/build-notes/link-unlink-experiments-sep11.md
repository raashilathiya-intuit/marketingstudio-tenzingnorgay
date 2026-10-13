---
name: link-unlink-experiments-sep11
description: "The Sep-11 link/unlink-experiments build — the experiment detail screen, the 3 flows from the Figma diagram, and what is built so far"
metadata:
  type: project
---

`link-unlink-experiments-sep11/` in the [[project-create-change-order]] CCO-landing repo, copied
from `clone-ipd-experiences-sep03` (inherits `runPCStep`, `tableHTML`, `aiPanel`, `scheduleAskType`,
`metaGrid`). Landing card under a new **11 SEP** section, New badge moved there off 3 SEP.
Page title "Marketing Studio - Link and Unlink Experiments". **LOCAL ONLY — not committed**
(user, 2026-09-11).

**SOURCE OF TRUTH: the Figma flow diagram**, MS 2.0 - Targeted Offers, node `9602-70408`
(file key `bql5nKwOL0ng1iBoWconOS`). Read it with `get_screenshot` at maxDimension 4096, then crop
with PIL — the node text is illegible at default resolution. Context on the board: high-volume bulk
cloning, users want to paste comma-separated offer IDs and let Marketing Studio sort out the
different access points. Prerequisites: IXP must be running/published (not stopped or draft),
treatment configured in IXP, an offer linked to one experiment cannot be linked to another, and a
published experiment cannot be edited (hence STAGING).

**Three flows in the diagram:**
1. **Link experience** — find experiment → details → *has experience ID?* YES: prompt "Link
   [experience ID] to treatment X" · NO: search experiences within that context (by access point) →
   select → prompt → *published?* YES: playback (1. create staging 2. create draft for all linked
   experiences 3. link new) → confirm → create staging + link → *ready to go live?* YES: publish
   experiment + publish offers linked to it (staged overrides live; draft offers override published)
   · NO: *delete staged experiment?* · NO(unpublished): playback + confirm → link.
2. **Unlink experience** — find experiment → details → *published?* YES: prompt → playback
   (1. create staging 2. unlink experiences) → confirm → unlink · NO: select linked experiences →
   prompt → unlink.  ← **BUILT FIRST** (user picked it: no ID-vs-search fork, so it exercises the
   detail screen and staging without the extra branching)
3. **Unlink from one experiment and link another** — find experiences → *linked to an experiment?*
   YES: prompt to unlink from X and link to Y → *are BOTH published?* YES: **PLAN widget** (5 tasks:
   staging for both, draft all linked, unlink from X, publish X, link to Y staging) · NO: playback
   (unlink old, link to new, review) · NO: *published?* → playback → ready to go live?

**THE EXPERIMENT DETAIL SCREEN** (`scenes.xpDetail`), rebuilt in OUR design from the current tool's
dialog (user dictated the structure 2026-09-11):
- `.expHead`: **name │ status chip │ Experiment ID**, separated by vertical dividers.
- `.meta.meta--exp`: the grey attribute-value card, FIVE columns — IXP state, Start date, End date,
  Hypothesis, **Holdout treatment**. Holdout is a plain attribute pair reading "None", **NOT the
  radio-button row the current tool shows** (user was explicit).
- Then `xpToolbar()` (search / filter / group by) and the linked-experiences table.
- **Columns use OUR terms**: Experience / Status / Access point / Treatment — not the tool's
  "Offer name / Offer status". Treatment is a column unique to this build.
- `pub` (defaults true) drives the status chip and the row statuses.
- **IXP STATE IS NOT THE VERSION'S STATE** (user, 2026-09-15). It is the experiment's state in IXP,
  so a published experiment stays **RUNNING** the whole time you edit a draft of it — which is
  exactly what the info note promises ("the live experiment keeps running"). Only an experiment
  that was NEVER published reads DRAFT. `xpMeta(pub)` takes only `pub`, never `staged`.
- Version-history author is **`XP_AUTHOR = 'Lathiya, Raashi'`** (the user). Other `Stroupe, Kristin`
  placeholders survive in the inherited clone-build scenes but never render in these flows.

**THE TWO SCENARIOS DEMONSTRATE THE TWO INTAKE SHAPES** (user, 2026-09-15) — that is the point of
having both, so do not make them match:
- **`ulPub`** — GENERIC prompt (`XP_FIND_PROMPT` = "Find the ty25 Catchall experiments.") →
  `runIntakeXp()` → `xpSearch` RESULTS TABLE (3 rows) → click a row → `xpDetail` (ty25_Catchall_PLU,
  Published).
- **`ulDraft`** — SPECIFIC prompt (`XP_FIND_ONE_PROMPT` = "Show me the ty25_Catchall_PLU_holdback
  experiment.") → `runIntakeXpOne()` → **NO results table**, `xpDetail` directly
  (ty25_Catchall_PLU_holdback, Draft, its own ID 716944). Loader says "Fetching the experiment",
  and its finished transcript `XP_FETCH_CONV()` has **no "Search results" object card** because
  nothing was searched.
**The PROJECT is named from the PROMPT** (user, 2026-09-15): "Find the ty25 Catchall experiments."
→ project **"ty25 Catchall experiments"** (an earlier "ty25 experiments" dropped the word that
narrows the search). The same rule on the specific intake makes its project
**"ty25_Catchall_PLU_holdback"** — and because the project IS that one experiment there, its crumb
is **ONE level** (`Home / ty25_Catchall_PLU_holdback`); a second would repeat the name. The search
intake keeps two (`ty25 Catchall experiments / ty25_Catchall_PLU`).

Both walk boot → C1 → C2 identically. `xpDetail` therefore owns the intake phases too (it is the
landing scene for the specific intake) and skeletons on `state.loading`.
`xpName(pub)` / `xpId(pub)` / `XP_CRUMB(pub)` pick which experiment the screen shows.

**THE JOURNEY STARTS AT "FIND EXPERIMENT"** (user, 2026-09-15: "why am I starting here? where is my
initial prompt"). The sim items open HOME with `XP_FIND_PROMPT` typed, exactly like every other
build: prompt → "I have created ty25 experiments project for you" → search loader → `scenes.xpSearch`
results list (3 experiments; the Draft row opens the unpublished variant) → row click → `xpDetail`.
`XP_SEARCH_CONV()` is replayed as HISTORY at the top of the detail screen's panel — otherwise the
detail screen appeared with an empty panel.
**NO message or object card for OPENING the experiment** (user, 2026-09-15: "why have you created an
object in conversation? I have only opened one experiment"). Clicking a search result is NAVIGATION;
an object card means the AI CREATED something. A first pass added a "Here's ty25_Catchall_PLU" card
to bridge the gap between the search and the unlink turn — wrong, and removed. The only object card
before the user's ask is the SEARCH PROJECT, which the AI did create.
`runIntakeXp()` mirrors `runIntakePC`; the `home:` trigger routes `ulPub`/`ulDraft` to it.

**THE INTAKE SEQUENCE IS NOW A SKILL: `ms-prototype-intake`** (created 2026-09-15 at the user's
request, after I reinvented it here). It documents the full boot → C1 → C2 → result pattern, the
markup for each phase, the runner shape, and the "specific search opens the object directly but
keeps the same intake" case. **Load it before building any new flow or entry point in these
prototypes.** Short version: every flow ALWAYS starts from a typed prompt; C1 is a centred single
column with NO canvas; C2 is two-pane with a skeleton table; never drop the user straight into a
two-pane screen or a pre-loaded object.

**Do NOT borrow `.detail-sub` for the header ID** — it carries `margin-bottom:20px` from the
drill-down and knocks the header baseline out. `.expHead__idw` is the header's own class (same
look, no margin), and `.expHead>*{flex:none}` keeps the status from being squeezed out of the row.

**Unlink as built**, sim `ulPub` / `ulDraft`, state key `ul`. **THE TWO PATHS HAVE DIFFERENT
SHAPES — the draft path is NOT a trimmed copy of the published one** (user, 2026-09-15):

- **PUBLISHED** (`ulPub`): `reading → intent → planning → playback → staging → stagereview →
  working → done → publishing → published`. A draft has to be created first, so a PLAN is worth
  making: intent (Proceed) → plan (Approve) → draft review (Approve) → unlink → publish.
- **DRAFT** (`ulDraft`): `reading → intent → working → done → publishing → published`.
  **NO plan widget, no draft creation** — there is nothing to stage, so the intent card IS the
  confirmation: "Does this look right? I'll unlink them once you approve." + **Approve**
  (`ulApprove`, not `ulApproveIntent`). Info note: "ty25_Catchall_PLU is a draft, so I'll apply the
  change directly. It goes live when you publish the experiment."
  Three places encode the difference: `UL_INTENT`'s pill/question branch on `pub`, `PLAN()` in the
  transcript returns `''` when `!pub`, and both `STEPS_UL` and `stepIndex`'s ORDER array drop
  `playback`/`stagereview`. Step counts: 9 published, 7 draft.
- **The word is "draft experiment", never "unpublished experiment"** (user, 2026-09-15) — sim menu
  included. And `UL_DONE` branches on `pub`: "The draft now has n" + object card `X (draft)` on the
  published path, "It now has n" + object card `X` on the draft path, because there the experiment
  IS the draft.

**THE WORD IS "DRAFT", NEVER "STAGE"/"STAGED"** (user, 2026-09-15). Status chip reads plain
**Draft**, the plan says "Create a draft of the experiment", the object card is
`ty25_Catchall_PLU (draft)`. No "Draft stage", no "staged version" anywhere in copy or loaders.

**THE DRAFT VIEW IS A CONFIRMATION STEP, AND NOTHING HAS CHANGED IN IT YET** (user, 2026-09-15 —
took two passes to get right). The plan's Approve creates a draft whose canvas is **the SAME view as
the published experiment with ALL 6 experiences, every one in Draft** — not a subset, not a
preview of the end state. "I've created a draft. Nothing has changed yet." Approving THAT performs
the unlink, and the canvas shows **the same draft minus the unlinked rows** — still Draft, still
IXP DRAFT. Two earlier wrong versions: (a) rows removed while still on the draft with the survivors
reading Published, (b) the draft showing only the 4 being unlinked.

**`live` OVERRIDES `pub` ONCE PUBLISHED.** The draft scenario kept showing a Draft chip, DRAFT IXP
state and Draft rows after publishing, contradicting its own done message — because every display
branch tested `!pub` (how the experiment STARTED) rather than whether it is live NOW.
`live = ul==='publishing'||ul==='published'` is threaded into `xpStatus`, `xpMeta` and the row
`SRC`, and wins over `pub` in all three.

**The info note is PUBLISHED-PATH ONLY** (user, 2026-09-15: "do we need the notice here since we're
working on a draft experiment?"). There it explains something non-obvious — a draft copy is made and
the live experiment keeps running. On a draft experiment it only restates the default the status
chip already shows.

**PUBLISH CLOSES THE LOOP IN-FLOW** (user, 2026-09-15). `UL_DONE` offers BOTH: a **Publish** pill
("I can publish the experiment for you, or you can do it from Campaign Manager.") and the `.link-cm`
link. Taking the pill runs `publishing → published`: the header returns to **Published**, IXP back
to **RUNNING**, and the unlinked experiences are gone for good. So the states are
`… → done (draft, rows gone) → publishing → published (live, rows gone)`.
`gone = done || live` drives the row filter and `picking`; the `shortList` array in the
`wireSelAll` call must list **all three** of done/publishing/published or the header checkbox
renders checked over the shorter list.

**Header order is NAME │ ID │ STATUS** (user, 2026-09-15), and the ID uses the repo's convention —
`ID:&nbsp; <value>` + `COPY_ICON` in a `.detail-sub`, NOT an uppercase "EXPERIMENT ID" label. The
status control is the version picker, so it sits last.

**The breadcrumb is TWO levels**: `{XP_PROJECT} / {XP_NAME}` (user, 2026-09-15: "i taught you not to
give 3 levels"). An invented "Experiments" middle level was wrong — the first level is the PROJECT
the search created. `XP_CRUMB` is a FUNCTION because `XP_PROJECT` is declared further down the file
(the same TDZ trap as the rollback build's step list).

**Selection stays visible until the rows actually go.** `sel` indexes the full 6-row list, and
EVERY view except the result renders that same list in the same order — the draft included, since
it is the published view with everything in Draft. So `picking = !done`: only `done` clears it, in
both `tableHTML` and `wireSelAll`, because only there do the indices stop lining up.
**This regressed once**: while the draft briefly showed only the 4 selected rows I cleared the
selection there too, and left that in after the draft went back to showing all 6 ("why is selection
not retained?"). Tie the rule to WHETHER THE ROW LIST CHANGED, not to "the conversation started".
- **An INTENT card comes before the plan** (user, 2026-09-15). Final copy, after a From/To on the
  link count was rejected ("what does the count even do?") and several suggested rewrites were
  turned down: **"4 experiences will be unlinked from ty25_Catchall_PLU."** + the staging rule in
  the PURPLE INFO NOTE: **"ty25_Catchall_PLU is published, so I'll create a draft and make the
  changes there. The changes go live when you publish the draft."** (the user supplied this
  structure; the closing clause was picked from three options) + **"If this looks okay, I'll proceed to create a
  plan for you?"** with a **Proceed** pill (the user wrote that line themselves). Then `UL_PLAYBACK`
  is the plan on its own message.
  Pills in order: `ulApproveIntent` → `ulApprovePlan` → `ulApprove`.
- **After approval the canvas is the STAGED version, so the status reads "Draft stage"** (user,
  2026-09-15) and IXP STATE flips to DRAFT. `staged = pub && (ul==='working'||ul==='done')`; the
  live experiment is untouched, but the object on screen is a staged draft. `badge()` had to learn
  `Draft stage` or it fell through to neutral grey.
- **The attribute card is TWO per row** (user, 2026-09-15), i.e. the shared `.meta` grid. A 5-column
  `.meta--exp` override squeezed every value and was deleted. Six pairs: IXP state, Start date,
  End date, Hypothesis, **No. of treatments (3)**, Holdout treatment.
- **HEADER ORDER IS TITLE > STATUS > ID > VERSION PICKER** (user, 2026-09-15), and there is **NO
  trailing divider after the last item** — a divider separates things, so one after the last
  separates nothing.
- **AN EXPERIMENT HAS EXACTLY TWO STATES: Published and Draft** (user, 2026-09-15). So the control
  is a STATE SWITCH, not a version history — **no v1/v2 anywhere**, not in the picker label and not
  in the menu rows. Both carry the status badge alone.
- **The picker only renders once BOTH states exist** (i.e. `staged`). Before that it would show the
  same badge the status chip already shows, and its divider left a separator with nothing after it
  ("separator at the end???????"). Its divider is emitted with it, never on its own.
- **NO TRAILING DIVIDER**, ever — a divider separates items, so one after the last separates
  nothing. Published header ends on the ID.
- The picker is **inert until a second version exists** (`.verselect--off`), so it never appears out
  of nowhere. **Dim only the CHEVRON** (`.verselect--off .ico-box{opacity:.35}`) — fading the whole
  control took the status badge to 45% opacity and it read as blank space beside a divider.
- **The menu opens ONLY on click** (user, 2026-09-15), never by default on any state.
  `state.verOpen` is a plain boolean; an earlier auto-open at `stagereview` was wrong. Once the draft is created the chip gains a chevron
  and lists BOTH versions (Draft active + Published), and **the menu opens automatically** at
  `stagereview` so the user sees the two side by side. `state.verOpen` is TRI-STATE: undefined =
  use the state's default, true/false = the user's own toggle.
- **NO Version column on the experiences table** (user, 2026-09-15: "we don't show version there").
  The version lives on the experiment header only.
- The sim items open `xpDetail` DIRECTLY (the flow starts "find experiment", not an experience
  search), so they `return` before the shared `go('home',...)` line.
- The playback's task table only appears when published; unpublished says "isn't published, so the
  change applies directly" and has no staging step.
- Unlinked rows are REMOVED from the table at `done` — that is what unlink means.
- The object card names the **staged experiment** when published, the experiment itself when not.

**`runPCStep` HARDCODED `pcSearch`.** Inherited from the clone build, it rendered every loader tick
and the landing `go()` into `pcSearch`, so a new scene's states advanced while the panel still
showed the CLONE conversation. It now takes an optional 6th arg `scene='pcSearch'`; any new flow
outside pcSearch must pass its own. **Check this first whenever a new scene's conversation does not
appear.**

**TIMERS THROTTLE WHEN THE BROWSER PANE IS HIDDEN** — a 78-char prompt at `TYPE_MS = 18` should
type in ~1.4s but crawled at ~0.7 chars/sec, which looked exactly like the typing restarting on
every render. It is not a bug (see [[preview-tab-throttling]]). To verify a flow past an auto-typed
ask, render the resting state directly (`render(scene,{typed:true})`) or call `trigger.*()` instead
of waiting for the animation and clicking.

**A COPIED BUILD INHERITS THE SOURCE BUILD'S STEP NAV — CUT IT.** Two things leak when you copy a
build (user, 2026-09-15: "if without choosing a scenario i go left right, it shows me clone even
though this is link unlink flow"):
1. **`let scenario = 'pc'`** — the source's default. Set it to THIS build's first scenario, or the
   arrows walk the old flow before the user picks anything.
2. **`FLOW_STEPS()`'s fallthrough** (`return scenario==='cl2' ? STEPS_CL2 : STEPS_PC`) — replace the
   whole body with this build's lists only; never leave a clone/source default at the end.
Also give each intake its own step list: the SPECIFIC intake has **no `xpSearch` step**, so
`STEPS_UL(pub)` emits it conditionally and `stepIndex` shifts the detail steps by `base`
(1 on the draft path, 2 on the search path). Step counts: 9 published, 6 draft.

**ARROW-KEY STEP NAV NEEDS BOTH HALVES.** `stepIndex()` returns **-1 for any scene that is not
`pcSearch`**, so a new build's scenes silently have no arrow navigation until you add them there AS
WELL AS adding a `STEPS_*` list to `FLOW_STEPS()`. `STEPS_UL(pub)` walks
home → xpSearch → xpDetail → selection → intent → playback → (stagereview, published only) → done
(8 steps published, 7 draft); `stepIndex` maps `xpSearch`→1 and resolves the executing states
(`reading→intent`, `planning→playback`, `staging→stagereview`, `working→done`) onto their resting
step, with a different ORDER array per path. Verified both arrows in both variants.

`wireSelAll(main, sel, frozen, apply)` takes FOUR args — no row-count 5th. Hand it an **empty set**
once the result is showing, or the header checkbox renders checked over unchecked rows.

**`tableHTML`'s `select:false` path renders a BARE DISABLED checkbox that drops the checked state.**
Passing `select:!state.ul` to freeze the table made the user's selection visibly clear the moment
the conversation started ("why is my selection not retained?"). Freeze in `wire()` with a `frozen`
guard instead and keep `select:true`.

Preview: served from the repo root, e.g. `http://localhost:8099/link-unlink-experiments-sep11/`.
**Bump `?v=N` in index.html after every app.js edit** — read the live value out of index.html, never
trust a number written down (see [[clone-ipd-experiences-sep03]]).

**FLOW 3 — MOVE EXPERIENCES BETWEEN EXPERIMENTS** (built 2026-09-15; **made MULTI-SELECT
2026-09-21**), sim `mvExp`, scene `scenes.mvExp`, state key `mv`.

**MULTI-SELECT REWRITE (user, 2026-09-21): "only 1 thing is changing, the NUMBER of experiences
we're moving. rest of it remains the same."** The flow used to open ONE experience by ID; now it
starts from the EXPERIMENT and its linked-experience list, and the user CHECKS the rows to move.
Every beat after the ask is structurally identical — only counts and plurals changed.
- Prompt is now `MV_FIND_PROMPT` = **"Find all experiences linked to 716920 experiment."** (the
  word "experiment" is explicit, user 2026-09-21) → SEARCH-shaped intake ("Finding the experiment"
  / "Compiling the linked experiences"). The ask is `MV_PROMPT` = "Unlink these from X and link
  them to Y."
- **THE PROJECT IS NAMED FROM THE PROMPT — I broke that rule and the user caught it**
  (2026-09-21: "project name is not making sense based on the prompt"). A first pass set
  `MV_PROJECT = XP_NAME`, so the ask said "716920" and the project came back
  "ty25_Catchall_PLU" — a name the user never typed. The prompt's only identifier is the ID, so
  `MV_PROJECT = \`Experiences linked to ${XP_ID}\`` and the crumb is
  `Home / Experiences linked to 716920`. The experiment's real NAME first appears where it is
  earned, in the AI's next message ("ty25_Catchall_PLU has 6 linked experiences"). Same rule as
  `XP_PROJECT` ("Find the ty25 Catchall experiments." → "ty25 Catchall experiments").
- **THE SELECTION WAS DECORATIVE — THE FLOW IGNORED IT** (user, 2026-09-21: "i made selections and
  typed my prompt for those selections. where is that in my conversation?"). `MV_PICK` was the
  hardcoded constant `[3,4,5]` and EVERY count, name, treatment split and row diff read from it,
  so checking four rows still produced "3 experiences will move". `MV_PICK` is now a FUNCTION
  reading `current.state.selected` (sorted, falling back to `MV_PICK_DEFAULT` for step-nav and
  pre-selection renders), and **`MV_N` had to become a function too** — as a `const` it captured
  the default at load time. Safe because `render`/`go` both set `current` BEFORE calling the scene.
- **THE SELECTION-SCOPED ASK NEEDS BOTH MARKERS, and I shipped neither.** The build already has
  the convention (`selThread(n)` at app.js, used by the unlink and clone flows; `aiPanel`'s
  `chip`): **(1)** `selThread(MV_N()) + userBubble(MV_PROMPT)` puts the **"↳ Selected n
  experiences"** divider above the ask in the transcript — without it the ask says "these" and
  nothing records WHAT it applied to; **(2)** `chip:` shows "n experiences selected" in the
  composer while the ask is being typed, cleared once sent (`!c`) since the divider then carries
  the context. Check both whenever a new flow's ask acts on checked rows.
- **DERIVE THE TYPED ANSWER, DON'T HARDCODE ITS PROSE.** `MV_TMT_PROMPT` was the fixed string
  "…and the DIWM one to C_SSG_Control", which read wrong the moment a selection held two DIWM
  experiences. It is now `MV_TMT_PROMPT_FN()`, grouping the actual picks by treatment and by
  recipe kind (DIY / FS / DIWM) with correct singular/plural, and emitting no fake split when
  everything lands on one treatment.
- **X STAYS AT 6 ROWS** (user chose this over growing `XP_ROWS` to 10 — keeps the unlink flow's
  table identical). `MV_PICK = [3,4,5]` — the three `DRY_test_*_recipe_C` rows, a coherent group
  sharing a treatment, which is what a bulk select looks like. `MV_N`=3.
- **THE LANDING CANVAS IS A SEARCH RESULTS LIST, NOT AN EXPERIMENT PAGE** (user, 2026-09-21: "if
  my prompt is search experiences, should I be shown the experiment?"). A first pass landed on X's
  full experiment page (header, meta card, version picker) with the experiences as a table inside
  it — the user asked for EXPERIENCES and was shown an EXPERIMENT. The diagram agrees: flow 3
  starts **"find experiences"** with *"linked to an experiment?"* as an attribute check, so the
  experiment is never the thing you land on.
  Canvas is now `xpSearch`'s shape: `<h2 class="page-h">{MV_PROJECT}</h2>` + `xpToolbar()` +
  the table. **No `expHead`, no `xpMeta`, no version picker** (`mvHead2` was deleted as dead code).
  **`MV_LIST_COLS` adds an EXPERIMENT column** that `XP_COLS` has not — on a results list nothing
  else says which experiment each experience is linked to, and that is exactly the value the move
  changes. `MV_LIST()` = `XP_ROWS` each tagged with `xp:XP_NAME`.
  The AI's reply is framed as a SEARCH too: "Searched experiences" / "I found 6 experiences linked
  to ty25_Catchall_PLU" + object card = the **project**, not the experiment. Loader ticks are
  Reading your request / Searching experiences / Compiling results.
  **The per-task canvases KEEP the experiment page** — once the plan starts the AI really is
  acting on experiments, so that is correct there; only the landing changed.
  The ask **waits for a selection** before auto-typing (it says "these"), and `mvSend` no-ops on
  an empty selection, same guard as `ulSend`.
- **TREATMENTS ARE SPLIT 2 + 1** (user: "give same for 2, and different for 1. this will get
  adjusted on the prompt the user types"). `MV_TMT` = B_SSG_HighIntent (DIY + FS), `MV_TMT2` =
  C_SSG_Control (DIWM); `MV_TMT_OF()` maps row → treatment, and the user's typed answer
  `MV_TMT_PROMPT` names the split. The confirmation card is a **STACKED list** (`.tmtAssign`,
  name over treatment) — a two-column `.planTable` row is `56px 184px` and crushed the experience
  names into unreadable overlap; the panel has ~200px of usable text width.
- `MV_ROWS()` = the moved rows as they appear on Y (each keeping its own eid so drill-downs open
  the right experience, each carrying its assigned treatment); `MV_KEPT()` = the rows left on X.
  These replaced every single-`MV_ROW` splice. Counts: X 6→3, Y 2→5, continuation 5→6.
- Step nav gained a SELECTION step: `['mvExp',{}], ['mvExp',{selected:MV_PICK}]`, and `stepIndex`
  returns 1/2 for the pre-conversation states and `i+3` after. 13 steps.
- **LONG NAMES OVERFLOWED THE CONVERSATION PANEL (fixed 2026-09-21, user spotted it on the
  published Pages site).** Experience/experiment names are long and contain NO SPACES, and
  underscores are not break opportunities, so with the default `overflow-wrap:normal` the browser
  treats `ty25_OICMS_716920_DRY_test_DIY_reco_recipe_C` as ONE unbreakable word and paints it
  straight out over the bubble edge (measured: 371px of text in a 358px box). Fix is in
  index.html, **`overflow-wrap:anywhere` on `.chatBubble`, `.bubble-q`, `.summaryCard__intro`,
  `.summaryCard__q`** and on **`.ft__v`** (the From/To value cell, which has `overflow:hidden` so
  it silently CLIPPED the name instead of spilling).
  **Use `anywhere`, NOT `word-break:break-all`** — break-all chops ordinary prose mid-word too.
  **Do NOT "fix" `.objectCard__name` or `.chatStatus>span:first-child`**: both truncate with
  `overflow:hidden`+ellipsis+nowrap ON PURPOSE, so an overflow detector flags them as false
  positives. Same root cause as the `.tmtAssign__exp` wrap; whenever a new panel container renders
  a user-supplied name, it needs this.
- **FROZEN-CHECKBOX BUG, fixed in BOTH this flow and the unlink flow (2026-09-21).** These are
  native `<input type=checkbox>`, so by the time the handler runs the box has ALREADY toggled
  itself; the old `if(frozen) return;` left it visually unchecked while state still held it
  ("my selection cleared itself"). Restore it instead: `if(frozen){ cb.checked = sel.has(i);
  return; }`. This was pre-existing in `ulPub`, not introduced by the rewrite.

Original single-experience build follows: `reading → intent → planning → plan → working → done`.
The diagram's "unlink from X and link another" branch where the experience IS linked and **both
experiments are published**.
- **ONE experience, not a multi-select** (user's call). The SPECIFIC intake applies: prompt names
  the experience (`MV_FIND_PROMPT`), `runIntakeMv()` opens it directly, no results table. Project =
  the experience name, so the crumb is `Home / <experience>`.
- The canvas is `expDrillCanvas(MV_CRUMB(), MV_ROW, state, {noBack, status, ver})` — that helper
  only accepts `status`/`ver`/`eid`/`noBack`; `experiment` and `busy` are NOT options (I invented
  them first). At `done` the experience is **Draft / v4**.
- `MV_INTENT` is a From/To on the EXPERIMENT (X → Y) + the info note, because both being published
  is what earns the plan. `MV_PLAN` is the diagram's five tasks: draft X, draft Y, unlink from X,
  link to Y, **"Review experience"** (not "review both experiments" — the experience is the object
  being moved).
- **EVERY TASK RESTS ON ITS OWN CANVAS** (user, 2026-09-15: "how can we do 5 tasks when you show me
  nothing on the canvas for each?"). States `w{i}` executing → `t{i}` resting with an Approve, same
  as the clone build's per-task reviews. The canvas follows the task:
  t0 → X's list (6 rows) · t1 → Y's list (2) · t2 → X minus it (5) · t3 → Y with it (3) ·
  t4/done → the experience itself. `MV_TO_ROWS` is Y's own linked experiences so tasks 2 and 4 have
  a real list to show. A first pass ticked the plan through with nothing to look at.
- **The experience screen's TABS work** (user: "these tabs should work?!") — `[data-exptab]`
  handlers plus `wireCreativeToggle`. The **Experiment tab reflects the move**: `ty25_Catchall_PLU`
  before, `ty25_Catchall_SSG` after, via a new `opts.experiment` on `expDrillCanvas`.
  **There are TWO `t==='experiment'` branches in app.js** (~1942 and ~3438) — `expDrillCanvas` uses
  the SECOND one; I patched the wrong one first and the tab kept showing the placeholder.
- **The prompt is the experience ID**, not the full name — "Show me experience
  51738ef0-9505-11f1-86ec-a3e651c6bc02." (the diagram's "include experience ID in prompt"). The
  PROJECT is still named for the resolved experience; a GUID in the crumb would be meaningless.
- **Both fetch transcripts end with a message + object card** ("Here's the experience." + card).
  A bare disclosure left the turn visibly empty (user: "where is my object?").
- Ends with both drafts awaiting publish → Campaign Manager link.

**FLOW 1 — LINK AN EXPERIENCE TO AN EXPERIMENT** (built 2026-09-15), state key `lk` on
`scenes.xpDetail`. **TWO scenarios, MIRRORING UNLINK EXACTLY but ADDING instead of subtracting**
(user, 2026-09-15: "same pattern as unlink but instead of subtracting, we add"):
- **`lkExp` — published experiment**: search intake → `reading → intent → planning → plan →
  w0/t0 → w1/t1 → done → publishing → published`. The intent leads to a **2-TASK PLAN** (user's
  call): **1 Create a draft of <experiment>, 2 Link the experience to <experiment>**. Each task
  rests on its own canvas — t0 the draft (6 rows, all Draft), t1 the draft **plus the new
  experience (7 rows)**. 9 steps.
- **`lkDraft` — draft experiment**: specific intake (no `xpSearch` step) → `reading → intent →
  linking → done → publishing → published`. **NO plan** — nothing to stage, so the intent card IS
  the confirmation (`lkApprove`, not `lkApproveIntent`). 5 steps.
**THE STICKY TASK TRACKER — I forgot it on every flow here** (user, 2026-09-15: "why do you always
forget this interaction in the conversation at the top"). It is `aiPanel`'s `step` / `stepLoading`,
so a flow works fine without it and the omission is invisible until someone looks:
`aiPanel({body, step:`${i+1}.  ${TASKS[i]}`, stepLoading:isExecuting})`. Now on the link, unlink and
move flows, on every per-task state AND every canvas path that state can render. Not on the plan
card — no task has started yet. Now also a rule in the `ms-prototype-intake` skill.

**PUBLISHING REPLACES WHAT IS LIVE — say so before the pill** (user, 2026-09-15; the diagram's
"staged experiment overrides live experiment"). A purple `.infoNote` sits above every Publish pill:
**"Publishing this draft will replace the version that's live now."** On the link flow's last task
and the unlink flow's done message (published path only — a draft experiment has no live version to
replace).

**TASK-APPROVAL RULE (user, 2026-09-15) — now in the `ms-prototype-intake` skill.** In a sequence
of tasks: every task rests on its own canvas; **all but the last end in an Approve**; **the LAST
offers the real decision instead (Publish)** and carries the closing guidance. **No separate "done"
message after the last task** — it already reports the outcome, so a done message reports the link
twice (user caught exactly that: "why are we linking twice in the conversation?"). I swung too far
the other way first (removing ALL approvals) before the user restored task 1's.
So `lkExp` ends: t0 (draft created) → **Approve** → t1 (linked, 7 rows) → **Publish** → published.

**NO From/To on the LINK intent card** (user, 2026-09-15: "these experiences were previously not
linked to any experiment"). A From/To means a value is CHANGING from one thing to another — that is
the MOVE flow's pattern. Linking ADDS an experience that had no experiment before, so the card is
just the statement + (published only) the info note. Same reasoning as the unlink flow, which also
carries no From/To.

**`lkBase()` DROPPED `pub`, SO THE DRAFT FLOW SWITCHED EXPERIMENTS MID-LOADER** (user,
2026-09-25: "we're starting at a draft ... it does some publish during loading"). It returned a
bare `{typed:true}`, so the instant Send ran, `lkDraft` forgot it was on the draft and every later
state re-rendered the PUBLISHED experiment — different name (`ty25_Catchall_PLU` not
`…_holdback`), different ID (716920 not 716944), Published chip, IXP RUNNING, Published rows, and
even a different BREADCRUMB. Fixed to mirror `ulBase()`: `if(st.pub===false) b.pub=false;` (plus
`verOpen`). **`ulBase()` had always carried it — the link flow was the odd one out**, so check any
new `*Base()` against it.

`lpub = state.pub!==false` threads through `LK_INTENT`/`LK_DONE`/`LK_PUBLISHED`, the header
(`xpHead(lpub, lpub && drafted && !livePub, …)`), `xpMeta(lpub, livePub)` and `XP_CRUMB(lpub)`.
Original single-scenario note follows.
- **Reuses the experiment screen and the SEARCH intake** (`runIntakeXp`, same as `ulPub`) — the flow
  starts "find experiment", so the generic prompt and the results table apply. The experience
  arrives by **ID in the prompt**: `LK_PROMPT` = "Link 6b23cd52-… to treatment B_Dry_SPNewOffer_Copy1."
- **NO selection**: the ask auto-types as soon as the experiment opens (`state.lk===undefined`),
  unlike the unlink flow which needs checked rows. The shared `draft:` on xpDetail's panel therefore
  branches on `scenario==='lkExp'` — hardcoding `UL_PROMPT` there made the link draft restart
  forever.
- The playback is the **intent card**, not a plan table — the diagram calls it a playback widget and
  our convention for that is the intent card (same as unlink). It carries a From/To of ID → resolved
  name plus the draft info note.
- Ending mirrors the unlink flow: link → **Draft** (7 rows, the new experience appended) → Publish →
  **Published** again. `xpHead(true, linked && !livePub, …)` so the draft chip appears only once the
  link is actually made, not on the intent card.

**ON HOLD (user, 2026-09-15):** the move workflow is parked; **flow 1 "Link experience" is next**,
and ONLY its "user has experience ID → YES" branch.

**Still to build:** flow 1 (link), flow 3's other branches (both-published NO → playback only;
not-linked → link straight to an experiment).

**PUBLISH-FROM-CAMPAIGN-MANAGER PAIR (user, 2026-10-01).** Sim menu now has three
`.simMenu__label` sections (CSS copied from the clone build): "Link and unlink" (4 items), "Move,
publish from Marketing Studio" (`mvExp`, `mvMulti`) and "Move, publish from Campaign Manager"
(`mvExpCM`, `mvMultiCM`). The CM pair REUSES `scenes.mvExp` / `scenes.mvMulti`, same state keys
and same chain (`t1 -> pw1 -> p1 -> t2 ...`); the only switch is `CM_PUB()` (scenario flag) read by
`MV_TASK`/`MX_TASK`/`MV2_DONE` footers and the `PUB_*` helpers next to `MV_INTENT`. Every publish
beat (mid-plan source, final destination, continuation) swaps the Publish pill for: q
"Publishing isn't available in Marketing Studio yet, so this step is yours." + infoNote "Open X
in Campaign Manager and publish its draft there. Publishing will replace the version that's live
now. Once it's published, come back here and select "I've published it", and I'll move on to the
next task / confirm the move." + pill **"I've published it"** (same trigger id as Publish) + "Go to
Campaign Manager". The loader then reads "Checking X" (subs Reading the experiment / Checking its
status / Refreshing the view) and the resting turn's disclosure is "Confirmed X is published"; the
closing turn says "Y is published with the N newly linked experiences" instead of "I've published".
`FLOW_STEPS` and the home/sim routing accept both ids. Later the same day: notice cut to two short
sentences ("Publish the draft of X in Campaign Manager. Once that's done, select "I've published it"
here and I'll move on to the next task."), link ABOVE the pill, "select" not "click"; the LAST
task's publish is OPTIONAL in the CM pair (`CM_OPTIONAL_Q` "If you want to make the change live,
you can publish the draft from Campaign Manager." + link, NO pill, no donePub step); the
continuation (`c2intent/c2done/c2published`) is now in `STEPS_MV`/`stepIndex`. Cache-buster v181.
**PUSHED 2026-10-01** to Create-Change-Order `master` (d82e1ae); no longer local-only. The landing
index.html diff (30 SEP card) is the move-origin-destination build and stays uncommitted.
