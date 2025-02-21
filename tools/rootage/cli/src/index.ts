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
  validate,
} from "@seed-design/rootage-core";
import fs from "fs-extra";
import path from "node:path";
import YAML from "yaml";
import { createRequire } from "node:module";

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
  const cjsResults = tsStringifier.getTokenCjs(getTokenDeclarations(ctx));

  for (const result of mjsResults) {
    const writePath = path.join(process.cwd(), dir, result.path);

    console.log("Writing", result.path, "to", writePath);

    if (!fs.existsSync(path.dirname(writePath))) {
      fs.mkdirpSync(path.dirname(writePath));
    }
    fs.writeFileSync(writePath, result.code);
  }

  for (const result of cjsResults) {
    const writePath = path.join(process.cwd(), dir, result.path);

    console.log("Writing", result.path, "to", writePath);

    fs.writeFileSync(writePath, result.code);
  }

  for (const result of dtsResults) {
    const writePath = path.join(process.cwd(), dir, result.path);

    console.log("Writing", result.path, "to", writePath);

    fs.writeFileSync(writePath, result.code);
  }
}

async function writeComponentSpec() {
  const { ctx } = await prepare();

  const specs = getComponentSpecDeclarations(ctx);
  for (const spec of specs) {
    const mjsCode = tsStringifier.getComponentSpecMjs(spec);
    const mjsWritePath = path.join(process.cwd(), dir, `${spec.id}.mjs`);
    const cjsCode = tsStringifier.getComponentSpecCjs(spec);
    const cjsWritePath = path.join(process.cwd(), dir, `${spec.id}.cjs`);

    console.log("Writing", spec.name, "to", mjsWritePath);

    if (!fs.existsSync(path.dirname(mjsWritePath))) {
      fs.mkdirpSync(path.dirname(mjsWritePath));
    }
    fs.writeFileSync(mjsWritePath, mjsCode);

    console.log("Writing", spec.name, "to", cjsWritePath);

    if (!fs.existsSync(path.dirname(cjsWritePath))) {
      fs.mkdirpSync(path.dirname(cjsWritePath));
    }
    fs.writeFileSync(cjsWritePath, cjsCode);

    const dtsCode = tsStringifier.getComponentSpecDts(spec);
    const dtsWritePath = path.join(process.cwd(), dir, `${spec.id}.d.ts`);

    console.log("Writing", spec.name, "to", dtsWritePath);

    fs.writeFileSync(dtsWritePath, dtsCode);
  }

  const mjsIndexCode = tsStringifier.getComponentSpecIndexMjs(specs);
  const mjsIndexWritePath = path.join(process.cwd(), dir, "index.mjs");

  console.log("Writing index to", mjsIndexWritePath);

  fs.writeFileSync(mjsIndexWritePath, mjsIndexCode);

  const dtsIndexCode = tsStringifier.getComponentSpecIndexDts(specs);
  const dtsIndexWritePath = path.join(process.cwd(), dir, "index.d.ts");

  console.log("Writing index to", dtsIndexWritePath);

  fs.writeFileSync(dtsIndexWritePath, dtsIndexCode);
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
      banner: `:root[data-seed] {
  color-scheme: light dark;
}

:root[data-seed="light-only"] {
  color-scheme: light;
}

:root[data-seed="dark-only"] {
  color-scheme: dark;
}

`,
      selectors: {
        global: {
          default: ":root[data-seed]",
        },
        color: {
          "theme-light": `:root[data-seed][data-seed="light-only"][data-seed-scale-color="dark"],
:root[data-seed][data-seed-scale-color="light"]:not([data-seed="dark-only"]),
:root[data-seed]:not([data-seed="dark-only"]) [data-seed-scale-color="light"]`,
          "theme-dark": `:root[data-seed][data-seed="dark-only"][data-seed-scale-color="light"],
:root[data-seed][data-seed-scale-color="dark"]:not([data-seed="light-only"]),
:root[data-seed]:not([data-seed="light-only"]) [data-seed-scale-color="dark"]`,
        },
      },
    },
  );

  const writePath = path.join(process.cwd(), dir, "token.css");

  console.log("Writing token css to", writePath);

  fs.writeFileSync(writePath, code);
}

async function writeJsonSchema() {
  const { ctx } = await prepare();

  const jsonSchema = jsonschema.getJsonSchema(getTokenDeclarations(ctx));
  const writePath = path.join(artifactsDir, "components", "schema.json");

  console.log("Writing schema to", writePath);

  fs.writeFileSync(writePath, jsonSchema);
}

async function writeJson() {
  const { ctx, models } = await prepare();

  for (const { fileName, ast } of getSourceFiles(ctx)) {
    const content = exchange.getModel(ast);
    const code = JSON.stringify(content, null, 2);
    const relativePath = path.relative(artifactsDir, fileName);
    const withoutExt = relativePath.replace(path.extname(relativePath), "");
    const writePath = path.join(process.cwd(), dir, `${withoutExt}.json`);

    console.log("Writing", withoutExt, "to", writePath);

    if (!fs.existsSync(path.dirname(writePath))) {
      fs.mkdirpSync(path.dirname(writePath));
    }

    fs.writeFileSync(writePath, code);
  }

  // Generate and write index.json
  const artifactsPkg = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "package.json"), "utf-8"),
  );
  const indexContent = exchange.getIndex(models, { version: artifactsPkg.version });
  const indexPath = path.join(process.cwd(), dir, "index.json");

  console.log("Writing index to", indexPath);
  fs.writeFileSync(indexPath, JSON.stringify(indexContent, null, 2));
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
