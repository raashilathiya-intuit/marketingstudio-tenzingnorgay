---
name: export-share-artifacts-oct08
description: "Oct-08 building block: the export/share button at the top-right of every table (duplicate glyph → drawn check + 'Link copied' tooltip), three resting screens reachable from its sim menu, no intake/loader"
metadata:
  type: project
---

`export-share-artifacts-oct08/` in the [[project-create-change-order]] CCO-landing repo, a straight copy
of `clone-ipd-1n-experiences-oct07/` (see [[clone-ipd-experiences-sep03]]) so it carries the campaign
detail, search results and cloned-experiences screens. Listed on the landing index's **Building Blocks**
tab (see [[building-blocks-sep24]]) as "Export / share artifacts", above Stop processing. Title
"Marketing Studio - Export / share artifacts". **PUSHED 2026-10-08 in `0b939ee`** (master, with the 1:n CLONE_MULT change). index.html was committed as HEAD + only the export card + footer (hash-object trick, as for the audit push) because the working tree also carries cards for the untracked audience-change-order, move-origin (LOCAL ONLY) and test-skill-export folders; placement-change-sep01 edits left uncommitted. Later cache-busters below.

**What it is** (user, 2026-10-08): "not a loading state", one icon button, the DUPLICATE glyph (square
behind a square, same family as the 14px `COPY_ICON` next to IDs), rendered like the filter `iconbtn`
but at the TOP-RIGHT of every table toolbar. Click → the glyph is replaced by a drawn check (stroke-dash
animation) in the SAME grey as the resting glyph: NO colour change at all on the copied state (user 2026-10-08, twice: first rejected an invented green, then the app's own positive green too: "no need of green colour"; only the glyph swap + tooltip say it worked), with "Link copied" as the IDS TOOLTIP small (Figma MS-Theme 1.2.0 `qsTBIhxlLaXLmrMEzQJbCS` node 8334:12631: #393a3d, white 12px semibold, 4px pad, 4px radius, 0 2px 4px rgba(0,0,0,.2); user supplied the link 2026-10-08, replacing my white bordered pill) UNDER the
button; 1.8s later it is the duplicate glyph again. It copies `location.href` (best effort, promise
rejection swallowed).

**How it is built**: `EXPORT_ICON` / `EXPORT_CHECK` / `exportBtn()` live right after `COPY_ICON` in
`app.js`; `${exportBtn()}` is the LAST child of all four toolbars (campaign list, `experiencesPanel`,
`rxToolbarCl4`, the pcSearch toolbar). `.exportWrap{margin-left:auto}` pushes it right. ONE delegated
`document` click listener on `[data-export]` does the swap, so it survives re-renders. CSS block sits
after `.simMenu__link:hover` in index.html. **`.toolbar .search` was made shrinkable (`flex:0 1 277px;
min-width:140px`) in THIS build only**, because "Group by: Access points" + the new button overflowed
the canvas at the default window width and the button was clipped off. Tooltip/zone need `z-index:40`
to clear the sticky table header (z 5/6).

**Sim menu** = label "Export / share artifacts" + three items that `go()` STRAIGHT to a resting screen
(no C1/C2 intake, deliberate, user: "this will not be a loading state"):
- `xs-campaign` → `go('singleCampaign',{view:'table',tab:'experiences',typed:true})` (typed:true stops
  the base build's auto-typed change request)
- `xs-search` → `go('pcSearch',{})`
- `xs-clones` → `go('pcSearch',{selected:[0,1,2],asked:3,typed:true,path:'change',cl3:'allrev'})`,
  the 1:n cl3n final output (12 clones across 4 access points with `CLONE_MULT.cl3n=4`)
Each handler sets `scenario='cl3n'`; the old cl3n/cl4n menu entries are gone and so is the sibling cross-link (user asked why it was there, 2026-10-08: a copy leftover, this block has no sibling). Verified all three in the browser 2026-10-08.

**2026-10-08, later: the loop back in, and a 4th scenario.** Cache-buster `?v=175`.
- **"Go to browser" GHOST button** (`.ghostDev`, dashed/muted like the Building blocks' `refJsonToggle`,
  dev aid NOT product UI) appears to the LEFT of the export button once a link has been copied, but NEVER on an artifact opened FROM a link (`state.shared`; user 2026-10-08: "remove go to browser from here after opening artifact")
  (`copiedShare = {key, link}`, in-memory only; user said do NOT persist across refresh). Click →
  `scenes.browser`: a fixed full-window Chrome-like frame (tab strip, back/fwd/reload, omnibox, empty
  page with a ghost hint). Paste (or Cmd+V, or an EMPTY Enter) fills the omnibox with the copied link
  (clipboard permissions are flaky in the pane, so the fill never depends on the OS clipboard); Enter →
  1.1s "navigating" state (progress bar, page skeleton) → `runIntakeShare(key)`.
- **`runIntakeShare`** follows the ms-prototype-intake sequence: boot "Creating a project" → C1 centred
  (**NO user bubble**: the link went into the browser, nothing was sent, user 2026-10-08 "we are not really sending it"; C1 opens on "I have created "<project>" project for you.", then the loader "Opening the artifact":
  Reading the link / Fetching the artifact / Preparing the view) → C2 skeleton two-pane → the artifact's
  own scene opened with `shared:<key>`. **`sharePostRender()`** (called in both `render()` and `go()`
  right after `innerHTML`) swaps `aside.ai` for the SHORT conversation: created, "I've opened
  "<title>" for you." + objectCard + "What would you like to do next?". No flow transcript is replayed
  (user: "we will not show the entire conversation").
- Links: `https://marketingstudio.intuit.com/` + slug per artifact in `SHARE_ARTS` (campaign / search /
  clones / verify); `shareArtKey()` reads `current` at copy time; `shareKeyFromLink()` maps a pasted
  URL back to the artifact.
- **4th scenario `xs-verify` → `scenes.verifySummary`** built from the user's two reference screenshots
  in OUR UI (user: "create it basis our UI"): crumb Home / ELM9071 campaign, title "Verification summary -
  ELM9071 campaign", cols Workbook Row no. | Experience ID | Experience | Verification status (badge:
  `Match`→pos, `Mismatch`→err, added to `badge()`) | Experiment ID | Audience | Billing offer, 9 rows
  (03–11, 03+04 Mismatch), pager "1-9 of 118", export icon top-right (NOT the reference's labelled
  "Export" button, ours is the icon). Row click → drill-down: back + full experience name + status badge,
  sub "Mismatch details between workbook and Marketing Studio", `.vsNote` root-cause card (light red,
  ERR_ICON), compare table Fields | Workbook Row NN … | Marketing Studio - Offer ID … with "Wrong entry"
  (`.msgErr`) under CTA text / CTA URL. Panel: two "Did something" disclosures, "I've generated
  experiences" + card, "I've verified all experiences against Workbook v1" + card + Match 7 / Mismatch 2
  mini table (`.vsMini`) + pill "Show mismatched experiences" (filters to the 2 rows, `state.mis`).
  Wiring is a delegated document click guarded by `current.name==='verifySummary'`.

**2026-10-08, VERSIONS + CHANGE LOG everywhere (user: "make their version thingies work").** Cache-buster
`?v=177`. Ported the audit build's flyout / log / compare (see [[audit-change-log-oct06]]) as a
PROFILE-driven module appended to app.js, injected AFTER each scene renders (`logPostRender`, called in
both `render()` and `go()` next to `sharePostRender`): it swaps the static `.verselect` in `.detail-h`
for the live picker, or replaces the whole `.content` with `changeLogCanvas` / `logCmpCanvas` when
`state.log` / `state.logDrill` is set. Scenes are untouched. All clicks are ONE delegated document
listener (data-vertoggle/verpick/verlog, logback/logrow/logvertoggle/logverpick, cmptab/cmpback, outside
click closes menus). `logProfileFor(main,name,state)` picks the profile:
- `campaignProfile` — the campaign header `v1` on singleCampaign: 1 version, 3 rows (Create / meta
  Update / Publish), compare is ONE Fields|Before|After table, no sub-tabs.
- `liveExpProfile(r)` — campaign Experiences-tab drill (NEW: rows now `drillrow:true`, the
  `scenes.singleCampaign` wrapper renders `expDrillCanvas` with `CAMP_EXP_ROW`, name
  "ELM9071-IPD-HelloChartAcc-US-QBL-QBLAST", v3) and the search-results drill (PC_ROWS, v3 or v4 per
  row → 3 or 4 versions, 8 or 10 rows; the v4 rows add a meta update + a second publish). Five compare
  tabs, audience with addedAt/removedAt indices computed from the entries.
- `cloneProfile` — the clone drill (read off the DOM: title + `.cd-attr__v`). **DELIBERATELY SHORT (user:
  "be a little thoughtful… only one change has happened which was fixing the creatives"): v2 Draft / v1
  Draft, exactly TWO rows: Create "Cloned from <source> onto <ap> with the hellobox - text template." (v1,
  initial) and Update Creative "Added the body copy the hellobox - text template requires." (v2, Body
  — → BODY_FIXED).** Meta carries a "Cloned from" row. No publish row (clones are Draft/Edited).
- Verification summary has no version UI (it is a workbook compare, not an object).
Creative compare tab is table-only here (no Detail/Preview toggle; this build's `helloboxCreative` has no
per-field opts). Status rule in `cmpAfter`: Published only at/after the newest publish entry, else Draft
(or the profile's own non-published status).

**2026-10-08, THE BROWSER IS AROUND THE APP NOW (user: "show Marketing Studio within our browser … remove
the ghost button … a plus that opens a new tab").** Cache-buster `?v=180`. This build ALONE renders inside
a fixed 88px browser frame (`#chrome` before `.app` in index.html; `body{padding-top:88px}`,
`.app{height:calc(100vh - 88px)}`): a tab strip + address bar, drawn by `renderChrome()` after every
render/go. Tab model `tabs=[{id,kind:'ms'|'new',snap,url,typed}]`, `activeTab`, declared with `var` /
function declarations because the first `go('home')` runs before the block (TDZ crash otherwise) and
`renderChrome()` is called once at the end of app.js. Tab 1 IS Marketing Studio; its address follows the
screen via `appUrl(name,state)` (home, campaign, campaign/…/experiences, search, clones, verify, with
drill suffixes), read-only. **"+" opens a New Tab**: `snapActive()` stores the leaving tab's
{name,state}, `scenes.newtab` is an empty white page with the ghost hint, `.app--blank` hides the rail,
the address bar becomes editable + focused. Paste / Cmd+V / empty Enter fill the copied link; Enter →
tab becomes an ms tab, `scenes.navigating` (progress bar + skeleton) 1.1s → `runIntakeShare(key)` →
the artifact with the short "opened for you" panel. Clicking a tab restores its snapshot; × closes
(never the last one). **The "Go to browser" ghost button, `scenes.browser` overlay and `data-gobrowser`
are GONE.** Verified in the browser: copy on verify → + → paste → Enter → intake → artifact, tab 1 still
on the verification summary.

**2026-10-08, later still.** Cache-buster `?v=184`.
- **THE COPIED LINK IS REAL**: `shareLink(key)` = this page's own URL + `?open=<key>`; on load `?open=`
  is stripped via replaceState and `runIntakeShare(key)` runs after 400ms, so the link works in the
  user's own Chrome (and on Pages once pushed). `shareKeyFromLink` reads `open=` first, slugs second, so
  the in-prototype new tab accepts the same link. The in-app browser frame STAYS (user: "keep this").
- **Sim menu's second section = "Try it yourself: copy link and open in your browser" (renamed 2026-10-09)** (`xr-*`): the SAME four
  screens as `xs-*` but with the browser frame OFF (`chromeOn=false` → `body.chrome-off` hides `#chrome`,
  padding back to 0), plain Marketing Studio like every other build. The user copies the link there and
  pastes it into their REAL browser: a one-to-one real example. A first pass made this section jump to
  the receiving end directly; user 2026-10-08: "I don't think you understood… just without the browser
  UI, if I copy it, go to my own browser and paste it." Arriving via `?open=` also runs frame-off (no
  browser inside a browser). `xs-*` turns the frame back on.
- **A shared artifact has NO back arrow above it** (user: "when an artifact is shared, it's something
  very specific… drill downs are fine"): `sharePostRender` removes `.detail-h .back[data-back]` when
  `state.shared` and no `expDrill`; drill-downs inside keep theirs.
- **Export button poked through the sticky campaign header while scrolling** (user screenshot):
  `.exportWrap` z-index is now auto, raised to 40 only on `.exportWrap--copied`, and `.detail-sticky` is
  z 50 in this build.

**2026-10-09.** Cache-buster `?v=185`. Two user calls:
- **A shared Experiences tab shows ONLY the experiences table**: `scenes.singleCampaign` with
  `shared==='campaign'` and no drill renders crumb + `page-h` "Experiences - DIWM QB Live campaign" +
  `experiencesPanel({drillrow:true})`, no campaign header, no Campaign meta / Insights tabs, no campaign
  version picker. `SHARE_ARTS.campaign.title` is now "Experiences - DIWM QB Live campaign" (object card
  + "I've opened …"). Drill-downs inside still work with their v3 picker.
- **AN EDIT DOES NOT BUMP THE VERSION** (user: "version doesn't change on just edit… one version could
  have multiple edits under it"). Clone rows stay `v1` after the creative fix (the two `'v2'` sites in
  the pcSearch display block are now `'v1'`); `cloneProfile` has ONE version, `{v1, status:'Edited'}`,
  cur v1, both log rows ver v1. Same family as the Oct-06 rule "version does not change on publish".
- Shared Experiences table uses the pinned `.selbar--footer` (the panel's inline bar floated under the
  pager on a short page, user screenshot 2026-10-09). The cloned-experiences canvas (shared cl3/cl4
  display block) now has the footer action bar too, plus the "Highlight changes" toggle when the clones
  are Edited (`loopKey==='cl3'`); `apChanged`/`tmplChanged` follow `state.hl`, the generic
  `[data-hlchanges]` wiring re-renders via go(). Second sim section relabelled "Try it yourself: copy
  link and open in your browser". Cache-buster `?v=188`.
