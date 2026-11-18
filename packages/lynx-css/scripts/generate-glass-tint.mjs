import fs from "node:fs";
import path from "node:path";

import collectionsArtifact from "@seed-design/rootage-artifacts/collections";
import colorArtifact from "@seed-design/rootage-artifacts/color";

import { vars as chip } from "../vars/component/chip.mjs";
import { vars as floatingActionButton } from "../vars/component/floating-action-button.mjs";

// Recipes that can render iOS Liquid Glass, by recipe file name. Like native SEED's `spec.root.color`, the glass tint
// is the component spec's `root.color` for the current variant and state. Lynx `glass-tint-color` does not resolve CSS
// variables, so each color is resolved here for both color schemes and appended to the recipe module as `glassTint`.
const components = { chip, "floating-action-button": floatingActionButton };
const colorSchemes = { light: "theme-light", dark: "theme-dark" };

// `GlassTint` has one value per scheme. Fail instead of dropping a Rootage color mode that is added or renamed.
const colorModes = collectionsArtifact.data
  .find(({ name }) => name === "color")
  ?.modes.map(({ id }) => id);
const schemeModes = Object.values(colorSchemes);
if (
  colorModes?.length !== schemeModes.length ||
  !colorModes.every((mode) => schemeModes.includes(mode))
) {
  throw new Error(`Unsupported Rootage color modes: ${JSON.stringify(colorModes)}`);
}

const recipesDirectory = path.join(import.meta.dirname, "..", "recipes");

// Rootage `$color.bg.neutral-solid` is the CSS variable `--seed-color-bg-neutral-solid`.
const tokenIdByCssValue = new Map(
  Object.keys(colorArtifact.data.tokens).map((tokenId) => [
    `var(--seed-${tokenId.slice(1).replaceAll(".", "-")})`,
    tokenId,
  ]),
);

function resolveColor(tokenId, mode) {
  const token = colorArtifact.data.tokens[tokenId];

  if (!token) {
    throw new Error(`Unknown Rootage token: ${tokenId}`);
  }

  const value = token.values[mode]?.value;

  if (typeof value === "string" && value.startsWith("$")) {
    return resolveColor(value, mode);
  }

  // Lynx parses `#rrggbb` and `#rrggbbaa` (CSS order) for `glass-tint-color`.
  if (typeof value !== "string" || !/^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    throw new Error(`Expected ${tokenId} (${mode}) to resolve to a hex color: ${value}`);
  }

  return value;
}

function getGlassTints(name, spec) {
  const tints = {};

  for (const [variantKey, states] of Object.entries(spec)) {
    for (const [stateKey, slots] of Object.entries(states)) {
      const color = slots.root?.color;

      if (color === undefined) continue;

      const tokenId = tokenIdByCssValue.get(color);

      if (!tokenId) {
        throw new Error(
          `${name}.${variantKey}.${stateKey}.root.color is not a color token: ${color}`,
        );
      }

      tints[variantKey] ??= {};
      tints[variantKey][stateKey] = Object.fromEntries(
        Object.entries(colorSchemes).map(([scheme, mode]) => [scheme, resolveColor(tokenId, mode)]),
      );
    }
  }

  return tints;
}

// Two levels, variant then state, formatted as Biome would.
function printTints(tints, printTint, separator) {
  const lines = [];

  for (const [variantKey, states] of Object.entries(tints)) {
    lines.push(`  ${variantKey}: {`);
    for (const [stateKey, tint] of Object.entries(states)) {
      lines.push(`    ${stateKey}: ${printTint(tint)}${separator}`);
    }
    lines.push(`  }${separator}`);
  }

  return `{\n${lines.join("\n")}\n}`;
}

// qvism rewrites the recipe modules first. Cut a previous block so running this script again does not duplicate it.
const marker =
  "// Generated from Rootage component specs and color tokens by scripts/generate-glass-tint.mjs.";
const header = `${marker} Do not edit directly.\n// Liquid Glass tint (\`root.color\`) per variant and state, resolved for each color scheme.\n`;

function appendBlock(file, block) {
  const content = fs.readFileSync(file, "utf8");
  const index = content.indexOf(marker);
  const recipe = (index === -1 ? content : content.slice(0, index)).trimEnd();
  fs.writeFileSync(file, `${recipe}\n\n${header}${block}`);
}

for (const [name, spec] of Object.entries(components)) {
  const tints = getGlassTints(name, spec);

  appendBlock(
    path.join(recipesDirectory, `${name}.mjs`),
    `export const glassTint = ${printTints(tints, (tint) => `{ light: "${tint.light}", dark: "${tint.dark}" }`, ",")};\n`,
  );
  appendBlock(
    path.join(recipesDirectory, `${name}.d.ts`),
    `export interface GlassTint {\n  light: string;\n  dark: string;\n}\n\nexport declare const glassTint: ${printTints(tints, () => "GlassTint", ";")};\n`,
  );
}
