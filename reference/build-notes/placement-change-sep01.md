---
name: placement-change-sep01
description: "The Sep-01 placement-change workflow build in CCO-landing — scenes, state keys, and the field-input card pattern it introduced"
metadata:
  type: project
---

`placement-change-sep01/` in the [[project-create-change-order]] CCO-landing repo, copied from
`delete-experiences-aug28` (see [[cco-aug28-experience-workflows]] for the shared conventions it
inherits: selection thread, `scheduleAskType`, step-nav via STEPS arrays, `expDrillCanvas`).
Landing card sits under a new **1 SEP** section, `data-type="ipd"` + XD only; the New badge moved
there off 31 AUG.

Single scene `pcSearch`, single scenario (`scenario='pc'`), state key `pc`:
`reading → understood → naming → fields → planning → plan → updating → placement → fixing →
bodyfixed → building → experience → done`. Extra state: `fields:{subheader,footnote}`, `expName`,
`hl`, `fixTyped`.

Flow (revised 2026-09-02): prompt "Change placement to Batch save - hellobox and template to
hellobox - text." → results table (single-select) → auto-typed ask → **intent card: Placement
From/To FIRST, Template From/To below, then an info note** ("Changing the placement creates a new
experience. The one you selected stays as it is.") → Looks good → **name card, prefilled with
`ELM9684-IPD-QBPayroll-BatchSaveHellobox-HighPS-US`, editable, NO typing animation** → Proceed →
two-field card (subheader/footnote, types on click) → Proceed → plan (1. Update placement and
template, 2. Review the newly created experience) → **task 1 = placement drill-down: the access
point/template card sits ABOVE the Creative heading + toggle** (we're in the PLACEMENT's drill-down,
not an experience's Creative tab) and the carried-over body copy is over the text template's limit,
so a field error shows on the canvas AND in the AI message → the fix ask auto-types into the
composer → Send → **canvas AND panel both load**, the old message's Approve pill goes dead
(`.cardReplyBtn.is-dead`) → new "I've updated the body copy" message + Looks good → task 2 (new
experience, no back button, named from `expName`) → done.

Body copy limit is `BODY_LIMIT=100`; the error string derives from `CREATIVE_BODY.length` (113) so
it can't go stale: "Body copy exceeds the character limit. 113 of 100 used."

**MULTI-SELECT ACCESS POINT CHANGE — scenario `mp`, state key `mp` (built 2026-09-25).** Same
scene `pcSearch`. Pick SEVERAL rows, ask to change the access point **without naming the
destination**, so the AI asks for it and the answer is what the rest is built on. That question is
the ONLY structural difference from the clone flow, where the selection is acted on immediately.
`asking → answering → understood → naming → planning → plan → w1 → t1err → fixing → t1fixed → w2
→ done → publishing → published`.
- **SHAPE FOLLOWS `cl6` IN THE CLONE BUILD — validation is fixed BEFORE creating** (user,
  2026-09-25). Task 1 stages the change and fails validation with no approve pill; task 2 creates
  from the corrected staging. Do NOT copy the older flag-after-create shape.
- **Naming is a RULE, not N fields** (the clone build's decision): one card says the access point
  inside each existing name is swapped. No per-experience input.
- **THREE PROMPTS SHARE ONE COMPOSER** — the opening ask, the access-point answer, the copy fix.
  `scheduleAskType` REFUSES to type into a box that already has text, so each new ask must CLEAR
  the composer first (`clearComposer()`), and the composer is also cleared on every state after a
  prompt has been sent or a spent prompt sits there for the rest of the flow.
- **The table was hardcoded SINGLE-select.** `pick()` now branches on `scenario==='mp'` to toggle;
  `wireSelAll` is wired for it; and the frozen guard RESTORES `cb.checked` rather than returning
  early (native checkboxes have already toggled themselves by then).
- **Prose uses display labels, not the system constants.** `NEW_TEMPLATE` is `helloboxText` and
  `NEW_PLACEMENT` is `Batch save -hellobox` — correct in a From/To cell, wrong in a sentence.
  `MP_AP_LABEL` / `MP_TMPL_LABEL` carry the readable forms.
- Own step list `STEPS_MP` + `MP_ORDER` in `stepIndex`, or the arrows walk the `pc` flow.

New pieces this build introduced (reusable):
- **IDS Text field** (Figma MS Theme 1.2.0 `3107:62482`): label 14/1.3 **regular** `#6b6c72`
  (sentence case, NOT an uppercase 12px key), 4px gap, input 16/1.3, border `#dddee3`, radius 8,
  padding 6px/8px, placeholder `#babec5`. CSS `.fieldSet`/`.fieldRow`/`.fieldRow__k`/`.fieldRow__in`.
- **Field-input card** (`pcFieldCard`): contenteditable fields; `.is-empty` shows `data-ph`.
  **Clicking into the FIRST field types out BOTH answers** at 18ms/char and chains to the next
  empty field, matching the guided-demo model (the reviewer never types). Manual typing still
  overrides. Values held in a local `vals` object and synced to `current.state.fields` without a
  re-render, so the caret never jumps. Proceed disabled until every field has content.
- **"Highlight changes" action bar.** `hlBar(on)` renders it and the `[data-hlchanges]` handler in
  wire() is already global, so the ONLY work is (a) calling `hlBar(state.hl!==false)` at the bottom
  of each review canvas and (b) gating every yellow on that flag rather than hardcoding `cd-hl`.
  Threaded through `expDrillCanvas({hl, hlBar})` → `newFieldDetail(view,{hl})` →
  `helloboxCreative(hl,{...,hl})`. Applies in Detail AND Preview. Same easy-to-miss cause as the
  task tracker: a single state-keyed scene has no per-task canvas to copy the call from.
- **Task tracker at the top of the AI panel.** `aiPanel({step, stepLoading})` renders it; it is
  EASY TO FORGET when a flow lives in one state-keyed scene instead of one scene per task, because
  there is no per-scene `artifactScreen({step})` call to copy. Label format is `'N.  Task name'`
  (two spaces after the dot). Here a `STEP_BY_PC` map keys it off `state.pc`: it appears only once
  the plan is running, spinner while the task executes, check once it settles.
- **"Access point" is called "Placement"** in this build: the results-table column, the placement
  review canvas, and the experience drill-down attribute pair. (The dead create/CO flows in the
  same file still say ACCESS POINT; left alone.)
- **`inline-block` does not survive a flex parent.** `.ab-conj` (the AND/OR chip in the audience
  builder) was stretching to full width because `.pad` is `display:flex` and a flex item ignores
  inline-block sizing. Needs `align-self:flex-start; width:fit-content`. The OR chip looked right
  only because `.ab-orwrap` wrapped it in a block.
- **QA status badges on the placement review.** `.qaBadge--err` "QA Error" (`#fad7d6`/`#d52b1e`,
  Figma MS-2.0 5323:102495) while the copy is over the limit, `.qaBadge--ok` "Verified"
  (`#e5f4d9`/`#006c23`, 1030:59370) once fixed. 12/500, r4, 2x8 padding. Sits in the title row after
  a `.detail-vd` vertical divider. Hidden while the canvas is loading.
- **20px rhythm on the placement canvas** (`.pad--pl`): title row → attribute card → Creative
  heading → creative card, all exactly 20px. The generic `.detail-sticky .detail-h{margin-bottom:16px}`
  and `.cd-attr{margin-bottom:20px}` had to be overridden, scoped to this canvas only.
- **A blocked step offers NO approve pill.** With the body copy over the limit there is no way
  forward but to fix it, so task 1's message drops Approve entirely and closes with
  "Send me body copy within 100 characters and I'll update it." The headline carries
  `<span class="issueCount">found 1 issue.</span>` in red.
- **Carry a correction forward.** Task 2's creative must render `BODY_FIXED` (highlighted), not
  `CREATIVE_BODY` — hardcoding the original there silently showed the user the copy they'd just
  replaced.
- **Info note vs warning note.** `.infoNote` (Figma MS-2.0 9179:74848) = purple `#6f5ade` filled
  circle, 14/1.5 `#6b6c72`, white bg, NO border. Use for "here's a consequence" (a placement change
  forking a new experience). `.warnNote` (orange border) is for destructive/irreversible only.
- **Field errors carry NO border.** Figma 6306:11217: the label and value stay exactly as they are
  and a red `#d52b1e` icon + 14/500 message sits underneath (`.cd-pair__err`). Do NOT add a red
  border to the field. The in-conversation variant is `.msgErr` (Figma 8327:12515), same treatment
  under the object card.
- **A superseded reply pill goes dead, it does not disappear.** `.cardReplyBtn.is-dead` (grey border
  + `#babec5` text, `disabled`) keeps the history readable while making clear the branch is closed.
- **Nested `.convoTurn`.** The outer turn is `min-height:calc(100% + 40px)` so a new ask snaps to
  the top. A turn nested INSIDE another (a follow-up within the same task) must be
  `min-height:0`, or the panel ends on a full screen of whitespace. A follow-up in the same task
  also carries NO "Selected n experiences" divider — that belongs to the selection-scoped ask only.
- **Runners must carry prior answers explicitly.** Each runner rebuilds state from scratch, so
  `pcBase()` re-threads selection, `fields`, `expName` and `hl`. Dropping one silently resets that
  card (the name field reverting to the proposal, the subheader emptying, etc).
- **Caret handling in the scripted typing.** Two traps, both fixed: (1) assigning
  `el.textContent` each tick REPLACES the text node, so the caret collapses to offset 0 and the
  cursor sits at the start of the field forever. Append with `textNode.appendData(ch)` instead so
  the node survives. (2) `range.selectNodeContents(el) + collapse(false)` lands on a CHILD-INDEX
  position on the div, not a text offset. Use `range.setStart(textNode, textNode.length)` to put
  the caret INSIDE the text node. Also `el.focus()` as the chain advances, so the caret is visibly
  in the field being filled.
- `expDrillCanvas` gained an opts arg: `{noBack, tmpl, ap, name, eid, status, ver, hlTmpl, newFields, fields}`
  so the same detail canvas serves both "navigated into" and "under review" roles.
- `helloboxCreative(hl, {sub, foot, tmpl})` — optional subheader (`.hb-sub` under the headline),
  footnote override, and template name in the caption.
- **Highlight must hug the TEXT, not the container.** Wrap the value in `<span class="cd-hl">`
  (works in table cells and in `.cd-attr__v`). Do NOT use `editedRow:true` (paints the whole row)
  or put `cd-hl` on a block element like `.cd-attr__v` (stretches full cell width).
- **Disclosure labels must match what actually happened.** The search step says
  `Searched and found ${PC_ROWS.length} experiences` (it returns a result set), NOT the inherited
  "Looked at your brief, created a summary" — no summary is produced and there is no uploaded
  brief in a prompt-driven flow. That stale label still sits in the dead-code flows in this file
  (lines ~790/850/902/1344/1484) and in the older builds; left as is deliberately.
- **Don't repeat the ask.** The field card's intro carries the whole instruction
  ("The new template needs two more fields. Fill these in and I'll put together a plan.");
  the separate `.summaryCard__q` closing line was removed as a duplicate.
- **A single object means no list.** Task 1 reviews ONE placement, so it lands directly in the
  placement's drill-down (title + Creative header + Detail|Preview toggle + one `.cd-card`)
  instead of a one-row table.

**RENAMED to "ACCESS POINT" 2026-09-11.** This build now says "access point", never "placement",
matching the clone build (see [[clone-ipd-experiences-sep03]], which was renamed the same day and
carries the full method). The user asked for the clone flows first, then extended it here after
seeing this build's search screen and thinking it was the clone one.
- Page `<title>` is "Marketing Studio — Access Point Change"; the sim label is "Change access point
  **and** template on an experience" (the old "Change placement template" read as one compound
  thing once renamed, so the `and` was added); the landing card is "TO / IPD - Access point change"
  / "Change an experience's access point and template…".
- **`'placement'` is a LIVE pc STATE NAME in this build** (task 1), used in ~12 comparisons,
  `PLAN_RUNNING`, `PC_ORDER`, `PC_S(...)` and the `stepIndex` resolver. The string-aware rename hit
  all of them and every one had to be reverted — unlike the clone build, where the same literal was
  dead code. The folder name, `wbPlacementScene`, `runPCPlacement`, `placementDrill`,
  `--node-placement` and the `{key:'placement', type:'placement'}` data keys are also unchanged.
- Display labels that live inside `${...}` were skipped by the tokenizer and needed hand-fixing:
  `objectCard('thumbnail','Placement - Batch save hellobox')` (x2) and
  `'Placements - DIWM QB Live campaign'` (x2).
- Verified by walking all 9 pc states and grepping `document.body.innerText` — not by eye.

**WORKFLOW 2 (`pc2`, built 2026-09-11) is now the CURRENT flow; the original `pc` is greyed out**
in the sim menu as "Change access point, fill fields up front (earlier draft)". `scenario` defaults
to `'pc2'`. The muted CSS (`.simMenu__item--muted{color:#8a8b93}`) was ported from the clone build
and MUST sit after `.simMenu__item` — same specificity, source order decides.
Two changes from `pc`, both the user's spec:
1. **The new template's fields are a READBACK TABLE, not a form.** `pc2FieldCard` lists each field
   with "Needs content" in the existing `.ft` key-value markup (no new CSS), then
   `dlLink2()` = "Download missing field summary", then Proceed. The agent does NOT block asking
   for content it does not need yet: "dont ask now, give a download missing field summary".
2. **NO plan widget.** `planning`/`plan`/`updating`/`placement`/`fixing`/`bodyfixed` as a separate
   access-point-review task are gone from this path; Proceed on the readback goes straight to
   building the experience, which lands WITH its errors.
States: `reading → understood → namingWait → naming → fieldsWait → fields → building →
experience → fixing → verified → done`.
3. **ONE content reply supplies all three values** (user, 2026-09-11): the shorter body copy AND
   both new fields, auto-typed into the composer at `experience`. The separate body-only fix turn
   is gone (`PC2_BODYFIX`/`bodyfixed` → `PC2_VERIFIED`/`verified`). `pc2ContentPrompt()` (plain
   text with `\n` + bullets, for the composer — needs `white-space:pre-wrap` on
   `.promptBox__input--filled`) and `pc2ContentBubble()` (real `<ul class="msgList">`) render the
   same `PC2_CONTENT_PAIRS`, so the two cannot drift. Pattern ported from the clone build's
   `cl3FixPrompt`/`cl3FixBubble`; `.msgList` CSS came with it.
4. **Supplying content EDITS the experience**: at `verified` the status is **Edited**, the version
   is **v2** (created at v1), and all three new values carry the `.cd-hl` yellow highlight
   alongside the changed Template. `pending:!fixed2` and `fields: fixed2 ? PC_FIELD_VALUES : {}`
   drive it. Both panes load during `fixing` (conversation loader + canvas skeleton).
5. **Status is `Error` while anything is flagged**, not Draft — the `badge--err` case and its
   `#fad7d6`/`#d52b1e` CSS were ported from the clone build, which had the same single-status rule.
6. **Missing fields render a bare `-`** with the error beneath (user's exact spec: `SUBHEADER` /
   `-` / `Subheader needs content.`), not prose like "No content yet".
7. **The download is offered ONCE**, on the field readback. Repeating it on the experience message
   was redundant (user).
- `PC2_EXPERIENCE` reports n+1 issues (the body-copy overflow plus each empty field) and has NO
  approve pill — the content must be sent first. `PC2_VERIFIED` says the experience is on v2 with
  no issues and carries the Approve.
- `newFieldDetail` gained a **`pending`** mode: the two new fields render "No content yet" in
  placeholder grey with their own `.cd-pair__err`, and BODY carries the over-limit error until
  `bodyFixed`. The old path's behaviour (fields filled, body already corrected) is untouched.
- **THREE bugs the user caught, all from verifying the wrong way** (injecting state with `go()`
  skips pill wiring, and I never exercised the arrow keys):
  1. **`FLOW_STEPS()` returned `STEPS_PC` unconditionally**, so LEFT/RIGHT arrow navigation walked
     the OLD flow — plan and all — long after pc2 became the default. This is why the "removed"
     plan widget kept appearing. Added `STEPS_PC2`/`PC2_ORDER` and routed by `scenario`.
     **The step-nav is a SEPARATE path from the click flow; verify both.**
  2. **The Proceed pill was dead**: its binding sat inside `if(inputs.length){...}`, and pc2's
     field card is a readback with NO `[data-field]` inputs, so the block never ran. Bindings for
     a card without inputs must live OUTSIDE that block.
  3. **The composer kept the sent prompt** for the whole flow: the draft guard tested only
     `!state.pc`, and pc2 never sets `state.pc`.
- Shared wiring that had to learn about `pc2` (each one a real bug otherwise): the Send router,
  the chip-clear guard, the auto-typed clone ask, the body-fix auto-type, the name card's Proceed,
  `onTask2` (or the creative Detail/Preview toggle and tabs do not bind), the selection chip's
  `PC2_RUNNING` list, and `pcSend`/`pcLooksGood` routing by scenario.
- **`>PLACEMENT</div>` attribute labels are invisible to the string-aware rename** (they sit inside
  `${...}`): 2 in this build, 3 in the clone build, all fixed by hand to `ACCESS POINT`.
- **A missed state-name revert almost broke the old flow**: `runPCPlacement` still set
  `pc:'access point'` after the rename. Grep `pc:'access point'` after any such rename.
