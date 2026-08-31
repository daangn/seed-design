#!/usr/bin/env node

import { addParser, runAdd } from "@/src/commands/add";
import { addAllParser, runAddAll } from "@/src/commands/add-all";
import { compatParser, runCompat } from "@/src/commands/compat";
import { docsParser, runDocsList, runDocsRead, runDocsSearch } from "@/src/commands/docs";
import { initParser, runInit } from "@/src/commands/init";

import { getPackageInfo } from "@/src/utils/get-package-info";
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

async function main() {
  const packageInfo = getPackageInfo();

  const options = run(parser, {
    programName: "seed-design",
    brief: message`SEED Design CLI`,
    version: {
      value: packageInfo.version || "1.0.0",
      option: { names: ["-v", "--version"] },
    },
    // Both names spelled out: the default registers `--help` alone, and `-h` has worked
    // since the first release.
    help: { command: true, option: { names: ["-h", "--help"] } },
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
