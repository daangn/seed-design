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
  tailwind,
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

async function readYamlFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const model = YAML.parse(content) as Authoring.Model;
    const ctx = buildContext([
      {
        fileName: filePath,
        ast: Authoring.fromObject(model),
      },
    ]);

    return getTokenDeclarations(ctx);
  } catch (error) {
    console.error(`Error reading YAML file ${filePath}:`, error);
    process.exit(1);
  }
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

async function writeTailwindPlugin(ymlFile?: string | string[], outPath?: string): Promise<string> {
  if (!ymlFile || !outPath) {
    const { ctx } = await prepare();
    const tokens = getTokenDeclarations(ctx);
    const code = tailwind.getTailwindPluginCode(tokens);

    const pluginPath = path.join(process.cwd(), dir, "index.ts");

    await writeFile(pluginPath, code);
    return pluginPath;
  }

  // 여러 YAML 파일 지원
  const allTokens = [];
  const fileList = Array.isArray(ymlFile) ? ymlFile : [ymlFile];

  for (const filePath of fileList) {
    try {
      console.log(`Reading file: ${filePath}`);
      const tokens = await readYamlFile(filePath);
      allTokens.push(...tokens);
    } catch (error) {
      console.error(`Error reading YAML file ${filePath}:`, error);
      process.exit(1);
    }
  }

  const code = tailwind.getTailwindPluginCode(allTokens);
  const outFile = path.join(outPath, "index.ts");

  await writeFile(outFile, code);
  return outFile;
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

if (command === "tailwind-plugin") {
  console.log("Start");
  writeTailwindPlugin().then(() => {
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
    "tailwind-plugin",
    "생성된 tailwind 플러그인을 만듭니다",
    (yargs) => {
      return yargs
        .option("file", {
          alias: "f",
          describe: "YAML 파일 경로 (여러 파일 지정 가능)",
          type: "array",
          default: ["./packages/rootage/color.yaml"],
        })
        .option("output", {
          alias: "o",
          describe: "출력 파일 경로",
          type: "string",
          default: "./packages/tailwind-plugin/src/index.ts",
        });
    },
    async (argv) => {
      console.log("Start");
      // file 매개변수가 string[] 또는 string인지 확인하고 항상 string[] 배열로 반환
      const files = Array.isArray(argv.file)
        ? argv.file.map((file) => String(file))
        : [String(argv.file)];

      await writeTailwindPlugin(files, argv.output as string);
      console.log("Done");
    },
  )
  .help().argv;
