import { parse } from "csv-parse";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { pascalCase } from "change-case";
import * as availableIcons from "@daangn/react-icon";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.tsv");
const data = fs.readFileSync(filePath, "utf8");

parse(data, { delimiter: "\t" }, (_err, records) => {
  const newEntries = [];

  for (const [key, value, ar] of records) {
    const pascalKey = pascalCase(key);
    const isActionRequired = ar.trim() === "1";

    if (value === "") {
      throw new Error(`"${key}" has no mapping value`);
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

    newEntries.push([
      `${pascalKey}Thin`,
      { newName: pascalValue.line, ...(isActionRequired && { isActionRequired }) },
    ]);
    newEntries.push([
      `${pascalKey}Regular`,
      { newName: pascalValue.line, ...(isActionRequired && { isActionRequired }) },
    ]);
    newEntries.push([
      `${pascalKey}Fill`,
      { newName: pascalValue.fill, ...(isActionRequired && { isActionRequired }) },
    ]);
  }

  const identifierMap = Object.fromEntries(newEntries);

  fs.writeFileSync(
    path.join(path.dirname(filePath), "identifier-map.json.log"),
    JSON.stringify(identifierMap, null, 2),
  );
});
