# 01. Below the line: a fix with no change file

**Prompt:** "The empty state on the page says 'No books yet. add one above.' Capitalize 'Add'."

The agent reads `METHOD.md` "A change": a commit that touches no spec and carries no decision
needs no change file. It checks both conditions. Does a spec govern the empty-state copy?
`grep -rn "No books yet" specs/` finds nothing; the page spec names an empty state but not its
wording. Is a decision being made? No.

It fixes the string, runs `npm test`, commits `page: capitalize the empty-state call to action`,
and pushes. No idea, no change, no spec edit, no ceremony. The whole exchange is one turn.

## Where the line is

The same request with "and make the empty state link to the import page" crosses it. The page
spec says what the empty state offers, so the spec changes; that is a spec edit in the same
commit as the code (method #1), and if any choice is being made (which import page, what the
link says when there is more than one), it is a change file, with every section one line:

```markdown
# empty-state-import-link

## Why
A reader with no books sees a dead end; the empty state should offer the import page.

## Specs
### specs/page.md
- The empty state links to import → in specs/page.md

## Prior art
- principles #1 (the list belongs to its reader) — keep: import is the reader's own data coming in.

## Decisions
- D1: One link, to `/import`, not a menu of sources; the import page already chooses the source.

## Tasks
- [x] Link and test — 3f1a0c2

## Surface review
Surface review: N/A — the page only; no API path touched.

## Verification
Release: 3f1a0c2 on main, CI 121 green; `/lantern-deploy` d_0430 live (2026-10-21).
Verify: skipped — a one-link UI change, checked live by the deploy skill's probe.
```

The test is method #4: who reads this next month? A capitalization: nobody. A new affordance
on the empty state: the next session that touches the page, which now finds it in the spec.
