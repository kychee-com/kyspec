# Method

How work is planned, specified, decided, verified and finished in a repository that runs
Kyspec. The five skills cite this page. It describes the present; git is the history.

A product keeps its own tier-1 documents (its principles, its style) beside this page and
names them in its `AGENTS.md` under `## Method declarations`. This page governs the work
itself.

## Principles

1. **A spec changes in the same commit as its code.** A spec kept apart from its code goes
   append-only and drifts, because nobody edits it when the code moves. A same-commit edit
   stays true, and the reviewer sees the contract and the implementation in one diff.

2. **A spec describes the present. Git is the history.** No archive directories, no status
   files, no "was/now". A reader learns what the system does; `git log` answers how it got
   there.

3. **Decisions and their rationale are kept, numbered, and cited from the place they
   govern.** A decision lives in its spec's Design notes under a stable id of the form
   `D-<capability>-N`, so code, tests and gates cite it forever. A decision that lives only in
   a file with a lifecycle dies with that file.

4. **Write only what will be read again.** Every artifact names its reader: a future
   session, CI, or code. The test is "who reads this next month?"; an artifact with no answer
   is not written.

5. **One change, one unit, deleted when done.** A change carries Why, Specs, Prior art,
   Decisions, Tasks, Surface review and Verification, and is bounded so it can finish. When
   every task is checked and verification passes, its requirements are in the spec, its
   decisions are folded into the spec's Design notes, and the change is deleted.

6. **Evidence, not narrative.** A task line carries a commit SHA, a count, a dated live
   check, or a struck-through "not needed" naming the decision that killed it. No logs, no
   diaries: the reader wants to know whether it is done, not how the day went.

7. **Done means verified by someone who didn't build it.** A change that touches what a user
   sees is verified by a fresh thread that did not write the code, using the released thing as
   that user would ("Verify"). Its scope is the change's requirements, one per line, so the
   verifier cannot drift onto the builder's reading of them. A change no user can see is done
   on its release evidence and says why it skipped verify.

8. **A rule nobody enforces is a rule nobody has.** Structure that matters gets a CI check,
   and a document is the commentary on its gates: each section names the gate that enforces
   it, or says "judgment" and names the review that applies it, or is deleted. The gate's
   failure message links the section.

9. **Nothing stands between the model and the file.** A skill is one short page of prose:
   no CLI, no templates fetched at run time, no artifact graph. It works unchanged in a cloud
   session, and the model is trusted to do what the change needs.

10. **Inside the repository, the contract is the spec and the commit. Issues are the
    contract with the outside.** A change spanning directories is one change and one commit
    citing the spec. Issues keep three jobs: the trackers where users report, forks that are
    not ours, and backlog not yet picked up.

## Three tiers

**Tier 1: principles.** This page and the principle documents the product declares
(`AGENTS.md` "Method declarations", Principles). They change only by a change whose
Decisions say "amends `<doc>` #N because". They are numbered so specs cite them by number
(`principles #2`, `method #6`). A principle nothing cites is a candidate for deletion.

**Tier 2: specs.** `specs/<capability>.md` is the live truth for one capability. A spec with
attachments (fixtures, manifests) is a directory instead, `specs/<capability>/<capability>.md`
beside them. Present tense only. Requirements carry stable names, each with WHEN/THEN
scenarios. Design notes hold the decisions, each under its `D-<capability>-N` id with its
rationale, and cite the tier-1 principle they apply. A spec never restates a tier-1 rule; it
cites it.

**Tier 3: ideas.** `ideas/<name>.md`, one file per idea. The first line is
`status: seed | explored | parked | rejected | adopted`; a file whose first line is anything
else fails the layout gate. An adopted idea names its change
(`status: adopted — changes/<name>.md`). When the change finishes, what is still worth keeping
of the idea becomes the spec's Purpose and the idea file is deleted. Parked and rejected ideas
stay, with the reason, so a later session can disregard them knowingly instead of
rediscovering them. A brainstorm ends in an idea file every time, even a five-line `seed`;
only an explicit instruction to drop the idea writes nothing.

**Products.** A repository that holds more than one product nests each tree by product:
`specs/<product>/<capability>.md`, `changes/<product>/<name>.md`,
`ideas/<product>/<name>.md`. A spec, change or idea belongs to the product its name starts
with and drops that prefix. A single-product repository does not nest. Every path on this page
and in the skills is written without the product segment; add it where the repository nests.

## The chain

Five skills run this method, each one short page (principle 9):

```
kyspec-brainstorm → kyspec-plan → kyspec-implement → the product's Release skills
                                                   → kyspec-verify (fresh thread) → kyspec-finish
```

- **kyspec-brainstorm** starts or continues an idea file and always ends in one ("Three tiers").
- **kyspec-plan** writes the change file ("A change").
- **kyspec-implement** works the tasks, pushes, records CI, then runs the product's Release
  skills and records their evidence.
- **kyspec-verify** is the code-blind check ("Verify").
- **kyspec-finish** settles the change into the specs and deletes it ("Finishing a change").

Each accepts the change (or idea) name and ends by naming the next step, so the whole chain
runs in one thread from "implement owner/repo#N" with no question a one-shot cannot answer;
verify alone runs in a fresh agent. Ceremony scales with the change: every section of a change
may be one line. The five pages are the same for every product; everything product-specific
is a declaration.

## Method declarations

A product declares, in its repository's `AGENTS.md` under `## Method declarations`, the four
things the skills cannot know. An undeclared line means the step does not exist for that
product.

- **Principles:** the tier-1 documents beside this page, numbered so specs and changes cite
  them (`principles #N`). Without one, this page is the only tier-1 document.
- **Release:** the skills that ship a change. kyspec-implement runs the ones a diff needs and
  records their evidence under Verification.
- **Coordination room:** whether one exists, and how to claim an area and announce in it.
  kyspec-plan and kyspec-implement claim, kyspec-implement and kyspec-finish announce, only
  when it is declared.
- **Surface review:** the skill that reviews a diff of the product's surface, the paths it
  covers, and the documents it judges against. kyspec-plan and kyspec-implement invoke it only
  when it is declared and the change touches those paths. The surface is what the product's
  users touch: an API, a UI, a CLI, a published client, its documentation.

## A change

A change is the unit of work between an idea and the spec. It is bounded so it can finish,
and it is deleted when it does. On disk it is one file, `changes/<name>.md`; a change with
attachments (a spike script, evidence) is a directory `changes/<name>/` with `<name>.md`
beside them. Its H2 sections are exactly the seven below, in this order; the layout gate
refuses any other set. An H1 title and a `Source:` line naming the issue or idea may precede
them. The same gate refuses a change directory without its `<name>.md`.

**No change file** is needed for a commit that touches no spec and carries no decision: a typo,
a dependency bump, a test fix.

**Why.** The problem and the reader it serves, in a few sentences. The outcome a verifier
can observe. Nothing about implementation.

**Specs.** The target spec paths (existing, or marked new) and the requirements and scenarios
the change intends, in the spec's own requirement and WHEN/THEN form and the present tense the
spec will carry. Each moves into its main spec in the same commit as the code that satisfies
it (principle 1). At finish the section holds no promise the spec does not already keep. There
are no delta-spec files.

**Prior art.** Mandatory, and written before Decisions. It lists the principles the change
touches (by number), the `## Design notes` D-ids and requirements of nearby specs, and any
idea on the topic, each relevant one marked `keep` or `override` in one line. An override is
restated in Decisions with its reason; a decision that silently contradicts prior art is a
defect.

**Decisions.** `D1`, `D2`, … inside the change, each stating what is decided, why, and the
alternative it rejects. At finish each one that still governs the code becomes
`D-<capability>-N` in the owning spec's Design notes.

**Tasks.** A checklist whose lines carry evidence (principle 6): a commit SHA, a count, a
dated live check, or a struck-through "not needed" naming the decision that killed it. A
task without evidence is open. For a change to a public surface the tasks include its
documentation and clients, the blast radius the product's `AGENTS.md` names.

**Surface review.** Required when the product declares a surface review and the diff touches
its paths. The section holds the output of the declared review skill, which reads the diff,
not the prose, with the declared documents as its rubric: one line per rule, each `pass`,
`concern <file:line>` or `n/a` with a reason, a `Checked:` line naming every surface file read,
and a verdict of `pass`, `concerns` or `fail`. A `fail` is fixed, never pushed. Until the diff
exists the section holds the plan's note ("Before planning a surface change"). A change with
no surface, or one that touches a surface path without changing user-visible behavior, says
`Surface review: N/A — <reason>` with a concrete reason.

**Verification.** The release evidence kyspec-implement writes: the CI run for the pushed
commit and the deploy or publish result with its live check, or `Release: none — <reason>`.
Then the verify cycles ("Verify"), or the `Verify: skipped — <reason>` kyspec-implement writes
when no user-facing flow changed.

## Verify

Verification (principle 7) is a cycle run by a fresh thread that did not write the code. It
reads only the change's Why and Specs (and the specs those name) and holds only what the
product's user holds: the public docs and published clients for a product whose users are
agents or developers, the app for one used by people. It uses the released thing against
production or the deployed branch, never reads the diff, and appends a dated cycle to
Verification: the scope (one requirement per line), pass, fail or blocked per item with what it
observed, and a verdict. A scenario no user can reach by ordinary means (fault injection, a paid
plan bought only for the test) is named out of reach and stays outside the verdict; finish
strikes it or moves it to an idea unless a test covers it. The verifier spends nothing beyond
the product's free path and removes what it creates. A failure adds unchecked tasks for
kyspec-implement, and the next release gets a new cycle. A live surface is verified live,
never by a unit test alone.

Verify is required when the change touched a user-facing flow (the declared surface, or any UI
flow) and optional otherwise; a skipped verify says why.

## Finishing a change

kyspec-finish takes five steps, then deletes:

1. **It may finish:** every task is checked with evidence, and Verification holds a green CI
   run, release evidence, and either a passing verify cycle or a skip line. Otherwise it stops
   and names what is missing.
2. **Specs settled:** every intended requirement is in its main spec; anything still unshipped
   is struck with a reason or moved out as a new idea. The section holds no promise.
3. **Decisions folded** into the owning spec's `## Design notes` as `D-<capability>-N` (the
   next free N) with their rationale; every code comment, test or doc citing the change's path
   is repointed to that id.
4. **Idea retired:** what is still worth keeping goes into the spec's Purpose, and the idea file
   is deleted.
5. **Loop closed:** the issues the change names are closed by the commit message, and the
   coordination room is told, if one is declared.

Then the change is `git rm`ed in the same commit as the spec edits and pushed. Git holds the
history: there is no archive directory and no date-prefixed change, and the layout gate
refuses either.

## Before planning a surface change

A change that could touch the declared surface (a route, a response body, an error, auth,
billing, deploy, a client, the help docs, or any public workflow) is planned against the
documents the Surface review declaration names, read before planning and again before
implementation. Until the diff exists, the change's `## Surface review` holds the plan's note:
the surface it touches, the rules in play, the clients and docs that must move with it, and
any deviation with its reason; a change with no public surface says
`Surface review: N/A — <reason>`. The declared review skill replaces the note with the review
of the built diff.

## Gates

Principle 8 applied to this page. Each row is a section with a mechanical check; the check's
comment header cites the section it enforces.

| Section | Check |
| --- | --- |
| "A change" (one file or `<name>/<name>.md`; the seven sections, in order) | `check-layout.mjs` |
| "Finishing a change" (no archive directory, no date-prefixed change) | `check-layout.mjs` |
| "Three tiers" (an idea's first line is its status) | `check-layout.mjs` |

A product adds a row for each section of its own tier-1 documents that has a mechanical check
(a route-shape test, a vocabulary sweep, a docs-alignment test), and names the review that
applies the rest.

**Judgment**, applied by the reviewer of a change and by kyspec-finish's first two steps:
principles 1, 3, 4, 5, 6 and 7, and the declared surface review's rubric on every surface diff.
