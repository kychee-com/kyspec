---
name: lantern-api-review
description: Review a diff that touches Lantern's API (src/api/** or openapi.json) against docs/api-style.md and write the `## Surface review` section of the change file. Use for /lantern-api-review <range>, or when kyspec-plan or kyspec-implement names it.
---

# /lantern-api-review

The surface review `AGENTS.md` "Method declarations" declares. It reads the diff (`<range>`,
or the working tree), every file under `src/api/` and `openapi.json` the diff changes, and the
code around them, with `docs/api-style.md` as its rubric. It never reads the change's prose to
decide a verdict.

Write, as the change's `## Surface review`:

```
Range: <from>..<to>
Checked: <every surface file read>

- Verbs: pass | concern <file:line> | n/a — a route is a noun with GET/POST/PATCH; no DELETE on books (principles #2)
- Errors: pass | concern | n/a — one code per condition, `404 BOOK_NOT_FOUND` for an unknown id, idempotent repeats answer 200
- Docs: pass | concern | n/a — openapi.json names every route, query and error the diff adds or changes

Verdict: pass | concerns | fail — <one sentence>
```

`fail` is fixed before the push. `concerns` ships; the concerns are the author's call.
