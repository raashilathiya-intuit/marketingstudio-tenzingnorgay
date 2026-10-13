---
name: draft-notice-language
description: "The standing wording for the purple info note whenever a flow creates or works in a draft version"
metadata:
  type: feedback
---

**THE PURPLE INFO NOTE DESCRIBES THE OBJECT AND WHAT STAYS SAFE — NOT WHAT THE AI IS ABOUT TO
DO** (user, 2026-09-28, supplying the pattern). The old copy narrated procedure and led with the
publish obligation; the new copy states what will exist and what is unaffected.

- Do NOT write "X is published, so I'll create a draft and make the changes there."
- DO write what the draft IS, then the reassurance.

**Why:** the user does not need the AI's plan of action, they need to know the live experiment is
safe. "The changes go live when you publish" is a next step, not a reassurance, so it stops being
the lead.

**The set, as applied across link-unlink-sep11, update-treatment-holdout-sep28,
unpublish-sep24:**

| Situation | Copy |
|---|---|
| Published, a draft is created | "A new draft version will be created from the current published experiment. The changes will be made to the draft without affecting the live experiment." (reworded by the user 2026-10-05: since [[draft-and-change-one-step]] the AGENT makes the change, so "you can make changes" was wrong) |
| Already a draft | "This experiment is already a draft, so changes apply to it directly. Nothing is live until you publish it." |
| TWO published experiments | "A new draft version will be created from each published experiment. The changes will be made to both drafts without affecting the live experiments. `${FROM}` has to be published before its experiences can move to `${TO}`." |
| N published experiments | "A new draft version will be created from each of the `${n}` published experiments. The changes will be made to the drafts without affecting the live experiments. Each draft has to be published before its experiences can move to `${TO}`." |
| The TARGET already has a draft (the move flow's continuation) | **"`${TO}` is already in draft, so I'll apply the change there. The change goes live when you publish the draft."** — the user wrote this one; it is deliberately the SHORT procedural form, because the card's own intro already says the change goes to the draft, so a long restatement read as redundant. |

**UNCHANGED, deliberately:**
- "Publishing this draft will replace the version that's live now." — already object-first, and it
  is a genuine WARNING before a destructive step, not reassurance.
- The unpublish flow's notes ("This also unpublishes its linked experiences and discards its
  current draft, which can't be recovered.") — about DESTROYING a draft, not creating one.
- The access-point builds' "Changing the access point creates a new experience. The one you
  selected stays as it is." — already follows the same object-first principle, and is about a new
  EXPERIENCE rather than a draft version (user chose to leave it).

**`update-treatment-holdout-sep28` WAS BEING EDITED IN ANOTHER SESSION** while this ran — a
`node --check` caught it mid-write and reported a syntax error that resolved on its own. Do not
restore a backup over that build without diffing first; the backup will be stale.
