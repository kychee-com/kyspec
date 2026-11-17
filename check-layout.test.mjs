import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  CHANGE_SECTIONS,
  changeFileProblems,
  changeTreeProblems,
  h2Headings,
  ideaStatusProblems,
  layoutProblems,
} from "./check-layout.mjs";

const roots = [];
after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

/** A temp tree from { "relative/path.md": "content" } (a bare array means empty files). */
function tree(files) {
  const root = mkdtempSync(join(tmpdir(), "kyspec-layout-"));
  roots.push(root);
  const map = Array.isArray(files) ? Object.fromEntries(files.map((f) => [f, ""])) : files;
  for (const [rel, content] of Object.entries(map)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), content);
  }
  return root;
}

const sevenSections = CHANGE_SECTIONS.map((s) => `## ${s}\n\ntext\n`).join("\n");
const change = `# a-change\n\nSource: owner/repo#1\n\n${sevenSections}`;

describe("h2Headings", () => {
  it("lists H2 headings in order and ignores other levels", () => {
    assert.deepEqual(h2Headings("# T\n\n## Why\n\n### Requirement: x\n\n## Specs\n"), ["Why", "Specs"]);
  });
  it("skips headings inside fenced code blocks", () => {
    const text = "## Why\n\n```md\n## Not a section\n```\n\n~~~\n## Nor this\n~~~\n\n## Specs\n";
    assert.deepEqual(h2Headings(text), ["Why", "Specs"]);
  });
});

describe("changeTreeProblems", () => {
  it("accepts a tree with no changes directory", () => {
    assert.deepEqual(changeTreeProblems(tree(["README.md"])), []);
  });
  it("refuses an archive directory at the top or inside a product", () => {
    const top = changeTreeProblems(tree(["changes/archive/old/old.md"]));
    assert.equal(top.length, 1);
    assert.match(top[0], /^changes\/archive\/ exists; METHOD\.md, Finishing a change/);
    const nested = changeTreeProblems(tree(["changes/app/archive/old/old.md"]));
    assert.match(nested[0], /^changes\/app\/archive\/ exists/);
  });
  it("refuses a date-prefixed change but not a dated attachment inside one", () => {
    const problems = changeTreeProblems(tree(["changes/2026-10-07-foo/foo.md", "changes/bar/bar.md", "changes/bar/notes-2026-10-07.md"]));
    assert.equal(problems.length, 1);
    assert.match(problems[0], /^changes\/2026-10-07-foo is named with a date prefix/);
  });
});

describe("changeFileProblems", () => {
  it("accepts a single-product layout: files and <name>/<name>.md directories", () => {
    assert.deepEqual(changeFileProblems(tree({ "changes/foo.md": change, "changes/bar/bar.md": change, "changes/bar/spike.sh": "" })), []);
  });
  it("accepts a product-nested layout", () => {
    assert.deepEqual(changeFileProblems(tree({ "changes/app/foo.md": change, "changes/app/bar/bar.md": change, "changes/site/baz.md": change })), []);
  });
  it("refuses a change with a missing, extra or reordered section", () => {
    const missing = change.replace("## Prior art\n\ntext\n", "");
    const extra = `${change}\n## Notes\n\nmore\n`;
    const reordered = change.replace("## Why\n\ntext\n\n## Specs", "## Specs\n\ntext\n\n## Why");
    for (const [name, text] of Object.entries({ missing, extra, reordered })) {
      const problems = changeFileProblems(tree({ [`changes/${name}.md`]: text }));
      assert.equal(problems.length, 1, name);
      assert.match(problems[0], new RegExp(`^changes/${name}\\.md has H2 sections \\[.*\\]; METHOD\\.md, A change: exactly these H2 sections`));
    }
  });
  it("does not count a heading inside a fenced block as a section", () => {
    const fenced = change.replace("## Verification\n\ntext\n", "## Verification\n\n```\n## Verify cycle\n```\n");
    assert.deepEqual(changeFileProblems(tree({ "changes/foo.md": fenced })), []);
  });
  it("refuses a change directory without its <name>.md", () => {
    const nested = changeFileProblems(tree(["changes/app/foo/other.md"]));
    assert.equal(nested.length, 1);
    assert.match(nested[0], /^changes\/app\/foo\/ has no foo\.md; METHOD\.md, A change/);
    const attachmentsOnly = changeFileProblems(tree(["changes/foo/spike.sh"]));
    assert.equal(attachmentsOnly.length, 1);
    assert.match(attachmentsOnly[0], /^changes\/foo\/ has no foo\.md/);
  });
});

describe("waiting markers", () => {
  const withTasks = (lines) => change.replace("## Tasks\n\ntext\n", `## Tasks\n\n${lines.join("\n")}\n`);
  const problemsFor = (lines) => changeFileProblems(tree({ "changes/foo.md": withTasks(lines) }));

  it("accepts a person, a date and a release, after a task number, with dashes and parentheses in the what", () => {
    assert.deepEqual(problemsFor([
      "- [ ] (waiting: Dana — the store attestation (her account)) Submit the listing.",
      "- [ ] 4.2 (waiting: 2026-12-01 — the 14-day ledger — then contact owners) Review the ledger.",
      "- [ ] (waiting: release — the next CLI publish) Release the template text.",
      "- [ ] (waiting: Mary O'Neil — the domain transfer) Point the domain.",
      "- [ ] 4c.3 (waiting: Tal — the re-issue named in 10.2) Re-issue the key.",
      "- [ ] Make the gate refuse `(waiting: access — x)` and `- [x] y (waiting: Dana — z)` quoted as examples.",
      "- [x] Done with evidence, abc1234.",
    ]), []);
  });
  it("refuses a marker anywhere but the start of the task, open or ticked", () => {
    const problems = problemsFor([
      "- [ ] Check the export as a member (waiting: access — a member sign-in).",
      "- [x] Publish the export to the store (waiting: Dana — the store attestation).",
      "- [ ] 2.1 Ship it (Waiting on release).",
      "- [ ] (waiting: Dana — the attestation) then (waiting: release — the publish) Two markers.",
    ]);
    assert.equal(problems.length, 4);
    for (const problem of problems) assert.match(problem, /a waiting marker opens the task.*; METHOD\.md, A change/);
  });
  it("reads a task as a whole list item: wrapped lines, numbered and + lists", () => {
    assert.deepEqual(problemsFor([
      "- [ ] (waiting: Dana — the store",
      "  attestation (her account)) Submit the listing.",
      "1. [ ] (waiting: release — the next publish) Release the template.",
      "+ [ ] 3.1 (waiting: 2026-12-01 — the ledger) Review it.",
    ]), []);
    const problems = problemsFor([
      "- [ ] Check the export as a member, then",
      "  (waiting: access — a member sign-in) record it.",
      "- [x] Publish the export to the store",
      "  (waiting: Dana — the store attestation).",
      "1. [ ] (waiting: access — a sign-in) Verify it.",
      "2. [x] (waiting: release — the publish) Ticked.",
      "+ [ ] Ship it (waiting: Dana — the click).",
      "",
      "Prose under Tasks that waits (waiting: Tal — a decision) is no task.",
    ]);
    assert.equal(problems.length, 6);
    assert.match(problems[0], /^changes\/foo\.md:\d+ .*a waiting marker opens the task/);
    assert.match(problems[2], /missing access is never a wait/);
    assert.match(problems[3], /ticked/);
    assert.match(problems[5], /a waiting marker opens an open task/);
  });
  it("reads group headings under Tasks, a `3)` task number, and code spans of any backtick run", () => {
    assert.deepEqual(problemsFor([
      "### 2. Store",
      "- [ ] 3) (waiting: Dana — the store attestation) Publish the listing.",
      "- [ ] Quote ``(waiting: access — x)`` and ```a `tick` (waiting: access — y)``` as examples.",
    ]), []);
    const problems = problemsFor([
      "### 2. Member checks (waiting: access — a member sign-in)",
      "- [ ] 2.1 Check the export as a member.",
      "",
      "#### 3. Store (waiting: Dana — the store attestation)",
      "- [x] 3.1 Published — 2026-11-17.",
    ]);
    assert.equal(problems.length, 2);
    for (const problem of problems) assert.match(problem, /a waiting marker opens an open task, never other text under Tasks/);
  });
  it("reads files saved with Windows line endings, and refuses access anywhere in <who>", () => {
    const crlf = (text) => text.replace(/\n/g, "\r\n");
    const good = withTasks([
      "- [ ] (waiting: release — the next publish) Release it.",
      "- [ ] 2.1 (waiting: Dana — the store",
      "  attestation) Submit the listing.",
    ]);
    const bad = withTasks(["- [ ] (waiting: access — a sign-in) Verify it.", "- [x] (waiting: release — x) Ticked."]);
    assert.deepEqual(changeFileProblems(tree({ "changes/foo.md": crlf(good) })), []);
    assert.equal(changeFileProblems(tree({ "changes/foo.md": crlf(bad) })).length, 2);
    assert.deepEqual(ideaStatusProblems(tree({ "ideas/a.md": crlf("status: seed\n\n# A\n") })), []);
    const access = problemsFor(["- [ ] (waiting: AWS access — the SSO login) Read the logs."]);
    assert.equal(access.length, 1);
    assert.match(access[0], /missing access is never a wait/);
  });
  it("reads only the Tasks section, outside fenced blocks", () => {
    const verification = change
      .replace("## Verification\n\ntext\n", "## Verification\n\n- [ ] (waiting: access — not a task here)\n")
      .replace("## Tasks\n\ntext\n", "## Tasks\n\n```md\n- [ ] (waiting: access — an example)\n```\n");
    assert.deepEqual(changeFileProblems(tree({ "changes/foo.md": verification })), []);
  });
  it("refuses access, a malformed marker, an invalid date, and a ticked task that kept its marker", () => {
    const problems = problemsFor([
      "- [ ] (waiting: access — a member sign-in) Verify the news page.",
      "- [ ] (waiting: Access to the org — membership) Read the receiver.",
      "- [ ] (waiting: Dana) No what.",
      "- [ ] (waiting on Dana — the click) Not the form.",
      "- [ ] (waiting: 2026-13-40 — a date that is none) Wait.",
      "- [ ] (waiting: dana@example.com — an address, not a name) Wait.",
      "- [ ] (waiting: Dana — never closed",
      "- [x] (waiting: release — the publish) Ticked, marker left on.",
    ]);
    assert.equal(problems.length, 8);
    for (const problem of problems) assert.match(problem, /^changes\/foo\.md:\d+ .*; METHOD\.md, A change: a blocked task opens with/);
    assert.match(problems[0], /missing access is never a wait/);
    assert.match(problems[1], /missing access is never a wait/);
    assert.match(problems[7], /ticked/);
  });
});

describe("acts and dependencies", () => {
  const withTasks = (lines) => change.replace("## Tasks\n\ntext\n", `## Tasks\n\n${lines.join("\n")}\n`);
  const problemsFor = (lines) => changeFileProblems(tree({ "changes/foo.md": withTasks(lines) }));

  it("accepts a person wait on a declared act, a one-off, and a wait on another task", () => {
    assert.deepEqual(problemsFor([
      "- [ ] (waiting: Dana on phone — check the export on her phone) Accept the export.",
      "- [ ] 2.1 (waiting: Dana on openai-platform — submit the plugin) Submit it.",
      "- [ ] (waiting: Dana — pick the launch day) Launch.",
      "- [ ] 3 (after 2.1 — the plugin is listed) Announce it.",
      "- [ ] Ship it (after 5.3 lands, in prose).",
      "- [x] 6.4 `wallets send` (after `kms-wallet-signer` 3.2 lands): done — abc1234.",
      "- [ ] (waiting: Dana on aws-access — grant the role) Read the logs.",
    ]), []);
  });
  it("refuses a malformed act, an act on a date, an after without a task, and a ticked after", () => {
    const problems = problemsFor([
      "- [ ] (waiting: Dana on Phone Check — x) A.",
      "- [ ] (waiting: 2026-12-01 on phone — x) B.",
      "- [ ] (after — x) C.",
      "- [ ] (after the deploy — x) D.",
      "- [x] (after 2 — x) E.",
      "- [ ] (waiting: access on phone — x) F.",
    ]);
    assert.equal(problems.length, 6);
    assert.match(problems[0], /"Phone Check" is not an act id/);
    assert.match(problems[1], /an act follows a person's name/);
    assert.match(problems[2], /\(after <task number> — <what>\)/);
    assert.match(problems[3], /\(after <task number> — <what>\)/);
    assert.match(problems[4], /ticked/);
    assert.match(problems[5], /missing access is never a wait/);
  });
});

describe("one spelling, so a grep finds every wait", () => {
  const withTasks = (lines) => change.replace("## Tasks\n\ntext\n", `## Tasks\n\n${lines.join("\n")}\n`);
  it("refuses extra spaces inside a marker", () => {
    const problems = changeFileProblems(tree({ "changes/foo.md": withTasks([
      "- [ ] (waiting:  Dana — x) A.",
      "- [ ] (waiting: Dana  — x) B.",
      "- [ ] (waiting: Dana  on phone — x) C.",
      "- [ ] (waiting: Dana on  phone — x) D.",
      "- [ ] (after  2 — x) E.",
    ]) }));
    assert.equal(problems.length, 5);
    for (const problem of problems) assert.match(problem, /one space/);
  });
  it("refuses a checkbox on an idea's waiting question", () => {
    const problems = ideaStatusProblems(tree({ "ideas/a.md": "status: seed\n\n- [ ] (waiting: Dana — pick the name)\n" }));
    assert.equal(problems.length, 1);
    assert.match(problems[0], /a plain list item, no checkbox/);
  });
});

describe("the marker's opening is on one plain line", () => {
  const withTasks = (lines) => change.replace("## Tasks\n\ntext\n", `## Tasks\n\n${lines.join("\n")}\n`);
  const problemsFor = (lines) => changeFileProblems(tree({ "changes/foo.md": withTasks(lines) }));
  it("accepts a marker whose what wraps after its opening", () => {
    assert.deepEqual(problemsFor([
      "- [ ] (waiting: Dana on phone — check the export",
      "  on her phone) Accept it.",
      "- [ ] 2.1 (after 2 — the plugin",
      "  is listed) Announce it.",
    ]), []);
  });
  it("refuses an opening split across lines, a number alone, a no-break space, a lowercase name and a spaced parenthesis", () => {
    const problems = problemsFor([
      "- [ ] (waiting: Dana on phone",
      "  — check it) A.",
      "",
      "- [ ] (waiting: Dana on phone —",
      "  check it) B.",
      "",
      "- [ ] 2.",
      "  (waiting: Dana — x) C.",
      "",
      "- [ ] (after",
      "  2 — publish) D.",
      "",
      "- [ ] (waiting: Dana — x) E.",
      "- [ ] (waiting: dana — x) F.",
      "- [ ] ( waiting: Dana — x) G.",
    ]);
    assert.equal(problems.length, 7);
    for (const problem of problems.slice(0, 5)) assert.match(problem, /first line/);
    assert.match(problems[5], /capital/);
    assert.match(problems[6], /not the waiting marker's form/);
  });
});

describe("waits in ideas", () => {
  it("reads a question that wraps, and refuses one whose opening is split or follows a no-break space", () => {
    assert.deepEqual(ideaStatusProblems(tree({ "ideas/a.md": "status: seed\n\n- (waiting: Dana — pick the name\n  for the launch)\n" })), []);
    const problems = ideaStatusProblems(tree({ "ideas/b.md": "status: seed\n\n- (waiting: Dana on phone\n  — x)\n\n- (waiting: Dana — y)\n" }));
    assert.equal(problems.length, 2);
    for (const problem of problems) assert.match(problem, /first line/);
  });
  it("checks a list item that opens with a marker, and leaves prose alone", () => {
    const ok = tree({
      "ideas/a.md": "status: seed\n\n# A\n\n## Open questions\n\n- (waiting: Dana — pick the name) Which name?\n- Prose may say (waiting for a worker) and `(waiting: access — x)`.\n",
    });
    assert.deepEqual(ideaStatusProblems(ok), []);
    const bad = ideaStatusProblems(tree({
      "ideas/b.md": "status: seed\n\n- (waiting: access — a sign-in) Read it.\n* (waiting: Dana) No what.\n",
    }));
    assert.equal(bad.length, 2);
    assert.match(bad[0], /^ideas\/b\.md:3 missing access is never a wait.*; METHOD\.md, Three tiers/);
    assert.match(bad[1], /^ideas\/b\.md:4 /);
  });
});

describe("ideaStatusProblems", () => {
  it("accepts every status, a reason after a dash, and product nesting", () => {
    const ok = tree({
      "ideas/a.md": "status: seed\n\n# A\n",
      "ideas/b.md": "status: explored\n",
      "ideas/c.md": "status: parked — waits on a second customer\n",
      "ideas/d.md": "status: rejected — duplicates specs/x.md\n",
      "ideas/e.md": "status: adopted — changes/e.md\n",
      "ideas/app/f.md": "Status: explored\n",
      "ideas/app/notes.txt": "not an idea",
    });
    assert.deepEqual(ideaStatusProblems(ok), []);
  });
  it("refuses an idea whose first line is not a status", () => {
    const problems = ideaStatusProblems(tree({ "ideas/a.md": "# A\n\nstatus: seed\n", "ideas/b.md": "status: maybe\n" }));
    assert.equal(problems.length, 2);
    assert.match(problems[0], /^ideas\/a\.md starts "# A"; METHOD\.md, Three tiers/);
    assert.match(problems[1], /^ideas\/b\.md starts "status: maybe"/);
  });
});

describe("layoutProblems", () => {
  it("is the union of the three checks", () => {
    const root = tree({ "changes/archive/x/x.md": change, "changes/y.md": "## Why\n", "ideas/z.md": "# Z\n" });
    assert.equal(layoutProblems(root).length, 3);
  });
  it("passes the example product and the migrated tree in this repository", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    assert.deepEqual(layoutProblems(join(here, "examples", "lantern")), []);
    assert.deepEqual(layoutProblems(join(here, "examples", "migration", "after")), []);
  });
});
