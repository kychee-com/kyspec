# Kyspec

**Specs live with the code. Changes are born to be deleted. Git is the history. The model is trusted.**

Kyspec is a spec-driven method for AI coding agents, written for models that no longer need rails. It is five short skill pages, one theory page and one CI check. There is no CLI, no template engine, no artifact graph, no delta files, and nothing is ever archived.

It grew out of [OpenSpec](https://github.com/Fission-AI/OpenSpec), which it credits and departs from. OpenSpec gave agents a shape for their work: specs, changes, proposals, tasks, an archive. Kyspec keeps the nouns and removes the scaffolding, because the scaffolding was built for a model that wandered, and the model stopped wandering.

Home: [kyspec.com](https://kyspec.com). Source: this repository. License: MIT.

## Why

**The rails were built for a weaker model.** The spec-driven frameworks of 2025 share one design. A CLI validates structure. Templates fix the shape of every artifact. A dependency graph says which file the model may write next. Delta files keep the model's hands off the main spec. An archive keeps every finished change, because deleting felt unsafe. Each of these was a sensible answer to a model that lost the thread, invented files, or rewrote a spec into mush.

**The model changed. The frameworks did not.** A frontier model in 2026 reads a three-hundred-line spec, the code it governs and the git log, and writes the new requirement in the spec's own voice. It knows what a decision is and what an alternative is. It can tell a typo from a change. For that model the rails cost more than they save, and the cost lands in five places.

1. **Expressibility.** A template gives every change the same four files, whether it is a rename or a new subsystem. The model pads the small one and compresses the large one, and both read worse than what it would have written freely. In Kyspec a change is one file with seven sections, any of which may be one line, and a commit that touches no spec and carries no decision needs no file at all.

2. **Throughput.** An artifact graph serializes thinking into proposal, then spec, then design, then tasks, each a round trip through a tool that prints the instructions for the next step. A model that can hold the whole change in one context is made to drip it out in four. In Kyspec each step is one page of prose, and the model does the step.

3. **Imagination.** Delta specs, with their ADDED, MODIFIED and REMOVED blocks, make the model think in text diffs instead of system behavior. A workflow that begins at "propose" skips the part where the idea is challenged. Kyspec begins with a brainstorm whose partner is told to challenge, not flatter, and which must end in an idea file with the alternatives and the pick. The plan must then search prior art, the decisions already in the specs and the ideas already parked, and mark each hit keep or override.

4. **Implementation quality.** When a tool merges deltas into the spec at archive time, nobody reads the merged result, and the spec drifts from the code within weeks. When the model edits the main spec in the same commit as the code, it holds both in one context, and the reviewer sees the contract and the implementation in one diff. And in Kyspec a change is not done when its tasks are ticked. It is done when a fresh agent that never saw the diff uses the released thing the way a user would and writes down what it observed.

5. **Context quality.** An archive of dated changes is dead weight in every grep and every context window, and a model reads a stale proposal as if it were live. Kyspec deletes the change once the spec has absorbed it, folds its decisions into the spec as numbered notes that code and tests cite forever, and leaves the history to git, where it already is.

**Loosening the shackles is not lowering the bar.** Kyspec trades validation for gates and narrative for evidence. One CI check refuses what matters structurally: a change with the wrong sections, an archive directory, an idea without a status line. Everything else is judgment, and the method says, section by section, whether a gate or a reviewer enforces it. A task line carries a commit SHA, a count or a dated live check, or it is open. Done means verified by someone who did not build it.

**Where it came from.** Kyspec runs [Run402](https://run402.com), an agent-first cloud platform: several hundred specs, dozens of changes in flight at any time, worked by parallel sessions of Claude Code and Codex with no CLI in the loop. A recent change there moved a protocol client into a shared package used by three consumers, across two npm releases. Its change file was under seventy lines.

## What it is

Three tiers, one unit of work, five skills, one gate.

**Tier 1, principles.** `METHOD.md` and the numbered principle documents your product declares. Specs cite them by number.

**Tier 2, specs.** `specs/<capability>.md`: the live truth for one capability, present tense only. Requirements carry stable names and WHEN/THEN scenarios. A `## Design notes` section holds the decisions, each under a stable id `D-<capability>-N` with its rationale and the alternative it rejected.

**Tier 3, ideas.** `ideas/<name>.md`, one file per idea. The first line is `status: seed | explored | parked | rejected | adopted`. Parked and rejected ideas stay, with the reason, so a later session disregards them knowingly instead of rediscovering them.

**The change.** `changes/<name>.md`, the unit between an idea and the spec. Seven sections, in this order: Why, Specs, Prior art, Decisions, Tasks, Surface review, Verification. It is bounded so it can finish, and it is deleted when it does.

**The chain.**

```
/kyspec-brainstorm → /kyspec-plan → /kyspec-implement → your release skills
                                                      → /kyspec-verify   (a fresh thread; required for user-facing flows)
                                                      → /kyspec-finish
```

- **brainstorm** challenges the idea, grounds it in the code and the specs, and ends in an idea file every time.
- **plan** writes the change file from an idea, an issue or a topic, after a real prior-art search.
- **implement** works the tasks, moves each requirement into its spec in the same commit as the code, ticks them with evidence, pushes, records CI, and runs your release skills.
- **verify** is run by a fresh agent that reads only the change's Why and Specs, holds only what your user holds, and uses the released thing.
- **finish** settles the specs, folds the decisions into Design notes as D-ids, retires the idea, closes the issues, and `git rm`s the change.

The whole chain runs in one thread from "implement owner/repo#12". Only verify starts a fresh one.

## A change's life

The example product in [`examples/lantern`](examples/lantern) is a reading list. Its git log for one change reads:

```
e91f2c7  ideas: archive-a-book, explored
b40a8d1  changes: archive-a-book planned from lantern#12
9f3c2a1  reading-list: an archived book leaves the list and keeps its notes
2b7e4d0  page: archive and unarchive on every book; openapi.json
7d2c05e  changes: archive-a-book, CI 118 and deploy d_0421 recorded
c3a91be  changes: archive-a-book, verify cycle 1: unarchive loses the status
5e8d1f4  reading-list: unarchive restores the status the book had
a7b3c92  changes: archive-a-book, verify cycle 2: pass
f06e4aa  reading-list: D-reading-list-3 and -4; archive-a-book finished
```

The spec gained one requirement in the same commit as the code that satisfies it and two decisions as numbered notes, and the change file is gone. `git log` is the only archive. The [example workflows](examples/workflows) walk through this change and four other situations prompt by prompt.

## Install

Four files, three lines.

1. Copy `METHOD.md` to your repository root.
2. Copy the five directories under `skills/` into `.claude/skills/`. Claude Code and Codex read `SKILL.md` from there; another harness that reads the same format takes the same copy.
3. Add a `## Method declarations` section to your `AGENTS.md` naming what the skills cannot know. An undeclared line means that step does not exist for your product.

   ```markdown
   ## Method declarations

   - **Principles:** `docs/principles.md`, numbered; specs cite `principles #N`.
   - **Release:** `/deploy` (the API and the site), `/publish` (the npm package).
   - **Surface review:** `/review-api`, for a diff touching `src/api/**` or `openapi.json`.
   - **Coordination room:** how parallel sessions claim an area and announce, if you have one.
   ```

4. Optional: run `node check-layout.mjs` in CI. It is one zero-dependency file.

Then say `/kyspec-brainstorm <topic>`, or `implement owner/repo#N`.

## Compared with OpenSpec

| | OpenSpec | Kyspec |
|---|---|---|
| The spec edit | delta files merged at archive | the main spec, in the same commit as the code |
| A finished change | moved to `changes/archive/<date>-<name>`, kept forever | deleted; git is the history |
| Decisions | `design.md` inside the change | `D-<capability>-N` in the spec, cited by code and tests |
| Prior art | not required | mandatory; each hit marked keep or override |
| Tasks | checkboxes | checkboxes that carry evidence |
| Verification | optional, advisory | required for user-facing flows; a fresh thread, never the diff |
| Ideas | none | a tier of their own, with a status line |
| Tooling | CLI, templates, generated files per tool | five prose pages, one CI check |
| Product specifics | `config.yaml` | three lines in `AGENTS.md` |

The long form, with the reasoning behind each departure and the objections we expect, is [WHY.md](WHY.md).

## Contents

- [`METHOD.md`](METHOD.md): the method. Ten principles, three tiers, the chain, the change, verify, finishing, gates.
- [`WHY.md`](WHY.md): the argument, the lineage, and the objections.
- [`skills/`](skills): the five pages.
- [`check-layout.mjs`](check-layout.mjs): the gate, with [its tests](check-layout.test.mjs).
- [`examples/`](examples): a product snapshot mid-change, and five workflows.

## Contributing

Open an issue here for anything: a page that misled your agent, a gap in the method, a workflow it should cover. Kyspec is edited in its maintainer's source repository and mirrored here, so a pull request is pulled back by hand rather than merged in place.

## License

MIT. Kyspec is made by Kychee, the makers of Run402.
