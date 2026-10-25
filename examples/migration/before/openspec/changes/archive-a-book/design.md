## Context

Status is a closed set of three (see the shipped unique-titles and status work). Archiving
must not become a fourth status, because the page's three columns and the export name three
states. Books are never deleted (project context).

## Goals / Non-Goals

- Goal: a book leaves the list and keeps its notes; it can come back.
- Non-goal: bulk archive; a trash view with expiry.

## Decisions

- **Archive is a verb route**, `POST /books/:id/archive` and `POST /books/:id/unarchive`, not
  a status and not a delete. Alternatives considered: `PATCH /books/:id { archived: true }` (a
  flag every list view would have to know about); `DELETE` (loses the notes).
- **Archived books are listed by `GET /books?archived=true`**, never mixed into the default
  list. Alternative considered: a separate `/archive` collection (a second list route to keep
  in step with the first).

## Risks

- Unarchive must restore the status the book had, not a default.
