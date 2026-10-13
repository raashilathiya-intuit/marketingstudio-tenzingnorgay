---
name: stop-processing-oct06
description: "Stop processing building block (Oct-06): three stop scenarios, the prompt-prompter recall chip, stop vs error conventions"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9f56b15c-6cbb-4163-b8c4-86a44f64a1c1
  modified: 2026-10-06T15:22:39.865Z
---

**STOP PROCESSING** (created 2026-10-06), the SECOND entry in the Building Blocks tab
(see [[building-blocks-sep24]] for the tab itself). LOCAL ONLY so far, not pushed.
Folder: `CCO-landing/stop-processing-oct06/` (`index.html` + `app.js` + a copy of `figma/`).
Listed in the landing index's `#pane-blocks` ABOVE Comparison screens.

**UNLIKE Comparison screens, THIS BLOCK IS LIVE, NOT STATIC.** Comparison screens is a
reference screen with a blurred panel; this one has real scenes, timers, a `go`/`render`
router and a sim menu, because the thing being shown IS an interaction. Chrome (icons,
rail, `topbar`, `aiPanel`, bubbles, `agentLoader`, `disclosure`, `.planNum`) was copied
from `audit-change-log-oct06` lines 1-250 so screens stay pixel-identical; everything
below that is this block's own.

**THREE SCENARIOS under the "Simulate a scenario" pill** (`scenario` = `s1`/`s2`/`s3`):
- `s1` **Stopped at thinking — C1**: intake runs, the "Doing some tasks" loader is ticking
  through `SP_TASKS` (`cm.offerSchema` / `ixp.splitConfig` / `ixp.splitConfig`, from the
  user's still), user stops it in the CENTRED conversation (no canvas, no panel).
- `s2` **Stopped at thinking — C2**: same intake, plus a plan card; "Looks good" opens the
  canvas and starts task 1, and the stop lands in the TWO-PANE state with the sticky
  tracker on screen.
- `s3` **Stopped at doing**: stops during task 2 (building), when work is half-done — so
  instead of just waiting the agent shows what exists (an object card, "Two of five were
  created") and asks the questions it needs answered.

**THE FLOW NEVER ADVANCES PAST THE RUNNING STATE ON ITS OWN.** Each runner holds on its
last substep so there is always something to stop. The stop is the user's action, always.

**STOPPING DOES THREE THINGS, in every scenario:**
1. the running loader settles, then the stopped message arrives (two beats, below)
2. the stopped prompt becomes an affordance under the composer
3. the composer returns to rest; the stop control disappears and send goes inert

**THE STOP IS A PAUSE, IN TWO BEATS — NOT A SWAP** (user, 2026-10-06: "the stop needs to
feel like a pause, richen the animation"). A single render swapping loader → note read as
the work VANISHING. Now the stop handler renders `phase:'pausing'` first, then the stopped
phase 1100ms later.
- **BEAT 1 (`pausing`) KEEPS THE SAME LOADER ON SCREEN AND SETTLES IT IN PLACE.**
  `agentLoader(label, tasks, bare, paused)` — the GIF spinner is REPLACED by the still
  stop glyph (a GIF cannot be frozen mid-frame, so the swap IS the wind-down, arriving via
  `pauseGlyph`: scale 1.35 + -25° → rest, as if the spin wound down), the label drops its
  shimmer for still text and reads "Stopping", and `.agentTasks--paused` fades the block to
  60% while killing the active substep's shimmer so it HOLDS where it got to. The substeps
  you were watching stay put — that is what a pause looks like.
- **BEAT 2 (at 1100ms)** the note eases in (`noteSettle`, 6px rise) and the settled loader
  collapses away. **The paused loader is NOT kept as history**: the note already says what
  happened, and on resume the same substeps would otherwise appear twice.
- **BEAT 3 (at 2000ms) IS THE RECALL CHIP, ON ITS OWN.** The note and the chip used to
  land in the same render, so one got missed (user, 2026-10-06: "they are both appearing
  together right now and one is likely to get missed out"). `state.recall` gates the chip,
  and `.recallChip` has its own `recallIn` entrance. **The note is WHAT HAPPENED, the chip
  is WHAT YOU CAN DO ABOUT IT** — the chip waits until the note has been read. Verified by
  polling: paused 0-1.1s, note from 1.1s, chip from 2.0s, no overlap.
- In s2/s3 the plan row and the sticky tracker flip to stopped on beat 1, not beat 2
  (`s2stopped`/`s3stopped` include `'pausing'`), so nothing is still spinning while the
  loader has visibly settled.
- All three animations are disabled under `prefers-reduced-motion`.

**THE RECALLED PROMPT BRINGS ITS ATTACHMENT BACK** (user, 2026-10-06: "add the attachment
too"). The stopped prompt arrived with the creative brief attached, so recalling it without
the file would resend a DIFFERENT request from the one that was stopped.
- `spComposer({file})` renders the home composer's own `.fileChip` above the input whenever
  there is a draft; `state.detached` turns it off.
- **THE CHIP'S X DETACHES WITHOUT LOSING THE PROMPT** (`data-spfilex` → `{detached:true}`).
- `resumeFile` (module state, like `resumeText` — same reason: `runSubs` re-renders with
  only `{phase,tasks}`) records whether the file was still attached at send time, and
  `SP_RESENT()` echoes the turn with or without the `.bubbleFile` accordingly. Verified
  both ways: attached → resent bubble carries the file; detached → it does not.

**AN INTERRUPTED TASK = THE INFO-NOTE CONTAINER + AN ATTENTION ICON.** Two separate
decisions, and conflating them was the mistake:
- **CONTAINER** is the flow builds' `.infoNote` (user, 2026-10-06: "use that info style
  messaging container for when the task is interrupted") — a white box inside the grey
  bubble. NOT the red `.msgErr` row: a validation failure is something the agent got
  WRONG, a stop was asked for.
- **ICON IS `Ui/Attention` #d94e00 AT 16px, NOT THE PURPLE INFO DOT** (user, 2026-10-06:
  "see the icon state. this is not info, it is semi warning", supplying Figma node
  **59:65930** in **MS 2.0 - Targeted Offer Oct, file `Z4FvTMCF5XcMZAZNiIDIVL`**).
  `ATTENTION_ICON`, not `INFO_ICON`. **A stop sits BETWEEN information and failure** — it
  wants attention without claiming the agent erred. Reusing the info container does NOT
  mean reusing the info icon; the container carries the layout, the icon carries severity.
- Node spec, verified against the build (all matched): white card, text `#6b6c72`
  (`--color-input-label`), padding 16 (`--space-container-padding-small`), radius 8
  (`--radius-large`), gap 8 (`--space-column-gap-x-small`), 16px inset from the bubble.
- Two earlier passes were wrong: first a bare `.msgErr`-shaped row with an amber dot
  (eyeballed off a still), then the right container with the WRONG (purple info) icon.
  **Fetch the node — the stills do not disambiguate icon semantics.**
- **`.infoNote` carries `margin-top:12px`, which is wrong when the note IS the whole
  message** (s1/s2, nothing precedes it in the bubble) — it pushed the box off the
  bubble's own padding. `.chatBubble > .infoNote:first-child{margin-top:0}`.

**KEY STATES + ARROW-KEY NAVIGATION** (user, 2026-10-06: "enable left right key usage for
key states", "allow me to trigger stop"). `KEY_STATES` is a per-scenario ORDERED LIST of
`[name, renderFn]`; left/right step between them, `S` triggers the stop.
- **A KEY STATE EITHER HOLDS STILL OR PLAYS — whichever is true of the real state.**
  `stepTo` calls `clearTimers()` (a deliberate jump must not be overwritten by a pending
  timer), so a state whose entry is a bare `render()` is FROZEN. That is right for a
  resting state (the plan card, the stopped note) but it silently killed the flow for
  good when arrowing into a RUNNING state — nothing ever restarted the timers (user,
  2026-10-06: "why does triggering left and right keys stop it from working completely on
  its own?"). **A running state's `KEY_STATES` entry must call its RUNNER, not `render`**:
  `runS1Working` / `runS2Planning` / `runS3Planning` / `runS2Task` / `runS3Task` /
  `run*Resume`. The working and planning loops were extracted out of `runS1`/`runS2`/
  `runS3` so the intake and the arrow keys share ONE definition — a frozen copy would
  drift from the timed run.
- **THE FIRST ARROW PRESS CONTINUES FROM WHAT IS ON SCREEN**, not from the start —
  `keyIdxFromCurrent()`.
- **THAT INDEX MUST NOT BE DERIVED BY PARSING THE ENTRY FUNCTIONS.** An earlier version
  read `phase:'…'` out of `fn.toString()` and it got the user stuck (2026-10-07: "left
  right key usage gets me stuck"), for two compounding reasons: a RUNNING state's entry is
  a runner call (`()=>runS2Task()`) with no phase string in it at all, and TWO states share
  the phase `stopped` (with and without the recalled draft) so `findIndex` always returned
  the first — right-arrow jumped BACKWARDS into a loop. Each scenario now declares its
  phase order explicitly in `KEY_PHASES`, with `stopped-draft` as its own key.
  **`pausing`/`closing` map to `stopped`** so arrowing mid-stop continues from the stop it
  is heading to instead of returning -1 and snapping to state 0.
- **EVERY EARLY PHASE MUST `return` IN THE SCENE — THIS WAS THE REAL CAUSE OF "the whole
  conversation shows first".** In s2 and s3, `msg-user`/`msg-created` had no return of
  their own, so they fell THROUGH the `planning`/`plan` checks into the C2/stopped branches
  and rendered the COMPLETE transcript. Arrowing back therefore showed the end of the flow
  at the earliest indices and project-creation afterwards (user, 2026-10-07: "why does
  complete conversation show before we see project creation and other loader before
  plan???"). s1 was immune only because it ends with a catch-all `return spC1(b, …)`.
  **Verify a state list by what each index RENDERS (count `.chatMsgGroup`), never by the
  phase name** — the names were right the whole time while the output was wrong, which is
  why several "index" fixes before this one chased the wrong layer.
- **A LOADER THAT ONLY INTRODUCES THE NEXT STATE IS NOT A KEY STATE — THIS WAS THE BUG, AND
  IT TOOK FOUR WRONG FIXES.** `planning` exists solely to arrive at `plan`, so listing both
  made them ADJACENT stops that each rendered the other: left from `plan` landed on
  `planning`, whose runner returned the screen to `plan`, and the next left did it again —
  a 3↔4 loop the user hit repeatedly ("this appears after the entire conversation again").
  **`KEY_PHASES`/`KEY_STATES` now list only SETTLED states**; landing on one still plays its
  own intro animation, so nothing is lost. `PHASE_ALIAS` maps `planning→plan`,
  `pausing`/`closing`→`stopped` so arrowing mid-animation resolves to the state being
  arrived at.
  **The four failed attempts, all band-aids on the wrong model:** (1) parse `phase:` out of
  `fn.toString()`; (2) suppress a stepped-to loader's `done` (`!stepping`) — froze the flow,
  which the user rejected outright; (3) `advanceKeyIdx()` to follow a self-advancing runner
  — it just moved the loop; (4) a `steppedBack` flag to stop a backwards step being dragged
  forward — moved the loop again. **Lesson: when a fix for an index bug needs another flag,
  the STATE LIST is wrong, not the bookkeeping.**
- **ARROWS NAVIGATE, THEY NEVER FREEZE THE FLOW.** The desync that made stepping feel
  "stuck" (user's screenshots: the plan bouncing back to "Creating a plan") is real: when
  you arrow onto a transient loader, `runSubs`'s `done` fires seconds later and advances
  the screen by itself, so the cached `keyIdx` still points at the loader while the screen
  shows the state after it — the next arrow then "advances" to where you already are.
  **I first fixed this by suppressing that `done` for stepped-to loaders (`!stepping`),
  which cured the bounce by BLOCKING the flow — worse, and the user said so immediately:
  "arrow key usage still doesn't automatically start moving the flow. it should not block
  me."** The correct fix keeps the flow running and moves the index with it:
  `runSubs` wraps its `done` as `()=>{ advanceKeyIdx(); done(); }`, and `advanceKeyIdx()`
  bumps `keyIdx` by one when a tracked step is in play. `go()` also clears `keyIdx` (unless
  stepping) so the cached index can never point at a state the screen has since left.
  **Lesson: when navigation and an autoplaying flow disagree, reconcile the bookkeeping —
  do not stop the flow.**
- **A SNAPSHOT HELPER THAT CANNOT TELL TWO STATES APART WILL FAKE A "STUCK" BUG.** An
  earlier `__snap()` returned `'stopped'` for stopped / stopped+draft / resumed alike
  (all three render `.infoNote`), so three working arrow presses looked identical and I
  nearly "fixed" a non-bug. Distinguish by `.recallChip`, a filled `#spInput`, and the
  presence of an `.agentTasks__label` before trusting a flat reading.
- `S` reuses the composer's own stop control (`$('[data-spstop]').click()`), so there is
  one stop implementation, and it only fires when the agent is actually running.
- Both handlers bail on `e.target.isContentEditable` and on `current.name==='home'`, so
  they never steal a key while the user is typing a prompt.
- **NO STATE-NAME LABEL ON SCREEN.** A first pass added a `.stateHint` toast naming the
  state you stepped to ("4/7 C1 — working (stoppable)"); removed (user, 2026-10-06: "why
  have you added this extra info?"). The ask was arrow navigation, not a readout of where
  you are — `KEY_STATES` entries are now bare render functions, no labels. **Do not
  re-add any on-screen state/step/debug readout to these prototypes unless asked.**

**THE "PROMPT PROMPTER" (`.recallChip`)** — the prompt that was stopped, kept as a
one-click chip under the composer (user's words: "it will also turn the prompt that I
stopped it for into an affordance at the bottom").
- **IT IS CONSUMED.** Once the prompt is in the box the chip goes away (callers pass
  `recall: state.draft ? '' : SP_PROMPT`) — otherwise the same sentence reads twice, once
  as a chip and once as the thing it just filled in. Confirmed against the user's second
  still, where the chip is absent while the box is full.
- **TAB ENTERS IT** (user: "if I trigger tab then that just gets entered as a prompt") —
  a global keydown, gated on a chip being present AND the box still being empty, so Tab
  never overwrites real typing.
- Clicking it fills the box but does NOT send: the user may want to edit first.
- **THE CHIP MUST BE INSIDE THE COMPOSER'S OWN WRAPPER (`.composerStack`), NOT A SIBLING.**
  Returned loose it became another child of `.centeredChat`, which has `row-gap:24px`, so
  the chip sat 32px below the box. The still shows ~8px, and the chip's left edge aligns
  exactly with the composer's (measured 1363 vs 1364 in the still; 554/554 in the build).

**A STOPPED TASK IS NOT A DONE TASK.** Both the sticky tracker (`stepStopped` on
`aiPanel` → `.chk--stopped`) and the recorded plan row (`.planNum--stopped`) show the stop
glyph: not the green check (it did not finish) and not the plain number (that reads as
"not started"). `S2_PLAN(done, running, stopped, recorded)` carries all three, and the
recorded plan tracks the SAME truth as the tracker — a plan saying "not started" above a
message saying "interrupted" contradicts itself.

**PLAN ROWS USE THE BUILD'S OWN `.planNum`, AND THE `56px 1fr` GRID.** A first pass invented
a two-column Task / What-happens table with `.chk` markers — wrong twice: `.planNum` already
exists (dashed circle + number → green check → spinner), and `.planTable__row .chk{background:
var(--pos-text)}` silently overrode `.chk--idle` so every unrun row wore a green check.

**`resumeText` IS MODULE STATE, NOT SCENE STATE.** `runSubs` re-renders on every substep
tick passing only `{phase, tasks}`, so an answer carried in scene state is lost on the
first tick — the user's typed answer was being replaced by the original prompt in the
transcript. It lives at module scope and resets in `runIntake`.

The C2 canvas is deliberately a permanent `skeletonCanvas()`: this block is about the
conversation, so the canvas only has to hold the proportions.


**s2 IS A CHANGE ORDER THAT COLLAPSES C2 → C1 ON STOP** (user, 2026-10-07, Figma frame
"Stopped at thinking - C2", node ~59:65910 family). This REPLACED the earlier create-campaign
s2. Three differences from s1/s3:
- **CONTENT**: a change order, not a create. Prompt `S2_PROMPT` ("I want to execute a change
  order for the ELM9071 campaign"), NO file attachment (it is typed), tasks
  `S2_TASKS` = Change the billing offer IDs / Change IPD content and images / Update the
  placements. Tasks 1 and 2 are already done and recorded as turns with object cards and
  `Approved` / `Proceed` replies (`S2_TASK1`/`S2_TASK2`); task 3 is the one that runs.
- **THE C2 CANVAS IS A REAL PROGRESS SCREEN**, `settingUpCanvas()`: "Setting things up" +
  subtext, a DETERMINATE bar (fills by completed substeps, the running one counting half so
  it advances when a step STARTS), then the same substeps the panel's loader is ticking as
  radio rows. One list (`S2_SUBS`) feeds both, so canvas and conversation never disagree.
  NOT the skeleton table — s3 still uses that.
- **THE CRUMB CARRIES "Change order - " ONLY WHILE THE CANVAS IS OPEN** (`S2_CRUMB_C2` vs
  `S2_CRUMB_C1`): collapsing back to C1 drops it, because no change order is open any more.
- **STOPPING COLLAPSES THE TWO-PANE BACK TO C1.** The canvas and panel leave, the
  conversation becomes the full-width centred column carrying its whole history plus the
  note. s1/s3 do NOT do this — they never opened a canvas. `STOP_TO`/the stop handler
  branches on `name==='s2'`.

**THE COLLAPSE ANIMATES ONLY `transform`/`opacity`, AND NEVER `scaleX` ON TEXT** (user,
2026-10-07: "animation is not smooth"). Two failed versions: one animated `flex-basis`,
`flex-grow`, `max-width` and `margin` — each forces a layout pass per frame and several do
not interpolate at all, so it juddered; the next scaled the conversation panel and
counter-scaled its children, which distorts every glyph DURING the tween. Final shape: the
CANVAS is the only thing that moves (slides left and fades), the conversation merely sheds
its panel identity in place (card edges and C2-only chrome fade), and C1 cross-fades in
over it. Nothing stretches, nothing reflows.

(superseded) THE COLLAPSE IS THE CANVAS SHRINKING AND THE CONVERSATION EXPANDING INTO IT (user,
2026-10-07: "canvas collapses to the left and conversation expands"). A first version slid
BOTH panes off to the left and faded a separate C1 column in — that reads as two things
LEAVING and a third ARRIVING, three objects where there are only two. The real movement is
one object shrinking to nothing while the other takes its room: `canvasCollapse` animates
the canvas's `flex-basis` to 0 (with `transform-origin:left` + `overflow:hidden`, so it
squeezes leftward) while `convoExpand` takes the panel from `flex:0 0 var(--ai-w)` to
`flex:1 1 100%`. **They are flex siblings, so one width drives the other — a single
movement, not two.** 500ms, and the note beat moved to 1620ms so the animation finishes
before C1 takes over; `.content--arriving` then only fades the last of the way in (.3s
opacity) rather than re-animating from nothing.
**VERIFYING THIS NEEDS A SINGLE MID-FLIGHT PROBE, NOT FRAME SAMPLING** — a `setTimeout` at
~1250ms caught canvas=628/convo=723 (from 988/360), which proves the flex animation
interpolates. An interval or rAF sampler returns a FLAT 988/360 or zero frames, because the
hidden preview pane throttles animations ([[preview-tab-throttling]]) and `render()`
replaces the DOM each tick, cancelling any rAF loop. Do not read a flat sample as "the
animation is not running".

**THE COLLAPSE IS ANIMATED, NOT A CUT** (user, 2026-10-07: "show the transition from c2 to
c1 in a smooth animation, not abrupt"). s2's stop gains a `closing` beat between pausing and
stopped, so the sequence is: pausing (0) → closing (1100) → stopped+note (1520) → chip
(2420). `.content--closing`/`.ai--closing` are the MIRROR of the build's existing
`canvasSlideIn`/`convoSlideRight` opening animation (canvas leaves left, conversation slides
back and fades), then `.content--arriving .centeredChat` settles the C1 column in. Verified
by polling: each beat lands separately, no overlap.

**THE COMPOSER IS PINNED, OUTSIDE `.scroll`** (user, 2026-10-07: "prompt box should not
scroll, right?" — with a screenshot of it scrolled off). `spC1` now renders
`.scroll` (conversation only) then a sibling `.composerDock` in the same 588 column, opaque
so a long transcript cannot show through behind it. `.content` was already a flex column, so
the dock just sits below.

**THE PLAN TABLE IS TWO COLUMNS, AND BOTH CELLS ARE ONE TASK: the marker under "Task",
the task NAME under "What happens".** `56px 1fr`, header `<span>Task</span><span>What
happens</span>`. **IT IS NOT A TASK + DESCRIPTION TABLE.**
**I BROKE THIS BY REASONING FROM A COPIED BUILD INSTEAD OF THE SKILL I HAD LOADED** (user,
2026-10-07: "you had the task thing known in your skills. why did you mess it up?"). Asked
for the "task, what happens header", I looked at `audit-change-log-oct06`'s markup, saw a
two-cell header over a two-column grid, concluded the column was MISSING, added a third
column, and invented per-row copy ("The IDs on the billing offers are updated") that exists
nowhere in the design — in BOTH s2 and s3. `ms-prototype-intake` was loaded the whole time
and states the convention.
**STANDING RULE: when changing a structure a loaded skill governs, RE-READ THE SKILL FIRST.
A build you are copying from is not the source of truth, and markup that looks like a bug
is usually a convention you have not checked.**
**WHAT IS FIXED IS THE STRUCTURE, NOT THE TASKS** (user, 2026-10-07: "always not
necessarily we have the same tasks, you do know that, right?"). The header, the `56px 1fr`
grid, the marker-then-name cells and the `.planNum` states are the convention and do not
vary. The task LIST is per-flow — whatever that flow actually does. s2 carries the five
from its change-order frame (Change billing offer IDs / Change IPD content to reflect new
pricing / Change images to reflect new pricing / Review change summary / Update the
campaign, `RUNNING = 2` = task 3 of 5); s3 carries its own three create-campaign tasks.
**Do not copy one flow's task list into another, and do not author task copy — ask.**

(superseded) A PLAN TASK IS A PAIR `[task, whatHappens]`, AND THE TABLE HAS BOTH COLUMNS (user,
2026-10-07, with the plan card: "task, what happens header"). The grid is
`56px minmax(0,1fr) minmax(0,1.2fr)` — marker, Task, What happens — and `.planTable__what`
renders the second column quieter (14px, secondary) since it is supporting detail.
**THE SOURCE BUILD HAS THIS BUG TOO**: `audit-change-log-oct06` renders a "What happens"
header over a 2-column `56px 1fr` grid, so the label sits in the MARKER column and the
column itself never existed. Anything copied from there needs the third column added, not
just the header text. Every read of a task name is `TASKS[i][0]`.

**s3 MUST NOT INHERIT s2's TASK NAMES.** They share `S2_PLAN`/`s2PlanRows`, and when s2
became a change order s3's plan and sticky tracker silently started reading "Change IPD
content and images". `S3_TASKS` + an `intro` argument now flow through the shared renderer.
**Any future edit to `S2_TASKS` must be checked against s3's tracker and plan card.**

**PER-SCENARIO PROMPT VIA `PROMPT()`.** `SP_PROMPT` (s1/s3, with the brief attached) vs
`S2_PROMPT` (s2, typed, no file). Everything that shows the user's words — the recall chip,
the resent bubble, the home autotype, `SP_USER`, `SP_CREATED`'s disclosure wording — goes
through it. `resumeFile`/the composer file chip are suppressed for s2 since nothing was
attached.

**PENDING — HEADER WORK NOT STARTED** (user, 2026-10-07). An AI button has been added to the
header in Figma, and C1 should also carry the conversation / history / approvals icons
(static, as the C2 canvas header has them today). **Start with the stop-processing flows,
other builds later.** Nodes to fetch:
- header C1: **59:65866**
- header C2 canvas: **59:67997**
- header C2 conversation: **59:83956**
(file `Z4FvTMCF5XcMZAZNiIDIVL`). The Figma MCP plugin disconnected mid-session and the
claude.ai Figma connector is NOT the same thing — its tools do not include
`get_screenshot`/`get_variable_defs`. A session restart is what restores the plugin tools.

**THE C1 COLUMN IS A FIXED 588px, FROM FIGMA — NOT A VIEWPORT FRACTION** (user,
2026-10-06: "check exact Figma specs for padding and all for the prompt box and messages
... right now it's a little random and it does not look like proposed XT", sharing node
**59:65910** = the whole C1 stopped frame, same file `Z4FvTMCF5XcMZAZNiIDIVL`).
`.centeredChat` inherited `width:33.3333%` from the source build, which computed to a
389px column at a 1440 viewport — every bubble inside it was squeezed, which is what read
as "random". Measured off the node and now matching:
- **COLUMN 588**, and the user bubble, agent bubble, stop note and composer ALL share ONE
  RIGHT EDGE. `max-width:652px` = 588 + the 2x32px gutter, so the content is 588 and the
  gutter survives a narrow window.
- user bubble `max-width:90%` (529 of 588; it was 80%). The box hugs its text, so a
  measured width below 528 is correct when the copy wraps shorter.
- composer: **radius 12** (`Radius/L`; was 16), **min-height 115** (was 96),
  **padding 20px** (was a guessed `16px 18px`), `justify-content:space-between` so the
  icon row sits on the bottom edge.
- recall chip gap **12** (`--space-component-gap-large`; was 8).
- bubble padding 16 and radius 12 were already correct.
**Lesson: when a screen "looks random", measure the CONTAINER first — a wrong column width
makes every correct padding inside it look wrong.**


**BUMP `app.js?v=N` IN index.html AFTER EVERY app.js EDIT.** (user, 2026-10-07: "on 8099 i
do not see left right key update" — the server had the new code, the browser did not.) This
build sat on `v=1` for the whole session while app.js changed dozens of times, so every fix
looked missing to the user even though my own verification passed: the browser automation
reloads bypass the cache, the user's browser does not. The convention is inherited from
[[building-blocks-sep24]]. **If the user reports a change as missing, check the
cache-buster BEFORE re-debugging the change.**


**A SHORTHAND DECLARATION BEATS AN ANIMATED LONGHAND — this cost five failed attempts at
the collapse.** `.ai` declares `flex:0 0 var(--ai-w)`, so keyframes on `flex-basis` (or
`width`, which flex then overrides) sat FLAT at 360px while `getAnimations()` cheerfully
reported `convoExpand/running`. The panel therefore jumped 360→853 in one step (user:
"conversation is not expanding smoothly post stop"). Fix: re-declare the SHORTHAND in the
animating rule with an `@property`-typed custom property as its basis
(`flex:0 0 var(--ai-anim-w)`), and animate that property. The from/to widths are measured
in JS at stop time and written to `--ai-anim-from`/`--ai-anim-to`/`--cv-anim-from`, since
the panel is `25vw` and hard-coded px would only be right at one viewport.
**DIAGNOSTIC: an animation that reports `running` while its computed property never changes
means something out-competes it — check for a shorthand on the base rule before rewriting
the keyframes again.**

**I MEASURED A BACKGROUNDED PANE AGAIN.** Several flat width readings during this work were
taken with `document.hidden === true`, which throttles animations — the exact trap
[[preview-tab-throttling]] documents and that this file already warns about. **Check
`document.hidden` BEFORE trusting any animation or layout sample**, and prefer a single
mid-flight probe over interval sampling.

**THE STOP CONTROL IS ALWAYS PRESENT, DISABLED WHEN IDLE** (user, 2026-10-07: "why is stop
icon (tho disabled since in this state nothing's loading) missing?"). It was rendered only
while running, so the composer's control row changed shape between states — three icons
running, two stopped. `.promptBox__stop--off` keeps it in place at 35% opacity,
`pointer-events:none`.


**s3 REBUILT 2026-10-07 FROM THE "Stopped at doing - C2" FRAME.** It is the SAME change
order as s2 (same prompt, same 5 tasks, `isChangeOrder()` covers both), just two tasks
further in — the stop lands in task 3, while placements are being built.
- **THE CANVAS PLAYS TWO BEATS**: `setup` = the "Setting things up" progress screen, then
  `working` = the skeleton table it fills. **The stop belongs to the SECOND** (user: "show
  setting things up loader in canvas then the skeleton loader. if stop is triggered at
  skeleton loader then this is the flow").
- **s3 STAYS IN C2 WHEN STOPPED** — unlike s2, which collapses to C1. The run produced real
  placements, so the canvas has something to show: the 4 completed rows, yellow
  (`tr.rowdone`), QA status Verified, under the partial artifact's name.
- **THE STOP IS ONE AGENT RESPONSE, ONE TIMESTAMP** (user, 2026-10-07: "these 2 should be 1
  combined ai response"). Built first as two staggered bubbles; the reference is a SINGLE
  `.chatBubble` holding, in order: the white `.infoNote` card ("I've stopped partway through
  updating your placements"), "Here's where your placement updates stand:", the Completed 4
  / Pending 6 `.standTbl`, "4 placements are ready for your review", the
  `Placement (partial) - …` object card, "What would you like to do next?", and the two
  stacked pills **Keep / Rollback 4 updated placements** (`.replyStack`). The note's own
  white card is what separates "what happened" from "what now" WITHOUT splitting the turn.
  `S3_SUMMARY(live)` renders the recorded form (chosen pill only) once resumed.
- The sticky tracker reads `<interruption notification>`, not a task name, and **an
  interrupted row carries the AMBER ATTENTION DOT on the left and a PLAY control on the
  right** (user, 2026-10-07, with the reference). It previously showed the stop glyph on
  both sides, which said "stoppable" about a row that had already stopped — resuming is the
  only move left from there. `PLAY_ICON` is a 20px ring + triangle, matching the stop
  glyph's weight so the two swap without the row shifting.
- Placement data is the source build's own `PLACEMENTS` (4 of its 6), so names/caps/offers
  match the frame exactly.

**SEND AND STOP SHARE ONE SLOT — NEVER BOTH** (user, 2026-10-07: "today we're showing send
and stop both. make it either or depending on the state"). While the agent runs that slot
IS stop; idle, it is send (dimmed when the box is empty). An earlier pass rendered both
with one greyed out, which also contradicted an earlier instruction to keep a disabled stop
visible — the either/or supersedes it.

**THE RECALL CHIP LIVES INSIDE THE PROMPT BOX, AT THE TOP** (user, 2026-10-07: "also have
the chip inside the prompt box at the top"), as the first row of `.promptBox__content`
above the input — not as a sibling underneath. `.composerStack` is gone.
**`const chip` must be declared BEFORE the `box` template literal that interpolates it** —
moving it inside without moving its declaration threw "Cannot access 'chip' before
initialization" on every render.

**`badge()` WAS NOT COPIED INTO THIS BUILD** and `s3PlacementTable` needed it; a missing
helper threw on every s3 stopped render and the scene silently never appeared. **When a
state "never arrives", read the console before re-reading the state machine** — I spent a
full pass inspecting `STOP_TO` and the beat timings for what was a ReferenceError.


**THE SKELETON MIRRORS THE SCREEN IT STANDS IN FOR** (user, 2026-10-07: "richer loader
please", with a reference). The first version was a flat 5x6 grid of identical bars, which
reads as "loading something" rather than "loading THIS". `skeletonCanvas()` now draws:
five summary LINES of uneven width above the table (22/92/68/92/14%), then a table with a
**56px leading gutter column** before the five data columns, a header row, and seven body
rows whose cell widths differ PER COLUMN (the name column long, the numeric columns short)
and vary slightly row to row. **Bars of one length look like a progress meter; real content
is uneven.** Rows sit at 55% opacity so the structure reads before the content.

**NO TITLE OVER A SKELETON** (user, 2026-10-07: "no title at this state"). The artifact is
not named until it exists — a heading over placeholder rows claims a result that has not
been produced. `Placement (partial) - …` appears only with the real rows.


**THE NOTE DITHERED BECAUSE THE CONTENT ANIMATED ITS OWN WIDTH** (user, 2026-10-07: "the
message that we immediately show ... it's dithering, it's kind of moving"). `.ai__body` and
`.ai__composer` were animating `max-width:100% → 628px` in step with the expanding panel, so
every bubble RE-WRAPPED on every frame — the text jittered while the box grew. Fixed by
setting that column width ONCE, instantly (no keyframe): the text lays out a single time and
sits still inside a box that widens around it.
**RULE: during a container resize, pin the CONTENT's width immediately and animate only the
container. Text that re-wraps mid-animation always reads as jitter.**

**THE s2 STOP TIMELINE** (user, 2026-10-07: "for a couple of seconds show that it's
stopping, then the left panel collapses and the one on the right expands"; then "give like
4-5 seconds of stopping loading state before moving the panes around" — `closeAt` went
1400 → **4500**):
`0ms` "Stopping" settles and HOLDS → `4500ms` collapse begins (620ms, eased
`cubic-bezier(.4,0,.2,1)`) → `2120ms` the note arrives, AFTER the panes have stopped moving.
**The note must never land mid-collapse** — it re-lays-out while its container is still
changing size, which is the same dither by another route. Verified interpolating:
panel 360 → 721 → 1257 → 1370 across the window.


**s3 TAKES STOCK BEFORE IT SHOWS A RESULT** (user, 2026-10-07: "before we reach here and
after stop is triggered, give a couple of seconds of loading before we show the artifact
and ai response"). It used to snap from the stop straight to the finished artifact, which
implied the agent already knew what it had completed. New `settling` phase between them:
`0ms` "Stopping" → `1200ms` "Checking what completed" (skeleton still on the canvas,
**4000ms** — user set this explicitly) → `5200ms` the real table, title and combined
summary land together.
**A result that required work should be preceded by the work being visible** — the canvas
keeps its skeleton through the beat so the pause reads as taking stock, not as an empty
screen. s1/s2 have nothing to compute and go straight from the pause to the note.
`settling` is in `PHASE_ALIAS` → `stopped` so arrow-stepping through it resolves correctly.


**AN ENTRANCE ANIMATION MUST BE KEYED TO THE RENDER THAT INTRODUCES THE MESSAGE, NEVER TO
THE ELEMENT** (user, 2026-10-07: "why does this blink when we add affordance prompt to
prompt box?"). `.chatBubble > .infoNote:first-child` animated on EVERY render, and the
recall chip arrives via its own `render()` — which rebuilds the panel, re-creates the note
as a new element, and replays `noteSettle` from `opacity:0`. That second play is the blink.
Fixed with `.chatBubble--settling`, a class the scene adds ONLY on the arrival render
(`state.recall===false`, i.e. before the chip beat); `SP_STOPPED(what, arriving)` and
`S3_SUMMARY(live, arriving)` take the flag. Verified: note arrives with 1 running
animation, and the chip render leaves it at 0.
**This applies to every staged message in this build** — the whole panel re-renders on each
beat, so any `from{opacity:0}` on a persistent message will flash once per later beat.


**BOTH HALVES OF THE SCREEN MUST AGREE ABOUT THE STATE** (user, 2026-10-07: "show stopping
in canvas too?"). During s2's pause the panel said "Stopping" while the canvas was still
headed "Setting things up / Doing some tasks" — the two halves of one screen disagreed
about what was happening. `settingUpCanvas(tasks, paused)` now swaps its title, subtext and
list heading to "Stopping" / "Finishing what's in progress", and the progress bar freezes
grey (`.suBar--paused`) instead of continuing to read as advancing progress.
**Whenever a state changes, check EVERY surface that names it** — the canvas, the panel
loader, and the sticky tracker all describe the same thing and drift independently.


**THE COLLAPSE IS STAGGERED, NOT SIMULTANEOUS** (user, 2026-10-07: "first start with left
panel disappearing and right after a moment the conversation expands"). Both panes used to
animate together, which read as one squeeze; separating them makes cause and effect legible
— the room is vacated, THEN taken. Canvas `0-420ms`, conversation `260-720ms` (a 260ms
`animation-delay`), so they overlap slightly rather than leaving a dead gap. `closeDur`
is 720 to cover the full staggered span before the note lands.
**Verify a stagger via computed `animation-delay`/`animation-duration`, not sampled widths**
— the preview pane throttles animation when hidden and every width reads flat.


**s3's CANVAS RESOLVES BEFORE ITS RESPONSE** (user, 2026-10-07: "canvas and conversation
update exactly together. give just a moment's difference to show animation effect?"). The
table and the agent's reply used to land in the SAME render, so the whole screen changed in
one frame and nothing read as movement. New `resolving` phase 420ms before `stopped`: the
placement table appears (with its own `.pad--arriving` rise-and-fade, keyed to that render
only) while the panel still shows "Checking what completed"; the combined response follows.
**This is also the honest order** — the agent can only report on work once that work is on
screen. Verified: table at 4.8s, response at 5.2s. `resolving` is in `PHASE_ALIAS` →
`stopped`.


**WHY s2 WENT JUMPY AFTER THE STAGGER — A REGRESSION I CAUSED** (user, 2026-10-07: "flow 2
animation is jumpy now. why new problems?"). Two causes, both introduced by the stagger:
1. **The margin after the movement was swallowed.** Staggering pushed the collapse from
   620ms to 720ms, but `noteAt` still added a flat `+100`. The C1 swap (which replaces the
   WHOLE DOM) therefore fired while the expansion was still settling, so the screen changed
   twice in quick succession. Now `settleGap = 320` — explicit stillness after the panes
   stop, named rather than a magic number, so the next timing change cannot silently eat it.
2. **The handoff flashed.** `.content--arriving .centeredChat` faded `from{opacity:0}` —
   the conversation was fully visible at the end of the expansion and then its REPLACEMENT
   faded up from nothing. Now `from{opacity:.82}`: enough to settle, not enough to blink.
**STANDING RULE: when a movement's duration changes, re-check every delay DERIVED from it.**
A constant like `+100` that was generous against 620ms is a defect against 720ms. Derived
timings should be named constants, not literals buried in an expression.


**WHY THE CONVERSATION SWAM LEFT THEN BACK — NOT RANDOM, A REAL MECHANISM** (user,
2026-10-07: "why does on expansion the entire conversation move to the left before coming to
centre? is this road rash?"). The content was `max-width:628px; margin:auto`, i.e. centred
INSIDE the panel. The panel starts 360px wide against the RIGHT edge and grows leftward to
full width — so the box's own centre travels left and settles, dragging the text with it.
**The content never moved itself; it was being re-centred in a container whose centre was
sliding.**
Fix: the column is left-aligned with a `margin-left` that animates from `--convo-pad` to
`--convo-pad-end` **on exactly the same duration, delay and easing as the panel's own
expansion** — as the panel's left edge travels left by `grow`, the margin grows by the same
amount, cancelling it out, so the text holds a constant screen position. Both values are
measured in JS at stop time: `(full - 628)/2` for the end, minus `grow` for the start
(clamped at 0 while the panel is narrower than the column).
**THE SECOND ATTEMPT ALSO FAILED, AND THE MEASUREMENT HID IT** (user: "still issue
persists"). Pinning a 628px column with an animated `margin-left` to cancel the panel's
travel does not work, because **628px does not FIT in a 360px panel** — the column
overflowed, sat at the panel's left edge, and only behaved once the panel grew past 628px.
The `padStart:0px` I measured was `Math.max(0, …)` CLAMPING, which I read as the fix
working. A clamped-to-zero value is a warning sign, not a pass.

**WHAT ACTUALLY WORKS: don't touch the content at all.** During the expansion the body and
composer keep the panel's own padding and full width — exactly as they look in C2 — so
there is no reflow and no reposition. The box grows around untouched content; C1 then
renders the 588 column for real. The bubbles stay panel-width until the handoff, which is
correct: they ARE still the panel's content until C1 replaces them.
**STANDING RULE: `margin:auto` centring inside a resizing container always drags its
content, and so does any fixed-width column wider than the container's starting width. The
safe move during a container animation is to leave the content's layout ALONE and let the
container animate around it.**


**THE COLLAPSE, FINALLY RIGHT: ANCHOR THE CONTENT TO THE PANEL'S RIGHT EDGE, ABSOLUTELY
POSITIONED.** Four failed attempts, all the same mistake in different clothes — tying the
content to something that MOVES:
1. `max-width:588px; margin:auto` — centred in the panel, whose centre slides left.
2. A 628px column with an animated `margin-left` to cancel that travel — the column does
   not FIT in a 360px panel, so it overflowed left and only behaved past 628px. The
   `padStart:0px` I reported as proof was `Math.max(0,…)` clamping.
3. Leaving it at panel width — it STRETCHED end to end then snapped to 588 at the handoff.
   The user's words: "You have made it completely worse ... zero grace."
4. `margin-left:auto; margin-right:<inset>` — same overflow, mirrored: spilled right.

**WHAT WORKS:** the panel grows LEFTWARD, so its RIGHT edge never moves. `.ai__body` and
`.ai__composer` go `position:absolute; right:var(--c1-inset)` with `width:588px`, taking
them out of flow entirely so the panel's width is irrelevant. The column sits at its final
screen position from the first frame; only the panel's left edge animates past it.
`--c1-inset` is measured at stop time (`panelRight - finalColRight + 5`; the +5 is a
residual between the panel's inner box and C1's content card, measured rather than derived
through four nested borders). `--c1-composer-h` pins the body's bottom.
**VERIFIED 0px DRIFT**: content left = 454 mid-collapse and 454 in final C1.
Easing also softened per "supposed to be like a very ease in kind of an interaction":
canvas 560ms `cubic-bezier(.25,.1,.25,1)`, conversation 720ms `cubic-bezier(.22,.61,.36,1)`
at a 220ms delay, so `closeDur` is 940.
**THE REAL LESSON: verify the CONTENT'S SCREEN POSITION at two points (mid-animation and
final) and require the difference to be ~0. Every failed attempt would have been caught in
one measurement; instead I checked CSS variables and animation names, which were all
"correct" while the thing on screen swam.**


**DO NOT COMBINE A WIDTH ANIMATION AND A `transform` ON THE SAME ELEMENT HERE** (user,
2026-10-07: "it is literally moving out of the screen space from the left"). I animated the
panel's width toward 652 AND slid it with `translateX(-354px)` to reach C1's centre. The
panel is RIGHT-ALIGNED in flex, so shrinking its width moves its left edge RIGHT while the
transform dragged it LEFT — the two compounded instead of cancelling and it left the
viewport. I had reasoned about each in isolation.
Now: the panel only GROWS, to the full content width, with no transform at all; the body's
own 588 column (`max-width:588px; margin:auto` on its children) centres itself as the panel
passes that width, which is C1's layout arriving under its own steam. One property, one
direction, nothing to compound.

**SEVEN FAILED ATTEMPTS AT THIS ONE ANIMATION — THE PATTERN IN ALL OF THEM.** Every fix
modelled the target from an ASSUMED edge instead of a measured one: `.main` vs the canvas
card, a guessed panel right edge of 1440 (really 1428), and `.chatBubble`, whose width
varies with its text and is not the column at all. Each time the CSS variables read
"correct" and I reported success while the screen did something else.
**BEFORE claiming any layout animation works: measure the CONTENT's screen box at the start,
mid-animation and after the handoff, and require all three to agree.** CSS variables,
animation names and computed durations prove nothing about where a thing actually is.


**THE "ROLLED LETTER" — WHY BOTH EDGES WERE MOVING** (user, 2026-10-07: "why does this open
like a rolled letter that opens from both sides? ... why should the right side end of it
move at all?"). The panel was a FLEX ITEM animating its width, sitting beside a canvas that
was shrinking on the same frames. Flex re-solves the whole row every frame, so BOTH
elements' edges moved — the panel's right edge drifted even though nothing asked it to.
**Its right edge was never pinned to anything; it was only ever where flex happened to put
it.** No amount of tuning the widths fixes that, because the constraint did not exist.
Fix: during the collapse both panes come OUT of flex flow —
`.ai--closing{position:absolute; top/bottom/right:12px; width:…}` and
`.content--closing{position:absolute; top/bottom/left:0; width:…}`, with
`.main{position:relative}` as the context. The panel's right edge and the canvas's left
edge are then fixed BY DEFINITION, and only `width` can change: the panel opens leftward
only, the canvas collapses leftward only. Verified: panel right edge = 1428 across every
sample of the collapse window.
**STANDING RULE: to make one edge of a box hold still while it resizes, pin that edge
(`position:absolute` + `left`/`right`). A flex item's edges are an OUTPUT of the row's
layout, so they will move whenever any sibling changes size.**

**CLEAR X IN THE COMPOSER (user, 2026-10-07):** "give me an X at the top right corner that
allows me to clear a prompt instead of having to select the entire text." `spComposer` renders
`<button class="promptBox__clear" data-spclear>` (12px close icon, 20px hit area, absolutely
positioned top:10 right:10 inside `.promptBox--expanded`, which is now `position:relative`)
ONLY when there is a `draft` and the agent is not `running`. `.promptBox--clearable` pads the
input 24px on the right so text never runs under it. Click → `render(name,{...state, draft:'',
detached:false})`: the box empties, the attachment goes with it, send dims, and the recall chip
comes back on its own because `!state.draft` gates it. Shared composer, so it works in C1 and
C2 alike. Cache-buster `?v=55`. Uncommitted.

**2026-10-12 UPDATE — tasks are real steps, "Thinking" vs "Doing", and a 4th scenario.**
- s2/s3 no longer skip from the plan to task 3. "Looks good" → (s2 only) ~2.8s "Thinking"
  loader in C1 → C2. Task 1 and task 2 each run as their own step: canvas = skeleton
  table while running (no title), then the real artifact ("Billing offers - …" /
  "Placement - …") with changed rows highlighted; panel = "Doing some tasks" loader,
  then the object card with a live **Approved** / **Proceed** button. Only after task 2's
  Proceed does task 3 (the stoppable one) start. Helpers: `taskPhase()`, `runTask()`,
  `S2_TASK1/2(live)`, phases `t1|t1ok|t2|t2ok`.
- s2 task 3 keeps task 2's artifact on the canvas (`s2PrevArtifact()`), NOT "Setting
  things up" (user: inconsistent with how tasks 1-2 behaved); its panel loader says "Thinking".
- LABELS: thinking flows (s1, s2) say **"Thinking"**; doing flows (s3, s4) say
  **"Doing some tasks"**. Tasks 1-2 say "Doing some tasks" in every flow.
- **s4 "Stopped at doing — applying changes"** (4th sim-menu entry) is a FULL flow with a
  stop available at every running beat: prompt "Find IPD experiences that use 'Flexible
  solutions for growth' as their headline" → project "QB Payroll experiences" → C1
  "Thinking" (holds; stop = thinking-in-C1) → resume = couple of seconds thinking then C2
  loader (skeleton table; stoppable) → results table → autopilot selects all 7, autotypes
  `S4_CHANGE` (headline + body copy + add audience) → "Creating a plan" (stoppable) → plan
  with ONE content task + "Add audience" task (never reached) → "Looks good" → brief
  "Thinking" → applying row by row, holding at 3/7 with a floating pill AND a panel card
  that both carry Stop → stop = pause → "Checking what completed" → partial artifact
  (3 rows highlighted, rest as they were) → one summary bubble with Keep/Rollback.
  `s4Log{search,open,plan}` carries an earlier stop's note + resent prompt into later
  phases. `s4Stop(state)` branches on phase; `runS4Resume()` branches on where the stop was.
- The user REJECTED the reference's two-line "name / Creative ID" cell: s4 uses our own
  table structure (Experience | Experience ID | Status | Headline | Body copy | Last
  updated) and the app's own classes (`.tbl`, `.cbcol/.cb`, `td.edited`, `.skel`,
  `.toolbar/.search/.iconbtn`, `.selbar--footer`, `.hlToggle`, `.selCtx`). User, sharply:
  "use our design language" — never invent table/footer styling in this block.
- The composer's X (`data-spclear`) dismisses the prompt FOR GOOD (user, 2026-10-12: "once
  I trigger close, I should not see my prompt affordance"): draft, attachment AND the
  recall chip all go. Implemented with `state.dismissed` (gates the chip at every site),
  not `recall:false`, because `recall===false` doubles as the note's "arriving" flag.
- **IF A LOADER IS RUNNING, THE COMPOSER SLOT IS STOP. NO EXCEPTIONS** (user, 2026-10-12:
  "why does the prompt box show disabled send when it should be the stop button? This is
  a repetitive issue"). Every running beat must be wired for stop, never left as send to
  dodge the wiring: post-plan Thinking (`planThinkPhase`), t1 / t2think / t2
  (`taskPhase` with `pausing-*` / `stopped-*` variants), s4's post-plan thinking
  (`stopped-c2` with `from:'thinking'`). Stopping a beat pauses it in place, writes the
  note, offers the prompt back; send re-runs THAT beat. `taskLog{thinking,t1,t2}` carries
  earlier notes + resent prompts (reset in `runIntake`).
- Task 2 THINKS BEFORE ITS SKELETON: Approve → "Thinking" in the panel over task 1's
  artifact (~2.4s) → skeleton ("Doing some tasks") → output. "Looks good" → C1 "Thinking"
  (~2.8s) → task 1, in s2 AND s3 (`runPlanThinking(scene)`).
- ARROW KEYS: t1ok / t2ok are key states; running beats alias to the result they arrive at
  (`PHASE_ALIAS`). `render()` drops `keyIdx` on every non-arrow render, so an arrow always
  continues from what is on screen. A HOLDING state (working / searching / applying) reached
  BY ARROW stops itself after `ARROW_HOLD_MS` (6s) and moves on (user: "not have me stuck
  there forever"); the prompt-driven run still holds for the user's stop.
- s4 details settled 2026-10-12: send is the user's (autotype leaves a live draft);
  found-message = disclosure + "Search results" `objectCard('search', …)`; table is VEILED
  (`.s4Veil`, non-interactive) while applying; result/artifact tables have NO selection
  ("0 of 7 selected", actions off); the picked list is frozen (disabled, 7 of 7) from the
  ask onward.
- s2 RESHAPED (user, 2026-10-12): the stop comes right after APPROVING THE FIRST OBJECT.
  plan → "Looks good" → C1 Thinking → task 1 (skeleton → "Billing offers" artifact →
  **Approve**) → stoppable "Thinking" with task 2 ("Change IPD content") in the tracker and
  the billing artifact still on the canvas → stop collapses to C1. Task 2's own run
  (t2think → t2 → t2ok → Proceed) exists only in s3. Stop note: "changing the IPD content".
- LIVE REPLY BUTTONS ARE IMPERATIVE ("Approve", "Proceed", "Looks good"); only the
  RECORDED reply reads "Approved" (user: "this can't say approved before I approve").
- s4 RESULTS STREAM IN ROW BY ROW (`landing` phase, `S4_ROW_MS`=260) under a still-running
  "Thinking"; the found card lands after the last row. A stop mid-stream keeps the rows
  already in (`revealed` carried into `stopped-c2`). User: "a very mature loading state".
- s3 RESHAPED TO MATCH s2 (user, 2026-10-12): plan → "Looks good" → C1 Thinking → task 1
  (skeleton → "Billing offers" → **Approve**) → `t2think` (Thinking over the billing
  artifact, task 2 in the tracker) → skeleton ("Doing some tasks", holds) where the STOP
  lands → "Checking what completed" → "Placement (partial)" + summary. The "Setting things
  up" canvas (`setup` phase) is NO LONGER USED anywhere: the previous artifact on the canvas
  during Thinking does that job. `runS3Task` = t2think → `runS3Working`. t2/t2ok/Proceed are
  now dead paths in every scenario (helpers kept).
- s4's C1 "Thinking" NO LONGER HOLDS (user, 2026-10-12: "it is not moving forward from
  here?"): it runs its three steps (~4.2s, the window for a C1 stop) then opens C2 on its
  own. `HOLDS` (arrow auto-stop) is now just working / applying. RULE OF THUMB: a beat holds
  for the user's stop ONLY when stopping it is the point of that scenario (s1/s2/s3 working,
  s4 applying); every other loader advances by itself.
- PARKED (user, 2026-10-12: "don't do the retry and edit to prompt thing right now"): s4's
  user-prompt bubble gets RETRY + EDIT icons next to the timestamp. Figma reference:
  https://www.figma.com/design/Z4FvTMCF5XcMZAZNiIDIVL/MS-2.0---Targeted-Offer-Oct?node-id=66-92003
  (node 66:92003, 588x116). Not built yet; pick up from there when asked.
- STATUS BADGE COLOURS (user, 2026-10-12: "you're not using the right status colours"): the
  `badge()` helper must map like the sibling builds, Published/Verified = `badge--pos`
  (green), Draft = `badge--draft` (blue #d6ebff/#0a73dc), Error = `badge--err` (red), else
  neutral. This block's helper had hardcoded green for everything.
- A SELECTION THREAD IS ITS OWN TURN: wrap `selThread(n) + userBubble(ask)` in
  `<div class="convoTurn">` (60px padding above the stroke), never bare (user, 2026-10-12:
  "fix this spacing!!!").
- NEVER `disabled` ON TABLE CHECKBOXES (user, 2026-10-12: "show normal selection, not
  disabled or whatever this new weird state is"): frozen/result tables draw ordinary boxes
  (checked where selected) and are made inert via `onclick = preventDefault` in wire().
- s4 SELECTION (user, 2026-10-12): autopilot picks SOME, `S4_PICK=[0,1,2,3,4]` (5 of 7), never
  all. Applying / the artifact / the summary are scoped to the selection (`rowsIdx`,
  "Applying changes 3/5", Pending 2). `runSubs(..., extra)` carries `selected` through every
  loader tick (planning/thinking/resumed) so the footer never falls to "0 of 7".
- s4 results table has the standard `.pager` ("1-7 of 7 items · Page 1 of 1").
- The selection thread uses `.selTurn` (60px top padding ONLY), NOT `.convoTurn`, whose
  viewport fill left an empty tail and pushed "Selected n experiences" out of the fold.
- s4 Stop controls (card + floating pill) are ICON ONLY (`s4StopBtn()`, `.s4Btn--icon`).
- "Highlight changes" is a LIVE toggle (`data-hlchanges` → `state.hl`), never disabled,
  during applying and after the stop.
- `.selTurn + .chatMsgGroup{margin-top:60px}`: the thread wrapper breaks the
  `.chatMsgGroup + .chatMsgGroup` sibling rule, so the turn after it needs the 60px
  explicitly (user, 2026-10-12: "spacing between 2 bubbles?? why this delta?").
- Icon buttons pin the glyph: `.s4Btn svg{width:20px;height:20px}` (the composer's size);
  without it the bubble context shrank it (user: "what has happened to icon size?").
- WHILE THE FILM IS UP IT COVERS THE FOOTER TOO: `s4Foot(..., veiled=true)` during applying
  and settling adds `.selbar--veiled` + its own `.s4Veil`, so "Highlight changes" and the
  actions are under the film; it lifts with the stop (user: "highlight changes should also
  be under that, no?").

**2026-10-12 BATCH (late evening):**
- RECALL CHIP LIVES IN THE COMPOSER'S ACTIONS ROW, BOTTOM-LEFT, grouped with attach/send
  (truncates, never wraps). Not a row above the input any more.
- NO RECALL AFFORDANCE ON LATE STOPS: s2 stopped, s3 stopped, every task-beat stop
  (stopped-think / stopped-t1 / stopped-t2think) and s4's applying stop. Only stops right
  after a prompt keep it: s1, s4 stopped-c1, s4 stopped-c2 (opening / planning / thinking).
- FILM OVER A PREVIOUS ARTIFACT WHILE THE NEXT OUTPUT IS PROCESSED (`veiledTable()`): s2
  working/pausing/closing (billing table), the t2think beat (both C2 flows), s4 planning +
  post-plan thinking (picked table + footer). Clear once stopped, resting on the plan, or
  when the canvas is a skeleton anyway.
- PARTIAL-STOP BUBBLE ORDER (s3 + s4, `partialStop()`): note → "n are ready for your
  review" + object card → "Here's where … stand" table → "What next?" → THREE options:
  Keep n / Rollback n / **Complete the remaining m**. The recorded form shows whichever was
  clicked (`resumeText`). In s4 "Complete the remaining" finishes the table (applied = all,
  title drops "(partial)").
- THE FILM COVERS THE WHOLE ARTIFACT, HEADING INCLUDED (`veiledBlock()`; in s4 the `<h2>`
  lives inside `.s4Body`). User, 2026-10-12: "why is this title completely visible?"
- EVERY ARTIFACT CANVAS CARRIES THE FOOTER ACTION BAR ("0 of n selected · Highlight
  changes · Keep/Remove/View"), s2/s3 billing + placement included; skeleton canvases do
  not (sibling convention). Veiled with the table while the film is up. The highlight
  toggle is wired for every scene (`taskBillingTable(hl)`, `s3PlacementTable(hl)`).
  User, 2026-10-12: "where is the action bar?"
- A CHIP REPLY INSIDE AN AI CARD IS RECORDED IN THE CARD ONLY (avatar line), NEVER ALSO AS
  A USER PROMPT BUBBLE. Only a composer send (e.g. the recalled prompt) produces the resent
  bubble. `resumeVia = 'chip' | 'composer'`, `RESENT_IF_TYPED()`. User, 2026-10-12: "when
  do we give that as a new user prompt? anything given in AI chip as a response?"
- Third partial-stop option label (user's pick, 2026-10-12, final after a grammar pass):
  **"Continue with the remaining n <noun>"** (s3: "Continue with the remaining 6 placements",
  s4: "Continue with the remaining 2 experiences"). "Continue" was chosen over "Update" because
  it says the job is picked up where it stopped; the article keeps it fully grammatical.
  Rejected: "Complete the remaining n", "Continue with n remaining", "Update the remaining n".
- FOOTER DEPENDS ON THE TABLE: a table WITH a checkbox column gets the selection bar
  ("n of m selected · Highlight changes · Keep/Remove/View", s4); a table WITHOUT one gets
  the highlight-only bar (`hlFoot()`, just the toggle; s2/s3 billing + placements). User,
  2026-10-12: "there is no checkbox in this table, so do not give zero of four selected".
- s4 STOP PLAYS OUT INSIDE THE PROGRESS CARD (`s4Card(n, mode, total)`): running
  "Applying changes 3/5" + icon stop → pausing "Stopping" → settling "Checking what
  completed" (spinner, in the card) → stopped "Stopped at 3/5" (attention dot), which
  STAYS as the recorded turn with the summary bubble under it. Never replace a rich
  progress card with a bare loader on stop (user, 2026-10-12: "we were at this stage, so
  rich; accommodate stopping also").
- THE INTAKE DISCLOSURE MATCHES ITS BUBBLE: "Read your request / brief, created a PROJECT"
  (last substep "Setting up the project"), never "created a summary" over an "I have
  created … project for you" bubble (user, 2026-10-12).
- ATTACHMENT PER PROMPT (`HAS_FILE()` / `FILE_NAME()`): ONLY s1 has one ("name of file.doc",
  the brief sheet). s2/s3 were briefly given "Change order - ELM9071 campaign" and the user
  reverted it the same day ("remove attachment, kept rest as is"); s4 is a search, no file.
  The s2/s3 disclosure stays "Read your request, created a project" / project "ELM9071 campaign".
- PUBLISHED vs LOCAL (user, 2026-10-12): on the GitHub Pages build the three partial-stop
  options (Keep / Rollback / Continue) are shown but INERT (no further interaction); locally
  they resume. One codebase: `IS_LOCAL` (localhost / 127.0.0.1 / file:) decides, and
  `?remote=1` previews the published behaviour locally. Keep this rule when adding any
  further interaction past the partial stop. The inert buttons keep their NORMAL look, pointer
  and hover (user: "keep hover state"); only the action is withheld.
- BUMP `app.js?v=N` IN `stop-processing-oct06/index.html` ON EVERY app.js PUSH. Pages caches
  the script hard; two pushes on 2026-10-12 shipped with v=55 unchanged and the published
  prototype kept the old behaviour (user: "clicking still gives me a loader"). Now v=56.
