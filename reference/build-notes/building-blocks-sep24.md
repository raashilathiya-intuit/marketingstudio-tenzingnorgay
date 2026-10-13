---
name: building-blocks-sep24
description: "The Building blocks reference library in the CCO-landing repo — Comparison screens, how to add a tab or a new block"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1897b48b-48ce-48c2-951e-dc44c9206773
  modified: 2026-10-01T14:38:47.931Z
---

**BUILDING BLOCKS** (created 2026-09-24) in the [[project-create-change-order]] CCO-landing repo.
A REFERENCE LIBRARY, not a flow: reusable screens pulled out of the flow builds so they can be
looked at on their own and copied into the next build.
**PUSHED 2026-09-24 in `48f133b`** (tabs + the three built tabs).

Two pieces:
1. `index.html` — **TWO TOP-LEVEL TABS: `Workflows` and `Building Blocks`** (user, 2026-09-24),
   above the type filters. Panes are `#pane-workflows` (all the dated sections) and
   `#pane-blocks`; `.sections.hidden, .filters.hidden{display:none}`. **The type filters belong to
   Workflows only and hide with it** — Building Blocks holds reference screens, not Targeted/IPD
   flow builds. Tab styling is `.tabs`/`.tab` with the active underline on `::after` at
   `bottom:-1px` so it sits ON the container's border.
   An EARLIER PASS made this a section plus a separate `building-blocks.html` list page; the tabs
   replaced both and that file was DELETED.
2. `building-blocks/` — the screens themselves (`index.html` + `app.js` + a copy of `figma/`).

**THE SCREENS ARE STATIC REFERENCE — no scenes, no timers, no autopilot, no `scheduleAskType`.**
**BUT THE CONVERSATION PANE IS PRESENT AND BLURRED** (user, 2026-09-24: "where did the
conversation pane go? give it just blur it"). A first pass dropped it entirely, which changed the
canvas proportions — the real screen is always two-pane and the comparison table is sized by what
is left beside the panel. `cmpPanel()` renders a real `aiPanel()` carrying the rollback flow's own
turns, with `aria-hidden` and `.ai--blurred`.
**BLUR THE CONTENTS, NOT THE CONTAINER** (user: "i dont see the container border. you blurred
everythign"): `.ai--blurred{pointer-events:none;user-select:none}` +
`.ai--blurred > *{filter:blur(4px);opacity:.85}`. Blurring the `<aside>` itself smeared its white
card, border and radius into the page and it stopped reading as a panel. `app.js` is ~360 lines: chrome and helpers copied
VERBATIM from `rollback-experiences-aug28` (ICONS/`icon()`/`I`/rail/`topbar`/`badge`/`COPY_ICON`/
`DETAIL_ICON`/`IMAGE_ICON`/`helloboxCreative`/`cdPair`/`hlBar`) so the screens stay pixel-identical
to the real flow, then a tiny router: `cmpState = {tab, view, hl}` → `render()` → `wire()`.
The CSS is the rollback build's whole `<style>` block plus a short page-only tail (`.cmpTodo`).

**COMPARISON SCREENS** — source is the rollback flow's task-1 canvas (`rb1Canvas` with `state.cmp`,
`rb1CmpTable`, `rb1CmpPreview`). Same experience: `ELM9071-IPD-HelloChartAcc-US-QBL-QBLAST-NAQL-XSLL`,
project crumb "QB Payroll Targeted offers". Header has **NO status badge and NO version picker** —
the screen shows two versions at once, so neither applies.
- `cmpTable(fields, hl)` is the SHARED PRIMITIVE: three columns (Fields / `CMP_VA` Version 3
  (current) / `CMP_VB` Version 4 (new draft)), changed rows highlighted **in the B column only**.
- **TO ADD A TAB: give its `CMP_TABS` entry a `fields` array** — `[label, versionA, versionB]`
  triples — and it renders exactly like Creative with no other change. Optionally a `preview`
  function for a Detail/Preview toggle (the toggle only renders when `preview` exists, so a
  table-only tab shows no dead control). Until then the tab shows `cmpTodo()`, which says plainly
  that it is not built yet rather than faking a screen.
- **AUDIENCE AND EXPERIMENT ARE BUILT BUT HELD BACK** (user, 2026-09-24: "keep audience and
  experiment local, keep some placeholder"). Their `CMP_*_SECTIONS` arrays stay in `app.js`, unwired; their `CMP_TABS` entries carry `wip:true` and a generic title. **To ship either: put
  `sections:CMP_AUDIENCE_SECTIONS` / `sections:CMP_EXPERIMENT_SECTIONS` back on the entry and
  restore the real title** (`AUD_AUDIENCE2-QBO_HighPriceSensitivity` / `IPD High Price Sensitivity · IXP
  321931`). Placeholder copy is short: "<Tab> comparison — coming soon".
  The reason for holding them: their v3/v4 diffs are still MY invention, not confirmed.
- **THE `test-skill-export` CARD IS SEPARATE, UNCOMMITTED WORK.** It sits in the same `index.html`
  and its folder is UNTRACKED, so committing the card would publish a dead link. When pushing
  index.html changes, stash it out and re-add it after (done on the 48f133b push).
- All five tabs' DATA is written (2026-09-24): Creative (CTA text + CTA URL), Experience meta (End date
  + Impression cap), Billing offer (Offers + End date), Audience (an operator flip), Experiment
  (a reallocation, Treatment1 up / Control down so the three still total 100%).
- **A TAB WITH PARTS USES SECTIONS: ONE TABLE PER PART, each with its own header row, under a
  small-caps label** (user, 2026-09-24, with a mockup — this REPLACED a first pass that put
  everything in one long table with shaded `group` rows and 32px-indented `in-group` rows; both
  of those row types are now deleted). A tab supplies `sections:` instead of `fields:`; a section
  is `{label?, fields}`, or `{join:'OR'}` for a bare join BETWEEN two tables. `cmpSections()`
  renders them; `.cmpSec__h` is the label, `.cmpSec__join` the between-tables join.
  - EXPERIMENT: **ONE flat table, NOT sections** (user, 2026-09-25: "we will not have multiple
    treatments at experience level"). A first pass gave each treatment its own sectioned table,
    mirroring the experiment screen's treatments list — wrong: this tab is an EXPERIENCE's view
    of its experiment, and an experience sits on exactly ONE treatment. Five rows: Start date,
    End date, Type, **Treatment**, **Allocation**. The diff is the experience moving to a
    different treatment, with the allocation following it (there is no reallocation to show when
    only one treatment is in view). `cmpSections` stays — Audience still uses it.
  - AUDIENCE: top-level conditions, then the nested group as its own table under ATTRIBUTE GROUP.
    **The OR that joins them sits BETWEEN the two tables**, not trailing the first one, where it
    was a join with nothing after it.
  - `'join'` survives as an IN-TABLE row kind for the AND/OR chips between conditions
    (`.cmpTbl__join`, spans the version columns, quiet grey).
- **AUDIENCE AND BILLING OFFER USE THE USER'S REAL DATA** (2026-09-25), replacing invented
  fields. BILLING OFFER is Promotion type / Billing offer / Product / Feature set codes /
  Pricing category / Is targeted / Is bundle — an earlier pass had invented Offers, Title and
  dates that are not on the screen at all.
  **"Is targeted"/"Is bundle" ARE `—`, NOT `N`** (user, 2026-09-25: "there's some n and written
  just give dashes instead so that it's not too random") — "N" next to real values like
  "QBO_PLUS" read as an unexplained stray letter; a dash reads as "not set", consistent with
  every other empty field on these screens.
  AUDIENCE was rebuilt 2026-09-25 from the REAL published-vs-draft editor screens (group AUD3,
  offer `20060232-ELM9722-IPD-AdvancedShellBanner...`), replacing an earlier version built from
  Version Compare JSON that had the diff direction backwards (showed v4 REMOVING two conditions)
  and invented a derived Rule/Score/Conjunction section with no corresponding UI. The real diff:
  AUD3 (`gbsgAEPCompanyAudience` contains any / `isAccountantAccessingClient` equal to No /
  `qboCompanyId` contains, all AND-joined) is IDENTICAL in both versions; v4 ADDS two more
  AND-joined conditions after the group (`qblUsPropensityQbliveAttachDiwmPercentileBt` greater
  than 10, `T5RdyNme` not equal to abcd) that v3 doesn't have.
- **A REMOVED SECTION IS MARKED ONCE, NOT PER ROW, AS PLAIN LABEL TEXT — AN ADDED SECTION GETS NO
  TEXT AT ALL, JUST THE RULE.** Emptying each cell to `—` and highlighting them made one removed
  condition read as three changes and never said why the cells were blank, so `removed:true`
  sections say **"Removed in v4"** as the label itself (no group name to show instead), using the
  exact same `.cmpSec__h` header style — label + underline rule — every section uses (same as
  "AUD3"), and additionally dim the table (`.cmpSec--gone`, 55% opacity) with highlighting OFF.
  An `added:true` section is DIFFERENT: it renders NO label text, just the bare `.cmpSec__h` rule
  (empty div, border-bottom only) then the table, full-opacity, highlighting ON — the yellow
  highlight on the new values already says what's new (user, 2026-09-25, after I'd added "Added
  in v4" text unprompted: "when did I ask you to add [that]... you're giving that yellow
  highlight so why would I need anything else"). **Do not add explanatory label text for an
  ADDED section — only REMOVED sections need text, because dimming alone doesn't say why cells
  are empty; an addition's own highlight is self-explanatory.**
  A first pass before that used pill/badge tags (amber "Removed in v4", green "Added in v4") —
  also wrong, called out separately ("don't give this random new badges... a label and an
  underline... below that the table"): **never reach for a badge/pill/chip for a section-level
  add/remove marker in this app.**
  A group's own unchanged rows (e.g. AUD3's three conditions) are ONE table with in-table
  `join` rows between them (via `cmpTable`'s `kind==='join'`), not one `cmpSections`-level table
  per row — splitting them per-row rendered three separate mini-tables with duplicate headers.
- **A SECOND AUDIENCE VIEW: THE RAW JSON, BEHIND A GHOST TOGGLE** (user, 2026-09-25, supplying
  the real "Version Compare" screen: two JSON panels side by side, v3 left / v4 right amber-tinted
  with a "Changed" footer bar). Same AUD3 diff as the tableified view, just as the raw Rules JSON
  the real screen shows — `audJsonCompare()` / `AUD_JSON_V3` / `AUD_JSON_V4_HL` in `app.js`,
  trimmed to segmentIds/conjunction/ruleActions.score/attributeIds/ruleConditions (the parts that
  carry the diff or give it context), leaving out id/type/version wrappers and
  `subscriptionAttributes:{}` so both panels stay short enough to read side by side.
  **THIS IS A DEV REFERENCE AID, NOT PART OF THE PRODUCT DESIGN** (user: "it should show that
  it's not a part of the design... like a ghost button"): `.refJsonToggle` is dashed-outline,
  muted grey, no fill — visually distinct from the real `.cvtoggle` (Detail/Preview) so it can't
  be mistaken for a product affordance. A tab opts in via `refJson:<renderFn>` on its `CMP_TABS`
  entry (only `audience` has one); `cmpState.refJson` toggles the body between the normal
  sections/table view and the JSON view, and resets to false on any tab switch.
  **RENDERED AS A TABLE, NOT TWO FREESTANDING CARDS** (user: "keep it in the form of a table...
  newly added just give them that yellow highlight") — a first pass matched the real screen's
  look exactly (bordered cards, v4 amber-tinted, "Changed" footer bar), but that broke from every
  other comparison view in this app. Rebuilt as one `cmpTbl-wrap`/`cmpTbl` (same header/border
  chrome as the rest of the app, `.audJsonTbl` only narrows the Fields column to fit "Rules JSON"),
  one row, the two JSON blocks as its Version 3 / Version 4 cells. Only the actually-new lines
  highlight — the two new `attributeIds` entries and the two new `ruleConditions` clauses — each
  wrapped in `.cd-hl` (the app's one shared yellow token, `--edited-cell:#ffff80`), not a
  whole-panel tint. `AUD_JSON_V4_HL` is markup with the highlight spans already placed, not a
  find/replace over escaped text.
  **HEADER IS "FIELDS", ROW LABEL IS "TARGETING"** (user, 2026-09-25) — matches every other
  comparison table's `Fields | Version 3 | Version 4` header instead of a JSON-specific
  "Attribute Targeting" header; the row label was "Rules JSON", now just "Targeting".
  **STAYS MONOSPACE** (user asked whether it should be code font or the app's own font) — kept
  monospace: it signals "this is code, a dev aid" the way the rest of the ghost-toggle treatment
  does, and JSON's nested indentation only stays legible in a fixed-width font.
- **SUPERSEDED 2026-10-01 (later the same day): NO "Removed in v4" LABEL AT ALL** (user: "i
  still see a lot of removed in v4s"). The highlighted v4 dashes already say it — the same logic
  that dropped "Added in v4" on Sep-25 — so removal and addition are now symmetric: values on one
  side, highlighted dashes/values on the other, no text. A removed GROUP keeps its normal
  "Attribute group" heading (it still exists on v3). A removed or added single CONDITION stays
  inside its run's table as rows (`audCondRows` emits a 5th field `'gone'`; `cmpTable` reads
  `[k,cur,next,kind,gone]`), with the join INTO it marked the same way — only a GROUP breaks a run
  into its own box (`special = n=>!!n.group`). The string "Removed in v4" no longer exists in app.js.
- **SUPERSEDED 2026-10-01: a REMOVED part does NOT dim** (user: "if something is removed from
  v4, why is it in inactive state in v3?"). v3 keeps its values at full strength; every v4 cell of
  the part, joins included, reads a muted "—" (`.cmpTbl__gone{color:#b3b6c2}`), **YELLOW-HIGHLIGHTED
  while Highlight changes is on** (user, 2026-10-01: "removal should still have yellow
  highlight?" — yes; `cmpGone(hl)`), under the "Removed in v4" label which still says why. `cmpTable(fields, hl, removed)` and
  `cmpJoin(...,{gone})` carry it; `.cmpSec--gone` (whole-table 55% opacity) is gone.
- **SUPERSEDED 2026-10-01: an ADDED part gets NO divider at all** (user: "remove extra stroke from
  below this. we will not unnecessarily use horizontal strokes. we will use box containers").
  `cmpSections` and `audTree` render a Heading 3 rule only when there is label text ("AUD3",
  "Removed in v4"); `.cmpSec__h--bare` is no longer emitted. Groups in the nested view are
  BOXES (`.audGrp`: 1px #dddee3 border, radius 12, padding 16) — ALL SOLID, a nested group is
  simply a box inside a box (user: "why dashed container?" — the dashed border came from the
  diagram's legend and was dropped). The join between tables is ONE complete stroke built per
  column (`.cmpSec__join>span` flex: the Fields cell is all line via `::after`; a version cell has
  the table's 16px `padding-left` so **the chip starts exactly where the column's text starts**
  (user, 2026-10-01: "and alignment with version 3?"), then a 16px gap and `::after` line to the
  cell's end — the padding IS the gap after the previous cell's line), and it sits EVENLY, 16px
  above and below (`margin:16px 0 0`, `+ .audGrp`/`+ .cmpSec__h` 16px) — it no longer hugs the
  thing below it (user: "see spacing"). The note below is history:
- **THE SECTION RULE RENDERS EVEN WITH NO LABEL TEXT, AND MUST NOT BE REMOVED.** An unlabelled
  section (an `added:true` one) still gets its Figma Heading 3 divider — that rule is what
  separates one condition from the next. When the AND looked detached from it I deleted the rule;
  wrong (user, 2026-09-25, re-sharing the Figma node). **The problem was the SPACING, never the
  rule**: the join sat `16px` above it and `32px` below, so the pair drifted apart. The AND and
  its rule are ONE UNIT — `.cmpSec__join{margin:20px 0 4px}` plus
  `.cmpSec__join + .cmpSec__h{margin-top:0}`, and `.cmpSec__h--bare{padding-bottom:0}` for the
  no-text case. **Measure a gap before changing a component.**
- **THE SECTION LABEL IS A FIGMA COMPONENT — "Heading 3", node `10268:87260`** in MS 2.0 -
  Targeted Offers (`bql5nKwOL0ng1iBoWconOS`). Exact spec: **13px, weight 600, `#656a81`,
  `letter-spacing:.52px`, uppercase, `padding-bottom:11px`, `border-bottom:1px solid #ececf0`**.
  My first guess (12px / 500 / `.06em` / no rule) was wrong on every axis — the RULE especially.
  Fetch the node rather than eyeballing a label like this.
- **AN AUDIENCE CONDITION IS THREE FIELDS: Attribute, Operator, Value** (user, 2026-09-24:
  "attribute: CDPCompanyAudienceName; operator: contains any; value: elm_9071_…"), each its OWN
  ROW compared across the versions. A first pass merged operator into value in the version
  columns ("not equal to  No") — wrong; they are separate fields on the real screen, and keeping
  them separate means an operator change highlights on the Operator row alone. `audCond(attr, op,
  val, op2, val2)` builds the three rows, with `op2`/`val2` for the v4 side when they differ.
- **The version column headers carry an info icon** (`icon('info',13)`), per the user's mockup.
  On AUDIENCE the **OPERATOR TRAVELS WITH THE VALUE** in the version columns ("not equal to  No"),
  because the diff IS an operator flip — it has to be on the side being compared.
- **AUDIENCE IS RENDERED WITHOUT ITS QA ERRORS** (user: "audience, just without errors"). The real
  screen carries a QA error chip, "Audience key does not exist" and "Invalid value" with a `~`
  value; none of that belongs on a clean reference screen, so the `~` shows as the real value.
  Same rule for the other tabs' status chips.
- **THE FIELDS COLUMN IS 24%, NOT 16%.** The inherited 16% is sized for "CTA text"; audience
  attribute names are long single words and broke mid-word ("CDPCompanyAu / dienceName").
- **THE USER SUPPLIES EACH TAB AS A SCREENSHOT OF THE REAL SCREEN**, and the fields are read off
  it in the SCREEN'S OWN READING ORDER — left column top-to-bottom, then the right column. A
  screenshot shows ONE state, so the v3/v4 difference has to be agreed: the pattern is **two
  realistic edits per tab**, matching Creative's 2-of-7 shape, and the END DATE moves consistently
  across tabs so they tell one story (meta Dec 31 2026 → Mar 31 2027, billing Apr 22 → Jun 30 2026).
  Ask before inventing the diff.
- **TITLE-TO-TABLE GAP WAS DOUBLE** (user, 2026-09-24: "what is this spacing between rows?").
  `.cd-head` has `margin-bottom:16px` and `.cmpTbl-wrap` `margin-top:16px`, and adjacent-sibling
  margins do NOT collapse, so the gap was 32px — worst on a tab with no Detail/Preview toggle,
  where the title row is only 24px tall instead of 34.8px. Fixed with
  `.cd-head:has(+ .cmpTbl-wrap), .cd-head:has(+ .cmpPrev){margin-bottom:0}`.
  **This is inherited from the rollback build, which still has the 32px gap** — not introduced here.

**AUDIENCE GOT A 4-WAY LAYOUT PICKER (built in a separate 2026-09-29 session)**: a `verselect`
dropdown top-right of the Audience tab — Table view (the original `cmpSections`/`cmpTbl`),
Side by side, Version toggle, and Table - Json (the JSON dev-reference view folded into this
menu instead of its own ghost button).
**THE PICKER MUST LOOK LIKE A DEV CONTROL, NOT A PRODUCT ONE** (user: "give this as greyed
outline so that it doesnt look as a part of the product") — it originally reused the bare
`.verselect` class, which IS a real shipped control elsewhere (the version-history picker), so
as-is it read as something the actual product has. Added `.verselect--ghost` (dashed border,
muted grey, transparent background — same recipe as `.refJsonToggle`) as a scoped modifier
class on JUST the audience layout picker's `<span>`, leaving bare `.verselect` untouched for its
real usages elsewhere. Side by side and Version toggle both use a NEW
expression-builder rendering (`audExprCol`/`audRow`/`.ab-row`/`.ab-group` in `app.js`,
`.ab-*` CSS in `index.html`) — the real ATTRIBUTE/operator/VALUE + AND/OR-chip look ported
verbatim from the flow builds' own audience builder, not the Fields/V3/V4 table. Both read off
the SAME `CMP_AUDIENCE_SECTIONS` data as the table view, so the diff can't drift between layouts.
**A NAMED GROUP (AUD3) MUST RENDER AS NESTED — VIA INDENTATION ONLY, NEVER A BORDERED BOX.**
First reported as "the nesting and all is missing" (user, 2026-09-29, supplying real editor
screenshots plus a generic nesting-pattern example — the real screen's outer rule contains a
visually bordered/indented inner group). First fix gave `.ab-group` a border+padding card — WRONG,
IMMEDIATELY REVERTED once rendered (user: "why have you given a box outside? our design does not
have it"). **The real product screen DOES box its group; THIS design deliberately does not** —
don't re-add a border/card for `.ab-group` even though the real screen has one. Final:
`.ab-group{margin-top:16px;padding-left:24px}` — indentation only. The two conditions that sit
OUTSIDE any group (the two added in v4) correctly render flush with the page either way, not
indented. There were two duplicate `.ab-row`/`.ab-group`/etc. CSS blocks (an earlier dead one +
the real one ported later in the same session) — the dead first block was deleted rather than
edited twice.
**HIGHLIGHTING WAS INCOMPLETE ON BOTH NEW LAYOUTS** (user: "the highlights are incomplete on the
2 new explorations") — `audRow()`/`audExprCol()` only ever compared the VALUE field's v3/v4 to
decide the yellow mark, so an added condition's ATTRIBUTE and OPERATOR (which also go from "—" to
a real name/operator) never highlighted even though the table view highlights any changed cell.
Fixed: `audRow` now takes three independent `hlAttr`/`hlOp`/`hlVal` flags, each computed by
comparing that field's own v3/v4 pair — matching `cmpTable`'s per-cell rule exactly.
**COLUMN BALANCE: ATTRIBUTE NEEDS MORE ROOM THAN VALUE, NOT LESS** (user: "do we need to wrap? i
dont think we're using real estate well") — `.ab-row`'s grid gave Value `1.8fr` vs Attribute's
`.55fr` (roughly 3:1), so a long unbroken attribute name like
`qblUsPropensityQbliveAttachDiwmPercentileBt` (43 chars, no natural break point for
`word-break:break-all`) wrapped across 2 lines while Value's much wider column sat mostly empty
for short values like `10`/`abcd`/`No`. First rebalance used `minmax(220px,1fr) auto 1fr` (still
`fr`-based) — **still wrong**: with `1fr`, a column's width is a FRACTION OF THAT ROW'S OWN
available width, so two rows at different nesting depths (different accumulated `padding-left`
eating into that width) land their Operator chip at different x-positions even with identical
ratios (user: "see the reference the containers are equal and aligned. you have not done that").
Final: `.ab-row{grid-template-columns:340px auto 1fr}` — Attribute is a FIXED pixel width, so
every row's Operator chip sits the same distance from ITS OWN left edge regardless of depth;
indentation is then the only thing that differs between nesting levels, not the column math.
**STILL NOT ENOUGH ON ITS OWN** (user, re-flagging the same issue after that fix: "contianer
width not fixed") — a fixed column width fixes the RATIO, but each row's own left edge still
shifted by however much its ancestor `.ab-nest`/`.ab-group` padding pushed it right, so a row 3
levels deep (AUD3, inside 2×`.ab-nest` + `.ab-group`) still landed its Operator chip further
right than one 2 levels deep (the added conditions, inside 2×`.ab-nest` only). Fixed with
negative-margin compensation on `.ab-row` itself: `.ab-nest .ab-nest .ab-row{margin-left:-40px}`
and `.ab-nest .ab-nest .ab-group .ab-row{margin-left:-64px}` pull each row back left by exactly
what its ancestors pushed it right (20px per `.ab-nest`, 24px for `.ab-group`), so every row's
grid starts at the same page-relative x regardless of depth — only the HEADER LABELS
(`.ab-nest__h`, `.ab-group__h`) stay indented, which is what actually shows the nesting.
`.audExprSbs .ab-row`'s narrower override (`minmax(90px,.5fr)`) had the exact same `fr`-based bug
in miniature and needed the same fixed-px treatment (`140px auto 1fr`) — an override that
re-introduces `fr` for a column re-introduces this whole class of misalignment, so any future
per-layout row override must stay fixed-px too.
**NEGATIVE MARGIN ALONE SHRINKS THE ROW'S OWN BOX — pair it with a matching `width:calc(100% +
Npx)`, always.** After the alignment fix landed, a long attribute name wrapped to 3 lines with
visible blank space beside it (user: "why is this wonky?" / "there isnt a need to wrap in
toggle one because we do have real estate"). Root cause: `margin-left:-Npx` pulls a box's LEFT
edge left, but its RIGHT edge stays pinned to its (unshifted) container — so the box's own width
shrinks by N instead of the box simply sliding left, squeezing the fixed-width Attribute column
against the row's own edge. Fixed by adding `width:calc(100% + 40px)` / `calc(100% + 64px)`
alongside each negative margin, restoring the width the margin took away. Separately, 340px was
also genuinely too narrow for the longest real attribute name
(`qblUsPropensityQbliveAttachDiwmPercentileBt`, 43 chars) even with full width restored —
widened `.ab-row`'s first column to 460px.
**A GENERAL LESSON for any negative-margin indent-compensation trick: it is ALWAYS two
properties, never one** — `margin-left:-Npx` needs `width:calc(100% + Npx)` in the same
declaration, or the element silently shrinks instead of relocating.
**THE 460px FIX ONLY COVERED THE TOGGLE LAYOUT — Side by side HAS ITS OWN SEPARATE `.ab-row`
OVERRIDE AND STILL WRAPPED** (user, re-flagging after the toggle fix: "i dont see this
fixed???" — the screenshot was Side-by-side, not Version toggle). `.audExprSbs .ab-row`'s
Attribute column was still 140px, far too narrow at this layout's 14px font. Widened to 230px,
sized to THIS column's actual available width (~429px per column at this canvas size, roughly
half the full-width layout's) rather than reusing the toggle layout's 460px, which wouldn't fit
in a half-width column at all. Even at 230px the longest name still takes 2 lines here — that's
an acceptable tradeoff for a genuinely half-width column, unlike the toggle layout which had
full canvas width to give it one line. **Any width-tuning fix in this file must be checked
against BOTH `.ab-row` (toggle/full-width) and `.audExprSbs .ab-row` (side-by-side) — they are
two separate declarations and a fix to one does not carry over to the other.**
**THE CANVAS IS FLUID, NOT ONE FIXED WIDTH — A FIXED-PX GUESS MUST BE CHECKED AT SEVERAL WIDTHS,
NOT JUST WHATEVER ONE THE FIX HAPPENED TO BE TESTED AGAINST.** 140px, then 230px, both still
wrapped (user, repeatedly, after each attempted fix: "i dont see this fixed???" / "everything is
still not updated" — each fix had been verified at a DIFFERENT window width than the one the
user's own screenshot showed, so it looked unfixed to them even though the CSS had changed).
Measured `.audExprSbs__col`'s actual available width at three real window sizes: 429px at
1400px viewport, 659px at 2000px, ~600-700px at other working sizes in between — confirming
this canvas genuinely resizes, it isn't the fixed ~800px the built-in browser pane often
renders at. Settled on 320px for `.audExprSbs .ab-row`'s Attribute column, verified to hold the
longest name (`qblUsPropensityQbliveAttachDiwmPercentileBt`) on ONE line at both 1400px and
2000px, with alignment (`.ab-op` left-position) still consistent within each column at 1600px.
**Lesson: when a fix is about layout/wrapping and the user's screenshot doesn't match what
verification just showed, suspect the TEST WIDTH before suspecting the CSS — re-verify at
multiple realistic widths, not the one that happened to be open.**
**A FIXED-PX FLOOR CAN NEVER WORK ACROSS THE FULL RANGE THIS CANVAS RENDERS AT — the final,
correct fix drops the floor entirely.** After 140px → 230px → 320px → `minmax(35%,200px)` each
still overflowed at SOME width (confirmed: `.ab-row` reported width 98px against a 320px+ column
demand at the pane's own narrow default — the row was overflowing its own container, not just
misaligned), the fix is `grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)` on BOTH `.ab-row`
and `.audExprSbs .ab-row` — no floor, so it can never demand more width than actually exists.
Per the user's own call ("allow 2 lines gracefully" once this was confirmed as a real space
constraint, not a bug): 1 line at realistic widths (1440px+, verified), 2 lines in the
side-by-side layout's narrower half-columns — both fine, NEVER overflow. This reintroduces a
small (~13-14px) alignment drift within a column at different nesting depths, since `fr` is
sensitive to a row's own available width the way a fixed px isn't — accepted as a minor residual
next to the alternative of a column demanding more space than its container has.
**CRITICAL DEBUGGING LESSON FOR THIS FILE: `document.hidden`/`visibilityState` MUST BE CHECKED
before trusting any `innerWidth`/layout measurement.** Much of the back-and-forth in this
exchange came from measuring a BACKGROUNDED preview tab (`document.hidden: true`), which
reports a collapsed `innerWidth` (610px, `.pad` only 156px) that is NOT representative of any
real user-visible state — this is the exact failure mode [[preview-tab-throttling]] already
documents for timers, but it applies to layout/width measurements too. A tab opened fresh via
`preview_start` (not reused via `navigate` on a stale tab) came back `hidden:false` at the SAME
610px, which one-off confirmed 610px CAN be real — but the resulting `.pad` width of 156px
still produced absurd one-char-per-line rendering that doesn't match ANY screenshot the user
has ever shared in this session, so treat any single-digit-px per character rendering as a
signal to distrust the tab's state and open a fresh one, rather than concluding the real user's
window is that narrow. Verify at a realistic width (1440px, matching what the user's own
screenshots show) as the primary check, and treat the pane's own unpredictable narrow default as
untrustworthy for anything except confirming "does it overflow" — not for "does it look right".
**THE `width:calc(100% + Npx)` COMPENSATION BECAME ACTIVELY HARMFUL ONCE THE COLUMN WENT
FLEXIBLE — it must be removed, not just left in place alongside `minmax(0,1fr)`.** After the
`minmax(0,1fr)` fix landed, EVERY row started clipping — the Operator/Value columns rendered
almost entirely off the visible right edge, just a sliver of the chip peeking past the boundary
(user: "text is showing up on the lines still??", sharing Version 3 with `contains any` and
`equal to` chips cut off). Root cause: `width:calc(100% + 40px/64px)` was added earlier
specifically to stop a FIXED-PX column from being squeezed by the negative margin — it made the
row's own box genuinely wider than its scroll container. That was fine while the fixed column
needed the extra width, but once the column became `minmax(0,1fr)` (no floor, shrinks to fit
automatically), the row no longer needed compensating width at all — and forcing it wider than
its container just overflowed the container itself, pushing the later grid columns out past the
visible/clipped edge. Fixed by deleting `width:calc(...)` entirely from both
`.ab-nest .ab-nest .ab-row` and `.ab-nest .ab-nest .ab-group .ab-row`, keeping only
`margin-left` for the visual pull-back. **Lesson: a CSS compensation trick (width, margin,
padding) is scoped to the specific problem and specific sibling declaration it was written to
fix — when that sibling declaration changes (fixed-px → flexible), re-examine whether the
compensation is still needed, don't just leave it stacked on top of the new approach.**
**THE NEGATIVE-MARGIN ALIGNMENT TRICK ITSELF WAS THE WRONG FIX, END TO END — REMOVED ENTIRELY.**
After the clipping was fixed, a full screenshot that otherwise looked correct still drew a
correction: "indent at the left is completely missing. boolean expression should be under aud3
line right". Root cause, finally: `.ab-nest .ab-nest .ab-row{margin-left:-40px}` and the
`.ab-group` variant at `-64px` were pulling EVERY row back left by exactly what `.ab-group`'s
own `padding-left:24px` (and each `.ab-nest`'s 20px) had just pushed it right — so AUD3's rows
rendered FLUSH with "Conditions" above them instead of nested under "AUD3", visually undoing the
one thing nesting is supposed to show. This whole margin-compensation chain (spanning several
fix attempts: fixed-px column → alignment via negative margin → width-restore → clipping →
clipping fix) was built to solve "operator chips should line up across different nesting
depths" — a real but MINOR cosmetic goal that was never worth trading away actual visible
nesting for. Deleted both negative-margin rules outright; `.ab-group`/`.ab-nest`'s own
`padding-left` now works undisturbed, so indentation is visibly correct at every depth, at the
cost of a few px of chip drift between differently-nested rows — the right tradeoff.
**Lesson for this file specifically: nesting depth (does content visibly sit under its own
header) is the priority signal in every one of this thread's corrections; chip alignment across
depths is decoration by comparison. When the two conflict, don't reach for a margin/width trick
that sacrifices the first for the second.**
**THE REAL FIX FOR ALIGNMENT: `vw`-ANCHORED `clamp()`, NOT `fr`/`auto`/fixed-px — because EACH
`.ab-row` IS ITS OWN INDEPENDENT GRID, not a shared table.** After nesting indentation was fixed
by removing the negative-margin trick, a NEW crop showed three operator chips ("contains any" /
"equal to" / "contains") at three different x positions — all belonging to AUD3, i.e. the SAME
nesting depth (user: "these widths should be same so that they're aligned"). Root cause: there
is no shared table/grid structure across sibling `.ab-row`s in the DOM — `audRow()` in `app.js`
emits each row as its own separate `<div class="ab-row">` with its own `display:grid`. So any
column sized by `fr` or `auto` (Attribute as `minmax(0,1fr)`, Operator as `auto`) computes its
width from THAT row's own content/available-width, independent of its siblings — three different
operator texts at `auto` literally can't share a column boundary, and neither can an `fr`
Attribute column whose available width depends on the row's own indentation. FIXED, for both
`.ab-row` and `.audExprSbs .ab-row`: Attribute becomes `clamp(160px,22vw,340px)` (half those
numbers for the narrower side-by-side layout) and Operator becomes a fixed `130px`/`100px` —
`vw` is identical for every row on the page regardless of nesting depth or that row's own
content, so it acts as a genuine shared column boundary the way `fr`/`auto` never could, while
still shrinking gracefully (never overflowing) at a narrow viewport the way earlier fixed-px
attempts didn't. Verified: all 3 AUD3 rows (same depth) align exactly; the 2 added conditions
(one level shallower) align with each other at a different, consistently-offset x; no overflow
down to a 900px test viewport.
**STANDING LESSON for any future alignment work on `.ab-row`/`audRow()`: `fr` and `auto` grid
tracks are PER-ROW, not per-page, because these rows have no shared parent grid. Only `vw`,
fixed px, or an actual shared-grid restructure (`display:contents` + a real parent grid, not
attempted here due to the interleaved joins/group-headers/nesting-depth complexity) can produce
column boundaries that hold across sibling rows.**
**ONCE THE OPERATOR COLUMN WAS A REAL FIXED WIDTH, ITS CHIP NEEDED CENTERING WITHIN THAT COLUMN**
(user, immediately after the alignment fix landed: "have the text centre aligned in those. only
in those since widths are same") — before the fix, the Operator column just hugged each chip's
own text width, so the chip always looked "centered" by virtue of having no extra room; after
the fix gave it a real shared column width (130px/100px), a short chip like "contains" now sat
flush-left in that wider column with visible empty space to its right. Added
`justify-self:center` to `.ab-op` (scoped to that one selector only, per "only in those" — no
other column's alignment changes).
**`justify-self:center` ALONE WASN'T ENOUGH — THE PILL ITSELF NEEDED A FIXED WIDTH, NOT JUST A
CENTERED POSITION** (user, immediately after: "widths are different") — centering only
positioned each pill's own natural width at the same center-point; "contains any" was still a
visibly bigger box than "equal to" or "contains", just centered rather than left-aligned. Added
`width:120px;text-align:center` to `.ab-op` (90px for `.audExprSbs .ab-op`, to fit its narrower
100px column) — now every operator pill is the identical box size regardless of its text,
verified to fit "contains any" (the longest realistic value) without clipping at both widths
(118px/89px scrollWidth against 120px/90px boxes).
**NESTING IS THREE LEVELS DEEP, NOT ONE — reproduce the reference's exact depth, don't
reinterpret it down to what the data seems to need.** The real screenshot shows outer
"Conditions" > inner "Conditions" > "AUD3", three stacked left-rule/indent levels. A first pass
added only ONE "Conditions" wrapper around AUD3, reasoning the second "Conditions" layer didn't
map to anything in `CMP_AUDIENCE_SECTIONS` — WRONG per the user re-sharing the same screenshot:
"I shared the exact example with this. why do you not have 3 lines then?" `audExprNested()` now
stacks `.ab-nest` TWICE (outer "Conditions" wrapping an inner "Conditions" wrapping the
`audExprCol` output, which itself wraps AUD3 in `.ab-group`) — three visual levels matching the
reference line for line, even though only one of them (AUD3 itself) corresponds to something
named in our data. **Lesson for any future "match this reference" ask in this app: reproduce the
exact structure/depth shown, don't collapse or simplify levels based on what our own data model
seems to justify — the user is asking for the picture, not a re-derivation of it.**
**AN ADDED CONDITION SHOULD NOT RENDER ON V3 AT ALL — NOT EVEN AS A DASH ROW** (user, 2026-09-29,
looking at Version 3: "current one should not have the last 2 rows right? because we added those
in the draft"). The table view's `—` marks a per-cell absence inside a row that exists on BOTH
sides; here the whole condition doesn't exist on v3, so v3 should skip the section outright.
`audExprCol` now filters `sections` before rendering: an `added:true` section is dropped when
`col===1` (v3), and the `{join:'AND'}` immediately preceding it is ALSO dropped on v3 (otherwise
an "AND" chip dangles with nothing after it). **This filter must run as ONE pass over the
original `sections` array** — a first attempt chained two separate `.filter()` calls, and the
second one's `arr[i+1]` "look at the next section" check silently pointed at the wrong element
because the array had already been reindexed by the first filter, leaving one dangling "AND"
behind. Fixed by computing both drop conditions in a single `.filter((sec,i)=>...)` against the
original `sections`/`i`.

**SIDE-BY-SIDE'S OPERATOR PILL AT 90px WAS TECHNICALLY NOT OVERFLOWING BUT VISUALLY TOO TIGHT —
REBALANCE THE COLUMN SPLIT, DON'T JUST WIDEN ONE COLUMN** (user: "contains any text is longer
than container. if we're wrapping text why not use the real estate well?"). Traced the real
available width at AUD3's own nesting depth (3 levels: 2×`.ab-nest` + `.ab-group`, each eating
its own `padding-left`) — confirmed the row's `width:100%` computation was already CORRECT
(350px of 449px column width, exactly accounted for by nesting padding, not a bug), but within
that real 350px budget Attribute's clamp ceiling (170px) was starving Value down to ~68px while
Operator's slot (100px, pill 90px) left "contains any" cramped with almost no padding either
side. Rebalanced the THREE-WAY split rather than widening one column in isolation: Attribute's
ceiling down to 130px (`clamp(90px,9vw,130px)`), Operator's slot up to 110px (pill 100px) so it
has real breathing room, Value keeps the remainder. Verified across all 8 rows in both v3/v4
columns (including "greater than"/"not equal to", the longest operator values): every pill
reports identical 35px height, i.e. one line, no wrap, in both columns.
**Lesson: when one column feels cramped, check the OTHER columns' widths before assuming that
one column needs to grow — a neighboring column may be oversized for no real reason, and the
fix is redistributing the split, not just inflating the cramped one.**

**UPDATE 2026-09-29 — AUDIENCE IS LIVE, AND HAS A LAYOUT DROPDOWN.** The "held back" note above
is stale: the Audience tab ships `sections:CMP_AUDIENCE_SECTIONS` with its real title. At the top
right of the tab header a `.verselect` pill (the app's version-picker chrome, not a new control)
opens `.audLayoutMenu` with FOUR layouts of the same diff, `cmpState.audLayout`:
`table` (the sections/table view) · `sbs` (Side by side) · `toggle` (Version toggle) ·
`json` (Table - Json — the former raw-JSON ghost toggle, FOLDED INTO the menu; the dashed
`.refJsonToggle` button is gone, the CSS class remains unused).
- **Both new layouts use the REAL audience builder rows** — `.ab-row/.ab-k/.ab-attr/.ab-op/.ab-v/
  .ab-conj/.ab-group` ported VERBATIM from the flow builds' `audienceBuilder()` (user: "take
  exactly the example we have in the design ... the design as in the build"). `audRow()` /
  `audExprCol(sections, col, hl)` walk `CMP_AUDIENCE_SECTIONS`; a changed/added VALUE gets
  `.cd-hl`. **The section `fields` array interleaves single-element `kind==='join'` rows between
  the Attribute/Operator/Value triples** — a naive `i+=3` stride crashes on it.
- **SIDE BY SIDE = two version panels next to each other; ATTRIBUTE / OPERATOR / VALUE STAY IN
  ONE ROW inside each panel** (user, 2026-09-29: "side by side does not mean attribute operator
  and value go one below the other. things in the row stay in the row"). A first pass stacked
  them vertically to fit the half-width column — wrong. Fit is done by shrinking the row's own
  proportions only: `.audExprSbs .ab-row{grid-template-columns:minmax(90px,.5fr) auto 1fr;gap:12px}`,
  op pill `padding:6px 10px`, 14px text.
- **VERSION TOGGLE** reuses `.cvtoggle` (Detail/Preview chrome) relabelled `Version 3 (current)` /
  `Version 4 (new draft)`, `cmpState.audVer` (`a`/`b`), one full-width builder at a time.

**UPDATE 2026-10-01 — A SECOND, NESTED AUDIENCE EXAMPLE: "Table - Nested" (ELM 7172).** **THE
DEFAULT and FIRST item** of the audience layout dropdown (user, later 2026-10-01); order is
Table - Nested › Table view › Table - Json › Side by side › Version toggle
(`cmpState.audLayout` defaults to `'nested'`, title swaps to "ELM 7172").
Source: the user's rule diagram (rule root, attribute groups, nested groups, "joined by AND unless
marked OR"). Data is a TREE, `AUD_NESTED`: nodes are `audN(attr,op,val,op2?,val2?)` conditions,
`{join:'AND'|'OR', joinB?, added?}`, `{group:[...], nested?, removed?, added?}`; `audTree(nodes,hl)`
renders it with the SAME `cmpTable` primitive: consecutive conditions share one table (joins as
in-table rows), a group is `.audGrp` (indented container, `border-left:2px solid #ececf0`,
DASHED when `nested` — the diagram's legend) under the Heading 3 label "Attribute group".
**Containers show as indentation, one step per level** (user: "check the indentation the way
containers are used in this case"), not as boxes.
- THE DIFF IS DELIBERATELY RICH (user: "remove some attribute operator value and add some and in
  some cases the AND changes to OR"): two values narrowed, one root condition removed
  (`qboProductSkuName`), one nested group removed (the LiveSkuName pair), two joins flipped
  AND → OR, one condition added inside the last group, one added at the root.
- **EVERY JOIN READS UNDER BOTH VERSIONS, AS THE BUILDER'S CHIP + RULE** (user, 2026-10-01, three
  notes: "these ORs that we have for current, we should also be having for the new draft";
  "styling for and or (between each expression) not the operator" = the grey `.ab-conj` pill;
  "for and or between rows this is what we have, use this here but we give both" = the pill
  followed by a thin line to the end of the cell). `cmpConj(t, hl, line)` = `.cmpConjRow` (flex) ›
  `.cmpConj` chip (+ `.cmpConj__line` when `line`); a NO-LONGER-SPANNING join row is
  `<td></td><td>chip</td><td>chip</td>`. **INSIDE A TABLE THE CHIP HAS NO STROKE** (user,
  2026-10-01: "we don't need horizontal stroke within table" — the row borders already rule it);
  the stroke stays on joins BETWEEN tables. A CHANGED join (AND → OR) fills the v4 chip yellow (`.cmpConj.cd-hl`, the chip
  itself, not text-hugging); a NEW join is `— | chip(yellow)`; a join into a removed part dims.
  Between tables, `cmpJoin(k,next,{hl,gone})` lays the same pair on the table's three columns
  (`.cmpSec__join{display:grid;grid-template-columns:24% 1fr 1fr}`, spans padded 16px like a td)
  so it lines up with the tables. `cmpSections` is next-section-aware for this (join into an
  added section = new, into a removed one = dimmed). `cmpTable`'s join tuple is `[k,'',next,'join']`.
- **THE GROUP HEADING IS THE BUILDER'S "Attribute group" + CHEVRON** (user, 2026-10-01: "styling
  for attribute group", showing the editor's heading with the chevron UP): `.ab-group__h.audGrp__h`,
  chevron rotated 180° (expanded); **spec from the user: 16px, weight 500 (medium), `#393a3d`**
  (not the 600/`--text-strong` of the flow builds' `.ab-group__h`).
- **A JOIN AFTER A GROUP BOX IS INSET 17px PER BOX LEVEL OF THE TABLE ABOVE IT** (`cmpJoin(...,
  {inset:n})` → inline `padding:0 ${17*n}px`; `audTree` computes `trailingDepth(prev)`, i.e. how
  many nested groups deep the previous group's LAST table sits): its percentage columns must match
  that table (each box is 1px border + 16px padding narrower per side) or the chip drifts 9-18px
  left of the text (user, 2026-10-01: "check or box alignment"). Rule: align with the thing above.
  Verified all joins within 0.5px. The heading selector is doubled (`.ab-group__h.audGrp__h`) so
  the 16/500/#393a3d spec beats the builds' later `.ab-group__h` rule. NOT the small-caps Heading 3 — that stays for "Removed in v4"
  and for the simple example's named group "AUD3".
- Removed/added conventions unchanged from Sep-25: "Removed in v4" once as the label + dimmed +
  highlight off; an added part gets the bare rule and its highlight, no text.
Cache-buster v61 after this.

Preview: `http://localhost:8099/building-blocks/`, reached from the landing index's
**Building Blocks** tab. `app.js?v=N` cache-buster applies here too (at v60 as of this fix).

- **2026-10-09: AUDIENCE TAB'S WIP BADGE REMOVED; THE NESTED TABLE IS THE FINAL DESIGN** (user:
  "remove wip tag, keep table nested as final but keep the dropdown to refer to other options").
  The ghost layout picker stays, its first item reads **"Table - Nested (final)"**, and a muted
  italic `.refNote` sits beside the pill: **"Reference only, this dropdown is not to be
  implemented"** (user: "ensure something that says dropdown is not to be implemented"). The
  other layouts (Table view / Table - Json / Side by side / Version toggle) remain as reference.
  Cache-buster v79. Local, not pushed.
