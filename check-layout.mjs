#!/usr/bin/env node
// check-layout.mjs: the one gate Kyspec ships (METHOD.md "Gates").
//
// Under changes/ it refuses:
//   - an archive directory, at any depth (METHOD.md "Finishing a change": a
//     finished change is deleted; git holds the history)
//   - an entry named with a date prefix, at any depth (the archive's naming)
//   - a change file whose H2 sections are not exactly the seven, in order
//     (METHOD.md "A change")
//   - a change directory without its <name>.md (METHOD.md "A change")
// Under ideas/ it refuses:
//   - an idea whose first line is not `status: seed | explored | parked |
//     rejected | adopted` (METHOD.md "Three tiers")
//
// A directory directly under changes/ or ideas/ that is not a change directory
// (it holds no <name>.md of its own name) is a product directory (METHOD.md
// "Products"), and its entries are read the same way, one level down.
//
// Run: node check-layout.mjs [<repository root>]   (exit 1 on any problem)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const CHANGE_SECTIONS = Object.freeze([
  "Why",
  "Specs",
  "Prior art",
  "Decisions",
  "Tasks",
  "Surface review",
  "Verification",
]);

export const IDEA_STATUSES = Object.freeze(["seed", "explored", "parked", "rejected", "adopted"]);

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

const RULE = Object.freeze({
  archive:
    "METHOD.md, Finishing a change: a finished change is deleted (git rm changes/<name>); git holds the history, there is no archive",
  sections: `METHOD.md, A change: exactly these H2 sections, in order: ${CHANGE_SECTIONS.join(", ")}`,
  file: "METHOD.md, A change: a change is changes/<name>.md, or changes/<name>/<name>.md beside its attachments",
  status: `METHOD.md, Three tiers: an idea's first line is \`status: ${IDEA_STATUSES.join(" | ")}\``,
});

/** The H2 headings of a markdown text, skipping fenced code blocks. */
export function h2Headings(text) {
  const headings = [];
  let fence = null;
  for (const line of text.split("\n")) {
    const opener = /^\s*(`{3,}|~{3,})/.exec(line);
    if (opener) {
      if (!fence) fence = opener[1][0];
      else if (opener[1][0] === fence) fence = null;
      continue;
    }
    const heading = fence ? null : /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) headings.push(heading[1]);
  }
  return headings;
}

function entries(dir) {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
}

function isChangeDir(dir, name) {
  return existsSync(join(dir, name, `${name}.md`));
}

/** Archive directories and date-prefixed entries anywhere under changes/. */
export function changeTreeProblems(root = ".") {
  const changes = join(root, "changes");
  if (!existsSync(changes)) return [];
  const problems = [];
  const walk = (dir, rel) => {
    for (const entry of entries(dir)) {
      const path = `${rel}/${entry.name}`;
      if (entry.isDirectory() && entry.name === "archive") {
        problems.push(`${path}/ exists; ${RULE.archive}.`);
        continue;
      }
      if (DATE_PREFIX.test(entry.name)) problems.push(`${path} is named with a date prefix; ${RULE.archive}.`);
      if (entry.isDirectory()) walk(join(dir, entry.name), path);
    }
  };
  walk(changes, "changes");
  return problems;
}

/** Every change file's sections, and every change directory's <name>.md. */
export function changeFileProblems(root = ".") {
  const changes = join(root, "changes");
  if (!existsSync(changes)) return [];
  const problems = [];
  const files = [];
  const collect = (dir, rel, depth) => {
    for (const entry of entries(dir)) {
      const path = `${rel}/${entry.name}`;
      if (entry.isFile()) {
        if (entry.name.endsWith(".md")) files.push(path);
        continue;
      }
      if (!entry.isDirectory() || entry.name === "archive" || DATE_PREFIX.test(entry.name)) continue;
      if (isChangeDir(dir, entry.name)) {
        files.push(`${path}/${entry.name}.md`);
        continue;
      }
      // Not a change directory. At the top level it is a product directory when
      // it holds markdown or directories of its own; a directory of loose
      // attachments is a change that lost its file.
      const inner = entries(join(dir, entry.name));
      const looksLikeProduct = inner.some((e) => e.isDirectory() || e.name.endsWith(".md"));
      if (depth === 0 && looksLikeProduct) collect(join(dir, entry.name), path, 1);
      else problems.push(`${path}/ has no ${entry.name}.md; ${RULE.file}.`);
    }
  };
  collect(changes, "changes", 0);
  for (const file of files.sort()) {
    const headings = h2Headings(readFileSync(join(root, file), "utf8"));
    if (headings.join("\n") !== CHANGE_SECTIONS.join("\n")) {
      problems.push(`${file} has H2 sections [${headings.join(", ")}]; ${RULE.sections}.`);
    }
  }
  return problems;
}

/** Every idea's first line is its status line. */
export function ideaStatusProblems(root = ".") {
  const ideas = join(root, "ideas");
  if (!existsSync(ideas)) return [];
  const problems = [];
  const check = (dir, rel, depth) => {
    for (const entry of entries(dir)) {
      const path = `${rel}/${entry.name}`;
      if (entry.isDirectory()) {
        if (depth === 0) check(join(dir, entry.name), path, 1);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      const first = readFileSync(join(dir, entry.name), "utf8").split("\n", 1)[0];
      const status = /^status:\s*(.*)$/i.exec(first);
      if (!status || !IDEA_STATUSES.includes(/^[a-z]*/.exec(status[1])[0])) {
        problems.push(`${path} starts "${first.trim()}"; ${RULE.status}.`);
      }
    }
  };
  check(ideas, "ideas", 0);
  return problems;
}

export function layoutProblems(root = ".") {
  return [...changeTreeProblems(root), ...changeFileProblems(root), ...ideaStatusProblems(root)];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2] ?? ".";
  const problems = layoutProblems(root);
  for (const problem of problems) process.stderr.write(`check-layout: ${problem}\n`);
  if (problems.length === 0) process.stdout.write(`check-layout: ok (${root})\n`);
  process.exit(problems.length === 0 ? 0 : 1);
}
