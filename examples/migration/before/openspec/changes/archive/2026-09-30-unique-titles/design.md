## Context

Readers add the same book twice with different capitalization, and the list shows both.

## Decisions

- **Titles are unique per list, compared case-insensitively after trimming.** A reader adding
  "dune" and "Dune" means the same book, and a duplicate is refused with the existing id so the
  page can link to it instead of showing an error. Alternative considered: allowing duplicates
  and merging later (every later view would need a merge rule).
