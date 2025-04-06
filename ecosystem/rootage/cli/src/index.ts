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
import fs from "fs-extra";
import path from "node:path";
import YAML from "yaml";
import { createRequire } from "node:module";
import yargs from "yargs";

const require = createRequire(import.meta.url);

const artifactsPath = require.resolve("@seed-design/rootage-artifacts");
const artifactsDir = path.dirname(artifactsPath);

const [, , command, dir = "./"] = process.argv;

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

const PREFIX = "seed";
const tsStringifier = typescript.createStringifier({
  prefix: PREFIX,
});

async function writeTokenTs() {
  const { ctx } = await prepare();

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

async function writeComponentSpec() {
  const { ctx } = await prepare();

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

async function writeTokenCss() {
  const { ctx } = await prepare();

  const code = css.getTokenCss(
    {
      tokens: getTokenDeclarations(ctx),
      tokenCollections: getTokenCollectionDeclarations(ctx),
    },
    {
      prefix: PREFIX,
      banner: `:root, [data-seed-color-mode="system"] {
  color-scheme: light dark;
}

[data-seed-color-mode="light-only"] {
  color-scheme: light;
}

[data-seed-color-mode="dark-only"] {
  color-scheme: dark;
}

`,
      selectors: {
        global: {
          default: ":root",
        },
        color: {
          "theme-light": `:root,
:root[data-seed-color-mode="system"][data-seed-user-color-scheme="light"],
:root[data-seed-color-mode="light-only"],
:root [data-seed-color-mode="light-only"]`,
          "theme-dark": `:root[data-seed-color-mode="system"][data-seed-user-color-scheme="dark"],
:root[data-seed-color-mode="dark-only"],
:root [data-seed-color-mode="dark-only"]`,
        },
      },
    },
  );

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

async function writeTailwind3Plugin(): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);

  const typographyTokens = getComponentSpecDeclarations(ctx);
  const code = tailwind3.getTailwind3PluginCode(tokens, typographyTokens);

  const pluginPath = path.join(process.cwd(), dir, "index.ts");

  await writeFile(pluginPath, code);
  return pluginPath;
}

async function writeTailwind4(): Promise<string> {
  const { ctx } = await prepare();
  const tokens = getTokenDeclarations(ctx);
  const typographyTokens = getComponentSpecDeclarations(ctx);

  // tailwind4 모듈의 함수 사용
  const themeCode = tailwind4.getTailwind4CompleteThemeCode(tokens, typographyTokens, {
    sourcePrefix: "seed",
    prefix: "", // 접두사 제거 (--dimension-x0_5 형태로 출력)
    banner: `/**
 * SEED Design Tailwind 4.0 Theme
 * 이 파일은 Tailwind CSS 4.0에서 SEED 디자인 토큰을 사용하기 위한 테마 변수를 제공합니다.
 */
`,
  });

  const writePath = path.join(process.cwd(), dir, "index.css");

  await writeFile(writePath, themeCode);
  return writePath;
}

if (command === "token-ts") {
  console.log("Start");
  writeTokenTs().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

if (command === "component-spec") {
  console.log("Start");
  writeComponentSpec().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

if (command === "token-css") {
  console.log("Start");
  writeTokenCss().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

if (command === "json-schema") {
  console.log("Start");
  writeJsonSchema().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

if (command === "json") {
  console.log("Start");
  writeJson().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

if (command === "tailwind3-plugin") {
  console.log("Start");
  writeTailwind3Plugin().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

if (command === "tailwind4") {
  console.log("Start");
  writeTailwind4().then(() => {
    console.log("Done");
    process.exit(0);
  });
}

yargs(process.argv.slice(2))
  .command(
    "token-ts <dir>",
    "Generate TypeScript tokens",
    (yargs) => {
      return yargs.positional("dir", {
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeTokenTs();
      console.log("Done");
    },
  )
  .command(
    "component-spec <dir>",
    "Generate component specs",
    (yargs) => {
      return yargs.positional("dir", {
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeComponentSpec();
      console.log("Done");
    },
  )
  .command(
    "token-css <dir>",
    "Generate CSS tokens",
    (yargs) => {
      return yargs.positional("dir", {
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeTokenCss();
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
      return yargs.positional("dir", {
        alias: "o",
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeTailwind3Plugin();
      console.log("Done");
    },
  )
  .command(
    "tailwind4 <dir>",
    "Generate Tailwind 4.0",
    (yargs) => {
      return yargs.positional("dir", {
        alias: "o",
        describe: "Output directory",
        type: "string",
        default: "./",
      });
    },
    async () => {
      console.log("Start");
      await writeTailwind4();
      console.log("Done");
    },
  )
  .help().argv;
