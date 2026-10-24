---
name: kyspec-finish
description: Finish a change in five steps then delete it - check it may, settle its Specs into the main specs, fold its Decisions into the spec's Design notes as D-<capability>-N, retire its idea, close linked issues and tell the room - then git rm the change file and push. Use for /kyspec-finish <change>, or when kyspec-implement or kyspec-verify names it.
---

# /kyspec-finish

The last step of `METHOD.md` "The chain"; its contract is method "Finishing a change". Five
steps, then the delete. Git holds the history: there is no archive, and the layout gate refuses
an archive directory or a date-prefixed change. In a repository that nests by product (method
"Products"), every path here gains its `<product>/` segment.

**Input:** a change name.

## 1. Check it may

Every task is checked, with evidence or a struck "not needed" naming its decision.
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

Each decision that still governs the code moves into the owning spec's `## Design notes` (added
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
(`Closes owner/repo#N`). If `AGENTS.md` declares a coordination room, tell it the change
finished and which specs it moved.

## Delete

`git rm` the change file (or its directory) in the same commit as the edits of steps 2 to 4, and
push the way `AGENTS.md` says. Report the specs touched, the D-ids written, the idea retired,
the issues closed, and the commit. The chain ends here.
