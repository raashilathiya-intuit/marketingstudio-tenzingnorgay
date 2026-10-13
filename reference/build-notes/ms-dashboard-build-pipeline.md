---
name: ms-dashboard-build-pipeline
description: How the MS_Dashboard standalone .html builds are produced from the Vite source project
metadata: 
  node_type: memory
  type: project
  originSessionId: 1dc40556-18f7-4e09-888e-5adc52649d6d
---

The `~/Trial/MS_Dashboard` repo (cloned from github.intuit.com/asharma81/MS_Dashboard) holds
single-file dashboard prototypes + an index.html launcher. Each build .html is a SELF-CONTAINED
export of the React/Vite app living at `~/MS v2 - Raashi` (note the spaces in the path).

**As of 24 Jun 2026 there are exactly TWO live builds** (top level), everything else moved to
`deprecated/`:
- `Release1_Jun15.html` — "Release 1 (15 June)", the R1-D1 line. Flags __MS_NEW_SEARCH +
  __MS_TYPE_TO_SEND (no reply chips; AI types approval, user sends). Opens on #/r1d1.
- `TenzingNorgay_Jul31.html` — "Tenzing Norgay (July 31 release)", the R2-D2 line. Flags
  __MS_NEW_SEARCH + __MS_R2D2_JUN22. Opens on #/r2d2 (HOME, not change-order) and the same
  Create/Home flow is mounted under /r2d2 so the left-nav stays in /r2d2.
The index.html shows just these two cards (no filter pills). Only ONE localhost now: the static
server on :8080 (launch config `ms-dashboard` in ~/Trial/.claude/launch.json) — it serves exactly
what gets pushed. The Vite dev (:5173) launch config was removed.

**Reusable build script:** `/tmp/build-both.sh` builds both from per-build entry sources
(`src/main.standalone.r1d1.tsx`, `src/main.standalone.r2d2.tsx` — recreate if missing) and cleans
up after. `/tmp/make-standalone.mjs` now takes (OUT_NAME, TITLE) args.

**LeftNav is route-aware:** pass `routePrefix` ('/r1d1' or '/r2d2'); nav items navigate within
that flow (Change order → #/<prefix>/change-order), no leak to /r1d1.

**Git remotes (from ~/Trial/MS_Dashboard) — push rebuilt builds to:**
- `raashi` → github.intuit.com/rlathiya/MS_Dashboard_Raashi — **THE served repo** (GitHub Pages,
  e.g. `.../pages/rlathiya/MS_Dashboard_Raashi/TenzingNorgay_Jul31.html`). Always push here.
  Push branch `add-r1d1-jun15-workflows:main`. **User workflow contract: build in sandbox →
  user REVIEWS → only then push. Do NOT push to main without explicit go-ahead** (the git
  auto-mode also blocks a direct main push until review is confirmed).
- `origin` → github.intuit.com/asharma81/MS_Dashboard — READ-ONLY for rlathiya (push 403).
- (the old `trial` remote is gone — only `raashi` + `origin` exist now.)

**CRITICAL — Pages does NOT auto-deploy on push.** This repo's Pages is "Deploy from a branch"
(legacy, main /root), but a `git push` does NOT reliably trigger a rebuild — the live site can
stay frozen on an OLD commit while new commits pile up in `main`. Symptom: user sees old content
no matter how many times they hard-refresh. This is NOT browser cache (I wrongly blamed cache for
many rounds — don't repeat that). ALWAYS force a Pages rebuild via the GHE API after pushing, and
verify the deployed commit == HEAD:

```
CRED=$(printf "protocol=https\nhost=github.intuit.com\n\n" | git credential fill 2>/dev/null)
USER=$(echo "$CRED" | sed -n 's/^username=//p'); TOK=$(echo "$CRED" | sed -n 's/^password=//p')
# trigger a build of current main:
curl -s -u "$USER:$TOK" -X POST -H "Accept: application/vnd.github+json" \
  https://github.intuit.com/api/v3/repos/rlathiya/MS_Dashboard_Raashi/pages/builds
# poll until status=built AND commit == `git rev-parse HEAD`:
curl -s -u "$USER:$TOK" https://github.intuit.com/api/v3/repos/rlathiya/MS_Dashboard_Raashi/pages/builds/latest
```
The git credential for github.intuit.com (user `rlathiya` + token) IS available via
`git credential fill` and has Pages-API scope. After build is confirmed, the user still loads with
`?v=N` to dodge the CDN edge for a few seconds. Reliable tell that the NEW build is live: the
published bubble says "is now live. All experiences have been published." (old build said the
short "has been published.").

**Source project:** `/Users/rlathiya/MS v2 - Raashi` — React 19 + react-router-dom 7 + Vite 8.
Dev server runs on :5173 (`npm run dev`). Routes: `/` Landing, `/r1d1` CreateFlow,
`/r1d1/create` CreateFlow, `/r1d1/change-order` ChangeOrder, `/r2d2` R2D2.

**To produce a standalone .html** (e.g. R1D1_Jun15.html):
1. Write a temp `src/main.standalone.tsx` (HashRouter version of main.tsx — opens on `/r1d1`,
   sets `window.location.hash='/r1d1'` if empty). Include BOTH CreateFlow and ChangeOrder routes.
2. Write temp `index.standalone.html` (points to `/src/main.standalone.tsx`).
3. Write temp `vite.standalone.config.ts` (outDir `dist-standalone`, input the standalone html).
4. `npx vite build --config vite.standalone.config.ts`
5. Run `/tmp/make-standalone.mjs` — inlines JS, CSS, and all 39 `/figma/*` assets as base64
   data URIs into ONE html written to `~/Trial/MS_Dashboard/R1D1_Jun15.html`. The script
   replaces backtick-quoted `/figma/..` refs with `window.__MS_ASSETS[...]` lookups.
6. Clean up: `rm -f index.standalone.html src/main.standalone.tsx vite.standalone.config.ts;
   rm -rf dist-standalone`.

The `make-standalone.mjs` script asserts every `/figma/*` ref is backtick-quoted and all get
replaced — this is what protects the SVGs/GIFs from getting lost in the export. See
[[ms-dashboard-figma-assets]].

**Gotcha:** changing only the URL hash does NOT reload the standalone file or reset React state
(HashRouter keeps the component mounted). To get a FRESH flow run in the browser preview, load
with a cache-busting query: `R1D1_Jun15.html?t=<ms>#/r1d1/change-order`.

**Build blocker:** `npm run build` runs `tsc -b && vite build`; the standalone config skips tsc.
There's an unused-var lint (`loaded` in CreateCampaignPanel useFirstVisitLoad) — vite build
itself tolerates it; only `tsc -b` complains.
