# adopt-kyspec

Source: the move from OpenSpec 1.15 to Kyspec (MIGRATING.md).

## Why

The next session should find the current requirements, the decisions behind them, and the work in flight, in that order, without reading an archive. After this change the repository holds `specs/`, `changes/` and `AGENTS.md` declarations in the Kyspec layout, the five `kyspec-*` skills, and no `openspec/`.

## Specs

No requirement changed. `openspec/specs/reading-list/spec.md` moved to `specs/reading-list.md` with its text intact and gained a Design notes section.

## Prior art

- `openspec/changes/archive/2026-09-30-unique-titles/design.md` — keep: its decision still governs `src/api/books.js` (the case-insensitive title check); lifted as D-reading-list-1.
- `openspec/changes/archive/2026-08-15-add-books/design.md` — not carried: the JSON file store it decided was replaced by SQLite in September, and nothing cites it.
- `openspec/config.yaml` context and rules — keep: the project context moved into AGENTS.md; "tests first" and "name the reader" are what the skills ask anyway.

## Decisions

- **D1: The archive is deleted, not moved.** Its one living decision is in the spec as D-reading-list-1 and cited from there; the rest is history, and git holds it. Rejected: keeping `openspec/changes/archive/` as a read-only folder (the layout gate refuses an archive, and nobody reads it).
- **D2: The active change archive-a-book converts without shipping anything.** Its ADDED requirement stays under the change's Specs until the code lands, then moves into the spec in that commit. Rejected: merging the delta into the main spec now (the spec would describe a route that does not exist).
- **D3: No principles document yet.** Lantern has three rules in AGENTS.md and nothing a spec needs to cite by number; a principles document comes when a decision first needs to cite one.

## Tasks

- [x] No shipped change was waiting in `openspec/changes/`; nothing to archive first — checked 2026-10-26
- [x] Spec moved; links fixed; read against `src/api/books.js` — c1a2b3d
- [x] D-reading-list-1 lifted from unique-titles; `grep -rn openspec/changes src test docs` clean — d2b3c4e
- [x] archive-a-book converted to the seven sections — e3c4d5f
- [x] `git rm -r openspec/` — f4d5e6a
- [x] `openspec-*` skills and `opsx` commands removed; `METHOD.md` and `kyspec-*` skills installed; Method declarations in AGENTS.md — a5e6f7b
- [x] `node check-layout.mjs` ok — a5e6f7b

## Surface review

Surface review: N/A — the method's own files only; no route, page or client changed.

## Verification

Pending.
