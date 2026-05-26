#!/usr/bin/env node

import { cac } from "cac";
import { cosmiconfig } from "cosmiconfig";
import pkg from "../../package.json" with { type: "json" };
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

function resolveGenerateLayeredCss(config: Partial<Config>, cliLayered?: boolean): boolean {
  return cliLayered ?? config.generateLayeredCss ?? true;
}

function removeFileIfExists(filePath: string) {
  fs.removeSync(filePath);
}

async function writeBundles(outputDir: string, config: Config) {
  const generateLayeredCss = config.generateLayeredCss ?? true;
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

  if (!generateLayeredCss) {
    // Remove stale layered bundles from earlier runs.
    removeFileIfExists(path.join(outputDir, "all.layered.css"));
    removeFileIfExists(path.join(outputDir, "all.layered.min.css"));
    removeFileIfExists(path.join(outputDir, "base.layered.css"));
    removeFileIfExists(path.join(outputDir, "base.layered.min.css"));
    return;
  }

  const layeredBundles = [
    {
      name: "layered css bundle",
      path: path.join(outputDir, "all.layered.css"),
      css: await generateAllBundle(config, { layer: true }),
    },
    {
      name: "minified layered css bundle",
      path: path.join(outputDir, "all.layered.min.css"),
      css: await generateAllBundle(config, { minify: true, layer: true }),
    },
    {
      name: "layered base css bundle",
      path: path.join(outputDir, "base.layered.css"),
      css: await generateBaseBundle(config, { layer: true }),
    },
    {
      name: "minified layered base css bundle",
      path: path.join(outputDir, "base.layered.min.css"),
      css: await generateBaseBundle(config, { minify: true, layer: true }),
    },
  ];

  for (const bundle of layeredBundles) {
    console.log("Writing", bundle.name, "to", bundle.path);
    fs.writeFileSync(bundle.path, bundle.css);
  }
}

async function writeRecipes(recipesDir: string, config: Config) {
  const generateLayeredCss = config.generateLayeredCss ?? true;
  // Prepare shared JS
  const sharedJs = generateSharedJs();
  console.log("Writing shared to", path.join(recipesDir, "shared.mjs"));
  fs.writeFileSync(path.join(recipesDir, "shared.mjs"), sharedJs);

  // Write each recipe .mjs + .d.ts, and optionally layered .mjs
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

      const layeredJsPath = path.join(recipesDir, `${name}.layered.mjs`);

      if (!generateLayeredCss) {
        // Remove stale layered recipe JS from earlier runs.
        removeFileIfExists(layeredJsPath);
        return;
      }

      const layeredJsCode = generateJs(definition, {
        ...options,
        cssImportPath: `./${name}.layered.css`,
      });
      console.log("Writing", name, "to", layeredJsPath);
      fs.writeFileSync(layeredJsPath, layeredJsCode);
    }),
  );

  // Write each recipe .css, and optionally layered .css
  const recipes = await generateEachRecipe(config, { generateLayeredCss });
  for (const { name, css, layeredCss } of recipes) {
    console.log("Writing", name, "to", path.join(recipesDir, `${name}.css`));
    fs.writeFileSync(path.join(recipesDir, `${name}.css`), css);

    const layeredCssPath = path.join(recipesDir, `${name}.layered.css`);

    if (!generateLayeredCss) {
      // Remove stale layered recipe CSS from earlier runs.
      removeFileIfExists(layeredCssPath);
      continue;
    }

    if (layeredCss == null) {
      throw new Error(`Layered CSS was not generated for ${name}.`);
    }

    console.log("Writing", name, "to", layeredCssPath);
    fs.writeFileSync(layeredCssPath, layeredCss);
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
    .option("--layered", "Generate layered CSS variants")
    .option("--config <path>", "Path to a custom config file (if needed)");

  cli.help();
  cli.version(pkg.version);

  const parsed = cli.parse();
  const { dir, recipesDir, config: configPath, layered } = parsed.options;

  const explorer = cosmiconfig("qvism");
  const searchResult = configPath
    ? await explorer.load(configPath) // Load exact config file if --config is specified
    : await explorer.search(); // Otherwise search up the file tree

  let userConfig: Partial<Config> = {};
  if (searchResult && !searchResult.isEmpty) {
    userConfig = searchResult.config;
  }

  // TODO: validate userConfig with zod
  const config: Config = {
    ...userConfig,
    generateLayeredCss: resolveGenerateLayeredCss(userConfig, layered),
  };

  await writeBundles(path.resolve(process.cwd(), dir), config);
  await writeRecipes(path.resolve(process.cwd(), recipesDir), config);

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
