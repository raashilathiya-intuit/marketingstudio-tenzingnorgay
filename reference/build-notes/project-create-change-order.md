---
name: project-create-change-order
description: "Key facts about the Create-Change-Order repo, local paths, git remotes, and GitHub Pages setup"
metadata: 
  node_type: memory
  type: project
  originSessionId: aa4772b9-33c7-486f-a312-b5015f0dbf2e
  modified: 2026-08-24T07:42:04.468Z
---

Local repo path: `/Users/rlathiya/Trial/MS_Dashboard`
Preview server: always running on port 8080, cwd `/Users/rlathiya/Trial`

Git remotes on the local repo:
- `origin` → `https://github.intuit.com/asharma81/MS_Dashboard.git`
- `raashi` → `https://github.intuit.com/rlathiya/MS_Dashboard_Raashi.git`
- `create-change-order` → `https://github.intuit.com/rlathiya/Create-Change-Order.git`

GitHub Pages site: `https://github.intuit.com/pages/rlathiya/Create-Change-Order/`

**Why:** Pages serves from `master` branch (HEAD on the remote), not `main`. Changes pushed to `main` won't appear on the Pages site until merged into `master`.

**How to apply:** When pushing updates to be visible on Pages, always merge into `master` and push that. Or remind user to change Pages source to `main` in repo settings.

Note: automated `git push` previously appeared blocked by Intuit's security hook, but on 2026-08-24 a push from the CCO-landing repo (`git push origin master`) succeeded from the session shell. Try pushing when asked; fall back to handing the user the command if a hook rejects it.
