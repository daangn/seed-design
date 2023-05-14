import Ajv from "ajv";
import { prettify } from "awesome-ajv-errors";
import fs from "node:fs/promises";
import path from "node:path";

import {
  componentMetaSchema,
  primitiveMetaSchema,
} from "./meta-data-schemas.mjs";

const ajv = new Ajv();

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

// ------------------ //

async function validateJsonInDir({ dir, validate, type }) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

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
