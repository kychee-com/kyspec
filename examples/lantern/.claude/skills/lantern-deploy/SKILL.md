---
name: lantern-deploy
description: Build Lantern and deploy it to https://lantern.example, then check it live and report the deploy id. Use for /lantern-deploy, or when kyspec-implement runs the Release step.
---

# /lantern-deploy

The release skill `AGENTS.md` "Method declarations" declares.

1. `npm test`, then `npm run build`.
2. `npm run deploy`, which prints a deploy id (`d_NNNN`).
3. Live check: `GET https://lantern.example/books` answers `200`, and any route the diff added
   answers as its spec says.
4. Report one line for the change's `## Verification`: the deploy id, the URL, the date, and the
   live check.
