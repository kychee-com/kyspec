---
name: kyspec-finish
description: Finish a change in five steps then delete it - check it may, settle its Specs into the main specs, fold its Decisions into the spec's Design notes as D-<capability>-N, retire its idea, close linked issues, file left-over bugs as GitHub issues and tell the room - then git rm the change file and push. Use for /kyspec-finish <change>, or when kyspec-implement or kyspec-verify names it. Under ff (fast forward, method "The chain"), it ends the run with its one report.
---

# /kyspec-finish

The last step of `METHOD.md` "The chain"; its contract is method "Finishing a change". Five
steps, then the delete. Git holds the history: there is no archive, and the layout gate refuses
an archive directory or a date-prefixed change. In a repository that nests by product (method
"Products"), every path here gains its `<product>/` segment.

**Input:** a change name.

## 1. Check it may

No task is open. A task still in the file is ticked with evidence, or struck as "not needed"
naming its decision, "moved" naming the idea file or issue it went to (which exists), or
"skipped by <name>" with the reason; compacted tasks are in git.
`## Verification` holds a green CI run for the pushed code, release evidence (or
`Release: none — <reason>`), and either a verify cycle whose verdict is `pass` or
`Verify: skipped — <reason>`. If anything is missing, stop: name it and the step that supplies
it (kyspec-implement or kyspec-verify). Nothing is deleted.

## 2. Settle Specs

Every requirement and scenario the section intended is in its main spec, worded as the spec
keeps it; confirm by reading the spec, not by trusting a pointer. Anything still unshipped,
including a scenario verify marked out of reach that no test covers, is either struck here with
its reason or moved out as a new idea file (`status: seed`, the reason inside). The section ends
holding no promise the specs do not already keep.

## 3. Fold Decisions

A decision whose code shipped is in its spec already (method #3), and compaction has removed it
from the change, pointer line and all; the compacting commits' messages name its D-id if you
need it. Each decision still under Decisions that governs the code moves into
the owning spec's `## Design notes` (added
as the spec's last section when it has none) as `D-<capability>-N`, the next free N in that
spec, with its rationale and the alternative it rejected. An override of prior art names the
D-id, requirement or principle it amends. A decision that only governed the work (sequencing, a
spike) is dropped. Then grep the repository for the change's path and its bare name
(`changes/<name>`, `<name>`) and repoint every code comment, test or doc citing it to the D-id
or the spec section.

## 4. Retire the idea

If an idea file reads `status: adopted — <this change>`, whatever in it is still worth keeping
and not yet in the spec goes into that spec's Purpose. Then delete the idea file.

## 5. Close the loop outside

The finishing commit's message closes the issues the change's `Source:` line or Why names
(`Closes owner/repo#N`). Every bug the change file records and leaves unfixed (a verify cycle's
"seen, outside this scope", a defect noted under Verification or in a task) is filed as a GitHub
issue in the repository before the delete, after a search for an open one that already covers
it: what was seen, where, what was expected, and what was left behind. Name each issue in the
finishing commit's message (`Refs owner/repo#N`), since the change file that recorded the bug
is deleted. If `AGENTS.md` declares a coordination room, tell it the change finished, which
specs it moved and the issues it filed.

## Delete

`git rm` the change file (or its directory) in the same commit as the edits of steps 2 to 4, and
push the way `AGENTS.md` says. Report the specs touched, the D-ids written, the idea retired,
the issues closed, the issues filed for bugs left over, and the commit. Under fast forward
(method "The chain"), the report also lists the decisions made without the person. The chain
ends here.
