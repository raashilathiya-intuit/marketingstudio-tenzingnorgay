---
name: move-origin-destination-sep30
description: "The Sep-30 move-with-context build — two searches in one conversation, the opened experiment as context, object cards as navigation with Figma Default/Hover/Active states; LOCAL ONLY"
metadata: 
  node_type: memory
  type: project
  originSessionId: c1a8cef3-f352-4a45-a8b7-3d74889e43f3
  modified: 2026-09-30T16:48:05.159Z
---

`move-origin-destination-sep30/` in the [[project-create-change-order]] CCO-landing repo, **cloned
from [[link-unlink-experiments-sep11]]** (its move flow, `scenes.mvExp`, state key `mv`, is the
engine). Landing card under a new **30 SEP** section, New badge moved there off 28 SEP.
**LOCAL ONLY — user said "this stays local for now" (2026-09-30). Do not push.**
One sim scenario, `mvCtx`; `let scenario='mvCtx'`; `FLOW_STEPS()` returns only `STEPS_MC()`.

**THE FLOW (user, 2026-09-30):** a BROAD experiments search → results (object `xps`, reuses
`scenes.xpSearch`) → open the DESTINATION `ty25_Catchall_SSG` (`go('mvExp',{md:'xp'})`; lands on
Experiment meta, back arrow, picker inert since no draft) → from its page a SECOND search types
itself, `MC_FIND_PROMPT` "Find the DRY test experiences." → `md:'searching'` loader IN the running
conversation (no boot, no project bubble: the second search adds an OBJECT to the same project,
never a project) → `md:'exps'` results object "DRY test experiences" (`MC_OBJECT`, 3 rows =
`MC_IDX=[3,4,5]` of XP_ROWS, all on PLU, Experiment column) → check rows → ask
**"Link these to the experiment I was looking at."** (BY REFERENCE, user's choice) → the intent
resolves it: "3 experiences will move from ty25_Catchall_PLU to ty25_Catchall_SSG, the experiment
you opened before this search." → the inherited 4-task move plan. Crumb stays
`Home / ty25 Catchall experiments` throughout (`MV_CRUMB = ()=>XP_SEARCH_CRUMB`).
- `state.selected` are LIST indices of the results object; `MV_PICK()` maps them through `MC_IDX`.
  Step literals use `MC_SEL_DEFAULT=[0,1,2]`.
- `MC_HEAD(state)` replaces `MV_FETCH_CONV` as the transcript above the ask: search 1, then
  prompt 2 + loader/results. NOTHING in between.

**OPENING THE DESTINATION LEAVES NO TRACE IN THE TRANSCRIPT** (user, 2026-09-30: "this I dont
think we should hold context", REJECTING my "↳ Opened ty25_Catchall_SSG" navigation line with an
eye, which was built and then removed). Clicking a result is navigation; the transcript records
only what the user asked and what the AI made (the 2026-09-15 rule again). The AI holds the
context itself and shows it when it resolves the ask in the intent card ("… the experiment you
opened before this search"). Consequence: before task 3 creates the SSG draft card there is no
object card for SSG, so it cannot be revisited by eye until then.

**ANY EXPERIMENT OPENED FROM THE RESULTS IS THE DESTINATION, AND THE SECOND SEARCH TYPES ITSELF
THERE** (user, 2026-09-30: "when I open any experiment, automatically have the prompt typed
then"). `state.dest` ∈ `plu|ssg|holdback` (`MC_DEST_KEY` in XP_LIST order, set by the results
row click, carried by `mvBase()` and `runMcSearch`); `MV_TO`, `MV_TO_ID`, `MV_TO_ROWS`,
`MV_TO_TREATMENTS`, `MV_TMT`, `MV_TMT2` are **getters on globalThis** over `MC_DESTS`
(`mcDest()`), so every builder follows the opened experiment; the SSG data lives in
`MC_SSG_ROWS`/`MC_SSG_TREATMENTS`. Only SSG runs the plan. `MV_INTENT` DEAD-ENDS honestly (no
pill): PLU = the origin → "The 3 experiences are already linked to ty25_Catchall_PLU … There's
nothing to change."; the holdback = a draft → "… is a draft. Experiences can only be linked to a
published experiment, so publish it first." (the diagram's prerequisite: IXP must be published).
`MV_TASKS` is still a load-time array naming SSG — fine while SSG is the only path that plans.

**OBJECT CARDS ARE NAVIGATION — THE WHOLE CARD IS THE CONTROL** (user, 2026-09-30: "if I click
on these, I should be able to go to them"; the eye alone was not enough): the click handler is
on `.ai__body [data-obj]`, cursor pointer, eye included. (user, 2026-09-30; Figma MS Theme 1.2.0 "Object/Table Preview"
`8327:12450`, file `qsTBIhxlLaXLmrMEzQJbCS`): `objectCard(ic, name, key)` — a key adds `data-obj`
and makes the eye a `[data-objeye]` button. Keys: `xps` (results 1), `xp` (SSG: the Opened line and
every later SSG card), `exps` (results 2), `x` (PLU cards). The eye does
`render(name,{...state, view:key})`; `scenes.mvExp` wraps `mvExpBase` and, when `state.view` is
set, swaps ONLY the canvas for `mcObjectCanvas(view,state)` — the object at its CURRENT state
(`mcXpPage` mirrors the task rules: X loses rows from task 2 and is live at p1; Y gains rows from
task 4 and is live at donePub). `mvBase()` never carries `view`, so the next flow advance puts
the canvas back on the task. Row drill-down is not wired on a revisited object.
**STATES per Figma:** Default = white, border `#dddee3`; Hover = `#fafafc` tint; Active = border
`#6f5ade` (container-border-ai). `markActiveObject()` marks the LAST card of the object on canvas
(`mcCanvasObj(state)`) with `.is-active`. Before this build every card wore the purple border
permanently — other builds still do.

**BACK ARROW ON EXPERIMENT PAGES REACHED FROM A RESULTS TABLE** (user, 2026-09-30: "the initial
drill down before ... execute my first change, it should have a back button. If I search a specific
experiment then that back is not needed. applies to other experiment flows too"). Done in ALL FOUR
builds (this one, link-unlink, unpublish, update-treatment): `xpHead(..., back)` / `mvHead(...,
staged, back)` render `<span class="back" data-xpback>`, wired generically at the tail of `wire()`
→ `go('xpSearch'|'upSearch',{})`. Shown only while no ask has been sent (`state.ul/lk/tt/up`
undefined) and only on the search intake (`pub`); the draft/specific intakes never show it.
**The treatment build renders its pre-ask page from the `tt` block (keyed on `scenario`, not
`state.tt`)**, so the flag had to go on that block's `xpHead(...)` too (`tpub && !T`), not just the
shared unlink block. CSS `.expHead .back` = `.detail-h .back` with `margin-right:-8px` so the
16px header gap reads as 8px to the title.

Cache-busters after this work: move-origin-destination v173, link-unlink v174, unpublish v11,
update-treatment v45. Preview `http://localhost:8090/move-origin-destination-sep30/`.
