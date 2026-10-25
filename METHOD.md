# Method

How work is planned, built, released, verified and finished in a repository that runs Kyspec.
Kyspec keeps requirements with their code, decisions where future work will find them, and a
clear test for when a change is finished.

This page is the operational reference cited by the five skills. It describes the current
method; Git holds its history. For the introduction, read [README.md](README.md). For the
reasoning behind the method, read [WHY.md](WHY.md).

A product keeps its own tier-1 documents, such as principles and style rules, beside this
page and names them in its `AGENTS.md` under `## Method declarations`. This page governs the
work itself.

## Principles

1. **A spec changes in the same commit as its code.** Editing them separately makes drift
   easy. Updating both together lets the reviewer assess the contract and its implementation
   in one diff.

2. **A spec describes the present. Git is the history.** No archive directories, no status
   files, no "was/now". The spec tells a reader what the system does; `git log` explains how it
   got there.

3. **Decisions and their rationale are kept, numbered, and cited from the place they
   govern.** A decision lives in its spec's Design notes under a stable id of the form
   `D-<capability>-N`. Code, tests and gates cite that id. The rationale remains available
   after the change file is deleted.

4. **Write only what will be read again.** Every artifact names its reader: a future
   session, CI, or code. Ask "who reads this next month?" An artifact with no answer is not
   written.

5. **One change, one unit, deleted when done.** A change carries Why, Specs, Prior art,
   Decisions, Tasks, Surface review and Verification. Keep its scope small enough to finish.
   Once every task is checked and verification passes, its requirements belong in the spec,
   its decisions belong in the spec's Design notes, and the change is deleted.

6. **Evidence, not narrative.** A task line carries a commit SHA, a count, a dated live
   check, or a struck-through "not needed" naming the decision that removed the need. No logs
   or diaries: the reader needs to know whether the task is done and how to check.

7. **Done means verified by someone who didn't build it.** A change that touches what a user
   sees is verified by a fresh thread that did not write the code. It uses the released
   product as that user would ("Verify"). It lists the change's requirements one per line to
   keep the check focused on the contract. A change no user can see is done on its release
   evidence and says why it skipped verify.

8. **A rule nobody enforces is a rule nobody has.** Structure that matters gets a CI check.
   Each document section names the gate that enforces it, or says "judgment" and names the
   review that applies it, or is deleted. A gate's failure message links to the section it
   enforces.

9. **Nothing stands between the model and the file.** A skill is one short page of prose:
   no Kyspec CLI, no templates fetched at run time, no artifact graph. The method works the
   same way in a cloud session. The model reads the instructions and edits the files the
   change needs.

10. **Inside the repository, the contract is the spec and the commit. Issues are the
    contract with the outside.** A change spanning directories is one change, and each of its
    commits is one commit across those directories: what must move together moves together,
    the spec with its code, a route with its docs and clients, never a commit per directory
    with an issue as the thread between them. Issues keep three jobs: the trackers where
    users report, forks that are not ours, and backlog not yet picked up.

## Three tiers

**Tier 1: principles.** This page and the principle documents declared under Principles in
`AGENTS.md`'s "Method declarations". They change only through a change whose Decisions say
"amends `<doc>` #N because". Number the principles so specs can cite them
(`principles #2`, `method #6`). A principle nothing cites is a candidate for deletion.

**Tier 2: specs.** `specs/<capability>.md` is the current contract for one capability. A spec
with attachments, such as fixtures or manifests, uses a directory instead:
`specs/<capability>/<capability>.md`, with the attachments beside it.

Write specs in the present tense. Requirements have stable names and WHEN/THEN scenarios.
Design notes hold decisions under `D-<capability>-N` ids, with their rationale and citations
to the tier-1 principles they apply. A spec cites a tier-1 rule instead of restating it.

**Tier 3: ideas.** Each idea has one file, `ideas/<name>.md`. Its first line is
`status: seed | explored | parked | rejected | adopted`; any other first line fails the
layout gate. An adopted idea names its change: `status: adopted — changes/<name>.md`.

When the change finishes, any lasting context from the idea moves into the spec's Purpose
and the idea file is deleted. Parked and rejected ideas stay with their reasons, so a later
session can understand the decision without rediscovering it. Every brainstorm ends in an
idea file, even a five-line `seed`. Only an explicit instruction to drop the idea writes
nothing.

**Products.** A repository with more than one product nests each tree by product:
`specs/<product>/<capability>.md`, `changes/<product>/<name>.md`, and
`ideas/<product>/<name>.md`. A spec, change or idea belongs to the product its name starts
with and drops that prefix. A single-product repository does not nest. Paths on this page
and in the skills omit the product segment; add it where the repository nests.

## The chain

Five skills run the method. Each is one short page (principle 9).

| Step | Skill | Result |
| --- | --- | --- |
| 1 | **kyspec-brainstorm** | Starts or continues an idea file and always ends in one ("Three tiers"). |
| 2 | **kyspec-plan** | Writes the change file ("A change"). |
| 3 | **kyspec-implement** | Works the tasks, pushes, records CI, then runs the product's Release skills and records their evidence. |
| 4 | **kyspec-verify** | Checks the released product in a fresh thread without reading the code or diff ("Verify"). |
| 5 | **kyspec-finish** | Settles the change into the specs and deletes it ("Finishing a change"). |

Each skill accepts the change or idea name and ends by naming the next step. The chain runs
from "implement owner/repo#N" in one coordinating thread, with no question a one-shot cannot
answer. Verify alone runs in a fresh agent.

Scale the writing to the change: every section may be one line. The five skills are the same
for every product; product-specific details live in declarations.

## Method declarations

In `AGENTS.md`, a product adds `## Method declarations` and declares the four things the
skills cannot know. An undeclared line means that step does not exist for the product.

- **Principles:** the tier-1 documents beside this page. Their numbered principles are
  cited by specs and changes (`principles #N`). Without a declaration, this page is the only
  tier-1 document.
- **Release:** the skills that ship a change. kyspec-implement runs the ones needed by the
  diff and records their evidence under Verification.
- **Coordination room:** whether a room exists, and how to claim an area and announce in it.
  kyspec-plan and kyspec-implement claim; kyspec-implement and kyspec-finish announce. These
  steps run only when a room is declared.
- **Surface review:** the skill that reviews a diff of the product's surface, the paths it
  covers, and the documents it judges against. kyspec-plan and kyspec-implement invoke it
  only when it is declared and the change touches those paths. The surface is what users
  touch: an API, a UI, a CLI, a published client, or its documentation.

## A change

A change is a bounded unit of work between an idea and the spec. It is deleted when finished.
Use one file, `changes/<name>.md`. A change with attachments, such as a spike script or
evidence, uses `changes/<name>/` with `<name>.md` beside the attachments.

The file has exactly the seven H2 sections below, in this order. The layout gate refuses any
other set or order, and refuses a change directory without its `<name>.md`. An H1 title and a
`Source:` line naming the issue or idea may precede the sections.

**No change file** is needed for a commit that touches no spec and carries no decision, such
as a typo, a dependency bump, or a test fix.

**Why.** Describe the problem, the reader it serves, and an outcome a verifier can observe,
in a few sentences. Leave implementation details out of this section.

**Specs.** Name the target spec paths, marking new ones as new. Write the intended
requirements and scenarios in the spec's own requirement and WHEN/THEN form, in the present
tense they will have in the spec. Each requirement moves into its main spec in the same
commit as the code that satisfies it (principle 1). At finish, this section contains no
promise the spec does not already keep. There are no delta-spec files.

**Prior art.** Mandatory, and written before Decisions. List the principles the change
touches by number, the `## Design notes` D-ids and requirements of nearby specs, and any idea
on the topic. Mark each relevant item `keep` or `override` in one line. Restate every override
in Decisions with its reason. A decision that silently contradicts prior art is a defect.

**Decisions.** Use `D1`, `D2`, and so on inside the change. Each states the decision, its
reason, and the alternative it rejects. At finish, every decision that still governs the
code becomes `D-<capability>-N` in the owning spec's Design notes.

**Tasks.** A checklist with evidence on each line (principle 6): a commit SHA, a count, a
dated live check, or a struck-through "not needed" naming the decision that removed the
need. A task without evidence is open. For a public surface change, include the documentation
and clients in the blast radius named by the product's `AGENTS.md`.

**Surface review.** Required when the product declares a surface review and the diff touches
its paths. The declared review skill reads the diff, using the declared documents as its
rubric. Its output contains:

- One line per rule: `pass`, `concern <file:line>`, or `n/a` with a reason.
- A `Checked:` line naming every surface file read.
- A verdict of `pass`, `concerns`, or `fail`.

A `fail` is fixed before pushing. Until the diff exists, this section holds the plan's note
("Before planning a surface change"). A change with no surface, or one that touches a surface
path without changing user-visible behavior, says `Surface review: N/A — <reason>` with a
concrete reason.

**Verification.** kyspec-implement records the CI run for the pushed commit and the deploy
or publish result with its live check, or `Release: none — <reason>`. This is followed by the
verify cycles ("Verify"), or `Verify: skipped — <reason>` when no user-facing flow changed.
kyspec-implement writes the skip line.

## Verify

Verification (principle 7) runs in a fresh thread that did not write the code. It is required
when the change touches a user-facing flow, whether a declared surface or any UI flow. It is
optional otherwise; a skipped verify says why.

The verifier follows these rules:

- **Read the contract.** Read only the change's Why and Specs, and the specs they name.
  Hold only what the product's user holds: public docs and published clients for a product
  used by agents or developers, or the app for one used by people. Never read the diff.
- **Use the released product.** Check production or the deployed branch. A live surface
  is verified live, never by a unit test alone.
- **Record observations.** Append a dated cycle to Verification. List its scope one
  requirement per line, record `pass`, `fail`, or `blocked` for each item with what was
  observed, and give a verdict.
- **Send failures back to implementation.** A failure adds unchecked tasks for
  kyspec-implement. The next release gets a new verification cycle.
- **Name what cannot be reached.** A scenario no user can reach by ordinary means, such as
  fault injection or a paid plan bought only for the test, is named out of reach and stays
  outside the verdict. Finish strikes it or moves it to an idea unless a test covers it.
- **Stay within the free path.** Spend nothing beyond the product's free path and remove
  what the verification creates.

## Finishing a change

kyspec-finish takes five steps before deleting the change:

1. **It may finish:** every task is checked with evidence, and Verification holds a green CI
   run, release evidence, and either a passing verify cycle or a skip line. Otherwise, stop
   and name what is missing.
2. **Specs settled:** every intended requirement is in its main spec. Strike anything still
   unshipped with a reason, or move it out as a new idea. The Specs section holds no promise.
3. **Decisions folded:** move decisions into the owning spec's `## Design notes` as
   `D-<capability>-N`, using the next free N and keeping their rationale. Repoint every code
   comment, test or doc that cites the change's path to the relevant id.
4. **Idea retired:** move any lasting context into the spec's Purpose and delete the idea
   file.
5. **Loop closed:** close the issues named by the change through the commit message, and
   announce in the coordination room if one is declared.

Then `git rm` the change in the same commit as the spec edits and push. Git holds the history.
There is no archive directory or date-prefixed change; the layout gate refuses both.

## Before planning a surface change

A change that could touch the declared surface is planned against the documents named by
the Surface review declaration. This includes routes, response bodies, errors, auth, billing,
deploys, clients, help docs, and public workflows. Read those documents before planning and
again before implementation.

Until the diff exists, the change's `## Surface review` holds the plan's note: the surface
touched, the rules in play, the clients and docs that must move with it, and any deviation
with its reason. A change with no public surface says `Surface review: N/A — <reason>`.
The declared review skill replaces the note with its review of the built diff.

## Gates

These are the mechanical checks for this page (principle 8). Each check's comment header
cites the section it enforces.

| Section | Check |
| --- | --- |
| "A change" (one file or `<name>/<name>.md`; the seven sections, in order) | `check-layout.mjs` |
| "Finishing a change" (no archive directory, no date-prefixed change) | `check-layout.mjs` |
| "Three tiers" (an idea's first line is its status) | `check-layout.mjs` |

These checks enforce layout. The remaining requirements below rely on review and the finish
workflow; the layout gate does not establish that a requirement is implemented or that
verification evidence is sound.

A product adds a row for each section of its own tier-1 documents with a mechanical check,
such as a route-shape test, vocabulary sweep, or docs-alignment test. It names the review that
applies the rest.

**Judgment**, applied by the reviewer of a change and by kyspec-finish's first two steps:
principles 1, 3, 4, 5, 6 and 7, and the declared surface review's rubric on every surface diff.
