# archive-a-book

Source: lantern#12 ("I want to hide books I gave up on without losing my notes")

## Why

A reader who gives up on a book has two choices today: leave it on the list forever, or delete
it and lose the notes. Neither is what they asked for. After this change a reader archives a
book from the page or the API; it leaves the list, keeps its notes, and can come back with the
status it had.

## Specs

### specs/reading-list.md

- An archived book leaves the list and keeps its notes → in specs/reading-list.md

## Prior art

- principles #2 (nothing is deleted) — keep: archive is the only way off the list; no `DELETE` route.
- principles #3 (the API is the product) — keep: the page's archive button is `POST /books/:id/archive`, nothing more.
- D-reading-list-2 (status is a closed set of three) — keep: archived is not a fourth status.
- ideas/shared-lists.md — no overlap; noted there that a share follows the default list, which excludes archived books.

## Decisions

Both are in `specs/reading-list.md`: D-reading-list-3 (archive is a verb route) and D-reading-list-4 (archived books are a query filter).

## Tasks

- [ ] Verify cycle 1: unarchive returned the book with status `to-read`; it was `reading` when archived (specs/reading-list.md "Unarchiving") — observed on https://lantern.example, 2026-10-20

## Surface review

Range: 4c1d9e2..2b7e4d0
Checked: src/api/books.js, openapi.json

- Verbs: pass — archive and unarchive are `POST` verb routes on the book; no `DELETE` added.
- Errors: pass — an unknown id answers `404 BOOK_NOT_FOUND` on both routes, as every `/books/:id` route does; a second archive is `200`, not `409`.
- Docs: pass — `openapi.json` names both routes and the `archived` query with its default.

Verdict: pass

## Verification

Release: 2b7e4d0 on main, CI run 118 green; `/lantern-deploy` d_0421 live at https://lantern.example (2026-10-20, `GET /books?archived=true` answers `200 []`).

Verify cycle 1 of 5 — 2026-10-20, a fresh session, against https://lantern.example
Scope: specs/reading-list.md: An archived book leaves the list and keeps its notes (Archiving, Archiving twice, Unarchiving)
- Archiving: pass — `POST /books/b_17/archive` → `200`; absent from `GET /books`; present in `GET /books?archived=true` with its 2 notes intact
- Archiving twice: pass — second `POST` → `200`, body identical to the first
- Unarchiving: fail — the book returned to the list with status `to-read`; it was `reading` before the archive
Verdict: fail
