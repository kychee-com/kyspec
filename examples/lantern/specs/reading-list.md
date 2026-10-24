# reading-list Specification

## Purpose

The list of books a reader keeps, with a reading status and notes per book: adding, moving a
book through its statuses, archiving, and the list views the page and the API serve. Export is
`specs/export.md`.

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

#### Scenario: An unknown status

- **WHEN** a reader patches a book to `abandoned`
- **THEN** the API answers `400 INVALID_STATUS` naming `to-read`, `reading` and `read`

### Requirement: An archived book leaves the list and keeps its notes

`POST /books/:id/archive` SHALL set `archived_at` and remove the book from `GET /books`;
`GET /books?archived=true` SHALL list archived books, newest archive first, with their notes;
`POST /books/:id/unarchive` SHALL clear `archived_at` and return the book to the list with the
status and notes it had. There is no `DELETE /books/:id` (principles #2).

#### Scenario: Archiving

- **WHEN** a reader archives a book that has notes
- **THEN** the book is absent from `GET /books`, present in `GET /books?archived=true`, and its notes are intact

#### Scenario: Archiving twice

- **WHEN** a reader archives an already archived book
- **THEN** the API answers `200` with the book unchanged

#### Scenario: Unarchiving

- **WHEN** a reader unarchives a book
- **THEN** it returns to `GET /books` with the status and notes it had when archived

## Design notes

- **D-reading-list-1. Titles are unique per list, compared case-insensitively after
  trimming.** A reader adding "dune" and "Dune" means the same book, and a duplicate is refused
  with the existing id so the page can link to it instead of showing an error. Rejected:
  allowing duplicates and merging later (every later view would need a merge rule).
- **D-reading-list-2. Status is a closed set of three, not a free string.** The page renders
  three columns and the export names three states; a fourth state is a change to both, so it
  must arrive as a change, not as a value a client invents. Rejected: a free-form status (each
  client would invent its own, and the columns would stop meaning anything).
