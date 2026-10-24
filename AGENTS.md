# AGENTS.md

Kyspec is a method, not a program. `METHOD.md` is the theory, `skills/` holds the five pages,
`check-layout.mjs` is the one gate, and `examples/` shows the method on a toy product. There is
no build and no dependency.

- `npm test` runs the gate's tests; `npm run check` runs the gate over `examples/lantern`.
- `METHOD.md` is this repository's own spec. A skill edit that changes the contract changes
  `METHOD.md` in the same commit (method #1); the reasoning behind a departure from OpenSpec
  lives in `WHY.md` "Each departure and its reason", and a new one is added there.
- The examples pass the gate. `examples/lantern` is a snapshot of a product in the middle of a
  change, and stays one; its README says where in the chain it stands.
- Every page stays short (method #9). A skill that grows past one page is doing a tool's job.
- Kyspec is edited in its maintainer's source repository and mirrored here. Issues are
  welcome; a pull request is pulled back by hand.
