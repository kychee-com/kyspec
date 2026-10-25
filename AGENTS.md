# AGENTS.md

Kyspec is a method, not a program. `METHOD.md` is the theory, `skills/` holds the five chain
pages and `kyspec-migrate`, `MIGRATING.md` is the map from OpenSpec, `check-layout.mjs` is the
one gate, and `examples/` shows the method on a toy product, before and after a migration. There is
no build and no dependency.

- `npm test` runs the gate's tests; `npm run check` runs the gate over `examples/lantern` and
  `examples/migration/after`.
- `METHOD.md` is this repository's own spec. A skill edit that changes the contract changes
  `METHOD.md` in the same commit (method #1); the reasoning behind a departure from OpenSpec
  lives in `WHY.md` "Each departure and its reason", and a new one is added there.
- The examples pass the gate. `examples/lantern` is a snapshot of a product in the middle of a
  change, and stays one; its README says where in the chain it stands. `examples/migration`
  keeps `before/` as an OpenSpec 1.15 layout on purpose; only `after/` is a Kyspec layout.
- Every page stays short (method #9). A skill that grows past one page is doing a tool's job.
- Kyspec is edited in its maintainer's source repository and mirrored here. Issues are
  welcome; a pull request is pulled back by hand.
