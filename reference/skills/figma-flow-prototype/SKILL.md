---
name: figma-flow-prototype
description: Build an interactive, clickable React prototype from a Figma file's components/page templates plus a logic flowchart describing user flow. Use this skill whenever the user provides (or references) a Figma file containing UI screens/components AND a flow diagram, decision tree, or described branching logic, and wants a working coded prototype out of it — even if they only say "build a prototype", "turn this into a working demo", or "wire up this flow", without using the words "Figma" or "flowchart" together. Also use it when asked to update, extend, or pixel-match a specific screen in an existing Figma-derived prototype, to change how the prototype asks clarifying questions or handles search/branching logic, or to add drill-down/nested detail screens (e.g. "there are N drill-down pages, add them") reached by clicking into rows from tables elsewhere in the prototype.
---

# Figma Flow Prototype

Turns a Figma design file (components + page templates) and a logic flowchart (branching user-flow diagram) into a single-file, interactive React artifact that a person can actually click through — not a static mockup.

## Overview of the pipeline

1. **Gather inputs** — Figma file(s) with reusable components/templates, and a flowchart describing the logic between screens.
2. **Read the design cheaply first** — `get_metadata` before `get_design_context`.
3. **Read the flowchart and resolve ambiguity by asking, not guessing.**
4. **Build the prototype as a small state machine** — one view per screen, one state variable driving which view renders.
5. **Match specific screens exactly when asked**, by pulling design context for that exact node.
6. **Keep dynamic content honest** — search/query flows must reflect what the user actually typed.
7. **Iterate** — re-present the updated artifact after each change, don't restate the whole file in prose.

Each of these is expanded below.

## 1. Gather inputs

Ask (a single elicitation call, not a paragraph of questions) for:
- What the final prototype should be: coded (React/HTML) vs. a Figma-native prototype. This skill is for the coded path — if the person wants a Figma-native prototype instead, that's a different workflow (use `use_figma`/Figma prototyping tools directly, not this skill).
- How they'll share components/templates + the flowchart: Figma link, images, or written spec. A Figma link is the best case since exact design context can be pulled.

If a Figma link is given, don't assume the flowchart is a separate file — many teams put screens and the logic diagram as different sections/frames of the *same* file. Check the whole file's page list before asking the person to hunt for it.

**Check for an existing reference doc before deciding how much to read fresh.** If this skill has been used on this same Figma file before, a person will often have a project-knowledge doc summarizing screens, navigation, tokens, and mock content (see section 2's note on writing one). If one is available (in project knowledge, or the person mentions/attaches one), **treat it as the primary source of truth for anything it specifies exactly** — reused mock data, exact copy, confirmed tokens — rather than re-improvising those details from scratch. Two sessions inventing different plausible metric numbers, different shortcut labels, or different degrees of "how much of this screen to include" is the single most common way this skill produces visibly inconsistent output across separate conversations on the same file. A reference doc's job is to close that gap: read it as an active spec, not background flavor text, and don't silently drop or simplify sections it lists as part of a screen (e.g. a documented "metrics + shortcuts + table" dashboard doesn't become a bare search box because a request emphasized the search flow) unless the person explicitly narrows scope. Only fall back to fresh `get_metadata`/`get_design_context` calls for what the doc doesn't cover — and if you learn something new that should be durable, tell the person it's worth adding back to the doc.

## 2. Read the design cheaply first

Figma files for real products are often too large for `get_design_context` to return in one call. Always:

1. Call `get_metadata` on the page/canvas first to get a cheap overview of frames/sections and their names. Frame and section *names* usually tell you what's a page template ("Home", "Search results"), what's a flowchart ("Logic", "Search experience"), and what's a detail/drill-down screen. This step is mandatory before writing any code — never start building a screen from general knowledge of what this type of app "usually" looks like.
2. Only call `get_design_context` on specific node IDs you actually need, not the whole page. If a call returns a "too large, call get_design_context on sublayer IDs" message, split into smaller sub-node calls rather than retrying the same large node.
3. **Text nested inside component instances (tab labels, badge status, meta field values) often resolves to generic placeholders when you query a large parent frame, but resolves to the real overridden text when you query that specific instance's node ID directly.** A tab group returning "Tab - Single" with no visible label at the screen level, for example, will often return the actual label (and even a Code Connect-mapped component snippet naming each tab) when you call `get_design_context` on that tab group's own node ID. Before concluding a value is unresolvable and falling back to a placeholder, try targeting the specific instance directly — it's a cheap call and frequently succeeds where the broader query didn't.
4. If prompted about Code Connect ("Would you like to connect code components to your codebase?"), relay that question to the user verbatim and follow their answer exactly — don't paraphrase or skip it. If there's no connected codebase to map against, tell the user that plainly and call `send_code_connect_mappings` with an empty list to close it out.
5. **"Don't over-extract" means skip chasing exact pixel/hex/spacing values for every element — it does not mean skip reading a screen's real content and layout.** Every screen that will actually appear in the prototype needs at least one `get_metadata`/`get_design_context` call grounding *that specific screen* — its real copy, its real component arrangement, its real section order. Pulling a color palette from one or two representative screens and then inventing the rest of the app's layout/content from general SaaS-dashboard conventions is the single most common way this skill produces a "generic-looking" result that doesn't match the user's actual file. If a person reports the output looks generic or doesn't match their design, this is the first thing to check: did every screen in the prototype get its own grounding call, or were some screens built from assumption?
6. **Self-check before presenting the prototype:** for each screen in the build, you should be able to point to a specific tool call that grounded it. If any screen's copy, layout, or components were written without one, go back and pull it before finalizing rather than shipping a plausible-looking guess.

## 3. Read the flowchart and resolve ambiguity by asking, not guessing

Flowcharts in Figma are usually shapes + connectors with no machine-readable edges — you have to infer which connector links which nodes from position/size (a connector's bounding box roughly spans from one shape's edge to another's). This works for most edges, but:

- **When a connector's target is genuinely ambiguous** (e.g., a "YES" branch is long enough to plausibly skip one or more intermediate steps), don't silently pick an interpretation. State your best reading, flag specifically which part you're unsure about, and ask the user to confirm with a short multiple-choice question. Getting a branch wrong means building the wrong logic, which is expensive to unwind — a 30-second confirmation is cheaper.
- **When a decision loops back**, ask whether it loops indefinitely or has a max-retry/fallback — don't assume either.
- Once confirmed, restate the full resolved flow back to the user in plain steps before building, so any remaining misunderstanding surfaces before you write code, not after.
- If the user says "fold in all other scenarios", check whether more than one flowchart/logic section actually exists in the file (search page metadata for names like "logic", "flow", "scenario") before assuming there's more to add — don't fabricate additional branches that aren't in the source.
- **When two labels/terms *might* refer to the same underlying entity or genuinely different ones, that's an ambiguity to flag, not one to silently resolve either way.** State your working assumption plainly (e.g. "I'm treating X as its own type, distinct from Y — flag it if that's wrong") and keep building rather than blocking, but don't bury the assumption in a footnote. If the user later says the two terms are actually synonyms, don't just add a mapping between them — go back and collapse any duplicate schema/table/branch you built for the "distinct entity" interpretation, so the code doesn't carry two representations of one concept. Treat this as equally likely to surface *after* you've already built something as before, since some naming collisions only become obvious once the prototype is being used.

## 4. Build the prototype as a small state machine

Structure:
- A root component holds `view` state (which screen is showing) plus whatever data the flow threads through (e.g. the current search query, a selected record, a resolved content-type).
- Each screen is its own component, receiving the data it needs and callbacks to transition (`onSubmit`, `onBack`, `onSelect`, etc.) rather than owning global state itself.
- Encode each decision from the flowchart as a plain function or branch (e.g. `detectQueryType(query)`) that the root/orchestrating view calls — keep branching logic out of JSX where possible so it's easy to point to and adjust later.
- Reuse recurring Figma components (nav, prompt/input box, message bubbles, status badges, tables) as small shared components rather than duplicating markup per screen.

**Clarifying questions inside the flow:**
- Default to presenting a clarifying question as a **dropdown `<select>` + confirm button** inside an agent/chat-style card, not as a row of buttons — unless the user tells you they want buttons. This should be true for every clarifying-question step in the flow, not just the first one you build.
- If the user later says something like "always use a dropdown for X", treat that as a standing rule for every instance of X already in the prototype, not just new ones — go back and update existing instances too.

**Tables / result sets driven by content type:** when different branches of the flow show different tables (e.g. a search resolves to one of several record types), define one schema per type (columns + mock rows) and a single generic table renderer that takes a schema, rather than a bespoke table per branch.

## 5. Matching a specific screen exactly

When the user points at one node and says "build this exactly like the Figma", don't reuse your general approximation:

1. Pull `get_design_context` (or `get_metadata` first if it's large) on that exact node.
2. Pay attention to structural facts that change the implementation, not just visuals — e.g. whether sections are separated by **tabs** (mutually exclusive, one visible at a time) vs. just **stacked vertically in one scroll** under a shared heading. Getting this wrong produces a UI that looks similar but behaves differently from the source. Don't assume every screen in a related family uses the same pattern: one drill-down might stack everything under one heading (confirm via a Table/Tree-style toggle spanning multiple sub-tables) while a sibling screen genuinely tab-switches full bodies (confirm by resolving the tab labels per point 3 in section 2 above, and checking whether each tab's content area is a distinct subtree rather than one continuous scroll).
3. Note anything you genuinely can't resolve (e.g. text nested inside a component instance that doesn't surface at the metadata level) and say so plainly, with a placeholder and an offer to fix it once the user supplies the real value — don't silently invent specific-sounding labels and present them as fact.
4. Match column counts/fields per data table from the node's actual layout (widths of header cells are a reliable signal of how many columns exist even when labels aren't resolvable).

## 6. Keep dynamic content honest

If the prototype has a search or query step, the results the user sees should visibly reflect what they typed — not just generic mock data unrelated to their input. Build a small helper that takes the resolved type + the raw query and injects/renames a row to match what was searched (e.g. templated off the first mock row's shape, with `name` overridden to the query), rather than serving static mock rows regardless of input. This applies retroactively too: if this rule is requested after mock data already exists, thread the real query through every result view that currently shows static data.

## 7. Iterating

- After any change, re-save the file and call `present_files` again — don't paste the whole file back into the chat.
- Keep responses to a short summary of what changed and why, not a restatement of the whole prototype.
- If a runtime error is reported (e.g. "artifact failed to load", an unsupported import), fix the specific import/API and re-present — check the artifact skill's supported library list before swapping in a replacement.

## 8. Handling drill-down / nested detail screens

Real product files often have a *family* of drill-down screens — one per record type (e.g. audience, experiment, billing offer, access point) — reached by clicking into rows from tables elsewhere in the flow. A few things make these reliable to build:

- **Figma files change between reads — don't trust a cached read when the user names screens you can't find.** If the person references specific frames (by name, or by pointing at a layers-panel screenshot) and a search of your last-fetched metadata comes up empty, re-run `get_metadata` on the page fresh before concluding the screens don't exist. Files get edited mid-conversation; a stale read isn't the same as "not in the file."
- **Cross-reference named frames exactly.** If the user shares a screenshot of the layers panel, match frame names verbatim (`grep`/search the metadata text for each name) rather than assuming which existing screen they mean.
- **Look for shared chrome vs. varying body content.** A family of drill-downs usually shares a header pattern (back button + title + status badge + a meta line) and the same side chat panel, but differs in the body. Factor the shared chrome into small components (e.g. a `DrillDownHeader` and a `DrillDownChatPanel`) used by every screen in the family, and only write the body once per screen type — this avoids re-deriving the same header markup N times and keeps them visually consistent.
- **A single drill-down can have more than one entry point.** The same audience/experiment/offer row might be clickable both from a top-level search result table *and* from inside a nested table on another detail screen (e.g. a campaign page's own Audience/Billing/Placement tabs). Track where the user came from (an "origin" piece of state) so the back button returns to the right place in both cases, rather than hardcoding a single return destination.
- **A "Detail/Preview"-style toggle is usually two renders of the same data, not two screens.** If Figma has separate frames like "X - drill down" and "X - drill down preview" that share the same header/meta and differ only in how the body is rendered (e.g. text rows vs. an image placeholder), that's a togglable view mode — implement it as local component state (`useState` for the mode) inside one component, not as two separate screens in the state machine. Confirm this by diffing the two frames' structure: if the header/meta/chat-panel subtrees are identical and only one inner block changes, it's a toggle.
- **Placeholder content is expected for deeply nested component-instance text.** Header sub-fields like secondary links or summary card values are sometimes only resolvable as generic component defaults (e.g. literally "Value") rather than the real override text. Say so plainly and use a reasonable placeholder rather than fabricating a specific-sounding fake value — same principle as section 5, just more likely to come up here since drill-downs tend to nest components more deeply.

## 9. Building screens that don't exist as a Figma frame yet

Once several screens are grounded in the real file, the person will often ask for something new — a settings page, a modal, a screen the file doesn't contain. Don't fall back to inventing markup from scratch, and don't treat "no source frame" as a reason to guess at styling:

- **Reuse the shared components you've already built.** By this point the prototype should have small generic pieces (nav, prompt box, status badge, table renderer, drill-down header, chat panel) already grounded in real tokens. Composing a new screen out of these carries their real styling forward automatically — this is usually the fastest path to something that looks native rather than bolted-on.
- **Search the actual design-system library for anything you don't have yet.** `get_design_context` on frames you've read only surfaces components that happen to appear on-screen. `search_design_system` searches the file's connected libraries directly (e.g. a project might draw from a product-specific design system plus underlying foundational libraries) for components, variables, and styles by name or description — including ones that never appeared in any frame you've read. Before inventing a date picker, modal, toast, or button variant from general knowledge, search for it; if it exists in the library, pull its real `get_design_context` the same way as for an on-screen component.
- **Be explicit with the person about what's confirmed vs. new.** For a screen with no source frame, individual components pulled from the real library are pixel-accurate, but the overall layout/composition is necessarily your own assembly, not verified against a specific design. Say so plainly, the same way section 5 says to flag unresolved text rather than presenting a guess as fact. If the person later adds a real frame for that screen, re-verify the composition against it.

## Test cases

If asked to verify this skill, good test prompts exercise the parts most likely to go wrong on autopilot:

1. **Ambiguous branch confirmation**: give a flowchart where a "YES"/"NO" connector could plausibly skip a step, and confirm Claude asks a specific, scoped clarifying question (not a vague "does this look right?") before building, rather than guessing silently.
2. **Dropdown-only clarifying questions + query honesty**: ask for a search flow with a branch that needs a clarifying question, then separately ask "always present refinement questions as a dropdown" and "make sure results include what the user searched for" — confirm both rules apply retroactively to logic already built, not just new code written after the request.
3. **Exact screen match**: point at one specific node and ask for it "exactly" — confirm Claude pulls fresh design context for that node (rather than reusing an earlier approximation) and gets structural facts right (tabs vs. stacked sections, real column counts).
4. **Drill-down family with stale cache**: after screens already exist in the prototype, tell Claude there are N drill-down pages it hasn't accounted for (referencing frame names it hasn't seen). Confirm Claude re-fetches the file rather than insisting the screens don't exist, correctly identifies shared header/chat-panel chrome vs. per-screen body content, wires multiple entry points to the same drill-down with correct back-navigation, and recognizes any Detail/Preview-style frame pair as one togglable screen rather than two.
5. **Synonym vs. distinct entity**: introduce a search term that maps to an ambiguous label (something that could plausibly be its own content type or just another name for an existing one). Confirm Claude states its working assumption and keeps moving rather than blocking. Then tell Claude the two terms are actually synonyms and confirm it collapses the duplicate schema/branch it built, rather than layering a mapping on top of an unnecessary parallel structure.
6. **Real content, not a plausible guess**: give a Figma file with several distinct screens and ask for a prototype covering all of them. Confirm Claude actually calls `get_metadata`/`get_design_context` on each screen that ends up in the build, rather than grounding one or two screens and inventing the rest from generic dashboard conventions. If the output looks visually correct but the copy/layout doesn't match the source file, that's this failure mode — the fix is to re-derive the ungrounded screens from real tool calls, not to restyle what's already there.
7. **New screen, no source frame**: after several screens are already grounded, ask for a screen the file doesn't contain (e.g. "add a settings page"). Confirm Claude reuses already-built shared components, searches the design-system library for anything new it needs (rather than inventing components from general knowledge), and explicitly tells the person that the composition is new/unverified even though the individual pieces are real.
8. **Cross-session consistency**: in a fresh conversation with only a reference doc and the skill (no shared history with a prior build), ask for the same screen twice — once as a first request, and once described slightly differently (e.g. emphasizing a different part of the flow). Confirm both builds include every section the reference doc lists for that screen (not a narrowed-down version) and reuse the doc's exact mock content/copy rather than inventing new plausible-sounding numbers each time.
