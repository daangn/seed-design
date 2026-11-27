import {
  Authoring,
  breakpoints,
  buildContext,
  createTokenValuesResolver,
  css,
  exchange,
  getComponentSpecDeclarations,
  getSourceFiles,
  getTokenCollectionDeclarations,
  getTokenDeclarations,
  jsonschema,
  type RootageCtx,
  typescript,
  tailwind3,
  tailwind4,
  validate,
} from "@seed-design/rootage-core";
import {
  type ComponentSpecGeneratorFunction,
  type GeneratorFunction,
  runComponentSpecGenerator,
  runGenerator,
} from "@seed-design/rootage-core/generator";
import fs from "fs-extra";
import path from "node:path";
import YAML from "yaml";
import { createRequire } from "node:module";
import type { Argv, CommandModule } from "yargs";

import { type CommandOptions, loadConfig, resolveCommandOptions } from "./config";

const require = createRequire(import.meta.url);

const artifactsPath = require.resolve("@seed-design/rootage-artifacts");
const artifactsDir = path.dirname(artifactsPath);

function readYAMLFilesSync(dir: string, fileList: string[] = []) {
  // readdir order varies by runtime and filesystem, and it reaches the order of the generated output.
  const files = fs.readdirSync(dir).sort();

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

function writeFileSync({
  filename,
  writePath,
  code,
}: {
  filename: string;
  writePath: string;
  code: string;
}) {
  console.log("Writing", filename, "to", writePath);

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

async function writeTokenTs(dir: string, prefix?: string) {
  const { ctx } = await prepare();

  const tsStringifier = typescript.createStringifier({
    prefix,
  });

  const mjsResults = tsStringifier.getTokenMjs(getTokenDeclarations(ctx));
  const dtsResults = tsStringifier.getTokenDts(getTokenDeclarations(ctx));

  for (const result of mjsResults) {
    const writePath = path.join(process.cwd(), dir, result.path);

    writeFileSync({
      filename: result.path,
      code: result.code,
      writePath: writePath,
    });
  }

  for (const result of dtsResults) {
    const writePath = path.join(process.cwd(), dir, result.path);

    writeFileSync({
      filename: result.path,
      code: result.code,
      writePath: writePath,
    });
  }
}

export function getComponentSpecEntries(ctx: RootageCtx) {
  return getSourceFiles(ctx).flatMap(({ fileName, ast }) =>
    ast.kind === "ComponentSpecDocument"
      ? [
          {
            path: path.relative(artifactsDir, fileName).split(path.sep).join(path.posix.sep),
            spec: ast.data,
          },
        ]
      : [],
  );
}

async function writeComponentSpec(
  dir: string,
  prefix?: string,
  filter?: CommandOptions<"component-spec">["filter"],
  generator?: ComponentSpecGeneratorFunction,
) {
  const { ctx } = await prepare();

  const specs = getComponentSpecEntries(ctx)
    .filter((entry) => filter?.(entry) ?? true)
    .map(({ spec }) => spec);
  const options = { prefix, resolveTokenValues: createTokenValuesResolver(ctx) };

  const files = generator
    ? await runComponentSpecGenerator(generator, { componentSpecs: specs }, options)
    : typescript.createStringifier(options).getComponentSpecFiles(specs);

  for (const file of files) {
    writeFileSync({
      filename: file.path,
      code: file.code,
      writePath: path.join(process.cwd(), dir, file.path),
    });
  }
}

async function writeTokenCss(
  dir: string,
  generator?: GeneratorFunction,
  prefix?: string,
  ts?: boolean,
) {
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

  let code: string;

  if (generator) {
    // Use custom generator
    code = await runGenerator(generator, ast, options);
  } else {
    // Use default CSS generator from core
    code = css.getTokenCss(ast, options);
  }

  const writePath = path.join(process.cwd(), dir, "token.css");

  writeFileSync({
    filename: "token.css",
    code,
    writePath: writePath,
  });

  if (!ts) return;

  writeFileSync({
    filename: "tokens.ts",
    code: typescript.getTokenCssModule(code),
    writePath: path.join(process.cwd(), dir, "tokens.ts"),
  });
}

async function writeJsonSchema(dir: string) {
  const { ctx } = await prepare();

  const jsonSchema = jsonschema.getJsonSchema(getTokenDeclarations(ctx));
  const writePath = path.join(process.cwd(), dir, "schema.json");

  writeFileSync({
    filename: "schema.json",
    code: jsonSchema,
    writePath: writePath,
  });
}

// The `.mjs` re-exports its sibling `.json` and the `.d.ts` describes it, so all three
// are written together: split across commands, one could be generated without the others.
function writeExchange(dir: string, withoutExt: string, value: unknown) {
  const jsonName = `${withoutExt}.json`;

  writeFileSync({
    filename: jsonName,
    code: JSON.stringify(value, null, 2),
    writePath: path.join(process.cwd(), dir, jsonName),
  });

  const dtsName = `${withoutExt}.d.ts`;

  writeFileSync({
    filename: dtsName,
    code: typescript.getExchangeDts(value),
    writePath: path.join(process.cwd(), dir, dtsName),
  });

  const mjsName = `${withoutExt}.mjs`;

  writeFileSync({
    filename: mjsName,
    code: typescript.getExchangeMjs(`${path.basename(withoutExt)}.json`),
    writePath: path.join(process.cwd(), dir, mjsName),
  });
}

async function writeJsonTs(dir: string) {
  const { ctx, models } = await prepare();

  for (const { fileName, ast } of getSourceFiles(ctx)) {
    const relativePath = path.relative(artifactsDir, fileName);
    const withoutExt = relativePath.replace(path.extname(relativePath), "");

    writeExchange(dir, withoutExt, exchange.getModel(ast));
  }

  const artifactsPkg = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "package.json"), "utf-8"),
  );

  writeExchange(dir, "index", exchange.getIndex(models, { version: artifactsPkg.version }));
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

// SEED breakpoints replace Tailwind's defaults unless the consumer opts out.
const TAILWIND_BREAKPOINTS_BY_DEFAULT = true;

async function writeTailwind3Plugin(dir: string, prefix?: string): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);

  const typographyTokens = getComponentSpecDeclarations(ctx);
  const code = tailwind3.getTailwind3PluginCode(tokens, typographyTokens, {
    prefix,
    breakpoints: breakpoints.getBreakpoints(getTokenCollectionDeclarations(ctx)),
    breakpointsByDefault: TAILWIND_BREAKPOINTS_BY_DEFAULT,
  });

  const pluginPath = path.join(process.cwd(), dir, "index.ts");

  await writeFile(pluginPath, code);
  return pluginPath;
}

async function writeTailwind4(dir: string, prefix?: string): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);
  const typographyTokens = getComponentSpecDeclarations(ctx);
  const values = breakpoints.getBreakpoints(getTokenCollectionDeclarations(ctx));

  // tailwind4 모듈의 함수 사용
  const themeCode = tailwind4.getTailwind4CompleteThemeCode(tokens, typographyTokens, {
    sourcePrefix: prefix,
    prefix: "", // 접두사 제거 (--dimension-x0_5 형태로 출력)
    banner: "",
    breakpoints: TAILWIND_BREAKPOINTS_BY_DEFAULT ? values : undefined,
  });

  // Opt-in entry while breakpoints are off by default; afterwards it stays as an empty file so
  // existing imports keep resolving.
  const breakpointsCode = TAILWIND_BREAKPOINTS_BY_DEFAULT
    ? "/* Breakpoints are included in index.css. This file is kept empty for existing imports. */\n"
    : tailwind4.getTailwind4BreakpointsCode(values);

  const writePath = path.join(process.cwd(), dir, "index.css");

  await writeFile(writePath, themeCode);
  await writeFile(path.join(process.cwd(), dir, "breakpoints.css"), breakpointsCode);
  return writePath;
}

async function writeBreakpoints(dir: string) {
  const { ctx } = await prepare();
  const values = breakpoints.getBreakpoints(getTokenCollectionDeclarations(ctx));

  writeFileSync({
    filename: "index.mjs",
    code: breakpoints.getBreakpointsMjs(values),
    writePath: path.join(process.cwd(), dir, "index.mjs"),
  });

  writeFileSync({
    filename: "index.d.ts",
    code: breakpoints.getBreakpointsDts(values),
    writePath: path.join(process.cwd(), dir, "index.d.ts"),
  });
}

async function validateArtifacts() {
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
    const updatedContents = await Promise.all(filePaths.map((name) => fs.readFile(name, "utf-8")));
    const updatedModels = updatedContents.map((content) => YAML.parse(content) as Authoring.Model);
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
}

// The name lives only in the table key below, which is what `Command` is derived from.
function defineCommand<U>({ args, ...module }: CommandModule<{}, U> & { args?: string }) {
  return (cli: Argv, name: string) =>
    cli.command({ ...module, command: args ? `${name} ${args}` : name });
}

const dirPositional = {
  describe: "Output directory",
  type: "string",
  default: "./",
} as const;

const configOption = {
  describe: "Path to a config file (searched in the working directory when omitted)",
  type: "string",
} as const;

export const commands = {
  "token-ts": defineCommand({
    args: "<dir>",
    describe: "Generate TypeScript tokens",
    builder: (yargs) => yargs.positional("dir", dirPositional).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      const { prefix } = resolveCommandOptions(await loadConfig(config), "token-ts");
      await writeTokenTs(dir, prefix);
      console.log("Done");
    },
  }),
  "component-spec": defineCommand({
    args: "<dir>",
    describe: "Generate component specs",
    builder: (yargs) => yargs.positional("dir", dirPositional).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      const { prefix, filter, generator } = resolveCommandOptions(
        await loadConfig(config),
        "component-spec",
      );
      await writeComponentSpec(dir, prefix, filter, generator);
      console.log("Done");
    },
  }),
  "token-css": defineCommand({
    args: "<dir>",
    describe: "Generate CSS tokens",
    builder: (yargs) => yargs.positional("dir", dirPositional).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      const { generator, prefix, ts } = resolveCommandOptions(
        await loadConfig(config),
        "token-css",
      );
      await writeTokenCss(dir, generator, prefix, ts);
      console.log("Done");
    },
  }),
  // These read nothing from the config, but loading it still rejects a `--config` that does not load.
  "json-schema": defineCommand({
    args: "<dir>",
    describe: "Generate JSON schema",
    builder: (yargs) => yargs.positional("dir", dirPositional).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      await loadConfig(config);
      await writeJsonSchema(dir);
      console.log("Done");
    },
  }),
  "json-ts": defineCommand({
    args: "<dir>",
    describe: "Generate JSON artifacts with their typed declarations",
    builder: (yargs) => yargs.positional("dir", dirPositional).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      await loadConfig(config);
      await writeJsonTs(dir);
      console.log("Done");
    },
  }),
  breakpoints: defineCommand({
    args: "<dir>",
    describe: "Generate breakpoint values and media queries from the viewport-width collection",
    builder: (yargs) => yargs.positional("dir", dirPositional).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      await loadConfig(config);
      await writeBreakpoints(dir);
      console.log("Done");
    },
  }),
  "tailwind3-plugin": defineCommand({
    args: "<dir>",
    describe: "Generate Tailwind 3 plugin",
    builder: (yargs) =>
      yargs.positional("dir", { ...dirPositional, alias: "o" }).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      const { prefix } = resolveCommandOptions(await loadConfig(config), "tailwind3-plugin");
      await writeTailwind3Plugin(dir, prefix);
      console.log("Done");
    },
  }),
  tailwind4: defineCommand({
    args: "<dir>",
    describe: "Generate Tailwind 4.0",
    builder: (yargs) =>
      yargs.positional("dir", { ...dirPositional, alias: "o" }).option("config", configOption),
    handler: async ({ dir, config }) => {
      console.log("Start");
      const { prefix } = resolveCommandOptions(await loadConfig(config), "tailwind4");
      await writeTailwind4(dir, prefix);
      console.log("Done");
    },
  }),
  validate: defineCommand({
    describe: "Validate YAML files and auto-fix unused schema properties",
    builder: (yargs) => yargs.option("config", configOption),
    handler: async ({ config }) => {
      await loadConfig(config);
      await validateArtifacts();
    },
  }),
};

export type Command = keyof typeof commands;
