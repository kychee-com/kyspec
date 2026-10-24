---
name: kyspec-brainstorm
description: Think an idea through with a partner who challenges it and grounds it in the repository's own code, specs and docs, ending in an idea file under ideas/ every time. Use for /kyspec-brainstorm, "let's think about X", "brainstorm X", or to continue an idea file. Accepts an idea file, --issue N, or a topic.
---

# /kyspec-brainstorm

The first step of the chain in `METHOD.md` "The chain". An idea is tier 3 (method "Three
tiers"): `ideas/<name>.md`, first line `status: seed | explored | parked | rejected | adopted`.
This page writes no spec, no change and no code. In a repository that nests by product (method
"Products"), every path here gains its `<product>/` segment.

**Input:** an existing idea file (continue it), `--issue N` (read the issue and its comments as
the seed, then explore outward from it), or a topic. The product is the one the repository or
the topic implies; ask once only when two are plausible.

## Stance

- **Challenge, don't flatter.** Name the riskiest assumption early and press on it. Say plainly
  when the idea duplicates something that exists, costs more than it returns, or solves a
  problem nobody reported.
- **Ground it.** Before saying how something would fit, read the code and the spec that govern
  it. Grep `specs/` Design notes and `ideas/` for earlier thinking and bring it in; name an
  open change under `changes/` that overlaps.
- **Follow the user's thread.** Two or three related questions a turn, not a march through
  topics. Diagrams when they make a shape clearer than prose.

## Steps

1. **Gather, then digest.** Take every reference the user names (repositories, docs, URLs,
   issues, a research document) and read all of it before discussing. Summarize what you
   learned in a few lines, then start.
2. **Explore.** Over the conversation, touch the problem (who feels it, how they cope today),
   the reader or user it serves, the idea walked through end to end, the smallest useful cut,
   and what it depends on that nobody here controls. What is not settled is an open question,
   never a decision.
3. **The differentiator.** Name the one thing that makes the idea worth doing and lay out two or
   three distinct approaches to it: how each works, its pros and cons, when it wins. Record the
   pick and why the others lost. If there is genuinely one way, say so in a line instead of
   inventing alternatives.
4. **The business side, only if there is one.** When the idea has a business side, offer a lean
   canvas (problem, customer segments, unique value proposition, solution, channels, revenue,
   costs, key metrics, unfair advantage) and keep only the blocks actually discussed. An
   engineering idea skips it.
5. **Write the file, every time,** even five lines at `status: seed`. The one exception: the
   user explicitly says to drop the idea, and then nothing is written. The shape, every part
   optional after the first two:
   - first line `status: <value>`; `parked` and `rejected` carry the reason
     (`status: parked — waits on the postage design`)
   - `# <title>`, then the problem and who has it, in a few sentences
   - the idea; the approaches and the pick; prior art (spec D-ids, the product's principles by
     number, sibling ideas) as links; the lean canvas; open questions; references (a research
     document is linked, never pasted)
   `seed` is a first sketch; `explored` means the problem, idea, differentiator and smallest cut
   are settled; `parked` and `rejected` keep their reason so a later session can disregard the
   idea knowingly.
6. **Self-review before presenting.** No TBD or hand-waves: make each concrete or an open
   question. The decisions match the idea. Nothing is in the file that was not discussed. A
   planner could turn it into requirements. Fix what fails, show the file, and ask once for
   changes.
7. **Keep it.** Commit the file the way the repository's `AGENTS.md` says (an idea left
   uncommitted in a workspace is lost when the workspace goes).

## End

State the path and the status, and name the next step: `/kyspec-plan <name>` for an explored
idea the user wants built; nothing for a seed still growing, or a parked or rejected idea.
