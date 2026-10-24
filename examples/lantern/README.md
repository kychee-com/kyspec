# Lantern

A reading list: an HTTP API and one page that calls it. This directory is a snapshot of a
repository that runs Kyspec, frozen in the middle of one change, so you can see every artifact
in its working state rather than a finished, tidy one.

Where it stands: the change `archive-a-book` has shipped, verify cycle 1 has failed one
scenario, and the fix is an open task. Its git history up to here, and on to the finish, is in
the top-level [README](../../README.md) "A change's life"; the [workflows](../workflows) narrate
the steps.

What is here:

| Path | Tier | What it shows |
| --- | --- | --- |
| `AGENTS.md` | | The three declaration lines a product writes, and the rules the skills defer to |
| `docs/principles.md` | 1 | A product's own numbered principles, cited by specs and changes |
| `specs/reading-list.md` | 2 | A spec: Purpose, Requirements with scenarios, Design notes with D-ids; one requirement already moved in by the open change |
| `ideas/shared-lists.md` | 3 | A parked idea, with the reason on its first line |
| `ideas/export-csv.md` | 3 | A seed |
| `changes/archive-a-book.md` | | The change, all seven sections, mid-flight: evidence on tasks, a surface review, release evidence, a failed verify cycle |
| `.claude/skills/lantern-api-review/` | | The product's own surface-review skill, named by the declaration |
| `.claude/skills/lantern-deploy/` | | The product's own release skill, named by the declaration |

Not duplicated here: `METHOD.md` and the five `kyspec-*` skills, which Lantern installs
exactly as the top-level README says. The source code is left out too; the method is visible
without it.
