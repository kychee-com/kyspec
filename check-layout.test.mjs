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
  it("passes the example product in this repository", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    assert.deepEqual(layoutProblems(join(here, "examples", "lantern")), []);
  });
});
