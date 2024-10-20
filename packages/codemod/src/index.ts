#!/usr/bin/env node

import { cac, type CAC } from "cac";
import { execaNode } from "execa";
import { createRequire } from "module";
import { dirname, resolve } from "path";

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
    .option("--parser <parser>", "Parser")
    .option("--extensions <extensions>", "Extensions")
    .option("--ignore-config <ignoreConfig>", "Ignore config")
    .option("--ignore-pattern <ignorePattern>", "Ignore pattern")
    .option("--verbose <verbose>", "Verbose")
    .action(async (paths, options) => {
      console.log("아이콘 마이그레이션을 시작해요");

      // TODO: bun / deno?
      const { all } = await execaNode({ all: true })`${jscodeshiftPath} ${paths.join(" ")}
        -t ${getTransformPath("migrate-icons")}
        ${options?.parser ? `--parser=${options.parser}` : "--parser=tsx"}
        ${options?.extensions ? `--extensions=${options.extensions}` : ""}
        ${options?.ignoreConfig ? `--ignore-config=${options.ignoreConfig}` : ""}
        ${options?.ignorePattern ? `--ignore-pattern=${options.ignorePattern}` : ""}
        ${options?.verbose ? `--verbose=${options.verbose}` : ""}`;

      console.log(all);
    });
}
