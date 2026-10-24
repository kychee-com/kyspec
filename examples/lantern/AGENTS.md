# AGENTS.md

Lantern is a reading list: an HTTP API under `src/api/` and one page under `src/web/` that
calls it. Node 22, no framework. `npm test` runs the unit tests. `METHOD.md` at the root is the
method; the five `kyspec-*` skills and the two Lantern skills are under `.claude/skills/`.

## Method declarations

- **Principles:** `docs/principles.md`, numbered; specs and changes cite `principles #N`.
- **Release:** `/lantern-deploy` (builds, deploys to https://lantern.example, records the
  deploy id and a live check).
- **Surface review:** `/lantern-api-review`, for a diff touching `src/api/**` or
  `openapi.json`, judged against `docs/api-style.md`.

No coordination room: one session works this repository at a time.

## Rules

- Commit to `main` in small commits and push; CI runs `npm test` and `node check-layout.mjs`.
- A change to a route moves `openapi.json` in the same commit (the blast radius for Tasks).
- Books are never deleted (principles #2); a route that deletes one is refused in review.
