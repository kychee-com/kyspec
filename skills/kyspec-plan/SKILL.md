---
name: kyspec-plan
description: Write a change file, changes/<name>.md, with its seven sections (Why, Specs, Prior art, Decisions, Tasks, Surface review, Verification) from an idea file, a GitHub issue, or a topic, grounded in a real prior-art search. Use for /kyspec-plan, "plan X", "write the change for issue N", or as the first step of "implement owner/repo#N".
---

# /kyspec-plan

Step two of `METHOD.md` "The chain". The contract for a change file is method "A change";
this page says how to write one. In a repository that nests by product (method "Products"),
every path here gains its `<product>/` segment.

**Input:** an idea (`ideas/<name>.md`), an issue (`owner/repo#N`, read with its comments), or
a topic. Name the change in kebab-case after the outcome, not the mechanism. Ask once only when
two products are plausible.

**Below the line, stop.** A commit that touches no spec and carries no decision (a typo, a
dependency bump, a test fix) needs no change file (method "A change"). Say so and make the
commit; when the request was "implement …", just do the work, outside the chain.

## Steps

1. **Read before writing:** the source, the specs it names or implies under `specs/`, and the
   code those specs govern. When no spec owns the behavior, name the spec that should: the
   nearest one, or a new one marked `(new)`. If a change for this work already exists
   (`changes/<name>.md`, or `changes/<name>/<name>.md`), continue it instead of starting
   another.
2. **Surface planning.** If the repository's `AGENTS.md` "Method declarations" declares a
   surface review and the change could alter what its paths serve (a response, an error, a
   client, its docs), even from code outside them, read method "Before planning a surface
   change" and the documents the declaration names, now and again before implementing.
3. **Prior art is a real search,** not memory: the `## Design notes` D-ids and the requirements
   of the specs in the area, `ideas/` on the topic, and the declared principles in play. Each
   relevant hit gets one line marked `keep` or `override`; every override is restated as a
   decision. Drift found on the way (a spec the code contradicts) that this change does not fix
   becomes an issue or an idea, named in one line.
4. **Write `changes/<name>.md`** with exactly these H2 sections, in this order (the layout
   gate enforces it). An H1 title and a `Source:` line naming the issue or idea may precede
   them. Ceremony scales with the change; any section may be one line.
   - `## Why`: the problem, who it serves, and the outcome someone could observe. No
     implementation.
   - `## Specs`: each target spec path (existing, or `(new)`), then the requirements and
     scenarios this change intends, in that spec's own form (the requirement, then
     `WHEN … THEN …` scenarios) and the present tense the spec will carry. Write scenarios the
     product's user can exercise with ordinary means; one that only a test can reach says so.
   - `## Prior art`: the lines from step 3.
   - `## Decisions`: `D1`, `D2`, …, each stating what is decided, why, and the alternative it
     rejects.
   - `## Tasks`: `- [ ]` lines small enough to tick with evidence; tests first where the
     repository's convention asks; for a public surface, the blast radius `AGENTS.md` names.
   - `## Surface review`: when step 2 applies, the planning note method "Before planning a
     surface change" asks for (surface, rules in play, clients and docs that move with it,
     deviations), which implement replaces with the review of the diff; otherwise
     `Surface review: N/A — <a concrete reason>`.
   - `## Verification`: `Pending.`; kyspec-implement fills it.
   A change that needs attachments (a spike script, evidence) is a directory `changes/<name>/`
   with `<name>.md` beside them.
5. **Adopt the idea.** When the source was an idea file, set its first line to
   `status: adopted — changes/<name>.md`.
6. **Claim the area** in the coordination room, only if `AGENTS.md` declares one, the way it
   says; best-effort, never blocking. Implement renews this claim rather than taking a second.
7. **Commit and push** only the change file and the idea's status line, the way `AGENTS.md`
   says, so a parallel session can see the plan.

## End

Name the path and the next step: `/kyspec-implement <name>`. When the chain runs in one
thread, go straight on.
