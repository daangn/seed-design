#!/usr/bin/env node

import { addCommand } from "@/src/commands/add";
import { helpCommand } from "@/src/commands/help";
import { getPackageInfo } from "@/src/utils/get-package-info";
import { cac } from "cac";
import { initCommand } from "./commands/init";

const NAME = "seed-design";
export const cli = cac(NAME);

async function main() {
  const packageInfo = getPackageInfo();

  cli.version(packageInfo.version || "1.0.0", "-v, --version");

  /* Commands */
  helpCommand(cli);
  addCommand(cli);
  initCommand(cli);

  cli.parse();
}

main();
