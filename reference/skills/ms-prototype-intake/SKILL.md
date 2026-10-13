---
name: ms-prototype-intake
description: |
  MUST use whenever building or editing ANY flow in the Marketing Studio
  prototypes (CCO-landing builds: clone, rollback, delete, pause, export,
  placement-change, link/unlink-experiments, create-*, change-order-*).
  Every flow ALWAYS starts from a typed prompt and walks the fixed intake
  sequence: "Creating a project" loader -> C1 (centred conversation, no
  canvas) -> C2 (two-pane, canvas skeleton) -> the result. Never drop the user
  into a two-pane screen or a pre-loaded object. Use before writing a new
  scene, a new sim-menu entry, or any entry point.
---

# Marketing Studio prototype intake (the C1 / C2 sequence)

Every flow in these prototypes begins the same way. This is not per-build
styling — it is the product's entry pattern, and it has been re-derived (badly)
more than once. Reuse the existing phases; do not invent a new intake.

## The rule

**A flow ALWAYS starts with a typed prompt in the composer.** Never open a
scene straight onto a table, a detail screen, or a pre-selected object. The sim
menu picks the *scenario*; it still enters through `home` with the prompt
auto-typing.

## The sequence

| Phase | State | What renders |
|---|---|---|
| Boot | `phase:'bootfull'` | Full-width, NO conversation. `bootCanvas()` centred: spinner + shimmering **"Creating a project"**. Crumb is `Home / <skeleton bar>`. |
| **C1** | `phase:'msg-prompt'` → `'msg-created'` → `'msg-search'` | **Centred single column, NO canvas, NO right pane.** The user's prompt bubble, then "I have created "<project>" project for you.", then the search `agentLoader` with its substeps. Crumb now names the project. |
| **C2** | `loading:true` (+ `opening:true`) | **Two-pane.** Conversation moves RIGHT, canvas appears LEFT showing `skeletonTable(COLS,true)`. |
| Result | no phase, no loading | Two-pane with the real table and the full `*_SEARCH_CONV()` transcript in the panel. |

## Markup for each phase

Copy `scenes.pcSearch` verbatim; only the crumb, prompt and loader label change.

```js
if(phase==='bootfull'){
  return `<div class="content">
    ${topbar('<span>Home</span> <span class="sep">/</span> <span class="cfskel cfskel--bar" style="width:220px;height:14px;display:inline-block"></span>')}
    <div class="scroll scroll--center">${bootCanvas()}</div>
  </div>`;
}
// C1 — centred, no canvas
if(phase==='msg-prompt' || phase==='msg-created' || phase==='msg-search'){
  let centeredBody = userBubble(FIND_PROMPT);
  if(phase==='msg-created' || phase==='msg-search') centeredBody += agentMsg(createdBubble,'');
  if(phase==='msg-search') centeredBody += agentLoader('Searching …', state.tasks||[]);
  return `<div class="content content--centered">
    ${topbar(CRUMB)}
    <div class="scroll"><div class="centeredChat"><div class="centeredChat__inner">${centeredBody}</div>
      ${expandedComposer()}
    </div></div>
  </div>`;
}
// C2 + result — two-pane
const table = loading ? skeletonTable(COLS,true) : tableHTML(COLS, ROWS, {...});
return `<div class="content">${topbar(CRUMB)}<div class="scroll"><div class="pad">
    <h2 class="page-h">${PROJECT}</h2>${toolbar()}${table}
  </div></div></div>` + aiPanel({body, opening:state.opening});
```

## The runner

Mirror `runIntakePC` — same shape, same timings:

```js
function runIntakeX(){
  const subs=['Reading your request','Searching …','Compiling results'];
  const tick=(a)=>render('xScene',{phase:'msg-search',tasks:subs.map((label,j)=>({label,state:j<a?'done':j===a?'active':'idle'}))});
  render('xScene',{phase:'bootfull'});
  const promptAt=2400, createdAt=promptAt+600, searchAt=createdAt+900, searchDur=4800;
  timers.push(setTimeout(()=>render('xScene',{phase:'msg-prompt'}),promptAt));
  timers.push(setTimeout(()=>render('xScene',{phase:'msg-created'}),createdAt));
  timers.push(setTimeout(()=>tick(0),searchAt));
  const slot=(searchDur-600)/subs.length;
  subs.forEach((_,i)=>timers.push(setTimeout(()=>tick(i+1),searchAt+Math.round(slot*(i+1)))));
  const openAt=searchAt+searchDur;
  timers.push(setTimeout(()=>render('xScene',{loading:true,opening:true}),openAt));   // C2
  timers.push(setTimeout(()=>go('xScene',{}),openAt+2000));                            // result
}
```

Wire it: the sim-menu handler does `go('home',{autotype:FIND_PROMPT}); return;`
and the `home:` trigger routes that scenario to `runIntakeX()`.

## The breadcrumb is ALWAYS exactly two levels

**`Home / <project name>`** — never three, never anything else.

- Level 1 is **Home**, always.
- Level 2 is the **PROJECT** the intake created, with the rename pencil.
  `topbar()` adds that pencil automatically to any crumb that is not bare Home.
- The object the user opened (an experiment, a campaign, an experience) does
  **NOT** get its own level. Drilling into something does not deepen the crumb.

```js
const CRUMB = `<span>Home</span> <span class="sep">/</span> <span>${PROJECT}</span>`;
```

Because the project is named from the prompt, the specific-search case ends up
with the object's own name at level 2 — that is correct, and still two levels.

## Specific search: no table, same sequence

When the prompt names ONE object (an ID, an exact name), the flow **skips the
results table and opens that object directly** — but the intake is unchanged:
boot loader → C1 (prompt, project created, "Fetching the experience" loader) →
the object's own screen. The loader label describes fetching one thing rather
than searching many.

**There is no shortcut.** "We already know which object" is not a reason to
skip the prompt, the project creation, or C1.

## Sequenced tasks: who gets an approval

When a flow runs a **sequence of tasks**, the rule is:

- **Every task rests on its own canvas** showing what it just did. A task that
  ticks past with nothing to look at is not a task — collapse it into another
  one or drop it.
- **Every task except the last ends with an Approve** ("Does this look ok?
  I'll … once you approve."). The user reviews each step before the next runs.
- **The LAST task does not ask for approval.** It offers the real decision the
  flow has been building toward — typically **Publish**, alongside the Campaign
  Manager link. It is the completion, so it carries the closing guidance.

```
task 1  → canvas + "Does this look ok?"            [ Approve ]
task 2  → canvas + "Does this look ok?"            [ Approve ]
task n  → canvas + "I can publish it for you…"     [ Publish ] + Go to Campaign Manager
```

### The sticky task tracker

While a plan is executing, the panel carries a **sticky header naming the
current task** — a spinner while it runs, a green check when it rests, plus a
chevron and a stop control. It is `aiPanel`'s own feature and is easy to forget,
because a flow works without it:

```js
aiPanel({ body,
  step: `${i+1}.  ${TASKS[i]}`,   // "1.  Create a draft of …"
  stepLoading: isExecuting,        // spinner vs check
});
```

Pass it on EVERY per-task state (both the executing and the resting one) and on
every canvas path that state can render. It does NOT appear on the plan card
itself — no task has started yet.

**Do NOT add a separate "done" message after the last task** — the last task
already reports the outcome, so a done message reports the same thing twice.

A flow with nothing to stage (a draft object, say) has no sequence at all: the
intent card is the confirmation and approving it does the work.

## Checklist before saying a flow works

- [ ] Entering the flow lands on `home` with the prompt auto-typing — not on a table or detail screen
- [ ] Boot shows "Creating a project" full-width, no conversation pane
- [ ] C1 is centred: no canvas, no right pane, no skeleton table
- [ ] C2 shows the skeleton table with the conversation on the right
- [ ] The result keeps the whole C1 transcript in the panel as history
- [ ] Any later scene reached from the result replays that transcript too
- [ ] The breadcrumb is `Home / <project>` on EVERY scene in the flow — two levels, never three
- [ ] Every task in a sequence rests on a canvas; all but the last end in Approve; the last offers
      Publish and there is no separate "done" message after it
- [ ] The sticky task tracker (`step` / `stepLoading` on `aiPanel`) shows on every per-task state,
      spinner while executing and check when resting.
      **IN A STATE-KEYED SCENE, CHECK THE MAP READS *YOUR* STATE KEY.** Builds with several
      scenarios in one scene keep a `STEP_BY_<key>` lookup; a new scenario's states are simply
      absent from it, so the tracker silently never renders and everything else looks fine.
      Grep for the existing map and add yours: `STEP_BY_MP[state.mp] || STEP_BY_PC[state.pc]`.
- [ ] **A plan's canvas shows the RIGHT KIND of object for that task.** Work that is still staged
      is not the finished object: if nothing has been created yet, the canvas shows the staged
      CREATIVES (no Experience ID, no status chip, a QA badge) and only becomes experiences once
      the creating task has run. Check the heading, the pager, the selection bar and the row
      click follow the same switch — a stale "N of M selected" bar or a dead row click gives the
      staging away.
- [ ] **Each fact appears ONCE in a message.** A validation error that says "found issues on all
      4", then "over the limit on all 4", then "113 of 100 used" states one problem three times.
      Headline what happened, state the single thing that is wrong, attach the object card.
- [ ] Nothing from the SOURCE build leaks: `let scenario = '<this build's first scenario>'`, and
      `FLOW_STEPS()` returns only this build's step lists with no fallthrough default
