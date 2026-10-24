---
name: kyspec-implement
description: Execute a change file's Tasks — tests first where the repo asks, each Specs requirement moved into its spec in the same commit as the code, every task ticked with evidence, surface review when declared — push, record CI, then run the product's declared release skills and record their evidence. Use for /kyspec-implement <change>, "implement <change>", or "implement owner/repo#N" (plans first when no change exists).
---

# /kyspec-implement

Step three of `METHOD.md` "The chain". In a repository that nests by product (method
"Products"), every path here gains its `<product>/` segment.

**Input:** a change name or an issue. No change yet: run `/kyspec-plan` first, or, below the
no-change-file line (method "A change"), just do the work. Read the whole change first.

## Steps

1. **Set up where `AGENTS.md` says** (its workspace, branch and install rules, before trusting
   any typecheck or test). Renew plan's claim in the coordination room, or take one, only if
   `AGENTS.md` declares a room.
2. **Work the Tasks in order.** For each: write the failing test first where the repository's
   convention asks, make it pass, keep the diff to the task. When the task satisfies a
   requirement under `## Specs`, edit the main spec in the same commit as the code (method #1):
   add or amend the requirement and its scenarios, present tense, and replace its text under
   Specs with one line, `→ in <spec path>`. Tick the task with evidence (method #6): a count, a
   dated live check, `~~struck~~ not needed — D<n>`, or a commit SHA, recorded once it is on
   the main branch (a commit cannot name itself, and a rebase rewrites SHAs).
3. **Change course in the file.** A design surprise becomes a new or amended decision under
   Decisions plus the tasks it implies, never an unrecorded detour. Ask the user only for a
   choice that the change, its prior art and the specs cannot settle.
4. **Surface review.** If `AGENTS.md` declares one and the diff touches its paths, or changes
   what they serve from code elsewhere, run it on the diff; its output replaces the planning
   note under `## Surface review` and rides in the same push as the files it covers. A `fail`
   is fixed, never pushed. Otherwise the section keeps `Surface review: N/A — <reason>`.
5. **Check and push.** Run the checks `AGENTS.md` names for what changed and push the way it
   says (to the main branch, or as the pull request that reaches it; rebase when behind). Then,
   in one follow-up commit to the change file, record the SHAs now on the main branch on their
   tasks and, under `## Verification`, the CI run for the pushed commit and its result; that
   bookkeeping commit's own CI is not recorded. Red CI is answered by the next push, not by an
   explanation.
6. **Release.** Of the skills `AGENTS.md` "Method declarations" lists under Release, run those
   this diff still needs once pushed (each one says what it ships; a deploy that already ran on
   the push is evidence, not a step to repeat). Record the release evidence under Verification:
   the deploy run and its live check, the published version, or `Release: none — <reason>`.
7. **Report to the room,** only if `AGENTS.md` declares one: done or paused, and what is next;
   release the claim.

## End

Name the next step:

- `/kyspec-verify <name>` when the change touched a user-facing flow (the declared surface, or
  any UI flow). It must run in a fresh thread that did not write the code, so in a one-thread
  chain start it as a fresh agent (a subagent or new session given only the change name),
  never inline.
- Otherwise write `Verify: skipped — <reason>` under Verification and name
  `/kyspec-finish <name>`.
- Stopped short: name the tasks left and that `/kyspec-implement <name>` resumes them.
