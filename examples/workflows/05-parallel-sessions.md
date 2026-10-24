# 05. Parallel sessions

Several agent sessions work one repository at once. Two things keep them from colliding: the
change file in git, and a coordination room when the product declares one.

## The declaration

`AGENTS.md` of a product with more than one session:

```markdown
## Method declarations

- **Coordination room:** the `dev` room. Claim an area before editing it:
  `room claims create "repo:src/api/**" --note "<change>"`; announce when done:
  `room messages send "<change>: done, <what moved>"`. Both best-effort (`|| true`), never
  blocking.
```

Any channel that holds a claim and a message will do. The skills only know the three verbs:
claim, renew, announce.

## Session A plans

A runs `/kyspec-plan` for `archive-a-book`. Step 6 of the plan page: claim the area, because a
room is declared. It claims `repo:src/api/**` with the change's name, commits only the change
file, and pushes. Both artifacts are now visible: the claim in the room, the plan in git.

## Session B brainstorms

B is asked to "think about a trash can for books". Its first move is to ground:
`ls changes/` shows `archive-a-book.md`. It reads the Why and the Decisions and tells its user
in one line that an open change already does this under the name "archive", with a reason the
spec will keep (principles #2). The brainstorm ends in a five-line idea file at
`status: rejected — duplicates changes/archive-a-book.md`, so the next person asking finds the
answer, and B does not plan a duplicate.

## Session C implements something else

C implements `export-csv`, which touches `src/api/export.js`. Its implement step 1 renews or
takes a claim; the room answers with A's live claim on `src/api/**`. C's area overlaps. The
claim is advisory, so C is not blocked, but it now knows: it keeps its diff to `export.js`,
rebases before pushing, and expects A's routes to land first. When A's push arrives, C's
rebase is clean.

## Session A finishes

At the end of implement, A announces `archive-a-book: done, verify next` and releases its
claim. At finish, step 5 tells the room which specs moved. B and C each read that line on their
next turn, and none of the three ever asked a person who was doing what.

## Without a room

A single-session product leaves the line undeclared, and the skills skip every claim and
announcement. The change file in git still does half the job: a session that plans pushes the
plan before it builds, so the next session's `ls changes/` is never stale by more than a push.
