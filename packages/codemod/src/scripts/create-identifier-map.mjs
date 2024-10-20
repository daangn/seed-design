import { parse } from "csv-parse";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { pascalCase } from "change-case";
// import * as availableIcons from "@seed-design/react-icon";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.tsv");
const data = fs.readFileSync(filePath, "utf8");
// const availableIcons = Object.keys(icons);

parse(data, { delimiter: "\t" }, (_err, records) => {
  const newEntries = [];

  for (const [key, value] of records) {
    const pascalKey = pascalCase(key);

    if (value === "") {
      newEntries.push([`${pascalKey}Thin`, null]);
      newEntries.push([`${pascalKey}Regular`, null]);
      newEntries.push([`${pascalKey}Fill`, null]);

      continue;
    }

    const pascalValue = pascalCase(value);

    // if (!availableIcons.includes(pascalValue)) {
    //   throw new Error(`Icon not found: ${pascalValue}`);
    // }

    newEntries.push([`${pascalKey}Thin`, `${pascalValue}Line`]);
    newEntries.push([`${pascalKey}Regular`, `${pascalValue}Line`]);
    newEntries.push([`${pascalKey}Fill`, `${pascalValue}Fill`]);
  }

  const identifierMap = Object.fromEntries(newEntries);

  fs.writeFileSync(
    path.join(path.dirname(filePath), "identifier-map.json.log"),
    JSON.stringify(identifierMap, null, 2),
  );
});
