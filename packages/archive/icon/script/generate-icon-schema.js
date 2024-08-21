import iconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";
import { writeFileSync } from "fs";
import { resolve } from "path";
import dedent from "string-dedent";
import pkg from "../package.json" assert { type: "json" };

const iconSchema = dedent`
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "https://raw.githubusercontent.com/daangn/seed-design/%40seed-design/icon%40${
      pkg.version
    }/packages/icon/schema/schema.json",
    "title": "Karrot UI Icon Schema",
    "description": "JSON Schema for Karrot UI Icon v${pkg.version}",
    "type": "object",
    "properties": {
      "icons": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "type": "string",
          "enum": [
            ${Object.keys(iconData)
              .map((name) => `"${name}"`)
              .join(",\n          ")}
          ]
        }
      },
      "componentPath": {
        "type": "string",
        "pattern": "^.+.tsx$"
      }
    },
    "required": ["icons"]
  }\n
`;

console.log("⚙️ Generating icon schema...");

writeFileSync(resolve("./schema", "schema.json"), iconSchema, {
  encoding: "utf-8",
});

console.log("✅ Done!");
