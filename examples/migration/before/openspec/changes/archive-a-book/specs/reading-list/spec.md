## ADDED Requirements

### Requirement: An archived book leaves the list and keeps its notes

`POST /books/:id/archive` SHALL set `archived_at` and remove the book from `GET /books`;
`GET /books?archived=true` SHALL list archived books, newest archive first, with their notes;
`POST /books/:id/unarchive` SHALL clear `archived_at` and return the book to the list with the
status and notes it had. There is no `DELETE /books/:id`.

#### Scenario: Archiving

- **WHEN** a reader archives a book that has notes
- **THEN** the book is absent from `GET /books`, present in `GET /books?archived=true`, and its notes are intact

#### Scenario: Archiving twice

- **WHEN** a reader archives an already archived book
- **THEN** the API answers `200` with the book unchanged

#### Scenario: Unarchiving

- **WHEN** a reader unarchives a book
- **THEN** it returns to `GET /books` with the status and notes it had when archived
