# 04. Verify fails

Continues [02. Issue to finish](02-issue-to-finish.md) from the failed cycle.

## What the verifier left

Under `## Tasks` of `changes/archive-a-book.md`, one new unchecked line:

```
- [ ] Verify cycle 1: unarchive returned the book with status `to-read`; it was `reading` when archived (specs/reading-list.md "Unarchiving") — observed on https://lantern.example, 2026-10-20
```

And under `## Verification`, cycle 1 with its three observations and `Verdict: fail`. The
verifier fixed nothing and read no source; it does not know why unarchive loses the status,
only that it does. That is the point: its report is a user's report.

## Implement, again

`/kyspec-implement archive-a-book` reads the whole change, finds one open task, and works it.
The failing test first: unarchive a `reading` book, expect `reading`. It fails. The cause is in
`src/api/books.js`: unarchive rebuilt the book from its title and notes and let `status` take
its default. The fix keeps the status the book had.

Is this a decision? The agent checks: the requirement already says "with the status and notes
it had", so the fix fulfils the spec rather than deciding anything new. No new D-line. Had the
fix required a choice (say, a book archived as `read` coming back as `to-read` on purpose), that
would be a new decision under `## Decisions` and a changed scenario in the spec, in the same
commit (method "Change course in the file").

Commit `5e8d1f4`, push, CI 123 green, `/lantern-deploy` d_0433 live. The task is ticked with
the SHA; Verification gains the release line. The change touched a user-facing flow, so verify
again, in a fresh thread, never this one.

## Verify, cycle 2

A new subagent, given only the change name, reads Why, Specs and Verification. It sees cycle 1
and runs the same scope, all three scenarios, not just the one that failed; a fix can break a
neighbor.

```
Verify cycle 2 — 2026-10-21, a fresh session, against https://lantern.example
Scope: specs/reading-list.md: An archived book leaves the list and keeps its notes (Archiving, Archiving twice, Unarchiving)
- Archiving: pass — `POST /books/b_22/archive` → `200`; absent from the list; present in `?archived=true` with notes
- Archiving twice: pass — second `POST` → `200`, body identical
- Unarchiving: pass — the book returned with status `reading` and both notes
Verdict: pass
```

It removes the book it created, commits, and names `/kyspec-finish archive-a-book`.
