---
name: audience-change-order-oct07
description: "Audience change-order build in CCO-landing/audience-change-order-oct07 — tabbed audience detail (Targeting | Linked experiences), operator-change flow via prompt"
metadata:
  node_type: memory
  type: project
  originSessionId: a03104fa-b603-46a6-b311-02b7a3397637
  modified: 2026-10-07T06:13:09.659Z
---

New build added 2026-10-07 to the [[project-create-change-order]] CCO-landing repo
(`Create-Change-Order.git`, served from `master`): `audience-change-order-oct07/`, linked from
the landing index as the 7 OCT card.

**THE AUDIENCE OBJECT GETS ITS OWN TWO-TAB DETAIL SCREEN** (user, 2026-10-07), mirroring the
experiment detail pattern from [[experiment-page-tabs-sep30]]: **Targeting** (the boolean
attribute/operator/value expression, reusing the `audienceBuilder()` widget already established
in link-unlink's audience-detail drill-down) and **Linked experiences** (the experiences
targeted by this audience). Opening the audience lands on Targeting by default — `auBody()` /
`AU_TABS` is a direct copy of `xpBody()`/`XP_TABS`'s pattern (tab written back into
`state.auTab`, never auto-switches).

**Flow**: prompt names a specific audience by ID/name (specific intake, no search-results table
— mirrors `XP_FETCH_CONV`'s shape) → boot/C1/C2 → audience detail. User then types an attribute
change (e.g. "Change the operator for X to Y") → From/To playback intent card (`pcFtBlk`,
disclosure "Read your request, checked the audience") → confirm ("Looks good") → **2-task plan**
("Update the targeting" / "Review the updated experiences") — this is a genuine exception to
[[draft-and-change-one-step]]'s "no separate staging step" rule because the user explicitly
asked for 2 tasks here, not a draft-then-apply pair. Task 1 rests on the Targeting tab with the
changed operator yellow-highlighted + the `hlBar` "Highlight changes" toggle, Approve. Task 2
(last task, no Approve) reviews the Linked experiences count and offers **Publish** + "View in
Campaign Manager" link, per the ms-prototype-intake convention. Publishing clears the highlight
(operator shows plain "equal to").

**Implementation note**: built as a fresh, independent `app.js`/`index.html` rather than gutting
one of the existing multi-scenario files (those — e.g. link-unlink's app.js at 7700+ lines — are
kitchen-sink files accumulating every scenario ever added to that build; forking one would have
dragged in dead scenes). Reused verbatim: the shared infra header (icons, `topbar`, `aiPanel`,
`tableHTML`, `skeletonTable`, `agentLoader`, `bootCanvas`, `expandedComposer`, `renderRail`),
`audienceBuilder`'s row/conjunction markup (renamed `auRow`/`auBuilder`/`auConj` to avoid
collision), `pcFtBlk`, `groupByCtl`, `COPY_ICON`/`INFO_ICON`/`cmLink`. Needed its own copy of the
`figma/*.svg` asset folder (every build folder carries one — copying app.js/index.html alone
leaves icons 404ing).

**Bug caught during verification**: `trigger.home()`'s intake sequence used `go()` instead of
`render()` for the `msg-prompt`/`msg-created` phase transitions. `go()` calls `clearTimers()`
unconditionally (by design, for scene *navigation*), so calling it from inside a timer callback
wiped out every timer still pending further down the same sequence — the flow would type the
prompt, then freeze there forever with `timers.length===0`. Fixed by using `render()` for the
phase transitions (no timer-clearing), keeping `go()` only for the actual entry and exit points
of the intake. **Lesson: inside any multi-step timer chain, intermediate steps must use
`render()`, not `go()` — `go()` is for navigating TO a flow, not for internal steps within one.**
Also caught: `AU_TASK1_DONE()` had no `active` param, so the live Approve button
(`replyBtn('Approve','auApproveTask')`) never rendered — it always fell back to
`recordedReply`, same bug pattern as every other task-done message in this codebase; fixed by
adding `active=false` param, same convention as `AU_PLAN`/`LK_TASK_MSG`.

Verified end-to-end live in the browser (Playwright-style click-through via `javascript_tool`,
since `computer` clicks on the sim-menu were double-firing against the
`document.addEventListener('click',...,{once:true})` outside-click handler — not a code bug,
just an automation quirk, see [[preview-tab-throttling]] for other browser-pane gotchas):
intake → tabs → operator-change prompt → playback → plan → task 1 (highlight) → task 2
(Publish offer) → published (highlight cleared).
