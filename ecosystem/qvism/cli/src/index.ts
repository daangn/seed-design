#!/usr/bin/env node

// TODO: load preset from config file

import {
  generateAllBundle,
  generateBaseBundle,
  generateDts,
  generateEachRecipe,
  generateJs,
  generateSharedJs,
  type Config,
  type Preset,
} from "@seed-design/qvism-core";
import preset from "@seed-design/qvism-preset";
import fs from "fs-extra";
import path from "node:path";

const [, , dir = "./", recipesDir = "./recipes"] = process.argv;

const PREFIX = "seed"; // TODO: move to config file

function buildConfig(preset: Preset, config: Partial<Config>) {
  return {
    prefix: PREFIX,
    ...preset,
    ...config,
  };
}

async function writeBundles() {
  const config = buildConfig(preset, {});

  const allCss = await generateAllBundle(config);
  console.log("Writing css bundle to", path.join(process.cwd(), dir, "all.css"));
  fs.writeFileSync(path.join(process.cwd(), dir, "all.css"), allCss);

  const minifiedAllCss = await generateAllBundle({ ...config, minify: true });
  console.log("Writing minified css bundle to", path.join(process.cwd(), dir, "all.min.css"));
  fs.writeFileSync(path.join(process.cwd(), dir, "all.min.css"), minifiedAllCss);

  const baseCss = await generateBaseBundle(config);
  console.log("Writing base css bundle to", path.join(process.cwd(), dir, "base.css"));
  fs.writeFileSync(path.join(process.cwd(), dir, "base.css"), baseCss);

  const minifiedBaseCss = await generateBaseBundle({ ...config, minify: true });
  console.log("Writing minified base css bundle to", path.join(process.cwd(), dir, "base.min.css"));
  fs.writeFileSync(path.join(process.cwd(), dir, "base.min.css"), minifiedBaseCss);
}

async function writeRecipes() {
  const config = buildConfig(preset, {});
  const options = { prefix: config.prefix };

  const sharedJs = generateSharedJs();
  console.log("Writing shared to", path.join(process.cwd(), recipesDir, "shared.mjs"));
  fs.writeFileSync(path.join(recipesDir, "shared.mjs"), sharedJs);

  await Promise.all(
    Object.values(config.theme.recipes).map(async (definition) => {
      const name = definition.name;
      const jsCode = generateJs(definition, options);
      const dtsCode = generateDts(definition);

      console.log("Writing", name, "to", path.join(process.cwd(), recipesDir, `${name}.mjs`));
      fs.writeFileSync(path.join(recipesDir, `${name}.mjs`), jsCode);

      console.log("Writing", name, "to", path.join(process.cwd(), recipesDir, `${name}.d.ts`));
      fs.writeFileSync(path.join(recipesDir, `${name}.d.ts`), dtsCode);
    }),
  );

  const recipes = await generateEachRecipe(config);
  for (const { name, css } of recipes) {
    console.log("Writing", name, "to", path.join(process.cwd(), recipesDir, `${name}.css`));
    fs.writeFileSync(path.join(process.cwd(), recipesDir, `${name}.css`), css);
  }
}

writeBundles()
  .then(writeRecipes)
  .then(() => {
    console.log("Done");
  });
