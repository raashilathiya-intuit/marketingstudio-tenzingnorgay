# CCO-landing

Before adding or changing a prototype build in this repo, read these three
docs in the repo root, in this order:

1. **`HANDOFF.md`** — how to start a new build: repo layout, what shared
   infra to copy (and what NOT to fork whole), known failure modes, how to
   run a build locally, how to add the landing-page card.
2. **`PATTERNS.md`** — which UI component to use for a given object or
   moment: search table vs. direct object open, table columns per object
   type, detail/tab shapes, comparison views, version flyout, which
   list-toolbar controls are actually wired vs. decorative.
3. **`PLAYBOOK.md`** — the flow-machinery rules: C1/C2 intake shape, when a
   playback-intent card is enough vs. when a full plan widget is needed,
   every loading-state widget and when each applies, exact arrow-key
   runtime behavior, the long-task-vs-short-task sequencing rule, and why
   canvas + conversation can never go out of sync.

Also load the `ms-prototype-intake` skill for any new flow — it's the
enforced entry-sequence spec these docs assume and build on, not a
replacement for them.

All three docs cite exact file:line references for their claims. If you
change code in a way that contradicts one of those citations, update the
doc in the same change — a stale "copy X" pointing at code that's since
been superseded is worse than no doc at all.
