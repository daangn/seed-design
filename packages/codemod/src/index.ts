#!/usr/bin/env node

import { cac, type CAC } from "cac";
import { execaNode } from "execa";
import { createRequire } from "module";
import { dirname, resolve } from "path";
import { LOG_PREFIX } from "./utils/log.js";

const cli = cac();

const getTransformPath = (transformFileName: string) =>
  resolve(dirname(import.meta.filename), `${transformFileName}.mjs`);

migrateIconsCommand(cli);
cli.help();
cli.parse();

function migrateIconsCommand(cli: CAC) {
  const require = createRequire(import.meta.url);
  const jscodeshiftPath = require.resolve("jscodeshift/bin/jscodeshift");

  cli
    .command("migrate-icons [...paths]", "Migrate icons")
    // https://jscodeshift.com/run/cli
    .option("--extensions <extensions>", "Extensions")
    .option("--ignore-config <ignoreConfig>", "Ignore config")
    .action(async (paths, options) => {
      console.log(LOG_PREFIX, "아이콘 마이그레이션을 시작해요");

      // TODO: bun / deno?
      const { stdout } = await execaNode({
        stdout: ["pipe", "inherit"],
      })`${jscodeshiftPath} ${paths.join(" ")}
        -t ${getTransformPath("migrate-icons")}
        --parser=tsx
        --ignore-pattern="**/*.d.ts"
        --silent
        ${options?.extensions ? `--extensions=${options.extensions}` : ""}
        ${options?.ignoreConfig ? `--ignore-config=${options.ignoreConfig}` : ""}`;

      console.log(stdout);
    });
}
