status: parked — waits on a second reader asking; the one who did wanted to show a friend, and a read-only link covers that without accounts

# Shared lists

One reader asked (lantern#9) to "share my list with my book club". Lantern has no accounts: a
list is a browser's list, and the API is open on its own host. Sharing with people means
either identity or a capability link.

## Approaches

1. **A read-only link.** `POST /shares` mints a token; `GET /shared/:token` serves the active
   list, no notes. No accounts, nothing to revoke but the token. Wins when the ask is "show".
2. **Accounts and members.** Sign-in, a list with members and roles. Wins when the ask is
   "edit together", which nobody has asked for.
3. **Export and send.** principles #1 already gives a reader a file to send. Wins today, at
   zero cost, if the friend only wants to read once.

Pick, when this is opened: approach 1. Approach 2 is a different product. Approach 3 is what
the reader was told to do meanwhile.

## Open questions

- Does a shared list show archived books? The archive-a-book change says the default list does
  not; a share should follow the default.
- Expiry: a token that lives forever, or thirty days and re-mint?

Prior art: principles #1 (keep), principles #3 (keep: the share is a request, the page is a
client of it), `specs/reading-list.md` "An archived book leaves the list and keeps its notes".
