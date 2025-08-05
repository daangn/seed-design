#!/usr/bin/env node

import {
  Authoring,
  buildContext,
  css,
  runGenerator,
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

function writeFileSync({ filename, writePath, code }) {
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

const DEFAULT_PREFIX = "rootage";
// TypeScript stringifier will be created in each function with the provided prefix

async function writeTokenTs(prefix: string = DEFAULT_PREFIX) {
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

async function writeComponentSpec(prefix: string = DEFAULT_PREFIX) {
  const { ctx } = await prepare();
  
  const tsStringifier = typescript.createStringifier({
    prefix,
  });

  const specs = getComponentSpecDeclarations(ctx);
  for (const spec of specs) {
    const mjsCode = tsStringifier.getComponentSpecMjs(spec);
    const mjsWritePath = path.join(process.cwd(), dir, `${spec.id}.mjs`);

    writeFileSync({
      filename: spec.id,
      code: mjsCode,
      writePath: mjsWritePath,
    });

    const dtsCode = tsStringifier.getComponentSpecDts(spec);
    const dtsWritePath = path.join(process.cwd(), dir, `${spec.id}.d.ts`);

    writeFileSync({
      filename: spec.id,
      code: dtsCode,
      writePath: dtsWritePath,
    });
  }

  const mjsIndexCode = tsStringifier.getComponentSpecIndexMjs(specs);
  const mjsIndexWritePath = path.join(process.cwd(), dir, "index.mjs");

  writeFileSync({
    filename: "index",
    code: mjsIndexCode,
    writePath: mjsIndexWritePath,
  });

  const dtsIndexCode = tsStringifier.getComponentSpecIndexDts(specs);
  const dtsIndexWritePath = path.join(process.cwd(), dir, "index.d.ts");

  writeFileSync({
    filename: "index",
    code: dtsIndexCode,
    writePath: dtsIndexWritePath,
  });
}

async function writeTokenCss(generatorPath?: string, prefix: string = DEFAULT_PREFIX) {
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
  
  if (generatorPath) {
    // Use custom generator
    code = await runGenerator(generatorPath, ast, options);
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
}

async function writeJsonSchema() {
  const { ctx } = await prepare();

  const jsonSchema = jsonschema.getJsonSchema(getTokenDeclarations(ctx));
  const writePath = path.join(process.cwd(), dir, "schema.json");

  writeFileSync({
    filename: "schema.json",
    code: jsonSchema,
    writePath: writePath,
  });
}

async function writeJson() {
  const { ctx, models } = await prepare();

  for (const { fileName, ast } of getSourceFiles(ctx)) {
    const content = exchange.getModel(ast);
    const code = JSON.stringify(content, null, 2);
    const relativePath = path.relative(artifactsDir, fileName);
    const withoutExt = relativePath.replace(path.extname(relativePath), "");
    const writePath = path.join(process.cwd(), dir, `${withoutExt}.json`);

    writeFileSync({
      filename: `${withoutExt}.json`,
      code,
      writePath: writePath,
    });
  }

  // Generate and write index.json
  const artifactsPkg = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "package.json"), "utf-8"),
  );
  const indexContent = exchange.getIndex(models, { version: artifactsPkg.version });
  const indexPath = path.join(process.cwd(), dir, "index.json");

  writeFileSync({
    filename: "index.json",
    code: JSON.stringify(indexContent, null, 2),
    writePath: indexPath,
  });
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

async function writeTailwind3Plugin(prefix: string = DEFAULT_PREFIX): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);

  const typographyTokens = getComponentSpecDeclarations(ctx);
  const code = tailwind3.getTailwind3PluginCode(tokens, typographyTokens);

  const pluginPath = path.join(process.cwd(), dir, "index.ts");

  await writeFile(pluginPath, code);
  return pluginPath;
}

async function writeTailwind4(prefix: string = DEFAULT_PREFIX): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);
  const typographyTokens = getComponentSpecDeclarations(ctx);

  // tailwind4 모듈의 함수 사용
  const themeCode = tailwind4.getTailwind4CompleteThemeCode(tokens, typographyTokens, {
    sourcePrefix: prefix,
    prefix: "", // 접두사 제거 (--dimension-x0_5 형태로 출력)
    banner: "",
  });

  const writePath = path.join(process.cwd(), dir, "index.css");

  await writeFile(writePath, themeCode);
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
          default: DEFAULT_PREFIX,
        });
    },
    async (argv) => {
      console.log("Start");
      await writeTokenTs(argv.prefix);
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
          default: DEFAULT_PREFIX,
        });
    },
    async (argv) => {
      console.log("Start");
      await writeComponentSpec(argv.prefix);
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
        .option("generator", {
          describe: "Path to custom generator module",
          type: "string",
        })
        .option("prefix", {
          describe: "Prefix for generated tokens",
          type: "string",
          default: DEFAULT_PREFIX,
        });
    },
    async (argv) => {
      console.log("Start");
      await writeTokenCss(argv.generator, argv.prefix);
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
    "json <dir>",
    "Generate JSON",
    (yargs) => {
      return yargs.positional("dir", {
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeJson();
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
          default: DEFAULT_PREFIX,
        });
    },
    async (argv) => {
      console.log("Start");
      await writeTailwind3Plugin(argv.prefix);
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
          default: DEFAULT_PREFIX,
        });
    },
    async (argv) => {
      console.log("Start");
      await writeTailwind4(argv.prefix);
      console.log("Done");
    },
  )
  .help().argv;
