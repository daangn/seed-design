#!/usr/bin/env node

import {
  Authoring,
  buildContext,
  css,
  exchange,
  getComponentSpecDeclarations,
  getSourceFiles,
  getTokenCollectionDeclarations,
  getTokenDeclarations,
  jsonschema,
  typescript,
  tailwind3,
  tailwind4,
  validate,
} from "@seed-design/rootage-core";
import { loadConfig } from "./config";
import type { GeneratedFile, PluginContext, RootagePlugin } from "@seed-design/rootage-core/config";
import fs from "fs-extra";
import path from "node:path";
import YAML from "yaml";
import { createRequire } from "node:module";
import yargs from "yargs";

const require = createRequire(import.meta.url);

const artifactsPath = require.resolve("@seed-design/rootage-artifacts");
const artifactsDir = path.dirname(artifactsPath);

const [, , , dir = "./"] = process.argv;

function readYAMLFilesSync(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readYAMLFilesSync(filePath, fileList);
    } else if (stat.isFile() && (path.extname(file) === ".yaml" || path.extname(file) === ".yml")) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// 커맨드 핸들러가 config 로드 후 채운다. 프로세스당 커맨드 하나라 모듈 상태로 충분하다.
let activePlugins: RootagePlugin[] = [];
let pluginContext: PluginContext = {};

async function applyTransforms(file: GeneratedFile): Promise<string> {
  let code = file.code;

  for (const plugin of activePlugins) {
    if (!plugin.transform) continue;

    try {
      const result = await plugin.transform({ ...file, code }, pluginContext);
      if (typeof result === "string") code = result;
    } catch (error) {
      throw new Error(
        `[${plugin.name}] transform failed for ${file.path}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return code;
}

async function writeGenerated({
  writePath,
  ...file
}: Omit<GeneratedFile, "path"> & { path: string; writePath: string }) {
  console.log("Writing", file.path, "to", writePath);

  const code = await applyTransforms(file);

  if (!fs.existsSync(path.dirname(writePath))) {
    fs.mkdirpSync(path.dirname(writePath));
  }

  fs.writeFileSync(writePath, code);
}

async function prepare() {
  const filePaths = readYAMLFilesSync(artifactsDir);

  const fileContents = await Promise.all(filePaths.map((name) => fs.readFile(name, "utf-8")));

  const models = fileContents.map((content) => YAML.parse(content) as Authoring.Model);
  const ctx = buildContext(
    models.map((model, i) => ({
      fileName: filePaths[i],
      ast: Authoring.fromObject(model),
      kind: model.kind,
    })),
  );

  const validationResult = validate(ctx);

  if (!validationResult.valid) {
    console.error(validationResult.message);
    process.exit(1);
  }

  return {
    ctx,
    filePaths,
    models,
  };
}

// TypeScript stringifier will be created in each function with the provided prefix

async function writeTokenTs(prefix?: string) {
  const { ctx } = await prepare();

  const tsStringifier = typescript.createStringifier({
    prefix,
  });

  const mjsResults = tsStringifier.getTokenMjs(getTokenDeclarations(ctx));
  const dtsResults = tsStringifier.getTokenDts(getTokenDeclarations(ctx));

  for (const result of mjsResults) {
    await writeGenerated({
      path: result.path,
      code: result.code,
      type: "mjs",
      kind: "Tokens",
      writePath: path.join(process.cwd(), dir, result.path),
    });
  }

  for (const result of dtsResults) {
    await writeGenerated({
      path: result.path,
      code: result.code,
      type: "dts",
      kind: "Tokens",
      writePath: path.join(process.cwd(), dir, result.path),
    });
  }
}

async function writeComponentSpec(prefix?: string) {
  const { ctx } = await prepare();

  const tsStringifier = typescript.createStringifier({ prefix });

  const specs = getComponentSpecDeclarations(ctx);
  for (const spec of specs) {
    await writeGenerated({
      path: `${spec.id}.mjs`,
      code: tsStringifier.getComponentSpecMjs(spec),
      type: "mjs",
      kind: "ComponentSpec",
      id: spec.id,
      writePath: path.join(process.cwd(), dir, `${spec.id}.mjs`),
    });

    await writeGenerated({
      path: `${spec.id}.d.ts`,
      code: tsStringifier.getComponentSpecDts(spec),
      type: "dts",
      kind: "ComponentSpec",
      id: spec.id,
      writePath: path.join(process.cwd(), dir, `${spec.id}.d.ts`),
    });
  }

  await writeGenerated({
    path: "index.mjs",
    code: tsStringifier.getComponentSpecIndexMjs(specs),
    type: "mjs",
    kind: "ComponentSpec",
    writePath: path.join(process.cwd(), dir, "index.mjs"),
  });

  await writeGenerated({
    path: "index.d.ts",
    code: tsStringifier.getComponentSpecIndexDts(specs),
    type: "dts",
    kind: "ComponentSpec",
    writePath: path.join(process.cwd(), dir, "index.d.ts"),
  });
}

async function writeTokenCss(prefix?: string) {
  const { ctx } = await prepare();

  const ast = {
    tokens: getTokenDeclarations(ctx),
    tokenCollections: getTokenCollectionDeclarations(ctx),
  };

  // Default minimal options - custom generators should provide their own
  const options = {
    prefix,
    banner: "",
    selectors: {
      global: {
        default: ":root",
      },
    },
  };

  const generators = activePlugins.filter((plugin) => plugin.tokenCssGenerator);

  if (generators.length > 1) {
    console.warn(
      `Multiple plugins provide tokenCssGenerator (${generators.map((p) => p.name).join(", ")}); using ${generators[0].name}`,
    );
  }

  const generate = generators[0]?.tokenCssGenerator ?? css.getTokenCss;
  const code = await generate(ast, options);

  await writeGenerated({
    path: "token.css",
    code,
    type: "css",
    kind: "Tokens",
    writePath: path.join(process.cwd(), dir, "token.css"),
  });
}

async function writeJsonSchema() {
  const { ctx } = await prepare();

  await writeGenerated({
    path: "schema.json",
    code: jsonschema.getJsonSchema(getTokenDeclarations(ctx)),
    type: "json",
    writePath: path.join(process.cwd(), dir, "schema.json"),
  });
}

// The `.mjs` re-exports its sibling `.json` and the `.d.ts` describes it, so all three
// are written together: split across commands, one could be generated without the others.
async function writeExchange(
  withoutExt: string,
  value: unknown,
  meta: Pick<GeneratedFile, "kind" | "id"> = {},
) {
  const jsonName = `${withoutExt}.json`;

  await writeGenerated({
    path: jsonName,
    code: JSON.stringify(value, null, 2),
    type: "json",
    ...meta,
    writePath: path.join(process.cwd(), dir, jsonName),
  });

  const dtsName = `${withoutExt}.d.ts`;

  await writeGenerated({
    path: dtsName,
    code: typescript.getExchangeDts(value),
    type: "dts",
    ...meta,
    writePath: path.join(process.cwd(), dir, dtsName),
  });

  const mjsName = `${withoutExt}.mjs`;

  await writeGenerated({
    path: mjsName,
    code: typescript.getExchangeMjs(`${path.basename(withoutExt)}.json`),
    type: "mjs",
    ...meta,
    writePath: path.join(process.cwd(), dir, mjsName),
  });
}

async function writeJsonTs() {
  const { ctx, models } = await prepare();

  for (const { fileName, ast } of getSourceFiles(ctx)) {
    const relativePath = path.relative(artifactsDir, fileName);
    const withoutExt = relativePath.replace(path.extname(relativePath), "");
    const model = exchange.getModel(ast);

    await writeExchange(withoutExt, model, { kind: model.kind, id: model.metadata.id });
  }

  const artifactsPkg = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "package.json"), "utf-8"),
  );

  await writeExchange("index", exchange.getIndex(models, { version: artifactsPkg.version }));
}

async function writeFile(filePath: string, content: string) {
  try {
    await fs.mkdirp(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    return filePath;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    process.exit(1);
  }
}

async function writeTailwind3Plugin(prefix?: string): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);

  const typographyTokens = getComponentSpecDeclarations(ctx);
  const code = await applyTransforms({
    path: "index.ts",
    code: tailwind3.getTailwind3PluginCode(tokens, typographyTokens, { prefix }),
    type: "ts",
  });

  const pluginPath = path.join(process.cwd(), dir, "index.ts");

  await writeFile(pluginPath, code);
  return pluginPath;
}

async function writeTailwind4(prefix?: string): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);
  const typographyTokens = getComponentSpecDeclarations(ctx);

  // tailwind4 모듈의 함수 사용
  const themeCode = tailwind4.getTailwind4CompleteThemeCode(tokens, typographyTokens, {
    sourcePrefix: prefix,
    prefix: "", // 접두사 제거 (--dimension-x0_5 형태로 출력)
    banner: "",
  });

  const code = await applyTransforms({ path: "index.css", code: themeCode, type: "css" });
  const writePath = path.join(process.cwd(), dir, "index.css");

  await writeFile(writePath, code);
  return writePath;
}

// Legacy command support is now handled by yargs

// Legacy command support is now handled by yargs

// Legacy command support is now handled by yargs

// Legacy command support is now handled by yargs

// Legacy command support is now handled by yargs

// Legacy command support is now handled by yargs

// Legacy command support is now handled by yargs

yargs(process.argv.slice(2))
  .option("config", {
    describe: "Path to a rootage config file (default: rootage.config.* in the current directory)",
    type: "string",
  })
  .command(
    "token-ts <dir>",
    "Generate TypeScript tokens",
    (yargs) => {
      return yargs
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./",
        })
        .option("prefix", {
          describe: "Prefix for generated tokens",
          type: "string",
        });
    },
    async (argv) => {
      console.log("Start");
      const config = await loadConfig(argv.config);
      activePlugins = config.plugins ?? [];
      pluginContext = { prefix: argv.prefix ?? config.prefix };
      await writeTokenTs(argv.prefix ?? config.prefix);
      console.log("Done");
    },
  )
  .command(
    "component-spec <dir>",
    "Generate component specs",
    (yargs) => {
      return yargs
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./",
        })
        .option("prefix", {
          describe: "Prefix for generated tokens",
          type: "string",
        });
    },
    async (argv) => {
      console.log("Start");
      const config = await loadConfig(argv.config);
      activePlugins = config.plugins ?? [];
      pluginContext = { prefix: argv.prefix ?? config.prefix };
      await writeComponentSpec(argv.prefix ?? config.prefix);
      console.log("Done");
    },
  )
  .command(
    "token-css <dir>",
    "Generate CSS tokens",
    (yargs) => {
      return yargs
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./",
        })
        .option("prefix", {
          describe: "Prefix for generated tokens",
          type: "string",
        });
    },
    async (argv) => {
      console.log("Start");
      const config = await loadConfig(argv.config);
      activePlugins = config.plugins ?? [];
      pluginContext = { prefix: argv.prefix ?? config.prefix };
      await writeTokenCss(argv.prefix ?? config.prefix);
      console.log("Done");
    },
  )
  .command(
    "json-schema <dir>",
    "Generate JSON schema",
    (yargs) => {
      return yargs.positional("dir", {
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeJsonSchema();
      console.log("Done");
    },
  )
  .command(
    "json-ts <dir>",
    "Generate JSON artifacts with their typed declarations",
    (yargs) => {
      return yargs.positional("dir", {
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async (argv) => {
      console.log("Start");
      const config = await loadConfig(argv.config);
      activePlugins = config.plugins ?? [];
      pluginContext = { prefix: config.prefix };
      await writeJsonTs();
      console.log("Done");
    },
  )
  .command(
    "tailwind3-plugin <dir>",
    "Generate Tailwind 3 plugin",
    (yargs) => {
      return yargs
        .positional("dir", {
          alias: "o",
          describe: "Output directory",
          type: "string",
          default: "./",
        })
        .option("prefix", {
          describe: "Prefix for generated tokens",
          type: "string",
        });
    },
    async (argv) => {
      console.log("Start");
      const config = await loadConfig(argv.config);
      activePlugins = config.plugins ?? [];
      pluginContext = { prefix: argv.prefix ?? config.prefix };
      await writeTailwind3Plugin(argv.prefix ?? config.prefix);
      console.log("Done");
    },
  )
  .command(
    "tailwind4 <dir>",
    "Generate Tailwind 4.0",
    (yargs) => {
      return yargs
        .positional("dir", {
          alias: "o",
          describe: "Output directory",
          type: "string",
          default: "./",
        })
        .option("prefix", {
          describe: "Prefix for generated tokens",
          type: "string",
        });
    },
    async (argv) => {
      console.log("Start");
      const config = await loadConfig(argv.config);
      activePlugins = config.plugins ?? [];
      pluginContext = { prefix: argv.prefix ?? config.prefix };
      await writeTailwind4(argv.prefix ?? config.prefix);
      console.log("Done");
    },
  )
  .command(
    "validate",
    "Validate YAML files and auto-fix unused schema properties",
    () => {},
    async () => {
      const filePaths = readYAMLFilesSync(artifactsDir);
      const fileContents = await Promise.all(filePaths.map((name) => fs.readFile(name, "utf-8")));
      const models = fileContents.map((content) => YAML.parse(content) as Authoring.Model);

      // Auto-fix: remove unused schema properties from ComponentSpec models
      let fixed = false;
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        if (model.kind !== "ComponentSpec") continue;
        if (!model.data.schema?.slots) continue;

        // Collect used properties from definitions
        const usedProperties = new Map<string, Set<string>>();
        for (const slotName of Object.keys(model.data.schema.slots)) {
          usedProperties.set(slotName, new Set());
        }

        for (const variantExpr of Object.values(model.data.definitions)) {
          for (const stateBody of Object.values(variantExpr)) {
            for (const [slotName, slotBody] of Object.entries(stateBody)) {
              if (!usedProperties.has(slotName)) continue;
              for (const propName of Object.keys(slotBody)) {
                usedProperties.get(slotName)!.add(propName);
              }
            }
          }
        }

        // Remove unused properties from schema
        let modelFixed = false;
        for (const [slotName, slotSchema] of Object.entries(model.data.schema.slots)) {
          const used = usedProperties.get(slotName) ?? new Set();
          for (const propName of Object.keys(slotSchema.properties)) {
            if (!used.has(propName)) {
              console.log(
                `Removing unused property "${propName}" from slot "${slotName}" in ${path.basename(filePaths[i])}`,
              );
              delete slotSchema.properties[propName];
              modelFixed = true;
            }
          }
        }

        if (modelFixed) {
          fs.writeFileSync(filePaths[i], YAML.stringify(model));
          fixed = true;
        }
      }

      if (fixed) {
        console.log("Auto-fixed unused schema properties. Re-validating...");
        const updatedContents = await Promise.all(
          filePaths.map((name) => fs.readFile(name, "utf-8")),
        );
        const updatedModels = updatedContents.map(
          (content) => YAML.parse(content) as Authoring.Model,
        );
        models.splice(0, models.length, ...updatedModels);
      }

      const ctx = buildContext(
        models.map((model, i) => ({
          fileName: filePaths[i],
          ast: Authoring.fromObject(model),
          kind: model.kind,
        })),
      );
      const result = validate(ctx);
      if (!result.valid) {
        console.error(result.message);
        process.exit(1);
      }

      console.log("Validation passed.");
    },
  )
  .help().argv;
