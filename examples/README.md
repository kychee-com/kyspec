# Examples

Three kinds. [`lantern/`](lantern) is a product snapshot: a repository that runs Kyspec, frozen
mid-change, so every artifact is shown in its working state. [`workflows/`](workflows) are
walkthroughs, prompt by prompt, of the situations the method is built for.
[`migration/`](migration) is the same product as an OpenSpec repository and as the Kyspec tree
[MIGRATING.md](../MIGRATING.md) produces from it.

| Workflow | What it shows |
| --- | --- |
| [01 Below the line](workflows/01-below-the-line.md) | A fix that needs no change file, and where the line is |
| [02 Issue to finish, one thread](workflows/02-issue-to-finish.md) | The whole chain from `implement lantern#12`: plan, implement, release, verify in a fresh agent, finish |
| [03 A brainstorm that parks](workflows/03-brainstorm-that-parks.md) | An idea challenged and parked with its reason, so the next session does not rediscover it |
| [04 Verify fails](workflows/04-verify-fails.md) | A failed cycle adds a task; the fix ships; a second fresh thread passes it |
| [05 Parallel sessions](workflows/05-parallel-sessions.md) | Two sessions on one repository with a coordination room declared |

The gate runs over `lantern/` and `migration/after/` in CI (`npm run check`), so both
snapshots are always valid layouts.
