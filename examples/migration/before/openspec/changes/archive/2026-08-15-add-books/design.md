## Context

The first cut of the list: add a book, see the list.

## Decisions

- **Books live in a JSON file on disk**, one file per list, rewritten on every change. Good
  enough for one reader; a database can come when there are two. Alternative considered:
  SQLite from the start (more to set up than the first cut needed).
