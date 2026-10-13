# CCO-landing playbook — flow-machinery rules

Scope: the engineering rulebook for how any flow is built to run — the
conversation/canvas relationship, when to show a playback-intent card versus
a full plan widget, every loading-state type and when each applies, exactly
how arrow-key navigation behaves, and the long-task-vs-short-task split.
Cousin docs: `PATTERNS.md` answers "which component, for which object";
`HANDOFF.md` answers "how to start a new build, what to copy."

Last verified: 2026-10-08, against the same six builds as `PATTERNS.md`,
cross-checked against the `ms-prototype-intake` skill where it codifies a
rule as enforced convention rather than just inferred-from-code.

## 1. C1 vs. C2 — the two intake shapes

- **Boot** (`phase:'bootfull'`): full-width, no conversation at all —
  `bootCanvas()` centered (spinner + shimmer "Creating a project"),
  breadcrumb is a skeleton bar.
- **C1** (`phase:'msg-prompt'` → `'msg-created'` → `'msg-search'`): a
  **centered single column** — no canvas, no right pane at all. One
  top-level div: `<div class="content content--centered">`.
- **C2** (`loading:true`, `+opening:true`): **two-pane** — canvas appears
  left (as a skeleton), conversation moves right.
- **Result** (no `phase`, no `loading`): two-pane with the real content and
  the full transcript preserved in the panel.

Code: `link-unlink-experiments-sep11/app.js:995-1013` (boot + C1 branches).
C2/result entry fires from a timer: `setTimeout(()=>render(scene,{loading:true,
opening:true}), openAt)`, e.g. `app.js:2043`.

CSS that actually produces the visual difference:
- `.content` — the normal two-pane card (`index.html:151-155`).
- `.content--centered` + `.centeredChat` — one-third-width centered column,
  no sibling `<aside class="ai">` exists on the page at all during C1
  (`index.html:914`, `916`).
- `.content--opening` / `.ai--opening` — the C1→C2 transition animation
  classes (`canvasSlideIn`/`convoSlideRight` keyframes, `index.html:178-181`),
  applied via `state.opening`.

**The full sequence (boot → C1 → C2 → result) is never skippable**, even
when the prompt names one specific object with no results table — see
`PATTERNS.md` §1 and the `ms-prototype-intake` skill. "We already know which
object" is not a reason to drop a step.

## 2. Playback-intent card vs. plan widget — the actual rule

**A single logical change — even one that technically requires "create a
draft" underneath — collapses into ONE intent card that IS the
confirmation. No separate plan widget.** Multi-step work (several genuinely
distinct tasks the user should review one at a time) gets a `planTable`-based
plan with one row per task.

This is a **dated decision (2026-10-05)** stated directly in code comments,
and it **supersedes an earlier two-task-plan design (2026-09-15)** that is
still physically present as dead code in some files (`UL_PLAYBACK`,
`LK_PLAN`/`LK_TASKS`). **If you find a two-task plan for a single-attribute
change while reading an existing build, that's the superseded pattern — do
not copy it.** The current rule:

> *"ONE STEP, NO PLAN (user, 2026-10-05: 'we can create the draft and make
> changes to that draft in the same step'). Creating the draft and
> unlinking from it is one task, and a one-task plan is no plan, so this
> card IS the confirmation on both paths; only the verb differs."*
> — `link-unlink-experiments-sep11/app.js:4323-4327`, same text in
> `update-treatment-holdout-sep28/app.js:4641`.

Independently reaffirmed in a third build: *"NO PLAN and NO single-access
point review in this flow (user, 2026-09-08)"* —
`clone-ipd-experiences-sep03/app.js:3763`.

**Example — genuine multi-step, gets a plan**: the create-campaign flow's
6-task `CR_PLAN_TASKS` (`link-unlink-experiments-sep11/app.js:1693-1700`) —
parse+validate meta/audiences/access-points/experiments, review summary,
create experiences. Each is a real, distinct, reviewable unit of work.

**Example — 2-task plan, correctly kept (not collapsible)**: the audience
change-order flow. Update-targeting and review-updated-experiences are two
genuinely separate concerns, so it keeps its plan —
`audience-change-order-oct07/app.js:979-982`. The intent card (From/To
playback) still comes FIRST, then the plan — the intent card is "what will
change," the plan is "in what order I'll do it"; they answer different
questions and aren't mutually exclusive.

**Decision rule when building a new flow**: ask "is this fundamentally one
task that happens to involve internal steps (draft-then-apply), or are there
multiple genuinely distinct units of work the user should review one at a
time?" One task → intent card only, Approve does the work, no plan. Multiple
→ plan widget, see §5 for the per-task rules.

## 3. Every loading-state widget, and when each applies

| Widget | Shape | Used for |
|---|---|---|
| `bootCanvas()` | Centered spinner GIF + shimmer "Creating a project" | Boot phase only, full-width, no conversation pane at all |
| `agentLoader(label, tasks, bare)` | Spinner + shimmer header, optional `<ul>` of `{label, state:idle\|active\|done}` substep rows (done=dark, active/pending=faded until all done) | C1's `msg-search` moment (Searching/Reading/Compiling); also standalone for single-object fetch loaders ("Fetching the experiment") |
| `skeletonTable(cols, checkbox)` | 8 skeleton rows, randomized-width bars, optional checkbox-column skeleton | Canvas-left placeholder during C2 (`state.loading===true`) before a real table resolves |
| `kvSkeleton(pairs, cols)` | Grid of randomized-width label+value bar pairs | Detail-view loads that resolve into a meta grid or attribute/value expression — never implies a table is coming |
| `disclosure(label, steps)` | Collapsed `<button data-disclosure>` + a hidden `<ul>` of already-DONE substeps | The RETROSPECTIVE summary attached to a completed turn ("Read your request, checked the experiment ▾") — this is not a live loading state, it's the settled record of one that already finished |
| `planNum--loading` (inline per-row marker) | Spinner on the currently-running plan row, green check on completed rows, plain numbered circle on not-yet-started rows | Inside a `planTable`, one row per task, reflecting live progress |
| Sticky task tracker (`aiPanel`'s `step`/`stepLoading`) | Persistent header bar atop the conversation panel: spinner while working, dashed numbered circle while idle-but-started, green check once finished | The entire time a multi-task plan is executing — must be present on EVERY per-task state, easy to forget (see `ms-prototype-intake` checklist) |
| `.cfskel` / `.cfskel--bar` | Generic shimmer bar primitive | The smallest unit — composes into the breadcrumb skeleton during boot and into `kvSkeleton`/`skeletonTable`'s own rows |

Rule of thumb: **a loader must preview the shape of what's coming** — a
table skeleton before a table, a kv-skeleton before a meta grid, never the
wrong shape. Never show a loading state with nothing for the sticky tracker
to say if a plan is in flight.

## 4. Arrow-key (Left/Right) navigation — exact runtime behavior

Copy-pasted near-identically into every build; reference is
`link-unlink-experiments-sep11/app.js:7554-7728`.

**`FLOW_STEPS()`** returns THIS build's own ordered list of `[sceneName,
stateObject]` pairs, branching on `scenario`:
```js
function FLOW_STEPS(){
  if(scenario==='lkExp')   return STEPS_LK(true);
  if(scenario==='lkDraft') return STEPS_LK(false);
  // ...
  return STEPS_UL(scenario!=='ulDraft');
}
```
Write a fresh one per new build — never inherit an old build's list, and
make sure it's long enough to include every resting state your flow has, or
the arrow key jumps past states that exist but aren't enumerated (caught
2026-09-16, comment at `app.js:7578-7580`).

**`stepIndex()`** resolves the CURRENT live state onto an index in that
list. Critically: **arrow keys only ever land on RESTING states, never
mid-loading/transient ones.** Every transient/executing state is explicitly
remapped via an `R={...}` lookup to the resting state it's heading toward:
```js
// move flow example, app.js:7570-7577
let r = {reading:'intent', planning:'plan',
         pubTo:'donePub', done:'donePub',
         tmworking:'tmtask', tmreading:'tmtask'}[st.mv] || st.mv || '';
const m=/^w(\d+)$/.exec(r); if(m) r='t'+m[1];   // "executing task N" -> "resting task N"
```
So if the agent is mid-"Reading your request" and the user presses
Right/Left, the step index treats that exactly as if it were sitting on the
`intent` state already — there's no notion of "jump forward past the
loader," because loaders were never independent steps to begin with.

**`gotoStep(i)`**: bounds-checks, turns off autopilot, clears all pending
timers, then calls `go(name, deepClonedState)` — a real navigation, not a
render-in-place.

**The `keydown` listener**:
```js
document.addEventListener('keydown',(e)=>{
  const t=e.target;
  if(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)
     || (t.closest && t.closest('.promptBox')))) return;
  if(e.metaKey || e.ctrlKey || e.altKey) return;
  if(e.key==='p'){ autopilot=!autopilot; ... return; }
  if(e.key==='r'){ autopilot=true; go('home',{}); return; }
  const i = stepIndex();
  if(i===-1) return;
  if(e.key==='ArrowRight'){ e.preventDefault(); gotoStep(i+1); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); gotoStep(i-1); }
});
```
- **Suppressed entirely** while focus is in any editable field (including
  anything inside `.promptBox`, the composer) or while a modifier key is
  held.
- **`p`** toggles autopilot on/off; turning it on resumes auto-driving from
  wherever the scene currently is (`scheduleAuto(current.name,
  current.state)`); turning it off just clears timers.
- **`r`** force-restarts: turns autopilot ON and navigates to `home`.
- If the current scene isn't recognized by `stepIndex()` (returns `-1`),
  arrow keys silently do nothing.

## 5. Long/complex tasks vs. short/simple tasks — the sequencing rule

Stated as enforced product policy in the `ms-prototype-intake` skill, under
"Sequenced tasks: who gets an approval":

> - Every task rests on its own canvas showing what it just did. A task
>   that ticks past with nothing to look at is not a task — collapse it
>   into another one or drop it.
> - Every task except the last ends with an Approve. The user reviews each
>   step before the next runs.
> - The LAST task does not ask for approval. It offers the real decision
>   the flow has been building toward — typically Publish, alongside the
>   Campaign Manager link.
> - A flow with nothing to stage has no sequence at all: the intent card is
>   the confirmation and approving it does the work.

This is reaffirmed independently in code comments across at least three
builds (link/unlink, audience change-order, clone-IPD), with the same
"no separate done message after the last task" detail:

> *"Task 1 (the draft) DOES ask for approval — it is a real object to
> review before anything is linked into it... The LAST task offers only
> PUBLISH: it is the completion, so a separate done message would report
> the link twice."* — `link-unlink-experiments-sep11/app.js:4601-4604`.

Concrete last-task shape (audience build):
```js
// app.js:1003 — note: NO Approve button, only Publish + the CM link
const AU_TASK2_DONE = ()=> `<div class="chatBubble">Reviewed the ${AU_EXP_ROWS.length}
  experiences linked to ${AU_NAME}...${objectCard(...)}
  <div class="bubble-q">Ready to publish?</div>${replyBtn('Publish','auPublish')}</div>${cmLink()}`;
```

**Decision rule when building a new flow**: count the genuinely distinct,
reviewable units of work. Zero or one → no plan, see §2. Two or more → a
plan widget, every task but the last gets its own canvas + Approve, the
last task carries Publish and nothing after it.

## 6. Conversation ↔ canvas — one shared state, one render call

**The canvas (left) and the conversation (right) are never built by two
separate code paths — they're two pieces of ONE string, produced by ONE
function call from ONE `state` object, then written to the DOM together.**

```js
// render(), link-unlink-experiments-sep11/app.js:2209-2217
function render(scene, state){
  current = {name:scene, state};
  main.innerHTML = scenes[scene](state);   // <- single call, single string
  wire(scene, state);
  ...
}
```

Every `scenes.XXX(state)` function returns `content + aiPanel({...})` —
the canvas markup concatenated with the conversation panel, both derived
from the same `if(loading){...} else {...}` branch over the same `state`
argument. This pattern appears 18+ times in a single build's `app.js` (e.g.
`link-unlink-experiments-sep11/app.js:1046, 1181, 1208, 1243, ...`).

**Why this matters when building a new flow**: there is no way for the
canvas and the conversation to go out of sync, because there's no
independent path for either to update alone. Clicking Approve in the
conversation calls `trigger.xxxApprove()`, which calls `render(scene,
newState)` — that one call regenerates BOTH halves from the new state and
replaces the whole DOM subtree in one shot. If you ever find yourself
wanting to "just update the conversation" or "just update the canvas"
without touching the other, that's a sign the state shape is wrong, not
that you need a separate update path — fix the state, not the rendering.

`go(name, state)` is the same mechanism plus `clearTimers()` + scroll reset
— use it for scene-to-scene navigation, never from inside a timer chain
mid-sequence (see `HANDOFF.md`'s "known failure modes" for what goes wrong
if you do).
