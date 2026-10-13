---
name: update-treatment-holdout-sep28
description: "Update treatments/holdout flow (published + draft paths) in CCO-landing/update-treatment-holdout-sep28 — 164 paged rows, holdout CLEARS 30 rows to Error then a 2-task plan fixes/reviews them (Oct-07), status timing, plan/done copy"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1897b48b-48ce-48c2-951e-dc44c9206773
  modified: 2026-10-05T02:58:07.298Z
---

Build in the [[project-create-change-order]] CCO-landing repo, `update-treatment-holdout-sep28/`.
Two paths sharing `scenes.xpDetail` with `state.tt`: reassign treatments on a **published**
experiment (creates a draft, reassigns, then a separate holdout-continuation ask sets the
holdout) vs. on a **draft** experiment (one step sets both treatment + holdout together).
Sim-menu entries: `data-sim="ttPub"` / `"ttDraft"`.

- **THE PUBLISHED PATH'S STATUS BADGE MUST FLIP TO "Edited" RIGHT AFTER THE REASSIGNMENT LANDS,
  NOT ONLY ONCE THE LATER HOLDOUT CONTINUATION LANDS** (user, 2026-09-30, on the screen right
  after "Reassigned 3 experiences": "at this point, the status of the experiment should also be
  edited"). A first version of `tedited` (near line 5980) only flipped true once the holdout
  continuation (`state.tt` prefixed `tt2`) reached `working`/`done` —
  `(tpub && inTt2 && [...].includes(T2))`. Fixed by ALSO flipping it once the MAIN reassignment
  (`T`, not `T2`) reaches `working`/`done`: `(tpub && ['working','done'].includes(T))`. Either the
  main step or the continuation being in that window is enough.
- **THE HOLDOUT STEP NEEDED SOMETHING TO ACTUALLY CLEAR — ADDED TWO NEW EXPERIENCES ON THE
  HOLDOUT TREATMENT, UNTOUCHED BY THE REASSIGNMENT** (user, 2026-09-30: "there are no experiences
  assigned to the treatment we're showing as the example for holdout... so that when we set the
  holdout, that experience also would get edited and then the treatment cell for that experience
  has a -"). Root cause: `XP_ROWS`' only 3 rows on `C_Dry_SPNewOffer_Copy2` (the eventual holdout
  target) were exactly `TT_PICK_DEFAULT` (indices 3,4,5) — the SAME rows the reassignment step
  moves OFF that treatment, so by the time the holdout step ran, the treatment was already empty.
  Added 2 more rows to `XP_ROWS` (`DRY_test_UPSELL_reco_recipe_C`, `DRY_test_XSELL_reco_recipe_C`,
  indices 6,7 — new constant `TT_HOLD_2 = [6,7]`), both starting on `C_Dry_SPNewOffer_Copy2` but
  NOT in `TT_PICK_DEFAULT`. `XP_LIST`'s hardcoded `linked:'6'` updated to `'8'` to match.
  `ttRows(base, holdoutSet, live=false)` now takes a `holdoutSet` param: once true, any
  `TT_HOLD_2` row not already part of the reassignment clears to `tmt:'–', status:'Edited',
  tmtEdited:true`. The existing "strip highlight once tt2 starts" rule (`ttableRows`) had to
  EXCLUDE `TT_HOLD_2`'s rows, since their own change happens DURING that same `tt2` step —
  stripping their highlight at the moment it should appear would mean it never shows.
- **ONCE PUBLISHED, EVERY ROW (AND THE HOLDOUT META VALUE) MUST GO BACK TO "Published"/PLAIN
  TEXT — NOT STAY "Edited"/YELLOW** (user, 2026-09-30: "once we publish, everything should be in
  published state"). `ttRows`'s `live` param: when true, a picked/cleared row gets ONLY its
  `tmt` updated, no `status`/`tmtEdited` override, so it falls through to the row's real base
  status. Same bug one level up: `ttEditedKeys` (highlights the Holdout Treatment meta VALUE)
  checked only `thl`, never `tlive` — fixed to `(ttOver && thl && !tlive)`.
  **Lesson: `tlive` governs the header via `xpHead`, but every OTHER thing this scene highlights
  (table rows, meta values) needs its OWN explicit `!tlive` check — nothing propagates
  automatically just because the header got it right.**
- **THE HEADER CHECKBOX WENT INDETERMINATE ON THE HOLDOUT CONTINUATION'S OWN "intent" (PRE-
  APPROVAL) CARD, WITH NO ROWS ACTUALLY CHECKED** (user, 2026-09-30: "indeterminate is
  incorrectly active at this point", on `state.tt==='tt2intent'`). Root cause, in `render`'s
  shared `xpDetail` block (~line 2937): `shortList` (tells `wireSelAll` to feed an EMPTY set
  instead of the stale 3-row `sel`) only checked `state.tt` against `'done'/'publishing'/
  'published'` literally — never accounted for `tt2`-prefixed states at all. A first attempt
  added only the continuation's OWN done/publishing/published (`ttT2 = state.tt.slice(3)`,
  same three strings) — still missed `tt2intent`, since "intent" isn't done-ish. Fixed properly:
  the reassignment's row selection is IRRELEVANT the moment the continuation starts AT ALL — ANY
  `tt2`-prefixed `state.tt`, not just a done-ish subset, means the table shows results, not a
  picker: `inTt2Here = isTt && state.tt && state.tt.startsWith('tt2')`, included unconditionally
  in `shortList`. Verified across all 6 `tt2*` states.
  **Lesson: when a "count as done" flag needs a variant for a related sub-flow, check whether
  the new variant's scope should mirror the same narrow subset or cover the whole sub-flow
  unconditionally — copying the narrower pattern without asking was the first mistake.**
- **PLAN CARD INTRO OVER-PROMISED STEP 1** (user: "I'll update the treatments in this order
  (task 1 doesn't change treatment)"). `TT_PLAN`'s "I'll update the treatments in this order:"
  sat above a table whose step 1 ("Create a draft of the experiment") doesn't touch any
  treatment. First fix: "I'll make these changes in this order:" (matches this file's own
  `mvPlanRows`/`lkPlanRows` pattern). User then wanted a "Here's my plan" opening — bare "Here's
  my plan:" felt incomplete with no verb, so final: **"Here's how I'll make these changes:"**.
- **"DONE" MESSAGE WORDING MADE MORE SPECIFIC, STILL A SUMMARY** (user: "do we instead want to
  say I've assigned the treatments for the 3 selected experiences. this but more specific?" —
  clarified NOT per-experience naming, "it's kinda like summarising"). `TT_DONE`'s chatBubble:
  "I've moved the N experiences to their new treatments on..." → "I've assigned the
  treatment(s) for the N selected experiences on...". Then "on the draft of X" read awkward
  (double-duty "on") — switched to possessive **"on X experiment's draft"** (a first pass
  dropped the word "experiment" by mistake, caught against the user's own exact wording and
  fixed). Final: "I've assigned the treatments for the 3 selected experiences on
  ty25_Catchall_PLU experiment's draft."
- **`TT2_DONE`'S "It's now edited" DROPPED, "EXPERIMENT" ADDED AFTER THE NAME** (user: "I've set
  X as the holdout treatment for Y experiment... no need to say it is not edited and all") — the
  object card right below already shows "(draft)" visually, so the sentence saying it too was
  redundant. Final: "I've set C_Dry_SPNewOffer_Copy2 as the holdout treatment for
  ty25_Catchall_PLU experiment." (Distinct from `TT_DONE` above — draft-path/reassignment done
  message, not this one.)
- **BARE "Search results" REPLACED WITH AN ACTUAL SENTENCE** (user: "give a sentence for search
  results. give here we finalise then you apply") — every OTHER search-results message in this
  file has a real sentence ("I found N experiences linked to X", "Here's the experiment.");
  this was the one outlier with no copy at all. This step is a checkpoint (pick which experiment
  to open) before any change is applied, so the wording should read that way, not as an action.
  First landed on "I found N experiments. Open one to continue." — then the "Open one to
  continue" clause itself got cut (user: "dont tell user what to do. just say I've 3 experiments
  matching your ask") — telling the user what to do next isn't this message's job, it's just
  reporting what was found. Final (`XP_SEARCH_CONV`, ~line 4699): **"I found N experiments
  matching your ask."** — "matching your ask" quietly nods to the find prompt above it without
  repeating it verbatim, and reads as report-only.

- **THE VERSION-PICKER DROPDOWN STAYED INTERACTIVE AFTER PUBLISH — SHOULD GO BACK TO INERT, SINCE
  THE DRAFT NO LONGER EXISTS SEPARATELY** (user, 2026-09-30: "at published state, my dropdown
  should be disabled since at this point no longer any draft exists" — screenshot showing the
  Draft/Published version-history menu still open at `tt2published`). `tstaged` (feeds
  `xpVerSelect`'s `staged` param, which gates `verselect--live` vs `verselect--off`) included
  `inTt2` UNCONDITIONALLY, so it stayed true straight through `tt2publishing`/`tt2published`, long
  after the draft had been consumed by publish. Fixed: `tstaged = tpub && !tlive && (...)` —
  excluding `tlive` mirrors `tSRC`'s own existing `tlive || (tpub && !tstaged)` check just below
  it, which already treated "live" as "no draft view left"; `tstaged` just hadn't caught up.
  Verified across `done`/`tt2intent`/`tt2done` (still `verselect--live`, correctly interactive —
  the draft genuinely exists as a separate version there) vs. `tt2publishing`/`tt2published`
  (now `verselect--off`, confirmed by clicking it live and seeing no menu open).

- **THE "Edited" BADGE DROPPED BACK TO "Draft" DURING EVERY tt2 LOADING/TRANSIENT STEP** (user,
  2026-09-30, on the "Reading your request" loader at `tt2reading`: "why has experience status
  gone back to draft?"). Root cause in `tedited`'s third clause,
  `(tpub && inTt2 && ['working','done'].includes(T2))`: `T` is the FULL `state.tt` string, which
  becomes the tt2-prefixed value (e.g. `'tt2reading'`) once the continuation starts — it is
  NEVER literally `'done'` again after that point, so the first two clauses
  (`['working','done'].includes(T)`) were always false during `inTt2`. The third clause then
  ALSO failed at any T2 state outside `working`/`done` (`reading`, `intent`, `publishing`,
  `published`), since `reading`/`intent` aren't done-ish and `publishing`/`published` should
  actually flip to "Published" via `tlive`, not "Edited" — so at `tt2reading`/`tt2intent`
  specifically, ALL THREE clauses came up false and the badge fell back to the base "Draft"
  label, even though nothing had un-edited the experiment.
  Fixed: once `inTt2` is true AT ALL, the reassignment that got it there is categorically already
  done — no need to re-check `T2` against a done-ish list. Third clause simplified to
  `(tpub && inTt2)`. Verified across all 6 `tt2*` states: badge reads "Edited" through
  reading/intent/working/done, "Published" at publishing/published (once `tlive` takes over).
  **Lesson: `T`/`T2` in this scene are STRINGS, and `T` specifically stops being the bare value
  ('done', 'working', etc.) the moment `inTt2` starts — any check comparing `T` against those
  literal strings will silently fail for the entire tt2 window. `inTt2` itself is the correct,
  simpler signal for "the reassignment phase is over" — reach for it directly instead of
  re-deriving the same fact from `T`/`T2` comparisons.**

- **THE REASSIGNMENT'S HIGHLIGHT WAS STRIPPED THE MOMENT `tt2` MERELY STARTED, BEFORE THE
  HOLDOUT HAD ACTUALLY LANDED** (user, 2026-09-30, on the pre-approval "intent" card: "next step
  has not happened so why is yellow highlight on the cells removed?"). `ttableRows`'s "strip
  highlight once the continuation is in play" rule (2026-09-29 decision) was gated on `inTt2`
  alone — true from `tt2reading` onward, i.e. before Approve is even clicked. Confirmed with the
  user this should instead wait for the holdout to actually apply: added
  `holdoutApplied = inTt2 && ['working','done','publishing','published'].includes(T2)`, gating
  the strip on THAT instead of bare `inTt2`. Verified: rows 3-5 keep their highlight through
  `tt2reading`/`tt2intent` (pre-approval), lose it only at `tt2done` onward — matching when
  TT_HOLD_2's own rows (6-7) gain theirs.
- **THE FLOATING STEP BANNER TEXT WRAPPED TO 2 LINES INSTEAD OF TRUNCATING** (user, 2026-09-30,
  on "2. Reassign the experiences to their new / treatments on the draft" breaking mid-sentence)
  — `aiPanel`'s `opts.step` sat as a bare TEXT NODE directly inside `.cv`, so there was no
  element for `text-overflow:ellipsis` to apply to. Wrapped it in its own
  `<span class="ai__step__label">`, gave `.cv` `min-width:0` (so the flex item can actually
  shrink below its content width) and gave the new label span the ellipsis/nowrap/overflow-hidden
  trio. Verified: "2. Reassign the experiences to the…" now renders on one line.
- **THE FLOATING STEP BANNER STAYED ON "3. Set the holdout treatment..." EVEN WHILE SCROLLED UP
  TO REVIEW A DIFFERENT TASK'S OWN CONTENT** (user, 2026-09-30, screenshot showing the banner
  above the reassignment's OWN "Here's how I'll make these changes" plan card: "the third one is
  a separate task so we do not need the floating thing on top"). Confirmed with the user: the
  holdout continuation isn't really "step 3" of the reassignment's 2-step plan at all — it's a
  separate task, so it shouldn't get a floating step banner of its own. Dropped the
  `tpub && inTt2 ? {step:'3. Set the holdout treatment...'}` branch entirely from the `aiPanel`
  call — steps 1/2 (`staging`/`stagereview`, `working`/`done`) still float their own banner as
  before; the tt2 continuation now shows none at all.

- **THE DRAFT PATH'S OWN DONE MESSAGE HAD THE SAME REDUNDANCY PATTERN AS `TT2_DONE`, FIXED THE
  SAME WAY** (user, 2026-09-30, replacing "I've assigned the treatments for the 3 selected
  experiences on ty25_Catchall_PLU_holdback, and set B_RealTest_Control as the holdout treatment
  for this experiment. It's now edited." with: "I've assigned the treatments for the 3 selected
  experiences and set the holdout treatment for this experiment."). `TT_DONE`'s draft-path
  (`!pub`) branch repeated the experiment name, named the specific holdout treatment inline, and
  tacked on "It's now edited" — same redundancy the published-path `TT2_DONE` fix already
  addressed (the object card right below already shows "(draft)"). Since the draft path does
  BOTH treatment + holdout in this ONE step (unlike the published path's two separate asks),
  neither the location nor the specific holdout name needs restating. Published path's own
  branch (`pub?...`) is untouched — verified both still render correctly.

- **SETTING A HOLDOUT ASKS WHERE THE AFFECTED EXPERIENCES GO — NOTHING IS EVER CLEARED TO "–"**
  (user, 2026-10-05: "Ask for new treatment associations when setting a holdout because we
  should not lead users into an error state. having no treatment associated to an experience
  leads to an error"). Published path is now `done → tt2reading → tt2ask → tt2reading2 →
  tt2intent → tt2working → tt2done → tt2publishing → tt2published`: `TT2_ASK()` is **QUESTION
  CONTEXT FIRST, THEN THE QUESTION, THEN OPTIONS WITH CONTEXT** (user, 2026-10-05, three
  passes: a first version was "jargony"; "ask which treatment should these experiences be
  assigned to and then give treatment options"; "we cant use these two. give context"; and
  finally "what does these 2 mean to the user? where is the context? we sort it out here
  before you apply" — the user picked option B) — intro **"To make C_Dry_SPNewOffer_Copy2 the
  holdout, the 2 experiences on it need a new treatment first:"**, the affected experiences as
  a plain unnumbered list (`.tmtList--plain`, `overflow-wrap:anywhere` or the names clip),
  **"Which treatment should they be assigned to?"**, then "Treatment options:" as a numbered
  list of the other treatments EACH WITH ITS ALLOCATION AND CURRENT EXPERIENCE COUNT
  ("D_RealTest (40%, 5 experiences)"). NO purple note: the first line already implies the rule.
  **Lesson: a question that starts with "these N" has no antecedent for the user — tie it to
  their own ask in the first line, and offer copy options before applying.**
  `TT2_AFFECTED()` = XP_ROWS on `TT_HOLDOUT_PUB` not in `TT_PICK()`; the answer `TT2_ANSWER` ("Assign them to treatment D_RealTest.") types
  itself (`typed3`, `trigger.tt2AnswerSend` → `runTt2Answer`); `TT2_INTENT` then shows the
  holdout From/To AND a numbered `.mxAssign` list name → `TT2_NEW_TMT`; `ttRows(base,
  holdoutSet, live, holdout)` reassigns every row still on `holdout` to `TT2_NEW_TMT` (Edited +
  highlight, plain once live). `TT2_DONE` says "...and assigned the 2 experiences that were on
  it to D_RealTest." `TT_HOLD_2` is deleted; `ttableRows`' highlight exception uses
  `TT2_AFFECTED()`. STEPS_TT/stepIndex carry `tt2ask` (12 steps). The old "This will clear all
  current experience associations" note was the error state itself and is gone.
  DRAFT PATH: its holdout (B_RealTest_Control) has nothing on it, so no question; `ttHoldoutNote`
  is now honest ("No experiences are on B_RealTest_Control, so nothing else changes") and the
  draft path no longer wrongly cleared rows 6-7 (they are on C_Dry, not the holdout) — that
  was a latent bug of the hardcoded `TT_HOLD_2`.

- **SUPERSEDED 2026-10-07: THE HOLDOUT NO LONGER ASKS A QUESTION, IT CLEARS AND THEN A 2-TASK PLAN
  FIXES THE CLEARED ROWS** (user: "the moment I say I want to set something as the holdout it will
  tell me that some 30 experiences need a new treatment... setting a holdout clears all the
  association with that treatment... first tell the user these associations will get removed").
  Published path is now `done → tt2reading → tt2intent → tt2planning → tt2plan → tt2working →
  tt2cleared → tt2reading2 → tt2intent2 → tt2working2 → tt2fixed → tt2reviewing → tt2review →
  tt2publishing → tt2published` (`T2_ORDER` + `t2at()` in the xpDetail block).
  `TT2_INTENT` = From/To (None → C_Dry) + purple `TT2_CLEAR_NOTE` **"This will clear all the
  current experience associations with X. The 30 experiences on it will need a new treatment."**
  (the product's own confirm-dialog register) → Approve → `TT2_PLAN` (`TT2_TASKS`: "Review experiences with cleared treatment" (user's wording) / "Review the updated experiment", audience-build shape, intent card FIRST
  then plan). Task 1 canvas is **EXPERIENCES ONLY, no experiment header/tabs/meta**, title
  `TT2_CLEARED_TITLE()` = "Experiences with cleared treatment"; `TT2_CLEARED` uses the build's
  ERROR FORMAT (user, 2026-10-07, from the clone build): headline + red `.issueCount` "found 30 issues.", object card, red `.msgErr` line with `ERR_ICON`, plain follow-up; the 30 rows read
  Status **Error** + Treatment "–" (`ttRows(..., assigned)`); the composer auto-types `TT3_PROMPT()`
  "Assign all 30 experiences with cleared treatment to D_RealTest." (`typed3`) → `TT3_INTENT` → Approve
  → rows Edited/highlighted → `TT3_DONE` ends in Approve (not last task) → task 2 `tt2reviewing`
  = whole-page skeleton back on the experiment → `TT2_REVIEW` offers Publish + CM link, copy = user's own line **"Here's the updated draft. The holdout treatment is set, and all 30 experiences that were on it now have a new treatment."** `TT2_CLEARED` headline is the CLEARING, not the holdout (user: the holdout landing is back-end): **"I've cleared the treatment for the 30 experiences that were on C_Dry_SPNewOffer_Copy2, since it's the holdout treatment, found 30 issues."** red line only **"Treatment is missing on all 30."** then "Tell me which treatment they should move to and I'll update them." Sticky
  tracker (`tStep`): step 1 spins on working/reading2/working2, numbered (stepNum) on
  cleared/intent2, check at fixed; step 2 spins on reviewing. `TT2_ASK`/`TT2_ANSWER`/`tt2ask`/
  `tt2done` are gone. STEPS_TT ORDER: intent, done, tt2intent, tt2plan, tt2cleared, tt2intent2,
  tt2fixed, tt2review, tt2published.
- **SCALE + REAL PAGING (2026-10-07)**: `XP_ROWS` = the 8 hand-written rows FIRST (indices 3,4,5 stay
  the default pick) + generated rows (28 more on C_Dry → 33 total, minus 3 picks = 30 affected;
  66 D_RealTest; 62 B_RealTest_Control) = **164**. `XP_LIST`'s linked count is `String(XP_ROWS.length)`.
  `pageOf(n,size,page)` / `xpPager(n,size,page)` with real `<button data-pagenav=±1 data-pages>`
  chevrons (CSS `.pager__btn`), generic handler at the tail of `wire()` → `render(name,{...state,
  xpPage})` (render not go, same rule as xpTab). `tableHTML` takes `opts.offset` or `opts.rowIdx`
  so a paged/filtered slice keeps GLOBAL indices (selection, drill, highlights). `wireSelAll`
  select-all acts on the visible page only. `ttBase()` carries `xpPage`; `runTt2Work`/`runTt2Review`
  reset it to 1 because the list changes. The tt table is 10/page.

Cache-buster at v60 after the clear-then-fix rework (`update-treatment-holdout-sep28/index.html`).
Pushed 2026-10-07 to Create-Change-Order `master` d5a2847 (only the two build files; landing index, placement-change and the untracked docs/builds were left uncommitted).
