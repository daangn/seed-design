#!/usr/bin/env node

import { parse, stringifyTs } from "@seed-design/component-spec-core";
import fs from "fs-extra";
import path from "node:path";
import YAML from "yaml";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const artifactsPath = require.resolve("@seed-design/component-spec-artifacts");
const artifactsDir = path.dirname(artifactsPath);

const [, , dir = "./"] = process.argv;

async function write() {
  const fileNames = await fs.readdir(artifactsDir);
  const filesToRead = fileNames.filter((fileName) => fileName.endsWith(".yaml"));

  return Promise.all(
    filesToRead.map(async (name) => {
      const content = await fs.readFile(path.join(artifactsDir, name), "utf-8");
      const definition = YAML.parse(content);
      const code = stringifyTs(parse(definition));
      const writePath = path.join(process.cwd(), dir, `${name.split(".")[0]}.vars.ts`);

      console.log("Writing", name, "to", writePath);

      fs.writeFileSync(writePath, code);
    }),
  );
}

write().then(() => {
  console.log("Done");
});
