# Moving from OpenSpec

How an OpenSpec repository becomes a Kyspec repository, artifact by artifact, in the order
that leaves nothing behind. Written against OpenSpec 1.15 (October 2026); the older layout is
noted where it differs. The short form is in [README.md](README.md#moving-from-openspec). The
page an agent runs is [`skills/kyspec-migrate`](skills/kyspec-migrate/SKILL.md); it ends with
the migration recorded as your first Kyspec change.

Nothing is lost. Every file the migration deletes stays in git, and the finish checklist of
the migration change confirms that what still matters has a home before the delete.

## What goes where

| OpenSpec | Kyspec | What changes |
| --- | --- | --- |
| `openspec/specs/<capability>/spec.md` | `specs/<capability>.md`, or `specs/<capability>/<capability>.md` beside attachments | The file moves. The Requirement and Scenario text stays as it is. A `## Design notes` section is added as decisions arrive. |
| `openspec/changes/<name>/proposal.md` | `## Why` of `changes/<name>.md` | The problem and the outcome a verifier can observe, in a few sentences. The "what changes" list becomes Tasks. |
| `openspec/changes/<name>/specs/<capability>/spec.md`, the delta | `## Specs` of the change, until each requirement moves into its spec with the code | An ADDED block becomes an intended requirement in the spec's own form. A MODIFIED block becomes the amended requirement text. A REMOVED block becomes a struck requirement with its reason. A RENAMED block becomes the new heading. There are no delta files. |
| `openspec/changes/<name>/design.md` | `## Decisions` (D1, D2, …) and `## Prior art` of the change | Each decision states what, why, and the alternative it rejects. The design's context about existing specs and principles becomes Prior art lines marked keep or override. |
| `openspec/changes/<name>/tasks.md` | `## Tasks` of the change | Checkboxes stay. Each done line gains its evidence (a SHA, a count, a dated check) or is reopened. |
| `openspec/changes/<name>/.openspec.yaml` | nothing | The schema name and created date have no Kyspec equivalent. |
| `openspec/changes/archive/<date>-<name>/` | `D-<capability>-N` entries in the owning spec's Design notes, then deleted | Only a decision the code still obeys survives, with its rationale. Everything else is history, which git already holds. |
| `openspec/config.yaml` (`project.md` in older layouts) | `## Method declarations` in `AGENTS.md`, and a principles document if you have rules worth numbering | Release skills, the surface review, the coordination room and the principles are declarations the five skills read. |
| `openspec/schemas/`, stores, worksets | nothing | Kyspec has one shape for a change and no schema. |
| `.claude/skills/openspec-*`, the `opsx` command files, their equivalents for other tools, and the `<!-- OPENSPEC:START -->` block in `AGENTS.md` (older layouts) | `.claude/skills/kyspec-*` and `METHOD.md` at the root | Five skills, one page each. |
| Explore notes, if you kept any | `ideas/<name>.md` with a `status:` first line | Parked and rejected ideas keep their reason. |

## The order that matters

1. **Let OpenSpec finish what shipped.** For every active change whose tasks are done and
   whose code is live, run `openspec archive <name>` so OpenSpec merges its deltas into the
   main specs one last time. A shipped requirement that still lives only in a delta is the
   first thing a migrated spec would get wrong. A change that has not shipped stays active and
   is converted in step 4.
2. **Move the specs.** `git mv openspec/specs/<capability>/spec.md specs/<capability>.md`, one
   per capability; keep the directory form only for a spec with attachments. Fix the links
   between specs. Read each spec once against the code it governs: a requirement the code does
   not meet is fixed now or struck with its reason.
3. **Lift the decisions out of the archive.** For each `archive/<date>-<name>/design.md`,
   decide per decision whether the code still obeys it (grep for the mechanism it names). A
   living decision becomes `D-<capability>-N` in the owning spec's Design notes, next free N,
   with its rationale and the alternative it rejected; a dead one is left to git. Then grep for
   `openspec/changes` outside `openspec/` itself and repoint every citation, in code comments,
   tests and docs, to the D-id or the spec section. This is the step that bit us: in Run402,
   database migration headers cited archived change paths and had pointed, for months, at
   prose nobody maintained.
4. **Convert the active changes.** Each becomes one file, `changes/<name>.md`, with exactly
   seven H2 sections in this order: Why, Specs, Prior art, Decisions, Tasks, Surface review,
   Verification. Why from the proposal; Specs from the delta, in requirement form and present
   tense; Prior art from the design's context, each line marked keep or override; Decisions
   from the design, numbered; Tasks from `tasks.md` with evidence on every done line;
   `Surface review: N/A — <reason>`, or the planning note when your product declares a surface
   review and the change touches it; `Verification: Pending.` A change with attachments is
   `changes/<name>/<name>.md`.
5. **Delete `openspec/`.** `git rm -r openspec/`. The archive, the config and the schemas go
   with it. A rule from `config.yaml` or `project.md` that still matters lives in `AGENTS.md`
   or a principles document now.
6. **Switch the instructions.** Remove the `openspec-*` skills and the `opsx` command files
   OpenSpec installed, and its marker block in `AGENTS.md` if you have one. Copy `METHOD.md` to
   the root and the five `kyspec-*` skills into `.claude/skills/`. Add `## Method
   declarations` to `AGENTS.md`. A repository with several products nests the three trees by
   product (METHOD.md "Products").
7. **Run the gate.** `node check-layout.mjs` refuses what the conversion missed: a change with
   the wrong sections, an archive directory, a date-prefixed change, an idea without a status
   line.
8. **Record the migration as your first change,** `changes/adopt-kyspec.md`, seven sections:
   Why (one source of truth, decisions where the next session looks), Specs (the moves, and
   anything step 2 struck), Prior art (the archived designs whose decisions you lifted, and the
   ones you left), Decisions (what you deleted and why, what you chose not to carry), Tasks
   (steps 1 to 7 with their commits), `Surface review: N/A`, Verification with the CI run.
   Review it on a branch or as a pull request, merge, and `/kyspec-finish adopt-kyspec` deletes
   it. The migration then looks like every later change: a spec that is true, decisions that
   are cited, and nothing left in the tree but the present.

## Worked example

[`examples/migration/`](examples/migration) holds the Lantern reading list twice. `before/` is
an OpenSpec repository: one spec, one active change with a delta, and two archived changes
whose designs hold one decision the code still obeys and one it no longer does. `after/` is
the Kyspec tree the steps above produce, including the migration change itself. Diff the two
to see every move.

## A month later

A migrated repository should show specs that changed in the same commits as their code, a
`changes/` directory holding only work in flight, Design notes with D-ids that tests cite, no
`openspec/`, no archive, and a git log that answers "how did it get here".
