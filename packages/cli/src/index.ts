#!/usr/bin/env node

import { addCommand } from "@/src/commands/add";
import { addAllCommand } from "@/src/commands/add-all";
import { initCommand } from "@/src/commands/init";
import { getPackageInfo } from "@/src/utils/get-package-info";
import { cac } from "cac";

const NAME = "seed-design";
const CLI = cac(NAME);

async function main() {
  const packageInfo = getPackageInfo();

  /* Commands */
  addCommand(CLI);
  addAllCommand(CLI);
  initCommand(CLI);

  CLI.version(packageInfo.version || "1.0.0", "-v, --version");
  CLI.help();
  CLI.parse();
}

main();
