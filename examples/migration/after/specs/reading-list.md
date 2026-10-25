# reading-list Specification

## Purpose

The list of books a reader keeps, with a reading status and notes per book: adding, moving a
book through its statuses, and the list views the page and the API serve.

## Requirements

### Requirement: A book is added by title

The API SHALL accept `POST /books { title, author? }` and answer `201` with the book, status
`to-read`, at the top of the list. A title already on the list SHALL answer `409 BOOK_EXISTS`
naming the existing book's id.

#### Scenario: Adding a new title

- **WHEN** a reader posts a title not on the list
- **THEN** the book appears at the top of `GET /books` with status `to-read`

#### Scenario: Adding a duplicate

- **WHEN** a reader posts a title already on the list, in any letter case
- **THEN** the API answers `409 BOOK_EXISTS` with the existing book's id, and the list is unchanged

### Requirement: Reading status moves forward and back

`PATCH /books/:id { status }` SHALL accept exactly `to-read`, `reading` and `read`, in any
order, and answer `200` with the book. Any other value SHALL answer `400 INVALID_STATUS`
listing the three.

#### Scenario: Starting a book

- **WHEN** a reader patches a `to-read` book to `reading`
- **THEN** the book shows `reading` on the list and on the page's Reading column

## Design notes

- **D-reading-list-1. Titles are unique per list, compared case-insensitively after
  trimming.** A reader adding "dune" and "Dune" means the same book, and a duplicate is refused
  with the existing id so the page can link to it instead of showing an error. Rejected:
  allowing duplicates and merging later (every later view would need a merge rule). Lifted
  from the archived change unique-titles (2026-09-30) at the move to Kyspec.
