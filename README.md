# Kyspec

**Keep your specs current. Make "done" mean verified.**

Kyspec is the [OpenSpec](https://github.com/Fission-AI/OpenSpec) spin-off we use at [Kychee](https://www.kychee.com/) to build [run402](https://run402.com/), our open-source backend for AI agents, and our other products.

It puts each change in one file, updates the spec in the same commit as the code, and requires a fresh agent to test the released product before user-facing work is finished. When the work is done, the requirements and decisions live in the spec. The change file is deleted. Git keeps the history.

If you use OpenSpec, the foundations are familiar: named requirements, WHEN/THEN scenarios, and a clear separation between what the product does and what you intend to change. Kyspec gives that foundation a smaller workflow and a stricter definition of done.

**Five short skills. One method. One layout check. No Kyspec workflow CLI.**

[Try it on your next change](#try-kyspec-on-your-next-change) · [Moving from OpenSpec](#moving-from-openspec) · [Why we built it](WHY.md) · [Read the method](METHOD.md)

## Why switch from OpenSpec?

**The rails were built for a weaker model.** OpenSpec, Spec Kit and their peers were designed in 2025 for models that lost the thread: a CLI to validate what the model wrote, templates to fix the shape of every artifact, an artifact graph to say which file it may write next, delta files to keep its hands off the main spec, and an archive so nothing it produced was lost. Those were sensible answers at the time, and OpenSpec's distinction between the current spec and the work that changes it is one we still build on.

**The model changed. The scaffolding did not.** A frontier model in 2026 reads a long spec, the code it governs and the git log, and writes the new requirement in the spec's own voice. For that model the rails now cost more than they save: a template pads a one-line change into four files, an artifact graph turns one pass into four round trips, delta blocks make it think in text diffs instead of behavior, a merge nobody reads lets the spec drift, and an archive fills its context with proposals that are no longer true. Kyspec removes the scaffolding and keeps the discipline. Each step is one short page. The spec is edited in the commit that implements it. Decisions stay where the next session looks. One CI gate holds the structure that must hold, and a stranger verifies what shipped. Loosening the shackles is not lowering the bar: the bar moves from the shape of the artifacts to the truth of the spec and the evidence of the release.

### Review the code and its contract together

The main spec changes in the commit that implements the requirement. The reviewer sees both in one diff, and the next session finds the current contract without waiting for a separate spec synchronization step.

### Have a fresh agent check what users actually get

For a changed user-facing flow, the verifier starts in a fresh thread. It reads the requirements, uses the released product through the user's interface, and records what happened. It never reads the implementation diff. Failures become tasks for the builder, followed by another release and a fresh verification cycle, up to a budget the change can set, five by default.

That gives you a concrete answer to "does the shipped behavior meet the requirement?"

### Keep decisions where the next agent will find them

Decisions that still govern the code move into the owning spec's Design notes under stable IDs such as `D-reading-list-3`. Code and tests can cite them. The next plan must find relevant prior decisions and explicitly mark each `keep` or `override`, with a reason for every override.

Your repository keeps the reasoning that future work needs.

### Finish with a clearer repository

A change is one file with seven sections. Each section can be one line. Once its requirements and decisions have been settled into the live specs, the change is deleted.

The working tree holds current specs, active work, and ideas worth keeping. Git holds completed plans and previous versions.

### Nothing to operate

The agent reads five short skills and edits ordinary Markdown files. Product-specific instructions live in `AGENTS.md`. A dependency-free Node.js check covers the required layout; review and verification cover meaning and behavior.

## The difference in one change

Consider the reading-list example in [`examples/lantern`](examples/lantern): a reader should be able to archive a book and restore it without losing its notes or reading status.

| Step | What happens |
| --- | --- |
| Plan | One change records the requirement, relevant prior decisions, tasks, and verification scope. |
| Implement | The requirement lands in the main spec with the code. The builder records CI and release evidence. |
| Verify | A fresh agent archives an in-progress book and restores it through the released product. The book returns, but its previous reading status is lost. |
| Fix | The verifier records the failure and adds a task. The builder fixes the behavior and releases again. |
| Finish | A new verification cycle passes. Lasting decisions move into the spec, and the change file is deleted. |

**The task list was complete. The user's workflow still failed. Kyspec makes that check part of finishing.**

The [example workflows](examples/workflows) walk through this change and four other situations.

## Compared with OpenSpec

This compares Kyspec's method with OpenSpec's documented standard workflow. OpenSpec supports customization; these are the choices Kyspec makes for you.

| Concern | OpenSpec | Kyspec |
| --- | --- | --- |
| Updating the current spec | Delta specs merged through sync or archive | Main spec updated in the implementing commit |
| Checking implementation | Optional, report-only verification against artifacts and code | Required fresh-thread check of released behavior for changed user-facing flows |
| Finishing a change | Move the change to an archive directory | Settle requirements and decisions, then delete the change |

The full comparison, with sources checked October 2026, is in [WHY.md](WHY.md#how-the-choices-differ), which also explains the tradeoffs and what prompted us to switch.

## Try Kyspec on your next change

Start with a small change you already need. The useful test is whether the next session can see what changed, why it changed, and how it was verified.

### 1. Copy the method and skills

Copy `METHOD.md` to your repository root. Copy the five chain directories under `skills/` into your coding agent's skills directory, preserving each `SKILL.md`; a repository arriving from OpenSpec also takes `kyspec-migrate`, for one run.

| Local coding agent | Repository location | Example invocation |
| --- | --- | --- |
| [Claude Code](https://code.claude.com/docs/en/skills) | `.claude/skills/` | `/kyspec-brainstorm <topic>` |
| [Codex](https://learn.chatgpt.com/docs/build-skills) | `.agents/skills/` | `$kyspec-brainstorm <topic>` |

For another host or a cloud session, use its supported skill installation mechanism. The workflow is written in Markdown; discovery paths and invocation syntax belong to the host.

### 2. Declare your product's rules

Add `## Method declarations` to `AGENTS.md`. Name the documents and skills your product actually uses. For example:

~~~markdown
## Method declarations

- **Principles:** docs/principles.md, numbered; specs cite principles #N.
- **Release:** /deploy for the API and site; /publish for the npm package.
- **Surface review:** /review-api for src/api/** and openapi.json; judge against docs/api-principles.md.
- **Coordination room:** the channel and procedure for claiming an area and announcing completion.
~~~

These are example declarations, not bundled release or review skills. Omit declarations that do not apply; the method defines their behavior in [Method declarations](METHOD.md#method-declarations).

### 3. Add the layout check (recommended)

Copy `check-layout.mjs` and run `node check-layout.mjs` in CI. It checks the structure of changes and ideas, including the rule against archived or date-prefixed changes. Reviewers and the finish workflow assess the requirements and evidence.

### 4. Start the work

Invoke `kyspec-brainstorm` for an idea, or ask your agent to use Kyspec to implement a named issue. The skills carry the work through planning, implementation, your release process, verification, and finishing.

Verification of a changed user-facing flow runs in a **fresh thread with access to the released product**. It requires another session; that independent check is part of the method.

## Moving from OpenSpec

**Keep your requirement prose and WHEN/THEN scenarios. Change where the knowledge lives and how work finishes.**

The full map, artifact by artifact, is [MIGRATING.md](MIGRATING.md), and the sixth skill, [`kyspec-migrate`](skills/kyspec-migrate/SKILL.md), runs it on a branch and records the migration as your first change. [`examples/migration`](examples/migration) shows one repository before and after. The transition is a repository edit; in outline:

1. **Reconcile the current behavior.** Fold already implemented delta requirements into the current specs. Keep unimplemented proposals separate.
2. **Move the specs into the Kyspec layout.** Use `specs/<capability>.md`, or `specs/<capability>/<capability>.md` when the capability has attachments. Keep requirement names and scenarios, and update links to moved specs.
3. **Convert active changes.** Use `changes/<name>.md` with exactly these sections: Why, Specs, Prior art, Decisions, Tasks, Surface review, Verification.
4. **Keep the decisions.** Move still-relevant design decisions into the owning spec's Design notes under stable `D-<capability>-N` IDs. Repoint code, test, and documentation references.
5. **Retire completed plans.** Ensure their contents are committed and their lasting requirements and decisions are retained before removing archived material from the working tree.
6. **Switch the instructions and check the layout.** Install the skills, add your declarations, update agent instructions to use Kyspec, and run the layout check.

For a repository with several products, use the product nesting described in [Three tiers](METHOD.md#three-tiers). The requirement format carries over; paths, change structure, and workflow commands change.

## How we use it at Kychee

Kyspec grew out of our day-to-day work on run402. We had shipped changes whose spec deltas still needed promotion, and code that cited decisions in archived plans. We wanted current contracts, durable rationale, and an explicit check of the released experience.

This is the method we now use at Kychee. Our release, review, and coordination details became declarations so you can use the same method with your own stack. Kyspec does not require run402.

We use it with parallel Claude Code and Codex sessions. One run402 change moved a protocol client into a shared package used by three consumers, across two npm releases. Its change file was under seventy lines.

## Read more

- [`METHOD.md`](METHOD.md): the rules, including the five skills, seven change sections, verification, and finishing.
- [`WHY.md`](WHY.md): the reasons for the method, its OpenSpec lineage, and adoption questions.
- [`MIGRATING.md`](MIGRATING.md): moving from OpenSpec, artifact by artifact.
- [`skills/`](skills): the five skills of the chain, and `kyspec-migrate`.
- [`check-layout.mjs`](check-layout.mjs) and [its tests](check-layout.test.mjs): the structural check.
- [`examples/`](examples): a product snapshot, worked workflows, and a migration before and after.

## Contributing

Open an issue for a page that misled your agent, a gap in the method, or a workflow it should cover. Kyspec is maintained in its source repository and mirrored here; pull requests are brought back to that source rather than merged in place.

## License and makers

MIT. Home: [kyspec.com](https://kyspec.com).

Made by [Kychee](https://www.kychee.com/), the team behind [run402](https://run402.com/). Evolved from [OpenSpec](https://github.com/Fission-AI/OpenSpec).

