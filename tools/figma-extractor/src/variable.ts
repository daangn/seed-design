import { camelCase } from "change-case";
import { rgba } from "color2k";
import dedent from "dedent";

const COLOR_COLLECTIONS = ["Color"];
const UNIT_COLLECTIONS = ["Unit", "Numbers"]; // V3 = Unit

const LIGHT_MODE_THEME = "theme-light";
const DARK_MODE_THEME = "theme-dark";
const UNIT_MODE = "Mode 1"; // Value로 되어있는데 기본값은 그냥 Mode 1로 되어있음

const lightModeTemplate = (css: string) => dedent`
/* Light Mode */
:root[data-seed][data-seed="light-only"][data-seed-scale-color="dark"],
:root[data-seed][data-seed-scale-color="light"]:not([data-seed="dark-only"]),
:root[data-seed]:not([data-seed="dark-only"]) [data-seed-scale-color="light"] {
  ${css}
}
`;

const darkModeTemplate = (css: string) => dedent`
/* Dark Mode */
:root[data-seed][data-seed="dark-only"][data-seed-scale-color="light"],
:root[data-seed][data-seed-scale-color="dark"]:not([data-seed="light-only"]),
:root[data-seed]:not([data-seed="light-only"]) [data-seed-scale-color="dark"] {
  ${css}
}
`;

const unitTemplate = (css: string) => dedent`
/* Units, Static Colors */
:root[data-seed] {
  ${css}
}
`;

export function generateCss() {
  const unitCss = generateUnitCss(); // NOT READY
  const colorCss = generateColorCss();

  const css = dedent`
    ${colorCss}
  `;

  return css;
}

function generateUnitCss() {
  const collections = figma.variables.getLocalVariableCollections();
  const variables = figma.variables.getLocalVariables();

  const unitCollection = collections.find((collection) =>
    UNIT_COLLECTIONS.includes(collection.name),
  );

  if (!unitCollection) {
    throw new Error("Unit collection not found");
  }

  const unitVariables = variables.filter(
    (variable) => variable.variableCollectionId === unitCollection.id,
  );

  const valueMode = unitCollection.modes.find((mode) => mode.name === UNIT_MODE);

  if (!valueMode) {
    throw new Error(`Mode not found, value: ${valueMode}`);
  }

  const UnitsCss = unitVariables
    .map((variable) => toCssDeclaration(variable, valueMode.modeId))
    .sort((a, b) => a.localeCompare(b))
    .join("\n  ");

  const css = dedent`
    ${unitTemplate(UnitsCss)}
  `;

  return css;
}

function generateColorCss() {
  const collections = figma.variables.getLocalVariableCollections();
  const variables = figma.variables.getLocalVariables();

  // 함수 분리
  const colorCollection = collections.find((collection) =>
    COLOR_COLLECTIONS.includes(collection.name),
  );

  console.log("colorCollection", colorCollection);

  if (!colorCollection) {
    throw new Error("Color collection not found");
  }

  const colorVariables = variables.filter(
    (variable) => variable.variableCollectionId === colorCollection.id,
  );

  const lightMode = colorCollection.modes.find((mode) => mode.name === LIGHT_MODE_THEME);
  const darkMode = colorCollection.modes.find((mode) => mode.name === DARK_MODE_THEME);

  if (!lightMode || !darkMode) {
    throw new Error(`Mode not found, light: ${lightMode}, dark: ${darkMode}`);
  }

  const lightColorsCss = colorVariables
    .map((variable) => toCssDeclaration(variable, lightMode.modeId))
    .sort((a, b) => a.localeCompare(b))
    .join("\n  ");

  const darkColorsCss = colorVariables
    .map((variable) => toCssDeclaration(variable, darkMode.modeId))
    .sort((a, b) => a.localeCompare(b))
    .join("\n  ");

  const css = dedent`
    ${lightModeTemplate(lightColorsCss)}
    ${darkModeTemplate(darkColorsCss)}
  `;

  return css;
}

function figmaColorVarToCssVar(name: string) {
  const [group, colorName] = name.split("/") as [string, string];

  return `--seed-color-${group}-${colorName}`;
}

function figmaUnitVarToCssVar(name: string) {
  const [group, value] = name.split("/") as [string, string];

  return `--seed-${group}-${value}`;
}

function figmaColorVarToJsVar(name: string) {
  const [group, colorName] = name.split("/") as [string, string];

  return camelCase(colorName, { mergeAmbiguousCharacters: true });
}

function toCssDeclaration(variable: Variable, modeId: string) {
  const value = variable.valuesByMode[modeId]!;

  if (typeof value === "number") {
    const name = figmaUnitVarToCssVar(variable.name);
    return `${name}: ${value};`;
  }

  if (typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS") {
    const name = figmaColorVarToCssVar(variable.name);
    const aliasName = figma.variables.getVariableById(value.id)!.name;
    return `${name}: var(${figmaColorVarToCssVar(aliasName)});`;
  }

  const name = figmaColorVarToCssVar(variable.name);
  const { r, g, b, a } = variable.valuesByMode[modeId] as RGBA;
  return `${name}: ${rgba(r * 255, g * 255, b * 255, a)};`;
}

function toJsDeclaration(variable: Variable) {
  return `export const ${figmaColorVarToJsVar(
    variable.name,
  )} = "var(${figmaColorVarToCssVar(variable.name)})";`;
}
