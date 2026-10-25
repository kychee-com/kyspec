---
name: kyspec-migrate
description: Move a repository from OpenSpec to Kyspec in one pass, on a branch - shipped deltas merged by OpenSpec first, specs moved, living decisions lifted from the archive as D-ids with every citation repointed, active changes converted to the seven sections, openspec/ deleted, skills and declarations installed, the layout gate run - and record it as the repository's first change, changes/adopt-kyspec.md. Use for /kyspec-migrate, "migrate from OpenSpec", or "adopt Kyspec in this repository".
---

# /kyspec-migrate

Run once, by a repository arriving from OpenSpec. The map is `MIGRATING.md` in the Kyspec
repository; this page is the order of work. It runs on a branch or in a worktree, never on the
main branch directly, because its fifth step deletes `openspec/`, and the user merges after
reading the change file it writes. Git keeps everything deleted. In a repository that nests by
product (METHOD.md "Products"), every path here gains its `<product>/` segment.

**Input:** none, or the product name when the repository holds several. Read `openspec/`
entire before writing anything: the specs, every active change, every archived change's
`design.md`, and `config.yaml` (or `project.md`).

## Steps

1. **Shipped work goes through OpenSpec's own archive.** For each active change whose tasks
   are done and whose code is live, run `openspec archive <name>` so its deltas merge into the
   main specs one last time. Ask the user only when you cannot tell whether a change shipped. A
   change that did not ship stays active for step 4.
2. **Move the specs.** `git mv openspec/specs/<capability>/spec.md specs/<capability>.md`, the
   directory form only for a spec with attachments; fix the links between specs. Read each
   against the code it governs: a requirement the code does not meet is fixed now, or struck
   with its reason in the migration change (step 8).
3. **Lift the living decisions.** From each `openspec/changes/archive/*/design.md`, a decision
   the code still obeys (grep for its mechanism) becomes `D-<capability>-N` in the owning
   spec's `## Design notes`, added as the last section when missing, next free N, with its
   rationale and the alternative it rejected. A decision nothing obeys is left to git. Then
   grep for `openspec/changes` outside `openspec/` and repoint every citation in code, tests
   and docs to the D-id or the spec section; none may remain.
4. **Convert the active changes.** One file each, `changes/<name>.md`, exactly these H2
   sections in this order: Why (from the proposal), Specs (the delta's requirements in the
   spec's own form and present tense; a MODIFIED block as the amended text, a REMOVED block as
   a struck requirement with its reason), Prior art (the design's context, each line `keep` or
   `override`), Decisions (`D1`, `D2`, … from the design), Tasks (from `tasks.md`, evidence on
   every done line or the line reopened), Surface review (`N/A — <reason>`, or the planning
   note when `AGENTS.md` declares one and the change touches its paths), Verification
   (`Pending.`). Attachments make it `changes/<name>/<name>.md`. Explore notes worth keeping
   become `ideas/<name>.md` with a `status:` first line.
5. **Delete `openspec/`** with `git rm -r openspec/`. A rule from `config.yaml` or `project.md`
   that still matters moves into `AGENTS.md` or the product's principles document first.
6. **Switch the instructions.** Remove the `openspec-*` skills, the `opsx` command files and
   any `<!-- OPENSPEC:START -->` block in `AGENTS.md`. Put `METHOD.md` at the root and the five
   `kyspec-*` skills under `.claude/skills/`, or the directory your harness reads. Write
   `## Method declarations` in `AGENTS.md`: Principles, Release, Coordination room, Surface
   review, each only when the product has one.
7. **Run the gate,** `node check-layout.mjs`, and fix what it names: an archive directory, a
   date-prefixed change, a change without the seven sections, an idea without a status.
8. **Write the migration as the first change,** `changes/adopt-kyspec.md`: Why (one source of
   truth, decisions where the next session looks), Specs (the moves, and anything struck in
   step 2), Prior art (the archived designs lifted in step 3 and the ones left, by name),
   Decisions (what was deleted and why, what was not carried over), Tasks (steps 1 to 7, each
   with its commit), `Surface review: N/A — the method's own files only`, Verification
   (`Pending.` until CI runs on the branch).
9. **Commit on the branch,** one commit per step, named after the step, and stop.

## End

Name the branch, the change file, and what the user should read before merging: the diff of
`specs/`, the D-ids added, and the change file. After the merge, `/kyspec-finish adopt-kyspec`
folds its decisions and deletes it; from then on the chain is `/kyspec-brainstorm` →
`/kyspec-plan` → `/kyspec-implement` → `/kyspec-verify` → `/kyspec-finish`.
