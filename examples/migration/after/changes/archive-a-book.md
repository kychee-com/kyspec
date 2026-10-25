# archive-a-book

Source: lantern#12 ("I want to hide books I gave up on without losing my notes")

## Why

A reader who gives up on a book can leave it on the list forever or delete it and lose the
notes. Neither is what they asked for. After this change a reader archives a book from the page
or the API; it leaves the list, keeps its notes, and can come back with the status it had.

## Specs

### specs/reading-list.md

- An archived book leaves the list and keeps its notes: `POST /books/:id/archive` SHALL set `archived_at` and remove the book from `GET /books`; `GET /books?archived=true` SHALL list archived books, newest archive first, with their notes; `POST /books/:id/unarchive` SHALL clear `archived_at` and return the book to the list with the status and notes it had. There is no `DELETE /books/:id`.
  - WHEN a reader archives a book that has notes THEN the book is absent from `GET /books`, present in `GET /books?archived=true`, and its notes are intact
  - WHEN a reader archives an already archived book THEN the API answers `200` with the book unchanged
  - WHEN a reader unarchives a book THEN it returns to `GET /books` with the status and notes it had when archived

## Prior art

- specs/reading-list.md "Reading status moves forward and back" (a closed set of three) — keep: archived is not a fourth status.
- AGENTS.md "Books are never deleted" — keep: archive is the only way off the list; no `DELETE` route.
- D-reading-list-1 (titles unique per list) — keep: an archived title still counts as on the list for duplicates; a decision below says so.

## Decisions

- **D1: Archive is a verb route, `POST /books/:id/archive` with `POST /books/:id/unarchive`, not a fourth status and not a delete.** A status would leak archived books into every status filter; a delete loses the notes. Rejected: `PATCH /books/:id { archived: true }` (a flag every list view would have to know about).
- **D2: Archived books are listed by `GET /books?archived=true`, never mixed into the default list.** One list route and one filter, so the page and the export share the query. Rejected: a separate `/archive` collection (a second list route to keep in step with the first).
- **D3: An archived title still refuses a duplicate.** The reader meant the same book; unarchiving it is the answer the `409` points at. Rejected: letting a second copy in (two books, one history).

## Tasks

- [ ] Tests: archive removes from the list, keeps notes, is idempotent; unarchive restores the book with its status
- [ ] `POST /books/:id/archive`, `POST /books/:id/unarchive`, `GET /books?archived=true`, with `openapi.json`; the requirement moves into `specs/reading-list.md` in the same commit
- [ ] The page: archive on every book, an Archived view with unarchive

## Surface review

Planning note: the surface is `src/api/books.js` and `openapi.json` (two new routes, one new query); rules in play are the verb rule (POST verb routes on the book, no DELETE) and one error code per condition (`404 BOOK_NOT_FOUND`, a second archive answers `200`); `openapi.json` moves with the routes. `/lantern-api-review` replaces this note with the review of the diff.

## Verification

Pending.
