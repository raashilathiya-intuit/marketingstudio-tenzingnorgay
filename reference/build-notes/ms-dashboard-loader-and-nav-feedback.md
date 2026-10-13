---
name: ms-dashboard-loader-and-nav-feedback
description: "Hard rules from repeated user corrections — loader active state must never look like a blue dot; selected nav = icon purple only, text stays navy"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1e1cc21f-4dad-42e3-afd2-bfd1c1b0a052
  modified: 2026-07-21T15:55:23.597Z
---

Repeated corrections on the MS dashboard ([[ms-dashboard-decisions]]). The user
had to ask multiple times, so treat these as firm:

**Loader sub-step active state — NO blue, NO dot:** the active sub-step must use
the SAME static grey hollow ring as idle (`#d2d5de`, transparent centre). The
"active" signal lives on the LABEL TEXT only — a light↔dark-grey gradient
shimmer (`agentLabelShimmer`, clipped to text). NEVER a blue arc/ring/spinner on
the marker — a spinning blue arc at 16px reads as a pulsing blue dot (esp. when
the hidden preview tab throttles the spin), which the user explicitly rejects.
Marker rule is shared `.agentTask__check` / `.agentTask__label` in
ChangeOrder.css → applies to Create flow, Change order, AND edit mode at once.

**Why:** user said the "blue pulsating thing" was wrong across Create flow + edit
mode; idle grey rings are fine, the blue active state is not.

**How to apply:** when verifying a loader, check the ACTIVE step's computed
marker has NO blue (`81,131,230`) and no `agentRingSpin`; the active label should
have a gradient + `-webkit-text-fill-color: transparent`.

**Selected nav = ICON purple ONLY:** on selection the icon swaps to the purple
(#4E35CB) `*-selected.svg`; the LABEL TEXT stays navy `#000729`
(`--nav-text-selected`). Do NOT make the selected label purple — the user only
ever asked about the icon. (I changed the text once; it was reverted.)

**Process note:** when the user marks one screenshot "this is correct," that
confirms ONLY that exact frame — don't generalize it to every loader. Ask which
marker style they want rather than assuming. See [[preview-tab-throttling]].

**UPDATE 2026-07-21 — CCO Targeted Offers build ([[create-change-order-new-repo]],
served from scratchpad `cco/`, files index.html + app.js):** the sub-task loader
marker is now a **bare stroked checkmark TICK (no circle, no ring)**, per Figma
"MS Theme 1.2.0 / Thinking — Doing some tasks" node **7463-9100** (body 7591-43300,
checkmark icon 235:6652). Rendered via `I.tick` (currentColor stroked SVG).
Fade hierarchy WHILE loading: done tick `#393a3d` (icon-primary) + text `#3a393d`;
active tick `#6b6c72` (icon-secondary) + shimmer label; idle/pending tick `#d4d7dc`
(input-placeholder-disabled) + tertiary `#5d686f` text. Once ALL steps done, the
list gets `.agentTasks__list--settled` and everything settles to done color
`#3a393d`. This REPLACES the green-filled-circle marker (which itself had replaced
the grey ring) in `agentLoader` — scope was **loader sub-tasks ONLY**; the AI-panel
step-header chip and plan-table done rows keep their green circle + white check.

**Why:** user shared the Figma node as the "proposed xd" and confirmed "hierarchy
for loading states, and done colour post done."
