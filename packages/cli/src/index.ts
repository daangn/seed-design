#!/usr/bin/env node

import { readFileSync } from "node:fs";

import { addParser, runAdd } from "@/src/commands/add";
import { addAllParser, runAddAll } from "@/src/commands/add-all";
import { compatParser, runCompat } from "@/src/commands/compat";
import { docsParser, runDocsList, runDocsRead, runDocsSearch } from "@/src/commands/docs";
import { initParser, runInit } from "@/src/commands/init";
import { ExitCode } from "@/src/utils/error";

import { merge, object, or } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { option } from "@optique/core/primitives";
import { run } from "@optique/run";

/**
 * `--verbose` is merged above the command tree rather than declared in each command, so it
 * can be written on either side of the command name the way it could before.
 */
const parser = merge(
  object({
    verbose: option("--verbose", { description: message`오류 상세 정보를 출력합니다.` }),
  }),
  or(addParser, addAllParser, compatParser, docsParser, initParser),
);

/**
 * The CLI's own version, and not that of whatever project the command was run in. Both `bin/`
 * and `src/` sit one level under the package root, so the same relative path answers for the
 * bundle and for the source the tests spawn.
 */
function getCliVersion() {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { version?: string };

  return packageJson.version ?? "0.0.0";
}

async function main() {
  const options = run(parser, {
    programName: "seed-design",
    brief: message`SEED Design CLI`,
    version: {
      value: getCliVersion(),
      option: { names: ["-v", "--version"] },
    },
    // Both names spelled out: the default registers `--help` alone, and `-h` has worked
    // since the first release.
    help: { command: true, option: { names: ["-h", "--help"] } },
    // An unreadable command line stops a command before it can look at anything, which is the
    // same kind of ending as an unreachable registry and not the same as an answer of no.
    errorExitCode: ExitCode.unanswerable,
    showDefault: true,
    showChoices: true,
  });

  switch (options.command) {
    case "add":
      return runAdd(options);
    case "add-all":
      return runAddAll(options);
    case "compat":
      return runCompat(options);
    case "docs list":
      return runDocsList(options);
    case "docs search":
      return runDocsSearch(options);
    case "docs read":
      return runDocsRead(options);
    case "init":
      return runInit(options);
  }
}

main();
