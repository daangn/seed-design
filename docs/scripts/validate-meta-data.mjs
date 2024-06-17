import Ajv from "ajv";
import { prettify } from "awesome-ajv-errors";
import chalk from "chalk";
import fs from "node:fs/promises";
import path from "node:path";

import componentMetaSchema from "../schema/component-meta.json" assert { type: "json" };
import primitiveMetaSchema from "../schema/primitive-meta.json" assert { type: "json" };

const ajv = new Ajv();

// ---------실행 부분 시작--------- //

console.log();
console.log(chalk.bold("---------------------------------------------"));
console.log(chalk.bold("Validating meta.json files..."));

await validateJsonInDir({
  dir: path.resolve("./content/component"),
  validate: ajv.compile(componentMetaSchema),
  type: "component",
});
await validateJsonInDir({
  dir: path.resolve("./content/primitive"),
  validate: ajv.compile(primitiveMetaSchema),
  type: "primitive",
});

console.log(chalk.bold("Finished validating meta.json files"));
console.log(chalk.bold("---------------------------------------------"));
console.log();

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
          if (type === "component") {
            console.log(
              `${chalk.bgBlue(`[${type}]`)} ${fileName}: ${chalk.red.bold(
                "invalid",
              )}`,
            );
          }

          if (type === "primitive") {
            console.log(
              `${chalk.bgYellow(`[${type}]`)} ${fileName}: ${chalk.red.bold(
                "invalid",
              )}`,
            );
          }

          console.error(prettify(validate, { data: json }));
          process.exit(1);
        } else {
          if (type === "component") {
            console.log(
              `${chalk.bgBlue(`[${type}]`)} ${fileName}: ${chalk.green.bold(
                "valid",
              )}`,
            );
          }

          if (type === "primitive") {
            console.log(
              `${chalk.bgYellow(`[${type}]`)} ${fileName}: ${chalk.green.bold(
                "valid",
              )}`,
            );
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
