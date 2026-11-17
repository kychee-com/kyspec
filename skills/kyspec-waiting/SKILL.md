---
name: kyspec-waiting
description: Report everything that waits on one person across the open changes and ideas, read from origin/main - grouped by the act that would release it (what each releases, whether it is one-time or per-sitting, and the tasks chained behind it), real-world acts as one checklist per place, one-off waits, open decisions in ideas, and date waits now due. Read-only; starts nothing. Use for /kyspec-waiting <name>, "what is waiting for me", or "what am I the bottleneck for".
---

# /kyspec-waiting

Outside `METHOD.md` "The chain", like kyspec-migrate: it reads and never writes. Its contract is
method "A change" (the markers) and "Method declarations" (person acts). In a repository that
nests by product (method "Products"), every path here gains its `<product>/` segment.

**Input:** a person's name as the markers write it. None given: ask once.

## Steps

1. **Read `main`, never the checkout.** Fetch, then read only from `origin/main`
   (`git grep … origin/main`, `git show origin/main:<path>`): a working tree can be stale or
   hold unpushed edits. Note the commit; the report names it, and the same commit gives the same
   report.
2. **Find every wait.** The layout gate allows a marker only where it opens an open task's first
   line (after its number) in a change's `## Tasks`, or opens a plain list item in an idea, and
   only in its one spelling, its opening on that first line after plain spaces, so the greps
   below find every one. Drop what grep can also return that is no marker: a line inside a
   fenced code block, and, in a change, a line outside `## Tasks`. Read each hit in its file,
   with the lines its task wraps onto, for the whole `<what>`.
3. **Follow what they hold.** In each change with a hit, a task that opens with
   `(after <n> — …)` waits on task `<n>`, and so on whatever `<n>` waits on: list it under that
   act too.
4. **Read the acts.** From `AGENTS.md` "Method declarations" "Person acts", each act's
   instruction, place, and kind. An act a marker names that is not declared is reported as
   undeclared, never dropped.
5. **Report**, every task with its change and line:
   - **by act**, most tasks released first, ties by act id: the act, its instruction and kind, what the kind
     means for releasing it (a one-time act's work can then run in any session; a per-sitting
     credential stays in the session where it was given, so its work runs there), its tasks,
     and indented under each, the tasks after it;
   - **real-world acts by place**, one checklist per place across changes ("on your phone, 3
     checks"; "on platform.openai.com, 2 steps");
   - **one-off waits**, by change;
   - **decisions**: ideas' open questions that wait on the person;
   - **due now**: date waits whose day has come, which wait on no one any more;
   - the totals, and the commit read.
6. **Start nothing.** After an act the person says in their own words what to start ("I logged
   in, do all of it here", "only `<change>`"), and the session that hears it does that. A task
   loses its marker when its work is done, so whatever was not reached is in the next report.

## Example

POSIX classes, because `git grep -E` has no `\s`. For a person named Tal:

```bash
git fetch -q origin main && git rev-parse --short origin/main
task='^[[:space:]]*([-*+]|[0-9]+[.)])[[:space:]]+\[ \][[:space:]]+([0-9][0-9A-Za-z]*(\.[0-9A-Za-z]+)*[.)]?[[:space:]]+)?'
git grep -nE "${task}\(waiting: Tal( on [a-z0-9-]+)? — " origin/main -- changes   # waits in changes
git grep -nE '^[[:space:]]*([-*+]|[0-9]+[.)])[[:space:]]+\(waiting: Tal( on [a-z0-9-]+)? — ' origin/main -- ideas   # decisions
git grep -nE "${task}\(after " origin/main -- changes   # what is chained behind them
git grep -nE "${task}\(waiting: [0-9]{4}-[0-9]{2}-[0-9]{2} — " origin/main -- changes   # dates; due when <= today
```

## End

The report, nothing else. When the person names an act they have done, the next step is theirs
to say.
