# Migration example

The Lantern reading list twice: [`before/`](before) as an OpenSpec 1.15 repository, [`after/`](after)
as the Kyspec tree [MIGRATING.md](../../MIGRATING.md) produces from it. Thirteen small files;
diff the two directories to see every move.

What `before/` holds, and where each part lands:

| Before | After |
| --- | --- |
| `openspec/specs/reading-list/spec.md` | `specs/reading-list.md`, text unchanged, plus a Design notes section |
| `openspec/changes/archive-a-book/` (proposal, design, tasks, a delta spec): planned, not shipped | `changes/archive-a-book.md`, seven sections; its ADDED requirement waits under Specs until the code lands |
| `openspec/changes/archive/2026-09-30-unique-titles/design.md`: a decision the code still obeys | `D-reading-list-1` in the spec's Design notes |
| `openspec/changes/archive/2026-08-15-add-books/design.md`: a decision the code no longer obeys | nothing; git keeps it, and the migration change says why |
| `openspec/config.yaml` | `## Method declarations` in `AGENTS.md` |
| the whole migration | `changes/adopt-kyspec.md`, the repository's first change, deleted by `/kyspec-finish` after the merge |

Not shown: the `.openspec.yaml` files, the installed `openspec-*` skills and `opsx` commands,
and the source code. `node check-layout.mjs examples/migration/after` passes; the `before/`
tree is not a Kyspec layout and is not checked.
