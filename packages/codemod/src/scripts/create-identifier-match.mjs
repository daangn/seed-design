import { parse } from "csv-parse";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { pascalCase } from "change-case";
import * as availableMonochromeIcons from "@karrotmarket/react-monochrome-icon";
import * as availableMulticolorIcons from "@karrotmarket/react-multicolor-icon";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.tsv");
const data = fs.readFileSync(filePath, "utf8");

parse(data, { delimiter: "\t" }, (_err, records) => {
  const result = [];

  for (const [oldName, newName, isActionRequiredValue, moveToMulticolorValue] of records) {
    const pascalOldName = pascalCase(oldName);
    const isActionRequired = isActionRequiredValue.trim() === "1";
    const moveToMulticolor = moveToMulticolorValue.trim() === "1";

    if (newName === "") {
      throw new Error(`"${oldName}" has no mapping value`);
    }

    const pascalValue = {
      default: `${pascalCase(newName)}`,
      line: `${pascalCase(newName)}Line`,
      fill: `${pascalCase(newName)}Fill`,
    };

    if (moveToMulticolor && pascalValue.default in availableMulticolorIcons === false) {
      console.warn(
        `"${pascalValue.default}" is not available in @karrotmarket/react-multicolor-icon.`,
      );
    }

    if (!moveToMulticolor) {
      if (pascalValue.line in availableMonochromeIcons === false) {
        console.warn(
          `"${pascalValue.line}" is not available in @karrotmarket/react-monochrome-icon.`,
        );
      }

      if (pascalValue.fill in availableMonochromeIcons === false) {
        console.warn(
          `"${pascalValue.fill}" is not available in @karrotmarket/react-monochrome-icon.`,
        );
      }
    }

    result.push({
      oldName: `${pascalOldName}Thin`,
      newName: moveToMulticolor ? pascalValue.default : pascalValue.line,
      ...(isActionRequired && { isActionRequired }),
      ...(moveToMulticolor && { moveToMulticolor }),
    });

    result.push({
      oldName: `${pascalOldName}Regular`,
      newName: moveToMulticolor ? pascalValue.default : pascalValue.line,
      ...(isActionRequired && { isActionRequired }),
      ...(moveToMulticolor && { moveToMulticolor }),
    });

    result.push({
      oldName: `${pascalOldName}Fill`,
      newName: moveToMulticolor ? pascalValue.default : pascalValue.fill,
      ...(isActionRequired && { isActionRequired }),
      ...(moveToMulticolor && { moveToMulticolor }),
    });
  }

  fs.writeFileSync(
    path.join(path.dirname(filePath), "identifier-match.json.log"),
    JSON.stringify(result, null, 2),
  );
});
