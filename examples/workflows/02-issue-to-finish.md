# 02. Issue to finish, in one thread

**Prompt:** "implement lantern#12"

The issue says: "I want to hide books I gave up on without losing my notes." The agent runs the
chain from `/kyspec-plan` onward in this thread, starting a fresh agent only for verify. The
files it produces are the ones in [`../lantern`](../lantern); this page narrates the steps.

## Plan

No change exists under `changes/`, so it plans. It reads the issue and its comments, then
`specs/reading-list.md` and the code the spec governs (`src/api/books.js`, the page). The
declaration names a surface review for `src/api/**`, and the change will add routes, so it
reads `docs/api-style.md` now (method "Before planning a surface change").

Prior art is a search, not memory: `grep -n "D-reading-list" specs/`, `ls ideas/`,
`docs/principles.md`. It finds D-reading-list-2 (status is a closed set), principles #2
(nothing is deleted) and #3 (the API is the product), and the parked idea `shared-lists`,
which mentions archived books. Each gets one line, marked keep.

It writes `changes/archive-a-book.md` with the seven sections: two decisions (a verb route, a
query filter), five tasks, the surface planning note, and `Verification: Pending.` It commits
only that file and pushes, so a parallel session would see the plan. Then it goes straight on;
the chain does not stop to ask.

## Implement

Tests first, because `AGENTS.md` asks for it: four tests for archive, idempotence, the archived
list, and unarchive. Then the routes. In the same commit it edits `specs/reading-list.md`: the
requirement "An archived book leaves the list and keeps its notes" with three scenarios, present
tense, and replaces the text under the change's `## Specs` with `→ in specs/reading-list.md`.
That commit is `9f3c2a1`. The page and `openapi.json` follow in `2b7e4d0`.

The diff touches `src/api/books.js`, so it runs `/lantern-api-review 4c1d9e2..2b7e4d0`. The
review reads the diff and the style doc, writes three rule lines and `Verdict: pass` into
`## Surface review`, replacing the planning note. It rides in the same push as the routes.

Push to `main`. CI run 118 is green. In one bookkeeping commit it ticks the tasks with their
SHAs (a commit cannot name itself, so SHAs are recorded after the push) and writes the CI run
under `## Verification`.

Release: the declaration names `/lantern-deploy`. It runs it: build, deploy `d_0421`, a live
`GET /books?archived=true`. One line under Verification.

The change touched a user-facing flow, so the next step is verify, and verify must not run in
this thread.

## Verify, in a fresh agent

The agent starts a subagent with only this:

> Run `/kyspec-verify archive-a-book` in the Lantern repository. You did not write this code.
> Read only the change's `## Why`, `## Specs` and `## Verification`, and the spec those name.
> Use https://lantern.example as a reader would, with the public docs. Append your cycle to
> `## Verification` and commit.

The verifier lists its scope first, three scenarios from the spec, then exercises each against
the live site. Archiving passes. Archiving twice passes. Unarchiving fails: the book comes back
as `to-read` when it was `reading`. It appends cycle 1 with what it observed, adds one unchecked
task naming the requirement, fixes nothing, and commits. Verdict: fail. It names
`/kyspec-implement archive-a-book`.

[04. Verify fails](04-verify-fails.md) continues from here. The finish is below, for when cycle
2 passes.

## Finish

`/kyspec-finish archive-a-book`, five steps, then the delete.

1. **It may finish.** Every task is checked with evidence; Verification holds CI 123 green,
   deploy `d_0433`, and cycle 2 `pass`.
2. **Specs settled.** It reads `specs/reading-list.md` and confirms the requirement and its
   three scenarios are there, worded as the spec keeps them. The section holds no promise.
3. **Decisions folded.** D1 becomes `D-reading-list-3` (the verb route) and D2 becomes
   `D-reading-list-4` (the archived query), each with its rationale and the rejected
   alternative, appended to Design notes. `grep -rn "archive-a-book"` finds one test comment
   citing the change; it is repointed to `D-reading-list-3`.
4. **Idea retired.** No idea file reads `adopted — changes/archive-a-book.md`; nothing to do.
5. **Loop closed.** The commit message carries `Closes lantern#12`. No room is declared.

Then `git rm changes/archive-a-book.md`, in the same commit as the spec edit, and push:

```
f06e4aa  reading-list: D-reading-list-3 and -4; archive-a-book finished

 specs/reading-list.md        | 4 ++++
 src/api/books.test.js        | 2 +-
 changes/archive-a-book.md    | 52 ------------------------------
```

The spec is the present. `git log -- changes/archive-a-book.md` is the history.
