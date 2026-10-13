# CCO-landing handoff — starting a new build

Scope: how to add a new prototype workflow to this repo without re-deriving
conventions from scratch each time. This is a code/process doc, not a design
doc — for visual/behavioral decisions already made, check `MEMORY.md` entries
in `~/.claude/projects/-Users-rlathiya-Trial/memory/` first (one file per
decision, cross-linked via `[[name]]`).

Last verified: 2026-10-08, against commit `2dbdcf2`.

## What this repo is

`Create-Change-Order.git` (remote `origin`, github.intuit.com), local path
`/Users/rlathiya/Trial/CCO-landing`. Despite the "new repo" framing in old
memory notes, THIS is that new repo — every build since Aug 2026 lands here.
GitHub Pages serves from `master`, not `main`. Push is manual-only (never push
without being asked).

Each build is a **self-contained folder**: its own `app.js`, `index.html`,
and `figma/` asset directory. Nothing is shared via imports — every build
carries its own copy of the shared infra (icons, `topbar`, `aiPanel`,
`tableHTML`, etc.), copy-pasted and sometimes locally modified. There is no
single source of truth for these helpers; the most recently-built file with
the pattern you need is the one to copy from.

## Before writing any code

1. Read the `ms-prototype-intake` skill. It is not optional — every flow
   enters through the same boot → C1 → C2 → result sequence, and the skill
   has the exact markup/timing to copy.
2. Check `MEMORY.md` for an existing decision that covers your flow's shape
   (tabs? highlight-changes? a plan with N tasks? one-step draft+change?).
   Memories describe the rule; they usually name which build implements it.
3. Pick ONE existing build as your structural template — the one whose
   object/flow shape is closest to what you're building. Don't fork a
   kitchen-sink file (see below) if a smaller one covers your needs.

## The kitchen-sink problem

Older builds like `link-unlink-experiments-sep11/app.js` (7700+ lines) have
accumulated scene code for every scenario ever added to that build over many
sessions (link, unlink, move, update-treatment all live in the same file via
shared screens keyed by `state.ul`/`state.lk`/`state.mv`/`state.tt`). They are
valuable as a REFERENCE — the widgets inside are correct and battle-tested —
but do NOT copy the whole file as a starting point for an unrelated flow. You
will drag in dead scenes, unrelated triggers, and autopilot branches that
don't apply, and the arrow-key step index will need surgery to exclude them.

**What to do instead**: copy just the shared infra header (see below) into a
fresh `app.js`, then write new scene/trigger/wire code for your flow only.
`audience-change-order-oct07/app.js` (built 2026-10-07) is the current
example of this approach — a clean file built this way rather than forked
whole.

## The shared infra block (copy verbatim)

In any existing build's `app.js`, this runs from line 1 to the line just
before `const scenes = {};` (check with
`awk '/^const scenes = \{\};/{print NR; exit}' app.js` — it was line 756 in
link-unlink's copy as of this writing, but line numbers drift build to
build). It includes:

- `ICONS` / `icon()` / `I` (the icon inset system — see
  `ms-dashboard-figma-assets` memory for the asset list)
- `RAIL_MAIN`/`RAIL_SECONDARY`/`RAIL_FOOTER`, `renderRail()`
- `topbar()`, `aiPanel()`
- conversation widgets: `userBubble`, `agentMsg`, `disclosure`, `objectCard`,
  `replyBtn`, `recordedReply`, `badge`, `expTabTitle`
- `agentLoader()`
- `metaGrid()`
- `tableHTML()`

Past that line (still early in the file, before scene-specific data) you'll
usually also want:
- `kvSkeleton`, `skeletonTable`, `bootCanvas`, `expandedComposer` — these sit
  a bit further down (around where `scenes.home` starts in most builds), not
  in the same contiguous block as the rest. Grep for them by name rather than
  assuming a fixed line range.

**You must also copy the `figma/` asset folder** into your new build
directory. Icons are referenced as relative paths (`figma/icon-*.svg`); if
you only copy `app.js`/`index.html` the icons 404 silently until you check
the console.

## Patterns worth copying by name (not by file)

These live inside specific builds' scene-data sections, not the shared infra
block, so grep for the function name in whichever build has it rather than
assuming it's universal:

- `pcFtBlk(label, from, to)` — the From/To playback widget. Defined
  independently (slightly differently named: `ftBlk`, `p2FtBlk`, `pcFtBlk`)
  in several builds — they're all the same shape, pick one.
- `xpBody(state, metaHtml, listHtml)` / `XP_TABS` — the two-tab detail
  pattern (see `experiment-page-tabs-sep30` memory). Rename per-object
  (e.g. `auBody`/`AU_TABS` for an audience) to avoid collisions if you copy
  more than one tabbed object into the same file.
- `audienceBuilder()` / the `.ab-*` CSS classes — the boolean
  attribute/operator/value expression widget. Lives in
  `link-unlink-experiments-sep11/app.js`.
- `groupByCtl()`, `xpToolbar()`/`xpPager()` — list toolbar + pagination for
  any linked-object table.
- `FLOW_STEPS()` / `stepIndex()` / `gotoStep()` + the `keydown` listener at
  the bottom of the file — arrow-key step navigation. Not a skill, just a
  copy-paste convention; write a fresh `FLOW_STEPS()` for your own flow's
  states, don't inherit an old build's.

## Known failure modes (check for these before calling a build done)

- **`go()` vs `render()` inside a timer chain.** `go()` calls
  `clearTimers()` unconditionally — it's for NAVIGATING to a scene, not for
  an intermediate step within one. If a `trigger.X()` function uses
  `setTimeout(() => go(...), ...)` partway through a multi-step sequence, it
  silently wipes every timer still scheduled after it, and the flow freezes
  with no error. Use `render()` for every step that isn't the sequence's
  first or last. (Caught 2026-10-07 in the audience build's `trigger.home()`.)
- **Recorded vs. live reply buttons.** A "done" message function that always
  calls `recordedReply('Approve')` with no `active` parameter means the
  live, clickable `replyBtn('Approve', 'someId')` version never renders —
  the user gets a dead screen with no button with that id. Give these
  functions an `active=false` parameter and branch on it, same as
  `AU_PLAN(done, loading, active)` / `LK_TASK_MSG`.
- **Simulate-scenario menu double-toggling under the browser automation
  tool.** Not a code bug — `computer` click actions on the sim pill can
  double-fire against the outside-click `{once:true}` listener. Prefer
  `javascript_tool` (`.click()` directly on the element) when scripting
  through this flow for verification.
- **Stale cache-buster.** `index.html` loads `app.js?v=N`. Bump N after any
  `app.js` edit, or a dev-server/browser cache can serve the old file.

## Running a build locally

The ACTUAL dev-server config lives at `/Users/rlathiya/Trial/.claude/launch.json`
(the Trial root, not `CCO-landing/.claude/launch.json` — that nested one only
has an unrelated `ms-builds-static` entry pointed at port 5190 and is not
what `preview_start` resolves against when run from within this repo's own
session). Configured server names: `ms-dashboard` (8080), `cco-landing`
(8090, serves this whole repo), `cco-clone-sep03` (8093), `cco-rollback-sep07`
(8094), `msds-storybook` (6006). Use `preview_start({name: "cco-landing"})`
and navigate to `http://localhost:8090/<your-build-folder>/index.html`.

## Adding the landing-page card

`index.html` at the repo root lists every build under `#pane-workflows`,
newest date first. Each entry is a `.date-section` with a `.section-header`
(date + optional `New` badge — strip the badge from whatever was previously
newest when you add yours) and one `.build` link per workflow in that date
section. `data-type` drives the Targeted/IPD filter chips; `data-xd="1"`
drives the "XD only" filter — add it if the build is meant to be filterable
under that chip.
