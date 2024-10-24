import { parse } from "csv-parse";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { pascalCase } from "change-case";
import * as availableIcons from "@daangn/react-icon";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.tsv");
const data = fs.readFileSync(filePath, "utf8");

parse(data, { delimiter: "\t" }, (_err, records) => {
  const result = [];

  for (const [oldName, newName, ar] of records) {
    const pascalOldName = pascalCase(oldName);
    const isActionRequired = ar.trim() === "1";

    if (newName === "") {
      throw new Error(`"${oldName}" has no mapping value`);
    }

    const pascalValue = {
      line: `${pascalCase(newName)}Line`,
      fill: `${pascalCase(newName)}Fill`,
    };

    const isAvailableNow = pascalValue.line in availableIcons && pascalValue.fill in availableIcons;

    if (!isAvailableNow) {
      console.warn(
        `"${oldName}" -> "${newName}" is not available in @daangn/react-icon. Set keepForNow: true`,
      );
    }

    result.push({
      oldName: `${pascalOldName}Thin`,
      newName: pascalValue.line,
      ...(isActionRequired && { isActionRequired }),
      ...(!isAvailableNow && { keepForNow: true }),
    });

    result.push({
      oldName: `${pascalOldName}Regular`,
      newName: pascalValue.line,
      ...(isActionRequired && { isActionRequired }),
      ...(!isAvailableNow && { keepForNow: true }),
    });

    result.push({
      oldName: `${pascalOldName}Fill`,
      newName: pascalValue.fill,
      ...(isActionRequired && { isActionRequired }),
      ...(!isAvailableNow && { keepForNow: true }),
    });
  }

  fs.writeFileSync(
    path.join(path.dirname(filePath), "identifier-match.json.log"),
    JSON.stringify(result, null, 2),
  );
});
