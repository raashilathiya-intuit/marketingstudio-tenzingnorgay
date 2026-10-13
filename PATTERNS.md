# CCO-landing patterns — which UI component, when

Scope: the design-system-level question — for a given object or moment, which
widget do we reach for (table vs. direct open, tabs vs. flat meta grid,
intent card vs. plan widget's cousin-doc is `PLAYBOOK.md`, version flyout,
comparison view)? This doc answers "what/when"; `PLAYBOOK.md` answers "how
the flow machinery runs"; `HANDOFF.md` answers "how to start a new build."

Last verified: 2026-10-08, by reading the actual code (not inferred) in
`link-unlink-experiments-sep11`, `update-treatment-holdout-sep28`,
`audit-change-log-oct06`, `move-origin-destination-sep30`,
`audience-change-order-oct07`, `clone-ipd-experiences-sep03`,
`building-blocks`. Every claim below has a file:line citation — if a future
build changes the pattern, update the citation, don't just reword the claim.

## 1. Search-results table vs. direct/specific object open

**This is a hardcoded per-scenario authoring choice, not a live decision an
agent makes at runtime.** Each sim-menu entry wires a fixed prompt string to
a fixed intake runner. The in-universe justification baked into the prompt
wording is: plural/broad ask → search table with multiple rows; one named
object (exact ID or exact name) → open it directly, no table at all.

- Sim-menu `data-sim` → prompt/runner pairs:
  `link-unlink-experiments-sep11/app.js:800-815`, dispatch at `2402-2409`,
  `2779-2785`.
- Search path: `runIntakeXp()` → lands on `scenes.xpSearch`, a real results
  table (`link-unlink-experiments-sep11/app.js:6608-6622`, scene at
  `4509-4537`).
- Direct path: `runIntakeXpOne()` → lands straight on `scenes.xpDetail`, no
  table (`link-unlink-experiments-sep11/app.js:6593-6607`). Comment at
  `6588-6592`: *"SPECIFIC intake (ulDraft): the prompt names ONE experiment,
  so there is no results table — it opens directly."*
- `scenes.xpDetail` itself documents owning the direct-open intake:
  *"THE SPECIFIC INTAKE LANDS HERE (ulDraft)... this scene owns
  boot/C1/C2 as well as the experiment itself"* — `app.js:5772-5776`.
- Audience build has **no search variant at all** — `audDetail` is
  direct-open only, since the audience prompt always names one audience by
  exact name (`audience-change-order-oct07/app.js:832`, scene `1008`).
- Audit build's "open by ID" skips even the middle campaign level:
  *"opened by ID, so the project is the experience itself (no campaign
  level)"* — `audit-change-log-oct06/app.js:3041-3044`.
- `pcSearch` (clone/placement-change) is always a results table — no direct
  variant observed (`link-unlink-experiments-sep11/app.js:3024`, `6038`).

**When building a new flow**: decide up front whether the prompt names one
object or asks broadly, and pick the matching runner shape — don't invent a
third option. See `ms-prototype-intake` skill for the required
boot→C1→C2→result sequence either way (this choice only affects whether a
table ever appears, not the intake steps themselves).

## 2. Table columns, per object type

| Object | Columns | Source |
|---|---|---|
| Experiment's linked-experiences list | Experience, Experience ID, Status, Access point, Treatment | `link-unlink-experiments-sep11/app.js:3779-3785` (`XP_COLS`) |
| Experiments search results | Experiment, Status, Experiment ID, IXP state, Linked experiences | `link-unlink-experiments-sep11/app.js:4485-4491` (`XP_LIST_COLS`) |
| Move flow's experience results list | Experience, Experiment, Status, Access point, Treatment | `link-unlink-experiments-sep11/app.js:4685-4691` (`MV_LIST_COLS`) |
| Clone/placement-change experiences | Experience, Experience ID, Status, Version, Access point, Template, Priority, Created by, Last updated | `link-unlink-experiments-sep11/app.js:3950-3957` (`PC_COLS`) |
| Audit log | What changed, Description, Changed by, Event, Date changed | `audit-change-log-oct06/app.js:2821-2824` (`LOG_COLS`) |
| Audit build's own experiences list | Experience, Experience ID, Status, Access point, Template, Priority, Created by, Last updated | `audit-change-log-oct06/app.js:3034-3039` (`EX_COLS`) |
| Audience's linked-experiences list | Experience, Experience ID, Status, Access point, Last updated | `audience-change-order-oct07/app.js:894-900` (`AU_EXP_COLS`) |
| Billing offer | **No standalone list table in any build checked** — only appears as a meta/field block inside drill-downs | see §3 `CMP_BILLING_FIELDS` |
| Access point / placement | **No standalone list table** — only a column value (`ap`) inside experience tables, or the subject of the clone build's access-point-change flow | n/a |

Rules behind specific column choices (quote these when a new object's
columns need deciding):
- **Experience ID only appears inside an experiment's table**, not a
  standalone creatives list: *"inside an EXPERIMENT the rows are real
  objects with ids... The clone build's creatives table stays name-only,
  because a pending creative has no id yet."* — `app.js:3776-3778`.
- **Treatment is a column ONLY on an experiment's own linked-experiences
  table** — *"Treatment is what the experiment assigns them, so it is a
  column here and nowhere else in the repo."* — `app.js:3761-3762`.
- **Move's results list adds an Experiment column** that nothing else has,
  because the list needs to show what each experience is *currently* linked
  to — that's the value the move is about to change — `app.js:4677-4684`.
- **Version sits right after Status** in any table that has one, per the
  rollback build's original column order — `app.js:3950` comment.
- A changed-but-not-failed clone keeps ONE status column (no separate
  Validation column); the specific fields that changed get the
  highlight/`editedKey` flag instead — `app.js:3958-3967`.

## 3. Object container shapes

**Campaign detail**: flat meta attribute/value grid, **no tabs**. 11 pairs
(PRODUCT, LOCALE, GOAL, SUB GOAL, START/END DATE, START/END TIME, TIME ZONE,
PRIORITY, VALUE) via `metaGrid()` —
`link-unlink-experiments-sep11/app.js:281-302`, used in `scenes.campaignObject`
/ `scenes.campaignTree` (header + meta grid + a Campaign-data section with a
table/tree toggle, still no tab strip) — `app.js:1212-1281`.

**Experiment detail**: header (`xpHead` — Title > Status > ID > version
picker, fixed order) + **two tabs**: `Experiment meta` | `Linked
experiences` (`XP_TABS`, `app.js:3929-3936`). Meta fields: IXP STATE,
HYPOTHESIS, START/END DATE, NO. OF TREATMENTS, HOLDOUT TREATMENT
(`XP_META`, `app.js:3750-3759`). Default-tab rule: opening an experiment
always lands on meta; the tab never auto-switches once picked —
`app.js:3915-3927` (see `PLAYBOOK.md` for the general tab-lock-in rule).

**Audience detail**: header (`auHead` — name | Verified badge | ID, **no**
version picker) + **two tabs**: `Targeting` | `Linked experiences`
(`AU_TABS`, `audience-change-order-oct07/app.js:940-958`), explicitly
mirroring the experiment pattern (`app.js:935-939`). Meta fields:
DESCRIPTION, SIZE, LAST UPDATED (`AU_META`, `app.js:837-841`).

**Experience drill-down** (`expDrillCanvas()`): sticky header (name, status
badge, optional QA badge, ID, version chip) + **four tabs**: Creative |
Experience meta | Audience | Experiment
(`link-unlink-experiments-sep11/app.js:3662-3701`, tab list at `3693`).
- Creative tab: Detail/Preview toggle, access point + template attributes,
  then single/clone creative body — `3673-3685`.
- Experiment tab: experiment name, a small meta grid (START/END DATE, TYPE),
  a treatments table — `3686-3689`.
- Experience-meta tab (the default fallback): Priority, Created by, Start
  date, End date — `3690-3691`.

## 4. Comparison views (`building-blocks`)

`building-blocks/app.js` is explicitly a **non-flow reference library** —
*"A reference library of reusable screens, not a flow... each page shows a
screen on its own"* (`building-blocks/app.js:1-16`). Use it as the canonical
source when a new build needs a version-vs-version comparison screen.

Tab registry `CMP_TABS` (`app.js:886-899`): Creative (built), Experience
meta (built), Audience (built, WIP-badged), Billing offer (built),
Experiment (code present but explicitly **not shipped** — placeholder only,
per comment).

Field sets:
- Creative: Headline, Body, CTA text, CTA URL, Secondary CTA, Image, Terms —
  `app.js:320-330` (`CMP_CREATIVE_FIELDS`).
- Experience meta: 15 pairs incl. Offer name, Locales, Timezone, Start/End
  date, Status, Impression cap, Priority, Goal, Subgoal, Product type, Tags,
  Template name, Experiment ID, Treatment ID — `app.js:473-490`
  (`CMP_META_FIELDS`).
- Billing offer: Promotion type, Billing offer, Product, Feature set codes,
  Pricing category, Is targeted, Is bundle — `app.js:498-509`
  (`CMP_BILLING_FIELDS`).
- Experiment: Start date, End date, Type, Treatment — ONE table, explicitly
  NOT per-treatment: *"we will not have multiple treatments at experience
  level... this tab is an EXPERIENCE's view of its experiment, and an
  experience sits on exactly ONE treatment"* — `app.js:869-884`
  (`CMP_EXPERIMENT_FIELDS`).
- Audience: nested condition groups — `CMP_AUDIENCE_SECTIONS` /
  `AUD_NESTED` — `app.js:511-556`, `665-735`.

**The comparison primitive** every tab renders through: `cmpTable(fields,
hl, removed)` — a 3-column table (Fields | Version A | Version B), only
differing cells get `.cd-hl` highlight on the B column, a value missing on
one side renders as `—` and is still highlighted (the dash IS the signal,
not a placeholder) — `app.js:351-376`, rule at `336-350`. Section-grouped
tabs (audience) render one table per group via `cmpSections()` —
`412-454`. Creative tab additionally renders a live Preview —
`cmpCreativePreview()`, `457-464`.

Audience tab offers 4 interchangeable layouts from one dropdown
(Table-Nested [default], Table view, Table-Json, Side by side, Version
toggle) — `AUD_LAYOUTS`, `app.js:940-951`, wiring `996-1013`.

The screen keeps the real two-pane chrome, but the conversation panel is
**visibly blurred and inert** behind the comparison — deliberately, to
preserve the real screen's proportions: *"where did the conversation pane
go? give it just blur it... the real screen is always two-pane"* —
`app.js:973-984` (`cmpPanel`). Entry point: `cmpScreen(state)` —
`app.js:914-971`.

## 5. Version flyout (`xpVerSelect`)

`link-unlink-experiments-sep11/app.js:3826-3847`. Facts:
- **Inert until a draft exists** — before that, it renders the status chip
  with a chevron but no menu at all (`verselect--off`) — `3830-3832`.
- Once a draft exists, the menu is a **hard two-way switch**, not a version
  history: exactly two rows, Draft/Edited ("Edited just now") and Published
  (a real date), each tagged with author + avatar — `3837-3845`. Comment:
  *"An experiment has exactly TWO states, Published and Draft... not a
  version history — no v1/v2 anywhere."*
- Trigger: click the chip (`data-vertoggle`) toggles `state.verOpen`; a
  click on a `data-verpick` row inside the menu is excluded from re-toggling
  it shut — `app.js:3008-3012` (same pattern at `2867-2871`, `2922-2926` for
  other scenes that reuse it).
- `verOpen` persists across re-renders the same way `xpTab` does — carried
  forward by every `*Base()` state-carrier function (`app.js:6653-6660`).
- **The audit build has a DIFFERENT, richer version flyout** —
  `logVerFilter()` — showing "All versions" plus every real version with its
  own status badge and date, used as a hard FILTER on the log table (not a
  Draft/Published toggle) — `audit-change-log-oct06/app.js:2838-2847`. Don't
  confuse the two when building a new audit-style flow — pick
  `logVerFilter` for a real version history, `xpVerSelect` for a
  draft/published binary.

## 6. Search, filter, and group-by controls — what's actually wired

**Important for anyone building a new list toolbar**: most of this chrome
is decorative. Confirmed by checking the actual click-wiring blocks, not
just the markup:

- The **search box** and the **sliders/filter icon** have **no click
  handler anywhere** in any build checked — pure static markup
  (`xpToolbar`, `link-unlink-experiments-sep11/app.js:3906-3910`; `auToolbar`,
  `audience-change-order-oct07/app.js:920-924`; wiring absence confirmed
  around `app.js:2931-3121`).
- **Group-by**: only options flagged `on:true` in `GROUP_BY_OPTS` render
  with a real `data-groupopt` attribute and are wired; every `on:false`
  option renders as a plain inert button with no data attribute at all —
  `groupByCtl`/`GROUP_BY_OPTS`, `app.js:3530-3548`. In practice **"Group by:
  Access point" is the only functioning option in every build checked** —
  both the 6-option list (`link-unlink-experiments-sep11`) and the 3-option
  list (`audience-change-order-oct07/app.js:904-919`) wire only that one.
  Click handler only binds `[data-groupopt]` elements —
  `app.js:3045-3048`.

**When building a new build's toolbar**: copy the markup wholesale (it's
meant to look complete), but don't assume search/filter/other-group-by-options
do anything unless you're the one adding that wiring — check the actual
`wire()` function for `data-*` bindings before claiming a control works in a
demo or a stakeholder walkthrough.
