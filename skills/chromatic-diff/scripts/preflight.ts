/**
 * Decides how far this skill is allowed to run, and prints the one-line
 * environment record the answer has to open with.
 *
 * The point is not the checking — the failures it reports would surface anyway,
 * a few steps later and less legibly. The point is producing a written record of
 * the environment at the start, so that "which tools actually ran" is an
 * artifact rather than something to remember at the end.
 *
 * Usage: bun scripts/preflight.ts --devtools-mcp <yes|no>
 */

import { tokenExpiry } from "./api";

/**
 * Exit codes are the gate. A non-zero exit makes the boundary something the
 * caller has to acknowledge rather than a paragraph it can read past.
 */
const EXIT = {
  full: 0,
  undeclared: 2,
  stopAfterStep2: 10,
  stopNow: 20,
} as const;

/**
 * Bun running this file while `bun` is absent from `PATH` means it was reached
 * by absolute path. That is a legitimate way to run the scripts, but it has to
 * appear in the answer.
 */
function describeRuntime() {
  return Bun.which("bun")
    ? `bun ${Bun.version}`
    : `bun ${Bun.version} OFF PATH (${process.execPath})`;
}

function describeToken() {
  if (!process.env.CHROMATIC_TOKEN?.trim()) return { ok: false, text: "token MISSING" };

  const expiry = tokenExpiry();
  if (!expiry) return { ok: true, text: "token present (expiry unreadable)" };

  const days = Math.floor((expiry.getTime() - Date.now()) / 86_400_000);

  return days < 0
    ? { ok: false, text: `token EXPIRED ${-days}d ago` }
    : { ok: true, text: `token ok (${days}d left)` };
}

/**
 * The CLI drives the same server as the MCP tools, so either one carries steps 3
 * to 5. Only this half is detectable: the CLI is invoked through a shell, so
 * being on `PATH` is the whole capability, while the `chrome-devtools-mcp`
 * binary is routinely installed in a session that never received the tools.
 */
function detectCli() {
  return Boolean(Bun.which("chrome-devtools"));
}

/**
 * Deliberately absent: any check of the machine for `chrome-devtools-mcp`. A
 * PATH lookup answers a different question than the one that matters and reads
 * as permission to continue; only the caller can see its own tool list.
 */
function readDeclaration() {
  const index = process.argv.indexOf("--devtools-mcp");
  const value = index === -1 ? undefined : process.argv[index + 1];

  return value === "yes" || value === "no" ? value : null;
}

const runtime = describeRuntime();
const token = describeToken();
const declared = readDeclaration();
const cli = detectCli();

if (!declared) {
  console.log(`env: ${runtime} · ${token.text}`);
  console.log(`
This script cannot see which MCP tools this session has, and it will not guess
from the machine: \`chrome-devtools-mcp\` is routinely installed in a session
that never received the tools. Look at your own tool list for names starting
with \`mcp__chrome-devtools__\`, then re-run with the answer:

  bun scripts/preflight.ts --devtools-mcp yes   # those tools are in my tool list
  bun scripts/preflight.ts --devtools-mcp no    # they are not

Answer about those tools alone. The chrome-devtools CLI is the other way to run
steps 3 to 5 and this script finds it on PATH by itself, so holding the CLI is
not a yes and does not need to be. Playwright, Puppeteer and headless Chrome
launched from a shell are not a yes either, and this skill does not use them.`);
  process.exit(EXIT.undeclared);
}

const drivers = [declared === "yes" && "MCP tools", cli && "CLI"].filter(Boolean);
const driver = drivers.length
  ? `driver: chrome-devtools ${drivers.join(" + ")}`
  : "driver: NONE (no chrome-devtools MCP tools, no CLI on PATH)";
console.log(`env: ${runtime} · ${token.text} · ${driver}`);

if (!token.ok) {
  console.log(`
STOP. Every step of this skill reads Chromatic's GraphQL API, and this
environment has no usable CHROMATIC_TOKEN, so there is no investigation to run.
Report that, point the user at references/token.md, and stop there. Scraping the
Chromatic UI and the chromatic CLI's project token do not authenticate this API.`);
  process.exit(EXIT.stopNow);
}

if (!drivers.length) {
  console.log(`
STOP AFTER STEP 2. Steps 3-5 render the same story from both published
Storybooks and compare the two, which needs a chrome-devtools driver: either the
MCP tools this session says it does not have, or the CLI, which is not on PATH.
Do not reach for another browser driver and do not fall back to the comparison
images; report as "Stopping early is a deliverable, not a blank" in SKILL.md
describes, and stop.`);
  process.exit(EXIT.stopAfterStep2);
}

process.exit(EXIT.full);
