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

  // Layered variants (@layer seed-base / seed-components)
  const allLayeredCss = await generateAllBundle(config, { layer: true });
  console.log("Writing layered css bundle to", path.join(outputDir, "all.layered.css"));
  fs.writeFileSync(path.join(outputDir, "all.layered.css"), allLayeredCss);

  const allLayeredMinCss = await generateAllBundle(config, { minify: true, layer: true });
  console.log(
    "Writing minified layered css bundle to",
    path.join(outputDir, "all.layered.min.css"),
  );
  fs.writeFileSync(path.join(outputDir, "all.layered.min.css"), allLayeredMinCss);

  const baseLayeredCss = await generateBaseBundle(config, { layer: true });
  console.log("Writing layered base css bundle to", path.join(outputDir, "base.layered.css"));
  fs.writeFileSync(path.join(outputDir, "base.layered.css"), baseLayeredCss);

  const baseLayeredMinCss = await generateBaseBundle(config, { minify: true, layer: true });
  console.log(
    "Writing minified layered base css bundle to",
    path.join(outputDir, "base.layered.min.css"),
  );
  fs.writeFileSync(path.join(outputDir, "base.layered.min.css"), baseLayeredMinCss);

  // Target-specific bundles (e.g., lynx)
  if (config.targets) {
    for (const target of config.targets) {
      const targetConfig = { ...config, postTransformPlugins: target.postcssPlugins };
      const targetDir = target.outputDir
        ? path.resolve(process.cwd(), target.outputDir)
        : outputDir;
      const useSuffix = !target.outputDir;

      if (target.outputDir) {
        fs.ensureDirSync(targetDir);
      }

      const baseName = useSuffix ? `base.${target.suffix}.css` : "base.css";
      const targetBaseCss = await generateBaseBundle(targetConfig);
      const basePath = path.join(targetDir, baseName);
      console.log(`Writing ${target.suffix} base css bundle to`, basePath);
      fs.writeFileSync(basePath, targetBaseCss);

      const minBaseName = useSuffix ? `base.${target.suffix}.min.css` : "base.min.css";
      const minTargetBaseCss = await generateBaseBundle(targetConfig, { minify: true });
      const minBasePath = path.join(targetDir, minBaseName);
      console.log(`Writing ${target.suffix} minified base css bundle to`, minBasePath);
      fs.writeFileSync(minBasePath, minTargetBaseCss);

      const allName = useSuffix ? `all.${target.suffix}.css` : "all.css";
      const targetAllCss = await generateAllBundle(targetConfig);
      const allPath = path.join(targetDir, allName);
      console.log(`Writing ${target.suffix} all css bundle to`, allPath);
      fs.writeFileSync(allPath, targetAllCss);

      const minAllName = useSuffix ? `all.${target.suffix}.min.css` : "all.min.css";
      const minTargetAllCss = await generateAllBundle(targetConfig, { minify: true });
      const minAllPath = path.join(targetDir, minAllName);
      console.log(`Writing ${target.suffix} minified all css bundle to`, minAllPath);
      fs.writeFileSync(minAllPath, minTargetAllCss);

      // Layered variants
      const layeredAllName = useSuffix ? `all.${target.suffix}.layered.css` : "all.layered.css";
      const layeredAllCss = await generateAllBundle(targetConfig, { layer: true });
      console.log(
        `Writing ${target.suffix} layered all css bundle to`,
        path.join(targetDir, layeredAllName),
      );
      fs.writeFileSync(path.join(targetDir, layeredAllName), layeredAllCss);

      const layeredAllMinName = useSuffix
        ? `all.${target.suffix}.layered.min.css`
        : "all.layered.min.css";
      const layeredAllMinCss = await generateAllBundle(targetConfig, { minify: true, layer: true });
      console.log(
        `Writing ${target.suffix} minified layered all css bundle to`,
        path.join(targetDir, layeredAllMinName),
      );
      fs.writeFileSync(path.join(targetDir, layeredAllMinName), layeredAllMinCss);

      const layeredBaseName = useSuffix ? `base.${target.suffix}.layered.css` : "base.layered.css";
      const layeredBaseCss = await generateBaseBundle(targetConfig, { layer: true });
      console.log(
        `Writing ${target.suffix} layered base css bundle to`,
        path.join(targetDir, layeredBaseName),
      );
      fs.writeFileSync(path.join(targetDir, layeredBaseName), layeredBaseCss);

      const layeredBaseMinName = useSuffix
        ? `base.${target.suffix}.layered.min.css`
        : "base.layered.min.css";
      const layeredBaseMinCss = await generateBaseBundle(targetConfig, {
        minify: true,
        layer: true,
      });
      console.log(
        `Writing ${target.suffix} minified layered base css bundle to`,
        path.join(targetDir, layeredBaseMinName),
      );
      fs.writeFileSync(path.join(targetDir, layeredBaseMinName), layeredBaseMinCss);
    }
  }
}

async function writeRecipes(recipesDir: string, config: Config) {
  // Prepare shared JS
  const sharedJs = generateSharedJs();
  console.log("Writing shared to", path.join(recipesDir, "shared.mjs"));
  fs.writeFileSync(path.join(recipesDir, "shared.mjs"), sharedJs);

  // Write each recipe .mjs + .d.ts + layered .mjs
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

      // Layered .mjs (imports layered CSS instead)
      const layeredJsCode = generateJs(definition, {
        ...options,
        cssImportPath: `./${name}.layered.css`,
      });
      console.log("Writing", name, "to", path.join(recipesDir, `${name}.layered.mjs`));
      fs.writeFileSync(path.join(recipesDir, `${name}.layered.mjs`), layeredJsCode);
    }),
  );

  // Write each recipe .css + layered .css
  const recipes = await generateEachRecipe(config);
  for (const { name, css, layeredCss } of recipes) {
    console.log("Writing", name, "to", path.join(recipesDir, `${name}.css`));
    fs.writeFileSync(path.join(recipesDir, `${name}.css`), css);

    console.log("Writing", name, "to", path.join(recipesDir, `${name}.layered.css`));
    fs.writeFileSync(path.join(recipesDir, `${name}.layered.css`), layeredCss);
  }

  // Target-specific recipes (e.g., lynx)
  if (config.targets) {
    for (const target of config.targets) {
      const targetConfig = { ...config, postTransformPlugins: target.postcssPlugins };
      const targetRecipesDir = target.recipesDir
        ? path.resolve(process.cwd(), target.recipesDir)
        : recipesDir;
      const useSuffix = !target.recipesDir;

      if (target.recipesDir) {
        fs.ensureDirSync(targetRecipesDir);

        // Write shared.mjs to target recipes dir
        const targetSharedJs = generateSharedJs();
        console.log(
          `Writing ${target.suffix} shared to`,
          path.join(targetRecipesDir, "shared.mjs"),
        );
        fs.writeFileSync(path.join(targetRecipesDir, "shared.mjs"), targetSharedJs);
      }

      // Generate target CSS for each recipe
      const targetRecipes = await generateEachRecipe(targetConfig);
      for (const { name, css, layeredCss } of targetRecipes) {
        const cssName = useSuffix ? `${name}.${target.suffix}.css` : `${name}.css`;
        const cssPath = path.join(targetRecipesDir, cssName);
        console.log(`Writing ${target.suffix}`, name, "to", cssPath);
        fs.writeFileSync(cssPath, css);

        // Write layered CSS for outputDir targets
        if (!useSuffix) {
          const layeredCssPath = path.join(targetRecipesDir, `${name}.layered.css`);
          console.log(`Writing ${target.suffix}`, name, "to", layeredCssPath);
          fs.writeFileSync(layeredCssPath, layeredCss);
        }
      }

      // Generate target MJS + DTS for each recipe (imports target CSS)
      await Promise.all(
        Object.values(config.theme.recipes).map(async (definition) => {
          const name = definition.name;
          const cssImportPath = useSuffix ? `./${name}.${target.suffix}.css` : `./${name}.css`;
          const targetJsCode = generateJs(definition, {
            ...options,
            cssImportPath,
            targetSlots: target.deriveSlots,
            extraVariants: target.extraVariants,
          });
          const mjsName = useSuffix ? `${name}.${target.suffix}.mjs` : `${name}.mjs`;
          const mjsPath = path.join(targetRecipesDir, mjsName);
          console.log(`Writing ${target.suffix}`, name, "to", mjsPath);
          fs.writeFileSync(mjsPath, targetJsCode);

          // Write layered MJS for outputDir targets
          if (!useSuffix) {
            const layeredJsCode = generateJs(definition, {
              ...options,
              cssImportPath: `./${name}.layered.css`,
              targetSlots: target.deriveSlots,
              extraVariants: target.extraVariants,
            });
            const layeredMjsPath = path.join(targetRecipesDir, `${name}.layered.mjs`);
            console.log(`Writing ${target.suffix}`, name, "to", layeredMjsPath);
            fs.writeFileSync(layeredMjsPath, layeredJsCode);
          }

          // deriveSlots가 있으면 별도 .d.ts 생성 (반환 타입이 다름)
          if (target.deriveSlots?.length) {
            const targetDtsCode = generateDts(definition, {
              targetSlots: target.deriveSlots,
              extraVariants: target.extraVariants,
            });
            const dtsName = useSuffix ? `${name}.${target.suffix}.d.ts` : `${name}.d.ts`;
            const dtsPath = path.join(targetRecipesDir, dtsName);
            console.log(`Writing ${target.suffix}`, name, "to", dtsPath);
            fs.writeFileSync(dtsPath, targetDtsCode);
          }
        }),
      );
    }
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
