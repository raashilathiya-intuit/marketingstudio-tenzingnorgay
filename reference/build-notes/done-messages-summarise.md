---
name: done-messages-summarise
description: "Agent 'done' messages in the CCO prototypes summarise counts and outcome — never enumerate experience names or per-item treatments inline; the object card carries the name"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c1a8cef3-f352-4a45-a8b7-3d74889e43f3
  modified: 2026-09-30T16:01:10.413Z
---

A "done" message reports WHAT happened as a count plus the resulting state, and never re-lists
experience names or per-experience treatments inline. Example the user wrote themselves
(2026-09-30, move flow, link-unlink build): **"I've linked the 3 experiences to the draft and
assigned their respective treatments. It now has 5 linked experiences."** (singular: "linked the
experience to the draft and assigned its treatment"). Same shape as the treatment flow's
"I've assigned the treatments for the 3 selected experiences on X experiment's draft."

The PUBLISH line after a move (both mvExp and mvMulti) is **"I've published the experiment with
the 3 newly linked experiences. It's live with 5 linked experiences."** (user's direction,
2026-09-30; "linkages" was their word, spelled out as "newly linked experiences" because the UI
never says "linkages"). And the treatment CONFIRMATION card in the single move now uses the same
numbered `.mxAssign` arrow list (name → treatment, equal weight) as the across-experiments flow
(user: "use the arrow format as in across experiment flow"); the stacked `.tmtAssign` is deleted.

**Why:** experience names are 40+ characters with no spaces; three of them plus treatment names in
one sentence read as "gibberish" (user, 2026-09-30). The detail already has its own place: the
plan/confirmation card lists name → treatment, the canvas table shows the result, and the object
card right under the message carries the experiment name (so the sentence can say "the draft").
The user has asked for this three times now (2026-09-28 "no need to name all in this message",
2026-09-30 twice), so treat it as standing.

**How to apply:** when writing any agent message after a change in these prototypes (link,
unlink, move, reassign, unpublish, clone...): counts + outcome, name the experiment at most once
(or not at all if the object card shows it), keep the per-item detail in a widget (numbered list
with arrows, plan table) on the CONFIRMATION turn, not in the done prose. Offer copy options
before applying — the user picks or writes the line.
