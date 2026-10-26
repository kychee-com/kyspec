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

- **D1: Archive is a verb route, `POST /books/:id/archive` with `POST /books/:id/unarchive`, not a fourth status and not a delete.** A status would leak archived books into every status filter (D-reading-list-2); a delete breaks principles #2. Rejected: `PATCH /books/:id { archived: true }` (a flag every list view would have to know about).
- **D2: Archived books are listed by `GET /books?archived=true`, never mixed into the default list.** One list route and one filter, so the page and the export share the query. Rejected: a separate `/archive` collection (a second list route to keep in step with the first).

## Tasks

- [x] Tests: archive removes from the list, keeps notes, is idempotent; unarchive restores the book — 4 tests, 9f3c2a1
- [x] `POST /books/:id/archive`, `POST /books/:id/unarchive`, `GET /books?archived=true`, with `openapi.json` for both routes and the `archived` query; the requirement moved into `specs/reading-list.md` in the same commit — 9f3c2a1
- [x] The page: archive on every book, an Archived view with unarchive — 2b7e4d0
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
