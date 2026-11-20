import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import preset from "@seed-design/lynx-qvism-preset";
import rootageIndex from "@seed-design/rootage-artifacts/index.json";

// Recipes whose name differs from the Rootage component id they draw. Sub-recipes (app-bar-main, *-positioner) are
// not listed: they map by their own name, and get an empty spec when Rootage has none.
const rootageIdByRecipeName = {
  "app-bar": "top-navigation",
  tabs: "tablist",
  "chip-tabs": "chip-tablist",
  "field-button": "input-button",
};

const require = createRequire(import.meta.url);
const recipesDirectory = path.join(import.meta.dirname, "..", "recipes");

const rootageComponents = new Map(
  rootageIndex.resources
    .filter((resource) => resource.path.startsWith("/components/"))
    .map((resource) => require(`@seed-design/rootage-artifacts${resource.path}`))
    .map((component) => [component.metadata.id, component]),
);

for (const [recipeName, rootageId] of Object.entries(rootageIdByRecipeName)) {
  if (!rootageComponents.has(rootageId)) {
    throw new Error(`Unknown Rootage component for recipe ${recipeName}: ${rootageId}`);
  }
}

const pascalCase = (id) => id.replace(/(?:^|-)([a-z0-9])/g, (_, char) => char.toUpperCase());
const camelCase = (id) => id.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());

// `lynx-test-tag` spec: Rootage name and variant axes, with the Lynx recipe's own defaults for those axes.
function getSeedTagSpec(recipeName, defaultVariants) {
  const rootageId = rootageIdByRecipeName[recipeName] ?? recipeName;
  const component = rootageComponents.get(rootageId);

  if (!component) return { name: pascalCase(recipeName), axes: [], defaults: {} };

  const axes = Object.keys(component.data.schema?.variants ?? {});
  const defaults = Object.fromEntries(
    axes.filter((axis) => axis in defaultVariants).map((axis) => [axis, defaultVariants[axis]]),
  );

  return { name: pascalCase(component.metadata.id), axes, defaults };
}

const printKey = (key) => (/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key));

function printObject(object, prefix = "", separator = ", ") {
  const entries = Object.entries(object);
  if (entries.length === 0) return "{}";
  return `{ ${entries.map(([key, value]) => `${prefix}${printKey(key)}: ${JSON.stringify(value)}`).join(separator)} }`;
}

function printSpec(spec) {
  return `{\n  name: ${JSON.stringify(spec.name)},\n  axes: [${spec.axes.map((axis) => JSON.stringify(axis)).join(", ")}],\n  defaults: ${printObject(spec.defaults)},\n}`;
}

function printSpecType(spec) {
  return `{\n  readonly name: ${JSON.stringify(spec.name)};\n  readonly axes: readonly [${spec.axes.map((axis) => JSON.stringify(axis)).join(", ")}];\n  readonly defaults: ${printObject(spec.defaults, "readonly ", "; ")};\n}`;
}

// qvism rewrites the recipe modules first. Cut a previous block so running this script again does not duplicate it.
const marker =
  "// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs.";
const header = `${marker} Do not edit directly.\n// \`lynx-test-tag\` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.\n`;

function appendBlock(file, block) {
  const content = fs.readFileSync(file, "utf8");
  const index = content.indexOf(marker);
  const recipe = (index === -1 ? content : content.slice(0, index)).trimEnd();
  fs.writeFileSync(file, `${recipe}\n\n${header}${block}`);
}

for (const recipe of Object.values(preset.theme.recipes)) {
  const jsName = camelCase(recipe.name);
  const mjsFile = path.join(recipesDirectory, `${recipe.name}.mjs`);

  // Fail instead of appending a name that does not match the qvism exports.
  if (!fs.readFileSync(mjsFile, "utf8").includes(`export const ${jsName}VariantMap`)) {
    throw new Error(`${mjsFile} does not export ${jsName}VariantMap`);
  }

  const spec = getSeedTagSpec(recipe.name, recipe.defaultVariants ?? {});

  appendBlock(mjsFile, `export const ${jsName}SeedTagSpec = ${printSpec(spec)};\n`);
  appendBlock(
    path.join(recipesDirectory, `${recipe.name}.d.ts`),
    `export declare const ${jsName}SeedTagSpec: ${printSpecType(spec)};\n`,
  );
}
