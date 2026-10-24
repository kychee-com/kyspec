status: seed

# Export to CSV

principles #1 says export always works in a format another tool reads. Today
`GET /books/export` answers JSON only; a spreadsheet user has to convert it. A `format=csv`
query, one row per book with status, notes flattened, and `archived_at`, would meet the
principle for the common tool. Open: whether notes with newlines quote cleanly in every
spreadsheet, and whether archived books are rows or a second file.
