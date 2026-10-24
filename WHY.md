# Why Kyspec

The argument behind the method, the lineage it comes from, and the objections we expect. [README.md](README.md) has the short form; [METHOD.md](METHOD.md) has the rules.

## The bet

Every spec-driven framework for coding agents encodes a belief about the model it was written for. The frameworks of 2025 believed the model would wander, so they fenced it: a CLI to validate what it wrote, templates to fix the shape of what it wrote, an artifact graph to say what it may write next, delta files so it never touched the main spec directly, and an archive so nothing it produced was ever lost. For the models of 2025 that belief was right, and the fences bought real discipline.

Kyspec encodes a different belief: the model is now the most capable reader and writer in the repository, and the way to get its best work is to put nothing between it and the file. Give it the truth (the spec, present tense, beside the code), a small unit of work with a clear end, a reviewer that is not itself, and a handful of mechanical gates for the structure that must hold. Then trust it.

The belief is testable. A method for a capable model should produce specs that stay true to the code, changes that finish, decisions that survive, and sessions that spend their context on the problem instead of the process. The sections below say how each departure from OpenSpec serves one of those.

## What OpenSpec got right

Kyspec is a descendant, and it keeps what it inherited on purpose.

- **Specs and changes are different things.** A spec says what the system does; a change says what is about to be different. Keeping them in separate trees is the single best idea in the family, and Kyspec keeps the two nouns, `specs/` and `changes/`.
- **A requirement is a sentence with scenarios.** `### Requirement: <name>` with `SHALL`, then `#### Scenario:` blocks of `WHEN` and `THEN`. The form is readable by a person, checkable by a verifier, and stable enough for code to cite. Kyspec keeps it unchanged.
- **A change is the unit of work.** Bounded, named after an outcome, with a task list. Kyspec keeps the unit and changes what happens at its end.
- **The agent runs the workflow through slash commands.** The person says `/opsx:propose`; the model does the rest. Kyspec keeps the slash-command shape and removes the CLI underneath it.

## Each departure and its reason

**Delta spec files become same-commit edits of the main spec.** OpenSpec has the model write `## ADDED Requirements` and `## MODIFIED Requirements` blocks into a delta file inside the change, and merges them into the main spec at archive time. Kyspec has the model edit the main spec in the commit that makes the code satisfy the requirement, and the change's Specs section holds the intended text only until it moves, then a one-line pointer. The reason is method #1: a spec kept apart from its code goes append-only and drifts, because nobody edits it when the code moves. In Run402's OpenSpec period the deltas that had shipped were promoted by hand in a cleanup pass before the switch; the merge step that was supposed to do it had been skipped, because an archive is the last thing anyone does and the first thing anyone postpones.

**The archive becomes a delete.** OpenSpec moves a finished change to `changes/archive/<date>-<name>/` and never prunes. Kyspec `git rm`s the change in the same commit that settles its specs and folds its decisions. The reason is method #2 and #4: a spec describes the present, git is the history, and an artifact nobody will read again is not written. An archive is read by grep and by the model's context window, which cannot tell a proposal from 2026-06 that was superseded from a spec that is live. When Run402 deleted its archive, code comments all over the tree were found citing archived change paths, and every one had to be repointed to the spec that had absorbed it. Those citations had pointed, for months, at prose nobody maintained.

**Decisions move from `design.md` to numbered notes in the spec.** OpenSpec records technical decisions in the change's design file, which goes to the archive with it. Kyspec folds every decision that still governs the code into the owning spec's `## Design notes` as `D-<capability>-N`, with its rationale and the alternative it rejected, and code, tests and gates cite that id. The reason is method #3: a decision that lives only in a file with a lifecycle dies with that file. A decision cited from the place it governs is read every time the place is touched.

**The CLI becomes nothing.** OpenSpec installs a CLI that scaffolds, validates, lists, shows and archives, and generates command files for thirty tools. Kyspec ships five prose pages and one CI check. The reason is method #9: nothing stands between the model and the file. A CLI validates structure, which the gate does in forty lines, and cannot validate truth, which only a reader can. A CLI also runs where it is installed, and an agent session in a cloud container, a CI runner, or a colleague's laptop should run the method unchanged.

**Templates become seven sections that scale.** OpenSpec scaffolds a change from templates and its schema says which artifacts a change has. Kyspec fixes the seven H2 headings of a change and nothing else: any section may be one line, and a commit that touches no spec and carries no decision needs no change at all. The reason is expressibility. A model made to fill a template writes to the template's size; a model given a section name and a reader writes to the problem's size.

**The artifact graph becomes one page per step.** OpenSpec's workflow is a dependency graph: design requires proposal, tasks require specs and design, and the agent fetches the instructions for its next step from the CLI. Kyspec's chain is five pages that each name the next one, and the whole chain runs in one thread from "implement owner/repo#N". The reason is throughput. A model that can hold a change entire should not be made to produce it in four round trips.

**Verification becomes a stranger's job.** OpenSpec's verify is an optional, advisory step run by the same agent. Kyspec's verify is required whenever a user-facing flow changed, and it runs in a fresh thread that reads only the change's Why and Specs, holds only what the product's user holds, uses the released thing, and never sees the diff. The reason is method #7: the builder reads the requirement through the code it wrote and cannot see what the code hides. A reader that never saw the code can only check what the spec says, which is the point.

**Evidence replaces narrative.** A Kyspec task line carries a commit SHA, a count, a dated live check, or a struck-through "not needed" naming the decision that killed it. No logs, no diaries. The reason is method #6: the reader wants to know whether it is done, not how the day went, and a SHA is shorter than a sentence and checkable.

**Ideas become a tier.** OpenSpec has nothing before "propose". Kyspec has `ideas/<name>.md` with a status line as its first line, a brainstorm skill whose partner challenges rather than flatters, and a rule that parked and rejected ideas keep their reason. The reason is imagination, and its cost: a session that cannot see what was already thought rediscovers it, and a session that starts at "propose" never asks whether the problem is real.

**Prior art becomes mandatory.** Before a change's Decisions, its Prior art lists the principles it touches, the D-ids and requirements of nearby specs, and any idea on the topic, each marked keep or override in one line, and every override is restated as a decision. A decision that silently contradicts prior art is a defect. The reason is the same as for D-ids: a decision is only worth keeping if the next one has to answer to it.

**`config.yaml` becomes three lines in `AGENTS.md`.** Everything product-specific, the release skills, the coordination room, the surface review and its paths, the principle documents, is a declaration the skills read. An undeclared line means the step does not exist. The reason is that the five pages are the same for every product, so the method can be installed by copying them.

**Validation becomes gates and labeled judgment.** One CI check refuses a change with the wrong sections, an archive directory, a date-prefixed change, a change directory without its file, and an idea without a status. Every other rule on the method page says which gate enforces it, or says "judgment" and names the review that applies it, or is deleted. The reason is method #8: a rule nobody enforces is a rule nobody has, and a document is the commentary on its gates.

## Objections

**Deleting the change loses information.** Everything worth keeping has a home before the delete: the requirements are in the spec, the decisions are D-ids in the spec's Design notes, the idea's residue is in the spec's Purpose, and the diff and the discussion are in git. What the archive kept beyond that was the narrative, and the narrative is what nobody read. The finish skill refuses to delete until each of those homes is filled; that is its first step.

**A model editing the main spec will wreck it.** The edit rides in the same diff as the code, so the reviewer reads the contract and the implementation together; a wrong spec edit is as visible as a wrong line of code. A spec is also read by every later session that touches its capability, so a bad edit is found by the next one. A delta merged by a tool at archive time is read by nobody.

**Without a CLI, how do you know the structure holds?** The gate. It is one file, it runs in CI, and it refuses the handful of structural faults that matter. The CLI validated headings and scenario blocks too; it never validated whether the requirement was true or the decision was sound, and neither can any program. Kyspec spends its enforcement on the gate and names the rest judgment, out loud, section by section.

**Why must the verifier be a stranger?** Because the builder has already decided what the requirement means. The verify page gives the fresh thread the change's Why and Specs and nothing else, and tells it to list the scope one requirement per line before it touches the product, so it cannot drift onto the builder's reading. When the verifier fails a scenario, it adds a task and fixes nothing; the next release gets a new cycle from another fresh thread.

**Isn't evidence on every task bureaucracy?** A SHA, a count, or a date and a URL is less text than the sentence it replaces, and unlike the sentence it can be checked. The rule is also what makes the finish step mechanical: every task is checked with evidence, or the change does not finish.

**Does it work with pull requests?** Yes. The skills defer to the repository's `AGENTS.md` for where and how to push, the gate reads a diff between two trees, and a SHA is recorded once it is on the main branch, whether it got there by push or by merge. Run402 pushes to `main` from worktrees with no pull requests, but nothing in the method depends on that.

**What about people?** The method is for the work, not the worker. A person runs the same chain, writes the same change file and gets the same verify. The brainstorm page is written for a conversation; the person is the partner whose idea is being challenged, and the file at the end is theirs.

**Why a coordination room?** Because several sessions work one repository at once, and a change file in git is only visible after a push. A declared room is where a session claims an area before it edits and announces when it is done; the plan and implement pages claim, the implement and finish pages announce, and only when the room is declared. Run402 uses its own rooms for this; any channel that can hold a claim and a message will do.

**Why not Spec Kit, or Kiro, or BMAD?** They share OpenSpec's premise: structure the model's output and accumulate the artifacts. Spec Kit's constitution, specify, plan, tasks and implement sequence is an artifact graph with a different vocabulary, and its per-feature spec directories stay. Kyspec's premise is the opposite one, and the differences follow from it.

## Lineage

Run402 used OpenSpec for most of its life and owes it the shape of its specs. Three things pushed it to change: the archive grew faster than the specs and was cited from code; shipped deltas went unmerged because the merge was a separate, postponable step; and every session spent its first minutes learning the CLI's view of the world instead of the product's. The move took two days in October 2026: the method page was written, the five skills replaced the generated commands, the `openspec/` tree became `specs/`, `changes/` and `ideas/` at the repository root, the archive was deleted with its citations repointed, and a layout gate replaced the validator. Kyspec is that method with the product-specific lines turned into declarations.
