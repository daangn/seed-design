#!/usr/bin/env node

import { cac } from "cac";
import { cosmiconfig } from "cosmiconfig";
import pkg from "../../package.json" assert { type: "json" };
import fs from "fs-extra";
import path from "node:path";
import {
  generateAllBundle,
  generateBaseBundle,
  generateDts,
  generateEachRecipe,
  generateJs,
  generateSharedJs,
  type Config,
} from "@seed-design/qvism-core";

async function writeBundles(outputDir: string, config: Config) {
  const allCss = await generateAllBundle(config);
  console.log("Writing css bundle to", path.join(outputDir, "all.css"));
  fs.writeFileSync(path.join(outputDir, "all.css"), allCss);

  const minifiedAllCss = await generateAllBundle(config, { minify: true });
  console.log("Writing minified css bundle to", path.join(outputDir, "all.min.css"));
  fs.writeFileSync(path.join(outputDir, "all.min.css"), minifiedAllCss);

  const baseCss = await generateBaseBundle(config);
  console.log("Writing base css bundle to", path.join(outputDir, "base.css"));
  fs.writeFileSync(path.join(outputDir, "base.css"), baseCss);

  const minifiedBaseCss = await generateBaseBundle(config, { minify: true });
  console.log("Writing minified base css bundle to", path.join(outputDir, "base.min.css"));
  fs.writeFileSync(path.join(outputDir, "base.min.css"), minifiedBaseCss);
}

async function writeRecipes(recipesDir: string, config: Config) {
  // Prepare shared JS
  const sharedJs = generateSharedJs();
  console.log("Writing shared to", path.join(recipesDir, "shared.mjs"));
  fs.writeFileSync(path.join(recipesDir, "shared.mjs"), sharedJs);

  // Write each recipe .mjs + .d.ts
  const options = { prefix: config.prefix };
  await Promise.all(
    Object.values(config.theme.recipes).map(async (definition) => {
      const name = definition.name;
      const jsCode = generateJs(definition, options);
      const dtsCode = generateDts(definition);

      console.log("Writing", name, "to", path.join(recipesDir, `${name}.mjs`));
      fs.writeFileSync(path.join(recipesDir, `${name}.mjs`), jsCode);

      console.log("Writing", name, "to", path.join(recipesDir, `${name}.d.ts`));
      fs.writeFileSync(path.join(recipesDir, `${name}.d.ts`), dtsCode);
    }),
  );

  // Write each recipe .css
  const recipes = await generateEachRecipe(config);
  for (const { name, css } of recipes) {
    console.log("Writing", name, "to", path.join(recipesDir, `${name}.css`));
    fs.writeFileSync(path.join(recipesDir, `${name}.css`), css);
  }
}

async function main() {
  const cli = cac("qvism");

  cli
    .option("--dir <dir>", "Output directory for generated CSS files", {
      default: "./",
    })
    .option("--recipesDir <dir>", "Output directory for generated recipe files", {
      default: "./recipes",
    })
    .option("--config <path>", "Path to a custom config file (if needed)");

  cli.help();
  cli.version(pkg.version);

  const parsed = cli.parse();
  const { dir, recipesDir, config: configPath } = parsed.options;

  const explorer = cosmiconfig("qvism");
  const searchResult = configPath
    ? await explorer.load(configPath) // Load exact config file if --config is specified
    : await explorer.search(); // Otherwise search up the file tree

  let userConfig: Partial<Config> = {};
  if (searchResult && !searchResult.isEmpty) {
    userConfig = searchResult.config;
  }

  // TODO: validate userConfig with zod
  await writeBundles(path.resolve(process.cwd(), dir), userConfig as Config);
  await writeRecipes(path.resolve(process.cwd(), recipesDir), userConfig as Config);

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
