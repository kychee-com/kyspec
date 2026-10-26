# Why Kyspec

**We wanted the next agent to find the current requirements, the decisions behind them, and evidence that the last change worked.**

Kyspec is the [OpenSpec](https://github.com/Fission-AI/OpenSpec) spin-off we use at [Kychee](https://www.kychee.com/) to build [run402](https://run402.com/), our open-source backend for AI agents, and our other products. It captures the way we plan, implement, review, release, and finish work.

If you already use OpenSpec, you already value specifications. The question is what happens as changes ship, decisions accumulate, and a new agent picks up the next task. Kyspec makes explicit choices about that handoff: update the spec with the code, keep the rationale in the spec, and require a fresh agent to check changed user-facing behavior before finishing.

[README.md](README.md) has the quick start and migration guide. [METHOD.md](METHOD.md) defines the rules.

## The bet

Every spec-driven framework encodes a belief about the model it was written for. The frameworks of 2025 believed the model would wander, so they fenced it: a CLI to validate what it wrote, templates to fix the shape of what it wrote, an artifact graph to say what it may write next, delta files so it never touched the main spec directly, and an archive so nothing it produced was lost. For the models of 2025 that belief was right, and the fences bought real discipline.

Kyspec encodes a different belief: the model is now the most capable reader and writer in the repository, and the way to get its best work is to put nothing between it and the file. Give it the current spec beside the code, a small unit of work with a clear end, a reviewer that is not itself, and a few mechanical gates for the structure that must hold. Then trust it.

The rails that helped a weaker model now cost a stronger one in five places:

1. **Expressibility.** A template gives every change the same four files, whether it renames a field or adds a subsystem. The model pads the small one and compresses the large one. In Kyspec a change is one file with seven sections, any of which may be one line, and a commit that touches no spec and carries no decision needs no file at all.
2. **Throughput.** An artifact graph serializes thinking into proposal, then specs, then design, then tasks, each a round trip through a tool that prints the instructions for the next step. A model that can hold the whole change in one context is made to drip it out in four. In Kyspec each step is one page, and the model does the step.
3. **Imagination.** Delta blocks make the model think in text diffs instead of system behavior, and a workflow that starts at "propose" skips the part where the idea is challenged. Kyspec starts with a brainstorm whose partner challenges rather than flatters and must end in an idea file with the alternatives and the pick, and the plan must search prior art and mark each hit keep or override.
4. **Implementation quality.** A merge nobody reads lets the spec drift from the code within weeks. When the model edits the main spec in the commit that satisfies the requirement, the reviewer sees the contract and the implementation in one diff, and a fresh agent that never saw the diff then checks the released product the way a user would.
5. **Context quality.** An archive of dated proposals is dead weight in every grep and every context window, and a model reads a stale plan as if it were live. Kyspec deletes the change once the spec has absorbed it and leaves the history to Git.

Loosening the shackles is not lowering the bar. Kyspec trades validation for gates and narrative for evidence: a task line carries a SHA, a count or a dated live check, or it is open, and done means verified by someone who did not build it. The bar moves from the shape of the artifacts to the truth of the spec and the evidence of the release.

## What made us change

We used OpenSpec while building run402. It gave us a useful distinction between the system's current specification and the work intended to change it. We kept that distinction.

Over time, we found two problems in our own repository:

- **Shipped behavior was still waiting to become the main specification.** We had implemented delta requirements that needed a separate cleanup pass to promote them into the live specs.
- **Code cited decisions in archived change files.** Those plans retained historical reasoning, but their paths had become references from code to prose we no longer maintained.

We also wanted a clearer answer to "is this done?" Completing implementation tasks and collecting a green CI run were useful evidence. We wanted changed user-facing flows to be checked through the released product by a session that had not built them.

Those needs shaped Kyspec. We made the current spec part of the implementation commit, moved lasting decisions into that spec, and made fresh verification part of finishing user-facing work. Then we reduced the workflow to five short skills and one change file.

The result is our working method, with product-specific details expressed as declarations so another team can use it.

## What you get by switching

### 1. The requirement ships with the code

A Kyspec change carries the intended requirements in its Specs section. When a requirement is implemented, the main spec changes in the same commit as the code that satisfies it.

That makes the contract reviewable alongside the implementation. A later session can start from the current spec without first finding a shipped delta that still needs promotion.

OpenSpec provides separate sync and archive operations for merging delta specs. Kyspec chooses a different rule: keeping the main spec current is part of implementing the change.

The review now covers the requirement and implementation together, and the separate synchronization step we had been postponing is gone.

### 2. A fresh agent checks the released experience

For every changed user-facing flow, Kyspec requires a verifier in a fresh thread that did not write the code.

The verifier reads the change's Why and Specs, along with the specs they name. It uses what the user can use: the released app, or public documentation and published clients for a developer-facing product. It checks production or a deployed branch. It never reads the implementation diff.

For each requirement, it records what it observed and whether the result passed, failed, or was blocked. Failures become tasks for the builder. The builder fixes and releases; a new verification cycle checks the result, up to a budget of five cycles by default, and the loop stops early when a cycle makes no progress.

This matters because a builder can carry the same mistaken interpretation into the implementation and its tests. A fresh thread starts from the requirement and has to demonstrate the behavior through the product.

OpenSpec also offers verification. Its documented verify workflow examines implementation against artifacts and produces an advisory report. Kyspec specifically requires this fresh-thread, user-perspective check for changed user-facing flows.

That check takes another session and access to a released product. We consider the additional evidence worth the cost. Changes without a user-facing flow can skip it with a recorded reason; the method also defines how to handle scenarios the verifier cannot reach.

### 3. Decisions survive where they are needed

A proposal has a short useful life. The decisions it contains may govern the system for years.

Before a Kyspec change is deleted, every decision that still governs the code moves into the owning spec's Design notes. It receives a stable ID such as `D-auth-4` and keeps its rationale and rejected alternative. Code, tests, and documentation can cite that ID.

The next plan must search the relevant principles, requirements, decision IDs, and ideas before making its own decisions. It marks relevant prior art `keep` or `override`, and explains each override.

This gives a later agent both the current rule and a reason to respect it. Changing direction remains possible; silently rediscovering or contradicting an existing decision becomes a reviewable defect.

### 4. Completed plans leave the working tree

Kyspec keeps current requirements and active work easy to find. A finished change is deleted after its lasting contents have been settled into the specs.

That deletion has conditions. Tasks need evidence. Requirements must be implemented or explicitly removed from scope. Continuing decisions must be retained, and references must point to their new home. Verification must satisfy the method's completion rules.

The change's previous versions remain in Git. Its ongoing requirements and rationale remain in the live spec. The working tree no longer needs a second collection of finished plans to represent that history.

The next session gets a clearer starting point: current contracts and active work, with historical planning available through Git when it needs it.

### 5. The process fits inside the repository

Kyspec uses one change file with seven sections: Why, Specs, Prior art, Decisions, Tasks, Surface review, and Verification. Each section can be one line. Work that touches no spec and carries no decision, such as a typo fix, needs no change file.

Five skills guide the work. The model reads their instructions and edits the files directly. There is no Kyspec workflow CLI, runtime template lookup, or artifact dependency graph to operate.

The structure is still explicit. The change has required headings. The layout check validates the rules it can check mechanically. Reviewers assess the reasoning and evidence, and the verifier exercises the released behavior.

For us, this is a useful division of responsibility: a compact written method, small structural checks, and direct scrutiny of the product.

## What we keep from OpenSpec

OpenSpec supplied foundations we still use:

- **Current specs and planned changes have different jobs.** The spec describes the system; the change describes work in progress.
- **Requirements have scenarios.** Stable `### Requirement: <name>` headings, `SHALL` statements, and `#### Scenario:` blocks with `WHEN` and `THEN` make the intended behavior concrete.
- **A change is a bounded unit of work.** It has an outcome and a task list, so it can reach an end.
- **The agent follows a reusable workflow.** People can invoke a skill and let the agent carry out the method.

The familiar requirement format is why existing OpenSpec work can be reused. The migration changes the layout and lifecycle around that work.

## How the choices differ

OpenSpec is configurable. Kyspec packages a particular way of working, so a team can adopt these conventions together.

| Choice | OpenSpec's documented workflow | Kyspec's method |
| --- | --- | --- |
| Planning artifacts | A schema defines artifacts; the default includes proposal, specs, design, and tasks | One change file with seven fixed sections |
| Spec updates | Delta requirements can be synchronized before or during archive | Implemented requirements enter the main spec with their code |
| Verification | Optional workflow checking artifacts against implementation; report-only | Fresh thread checks released user-facing behavior; the finish workflow requires the result |
| Lasting rationale | Technical decisions recorded in the change's design artifact | Continuing decisions folded into the live capability spec |
| Exploration | Explore workflow investigates ideas before a proposal | Brainstorm leaves a persistent idea file unless explicitly told to drop it |
| Completion history | Completed change folders move into an archive | Completed change files are removed after their lasting contents are retained |

OpenSpec users can customize their process, and some may already follow similar disciplines. Kyspec's value is making these choices the standard method you install and use.

This comparison follows OpenSpec's [command reference](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md), [profiles](https://openspec.dev/docs/profiles), [skill contracts](https://openspec.dev/docs/skills), and [schemas](https://openspec.dev/docs/schemas), checked October 2026.

## Questions before switching

### Can I keep my existing specs?

Yes. Keep the requirement prose and WHEN/THEN scenarios, and review them against what the system currently does. Reconcile shipped deltas before moving to the Kyspec layout.

Active changes need the seven-section format. Lasting decisions need a home in the current spec, and references to old change paths need updating. [MIGRATING.md](MIGRATING.md) maps every artifact and gives the order; the `kyspec-migrate` skill runs it. This is a change of method and layout, with reusable source material.

### Why not configure OpenSpec to work this way?

Kyspec packages the complete method as five skill files: direct edits to the main spec, one temporary change file, lasting decision IDs, and fresh verification of user-facing releases.

Many of these practices can also be added to OpenSpec. We wanted them together as the standard way of working, with the instructions available directly as skill files. Kyspec lets another team adopt that whole method.

### Does deleting a change lose useful information?

The finish checklist preserves the information that continues to matter before deleting the temporary change file.

Requirements belong in the spec. Continuing decisions and their rationale belong in Design notes. Useful idea context moves into the spec's Purpose. References are updated before the change is deleted, and committed versions of the change remain in Git.

The method depends on doing that transfer properly. The finish workflow and the reviewer check it.

### Does CI enforce the entire method?

The bundled `check-layout.mjs` enforces layout: the permitted change shape and sections, idea status lines, and the rules against archives and date-prefixed changes.

The reviewer and the finish workflow judge whether requirements are implemented, evidence is adequate, and continuing decisions have been preserved. A layout check cannot by itself establish those facts.

That boundary is explicit in [METHOD.md's Gates section](METHOD.md#gates). Products can add their own mechanical checks and declare their surface-review process.

### Will the agent follow five Markdown skills reliably?

The skills tell the agent how to work. Their results still need checks.

Kyspec puts those checks at specific points: review the spec with the code, record evidence against tasks, run the layout gate, apply the declared surface review, and use a fresh verifier for changed user-facing flows. The finish workflow checks what is present before completing the change.

The method assumes capable agents and fallible work. Independent verification is part of the design.

### Does it work with pull requests, people, and parallel agents?

The method can fit a repository that uses pull requests or direct pushes; the repository's own instructions determine how work lands. People can follow the same change format and verification rules.

For parallel work, a product can declare a coordination room where sessions claim an area and announce progress. Release skills, review skills, principles, and coordination are supplied by your product through `AGENTS.md`. The five Kyspec skills read those declarations.

### Do I need run402?

No. We developed Kyspec while building run402 and use it across Kychee's work. Your product supplies its own release, review, and coordination instructions. Kyspec has no dependency on the run402 platform.

## Try the method on a real change

Choose a small user-facing improvement you already intend to ship. Follow the [setup and migration instructions](README.md#try-kyspec-on-your-next-change), then take it through planning, implementation, release, fresh verification, and finish.

At the end, inspect what the next session receives: a current requirement, the decisions behind it, code that implements it, and a Git history containing the work and its verification evidence.

**That is what we want from spec-driven development, and it is how we work at [Kychee](https://www.kychee.com/) and [run402](https://run402.com/).**

