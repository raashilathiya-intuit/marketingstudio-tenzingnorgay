---
name: draft-and-change-one-step
description: "Experiment flows create the draft AND apply the change in ONE step; plans never carry a separate 'Create a draft of X' task"
metadata:
  type: feedback
---

**CREATING THE DRAFT AND CHANGING IT IS ONE STEP** (user, 2026-10-05: "we can create the draft
and make changes to that draft (whether linking or unlinking) in the same step, so our plan widget
cuts out some steps"). No plan row, loader, resting canvas or Approve exists for "Create a draft of
X" on its own.

**Why:** the draft is only a means to the change; a task whose canvas shows an unchanged copy made
the user approve the same state twice.

**How to apply:**
- A flow that changes ONE experiment (unlink, link, reassign treatments) has NO plan at all: the
  intent card is the confirmation ("Does this look right? I'll create the draft and unlink them
  once you approve."), one loader ("Creating the draft and unlinking the experiences", subs
  Creating the draft / <the change> / Refreshing the list), then the done turn ("I've created a
  draft of X and unlinked the N experiences from it. The draft now has K linked experiences.") with
  the Publish offer. The draft path is identical minus the draft wording.
- A MOVE plan has one task per experiment: `Create a draft of X with the experiences unlinked, and
  publish` (ends in the publish beat) and `Create a draft of Y with the experiences linked` (no
  publish of its own). Across N sources: N tasks + 1. The treatment ask sits BEFORE the destination
  task, standing on the destination's LIVE list (its draft does not exist yet).
- Applied 2026-10-05 to [[link-unlink-experiments-sep11]] (ulPub, lkExp, mvExp, mvMulti + CM pair;
  v182), [[update-treatment-holdout-sep28]] (ttPub; v48) and [[move-origin-destination-sep30]]
  (mvCtx; v176). `UL_PLAYBACK`/`UL_STAGED`/`LK_PLAN`/`LK_TASK`/`TT_PLAN`/`TT_STAGED` are now dead
  code left in place. `MX_DEST_DRAFT_TASK` is gone.
- **PUSHED 2026-10-05** in Create-Change-Order `master` d1f42de (link-unlink v189, treatment v55, unpublish's inherited line). move-origin-destination-sep30 carries the same change but stays LOCAL ONLY per the user.
