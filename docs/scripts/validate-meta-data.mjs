import Ajv from "ajv";
import { prettify } from "awesome-ajv-errors";
import fs from "node:fs/promises";
import path from "node:path";

import {
  componentMetaSchema,
  primitiveMetaSchema,
} from "./meta-data-schemas.mjs";

const ajv = new Ajv();

// ---------실행 부분 시작--------- //

console.log("Validating meta.json files...");

validateJsonInDir({
  dir: path.resolve("./content/component"),
  validate: ajv.compile(componentMetaSchema),
  type: "component",
});
validateJsonInDir({
  dir: path.resolve("./content/primitive"),
  validate: ajv.compile(primitiveMetaSchema),
  type: "primitive",
});

console.log("Finished validating meta.json files");

// ---------구현 부분 시작--------- //

async function validateJsonInDir({ dir, validate, type }) {
  try {
    const filesOrFolders = await fs.readdir(dir);

    for (const fileOrFolder of filesOrFolders) {
      const filePath = path.join(dir, fileOrFolder);

      const stats = await fs.stat(filePath);

      if (!stats.isDirectory()) {
        continue;
      }

      const subfiles = await fs.readdir(filePath);

      for (const subfile of subfiles) {
        if (path.extname(subfile) !== ".json") {
          continue;
        }

        const data = await fs.readFile(path.join(filePath, subfile), "utf8");

        const json = JSON.parse(data);
        const isValid = validate(json);
        const fileName = `${json.name.replaceAll(" ", "-").toLowerCase()}.json`;

        if (!isValid) {
          console.log(`${type}/${fileName} is invalid`);
          console.error(prettify(validate, { data: json }));

          process.exit(1);
        } else {
          // console.log(`${type}/${fileName} is valid`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
