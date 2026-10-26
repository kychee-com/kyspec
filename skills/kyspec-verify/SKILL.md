---
name: kyspec-verify
description: Verify a released change as its user would, in a fresh thread that did not write the code - from the change's Why and Specs and only what the product's user has, against production or the deployed branch, never the diff - and append a dated cycle to the change's Verification. Use for /kyspec-verify <change>, or when kyspec-implement names it.
---

# /kyspec-verify

**Hard rule: this runs in a fresh thread that did not write the code.** If this thread planned,
built or reviewed the change, stop here and start a fresh agent or session given only the change
name (method #7).

The optional step of `METHOD.md` "The chain", required when the change touched a user-facing
flow: the surface the repository's `AGENTS.md` "Method declarations" declares, or any UI flow.
Its definition is method "Verify". In a repository that nests by product (method "Products"),
every path here gains its `<product>/` segment.

**Input:** the change name. Read only the change's `## Why`, its `## Specs` (and the main specs
those name: a requirement already moved is read there), and its `## Verification` for the
environment and the earlier cycles. Nothing else of the change, no diff, no commits, no source.

## Steps

1. **Scope.** List the requirements and scenarios to check, one line each, by spec path and
   requirement name. That list is the cycle's scope; never widen it to whatever the product
   happens to do. A scenario no user can reach by ordinary means (fault injection, a scale or
   paid plan the user would not buy for this) is listed as `out of reach — <why>`, outside the
   verdict, so a later cycle does not chase it.
2. **Be the user.** Hold only what the product's user holds: its public docs and published
   clients for a product whose users are agents or developers, the app in a browser for one used
   by people. No repository source, no staff credentials, no internal endpoints, unless this
   product's user has them too. Spend nothing beyond the product's free path, and remove what
   you create the way `AGENTS.md` says, so no human decision is left behind.
3. **Use the released thing,** against production or the deployed branch that Verification
   names, never a local build. For each scenario, do the WHEN, observe the THEN, and keep what
   you saw (the command and its output, the URL and the response, the screen). A scenario in
   reach that you could not exercise this time is `blocked — <why>`, never a pass.
4. **Append the cycle** under `## Verification`:

   ```
   Verify cycle <n> of <N> — <YYYY-MM-DD>, <who ran it>, against <environment>
   Scope: <spec path: requirement>, …   Out of reach: <requirement — why>, …
   - <requirement>: pass | fail | blocked — <what was observed>
   Verdict: pass | fail
   ```

   `N` is the budget: five, or the `Verify budget: N — <reason>` line under Verification. The
   verdict is `pass` only when every in-scope item passes. When an item fails with the same
   observation as in the cycle before, write `Verdict: fail — no progress on <requirement>`,
   so the driving thread stops instead of trying again (method "Verify").
5. **On a failure or a block,** add one unchecked task per item under `## Tasks`, naming the
   requirement and what was observed, for kyspec-implement. Fix nothing here.
6. **Commit** the change file the way `AGENTS.md` says.

## End

Verdict `pass`: name `/kyspec-finish <name>`. Verdict `fail`: name `/kyspec-implement <name>`,
which releases the fix and comes back here, to a fresh thread, for the next cycle.
