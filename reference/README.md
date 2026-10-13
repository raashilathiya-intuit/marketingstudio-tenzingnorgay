# Reference

Supporting material for the prototypes in this repo. None of it ships as part
of a build; it is here so the next person can pick the work up.

## skills/

Claude Code skills used to build and extend these prototypes.

- **ms-prototype-intake** — the one written specifically for this repo. Every
  flow starts from a typed prompt and walks a fixed intake sequence
  ("Creating a project" loader, then C1 centred conversation, then C2 two-pane
  with canvas skeleton, then the result). Read it before adding a scene, a
  sim-menu entry or any new entry point.
- **figma-flow-prototype** — generic skill for turning a Figma file plus a flow
  diagram into a clickable prototype.

## build-notes/

One file per workflow, recording the decisions behind each build: scenario
lists, state keys, copy rules, and the places where a build deliberately
departs from Figma. These are the "why" that the code cannot carry.

A few files are conventions that apply across every build rather than to one:

- `no-em-dash-in-ui-copy.md` — user-visible copy uses sentences and commas
- `draft-notice-language.md` — standing wording for the draft info note
- `done-messages-summarise.md` — agent completion copy is counts and outcome,
  never a list of experience names
- `draft-and-change-one-step.md` — experiment plans never have a separate
  "create a draft" task
- `ms-dashboard-loader-and-nav-feedback.md` — active loader step is a grey ring
  plus text shimmer, never a blue dot

## What is not here

`MEMORY.md` (an index into a personal memory store, with pointers to files that
do not exist in this repo) and `preview-tab-throttling.md` (a note about a local
editor setup) were left out as not being about these prototypes.
`project-create-change-order.md` is included for its Pages and branch notes, but
be aware it also records local filesystem paths and git remotes that are
specific to one machine.
