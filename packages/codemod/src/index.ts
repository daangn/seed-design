import { cac, type CAC } from "cac";
import { execaNode } from "execa";
import { createRequire } from "module";

const cli = cac();
const getTransformPath = (transformFileName: string) => `./dist/${transformFileName}.mjs`;

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
    .option("--ignore-pattern <ignorePattern>", "Ignore pattern")
    .action(async (paths, options) => {
      // TODO: bun / deno?
      const { all } = await execaNode({ all: true })`${jscodeshiftPath} ${paths.join(" ")}
        -t ${getTransformPath("migrate-icons")}
        --parser=tsx
        --verbose=2
        ${options?.extensions ? `--extensions=${options.extensions}` : ""}
        ${options?.ignoreConfig ? `--ignore-config=${options.ignoreConfig}` : ""}
        ${options?.ignorePattern ? `--ignore-pattern=${options.ignorePattern}` : ""}`;

      console.log(all);
    });
}
