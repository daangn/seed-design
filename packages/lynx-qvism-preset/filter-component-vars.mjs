import fs from "node:fs";
import path from "node:path";

const componentDir = path.join(import.meta.dirname, "src/vars/component");

const lynxComponentSpecs = [
  "action-button",
  "bottom-sheet",
  "bottom-sheet-handle",
  "checkbox",
  "checkbox-group",
  "checkmark",
  "progress-circle",
  "radio",
  "radio-group",
  "radiomark",
  "switch",
  "switchmark",
  "tag-group",
  "tag-group-item",
];

const keepFiles = new Set([
  "index.d.ts",
  "index.mjs",
  ...lynxComponentSpecs.flatMap((name) => [`${name}.d.ts`, `${name}.mjs`]),
]);

for (const entry of fs.readdirSync(componentDir)) {
  if (!keepFiles.has(entry)) {
    fs.rmSync(path.join(componentDir, entry));
  }
}

const toCamelCase = (value) => value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const indexMjs = `${lynxComponentSpecs
  .map((name) => `export { vars as ${toCamelCase(name)} } from "./${name}.mjs";`)
  .join("\n")}\n`;

const indexDts = `${lynxComponentSpecs
  .map((name) => `export { vars as ${toCamelCase(name)} } from "./${name}";`)
  .join("\n")}\n`;

fs.writeFileSync(path.join(componentDir, "index.mjs"), indexMjs);
fs.writeFileSync(path.join(componentDir, "index.d.ts"), indexDts);
