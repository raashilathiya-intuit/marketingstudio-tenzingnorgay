---
name: unpublish-experiment-sep24
description: "The Sep-24 unpublish-experiment build — two scenarios (draft / no draft), the purple notice copy, and the vocabulary rules"
metadata:
  type: project
---

`unpublish-experiment-sep24/` in the [[project-create-change-order]] CCO-landing repo, **copied
from [[link-unlink-experiments-sep11]]** (inherits the experiment search intake, `XP_ROWS`,
`xpMeta`, `xpToolbar`, `xpVerSelect`, `runPCStep`). Landing card under a new **24 SEP** section,
New badge moved there off 11 SEP. Page title "Marketing Studio - Unpublish Experiment".
**LOCAL ONLY so far (2026-09-24).**

Source is the CURRENT TOOL's Unpublish Experiment dialog (user supplied both variants as
screenshots).

**NO TASK SEQUENCE.** Nothing is staged, so per the `ms-prototype-intake` skill the intent card
IS the confirmation and approving it does the work:
`reading → intent → working → done`. No plan widget, no per-task canvases, no sticky tracker.

**TWO SCENARIOS, and the ONLY difference is whether a draft exists** (user, 2026-09-24).
Threaded as `state.hasDraft` (defaults true), carried through `upBase()`:
- **`unpub`** — a draft exists. Note: **"This also unpublishes its linked experiences and
  discards its current draft, which can't be recovered."** Pill **"Unpublish and discard draft"**.
  Version picker renders (both states exist).
- **`unpubNd`** — no draft. Note: **"This also unpublishes its linked experiences."** Pill plain
  **"Unpublish"**. No version picker. Disclosure substeps say "Checking the linked experiences".

**THE NOTICE IS ONE SENTENCE** (user, 2026-09-24: "this text can be optimised?"). A first pass ran
to three sentences and repeated "unpublishing"/"will be unpublished" from the card right above it.
The card already states the action, so **the notice carries only the CONSEQUENCES**. The
experiences clause comes FIRST because it holds in both scenarios — the two variants are then
structurally identical, with the draft clause simply absent from one.

**VOCABULARY — two corrections the user made during the build:**
1. **"DRAFT", NEVER "STAGE".** The real dialog says "discard the current stage version"; this
   build has always said draft. Standing rule across these prototypes.
2. **"EXPERIENCES", NEVER "OFFERS"** (user, 2026-09-24: "we dont have offers, we have
   experiences in marketing studio"). The dialog says "offers associated with the experiment will
   also be unpublished" — that is the OLD TOOL's vocabulary. The experiences clause appears in
   BOTH scenarios' notices (user asked for it on the draft one too). It lives inline in
   `UP_NOTE(hasDraft)`; an earlier `UP_TAKES_LINE` const was folded in when the copy became one
   sentence.

**END STATE:** Published → **Unpublished** (user, 2026-09-24: "change status to unpublished, not
draft" — a draft is something you are working towards publishing; an unpublished experiment was
live and has been taken down). IXP state RUNNING → **STOPPED**. Linked-experience rows →
Unpublished. `off = up==='done'` drives the header chip, the rows and the From/To, and the
playback reads `Published → Unpublished`.
**`badge()` has NO Unpublished case, so it falls through to NEUTRAL GREY** — which is correct
here and keeps it visually distinct from Draft's blue. Do not add a case for it.
**The done message ENDS ON THE OBJECT CARD** — no closing guidance line and **no Campaign
Manager link** (user, 2026-09-25 removed both). Unlike the link/unlink flows nothing is left
for the user to go and finish here, so there is nothing to point them at.
NOTE the `hasDraft` flag is unrelated: that is about whether a DRAFT VERSION exists, not the
status.

**Scenes:** `scenes.upSearch` (the search intake + results; every row is PUBLISHED because you
cannot unpublish anything else, so a draft row would be a dead end) and `scenes.upDetail` (the
experiment + the conversation). `runIntakeUp()` mirrors `runIntakeXp`. `STEPS_UP(hasDraft)` is
home → upSearch → upDetail → intent → done (5 steps); `FLOW_STEPS()` returns ONLY this build's
list — no fallthrough to the source build's (the copied-build trap).
`let scenario = 'unpub'` — the source's `'ulPub'` would have walked the unlink flow.

Preview: `http://localhost:8099/unpublish-experiment-sep24/`. Bump `?v=N` after every app.js edit.
