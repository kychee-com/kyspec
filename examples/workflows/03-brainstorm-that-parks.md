# 03. A brainstorm that parks

**Prompt:** "let's think about shared lists"

`/kyspec-brainstorm` is a conversation with a partner who challenges, not a form. The partner's
first move is to ground: `grep -rn "share" specs/ ideas/ changes/` finds nothing, and the only
trace is lantern#9, a reader asking to "share my list with my book club". It reads the issue.

**Turn 1.** The partner names the riskiest assumption: that "share" means "edit together".
Lantern has no accounts; a list is a browser's list. Accounts are a different product. What did
the reader actually ask for? The issue says "show". Two questions back: is anyone else asking,
and would a read-only link have satisfied this one?

**Turn 2.** The user: one reader, and probably yes. The partner lays out three approaches, how
each works and when it wins: a read-only capability link, accounts with members, and export
and send, which principles #1 already provides. It says plainly that the third costs nothing
today and that the reader was told to do exactly that.

**Turn 3.** The user agrees there is no second reader yet. The partner asks whether a shared
list should show archived books; the open change `archive-a-book` makes the default list
exclude them, and a share should follow the default. That becomes an open question in the
file, not a decision.

**The file, every time.** A brainstorm that ends in "not now" still ends in a file, so the next
session finds the thinking instead of redoing it. The partner writes
[`ideas/shared-lists.md`](../lantern/ideas/shared-lists.md) with its first line:

```
status: parked — waits on a second reader asking; the one who did wanted to show a friend, and a read-only link covers that without accounts
```

Then the problem and who has it, the three approaches with the pick for when it is opened, the
open questions, and prior art as links. It self-reviews (no TBD, nothing in the file that was
not discussed), commits, and ends: the path, the status, and no next step, because a parked
idea has none.

Six months later a session asked to "add sharing" greps `ideas/`, reads the first line, and
knows in one glance what was decided, why, and what would reopen it.
