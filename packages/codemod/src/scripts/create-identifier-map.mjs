import { parse } from "csv-parse";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { pascalCase } from "change-case";
import * as availableIcons from "@daangn/react-icon";

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

    const pascalValue = {
      line: `${pascalCase(value)}Line`,
      fill: `${pascalCase(value)}Fill`,
    };

    if (
      pascalValue.line in availableIcons === false ||
      pascalValue.fill in availableIcons === false
    ) {
      console.error(`"${value}" is not available in @daangn/react-icon`);
    }

    newEntries.push([`${pascalKey}Thin`, pascalValue.line]);
    newEntries.push([`${pascalKey}Regular`, pascalValue.line]);
    newEntries.push([`${pascalKey}Fill`, pascalValue.fill]);
  }

  const identifierMap = Object.fromEntries(newEntries);

  fs.writeFileSync(
    path.join(path.dirname(filePath), "identifier-map.json.log"),
    JSON.stringify(identifierMap, null, 2),
  );
});
