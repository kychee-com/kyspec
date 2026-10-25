## Why

A reader who gives up on a book (lantern#12) can leave it on the list forever or delete it and
lose the notes. Neither is what they asked for: they want it out of the way, with the notes
kept, and a way back.

## What Changes

- Archive and unarchive routes on a book.
- The default list excludes archived books; a query lists them.
- The page gets an archive action on every book and an Archived view.

## Impact

- `src/api/books.js`, `src/web/`, `openapi.json`
- The reading-list spec gains one requirement.
