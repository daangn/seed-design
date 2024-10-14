import { camelCase } from "change-case";
import { rgba } from "color2k";
import dedent from "dedent";

const COLOR_COLLECTIONS = ["Color"];
const UNIT_COLLECTIONS = ["Unit", "Numbers"]; // V3 = Unit

const LIGHT_MODE_THEME = ["theme-light", "test-light"];
const DARK_MODE_THEME = ["theme-dark", "test-dark"];
const UNIT_MODE = "Mode 1"; // Value로 되어있는데 기본값은 그냥 Mode 1로 되어있음

/**
 * @example carotene | seed
 */
const DESIGN_SYSTEM_NAME = "seed";

const lightModeTemplate = (css: string) => dedent`
/* Light Mode */
:root[data-${DESIGN_SYSTEM_NAME}][data-${DESIGN_SYSTEM_NAME}="light-only"][data-${DESIGN_SYSTEM_NAME}-scale-color="dark"],
:root[data-${DESIGN_SYSTEM_NAME}][data-${DESIGN_SYSTEM_NAME}-scale-color="light"]:not([data-${DESIGN_SYSTEM_NAME}="dark-only"]),
:root[data-${DESIGN_SYSTEM_NAME}]:not([data-${DESIGN_SYSTEM_NAME}="dark-only"]) [data-${DESIGN_SYSTEM_NAME}-scale-color="light"] {
  ${css}
}
`;

const darkModeTemplate = (css: string) => dedent`
/* Dark Mode */
:root[data-${DESIGN_SYSTEM_NAME}][data-${DESIGN_SYSTEM_NAME}="dark-only"][data-${DESIGN_SYSTEM_NAME}-scale-color="light"],
:root[data-${DESIGN_SYSTEM_NAME}][data-${DESIGN_SYSTEM_NAME}-scale-color="dark"]:not([data-${DESIGN_SYSTEM_NAME}="light-only"]),
:root[data-${DESIGN_SYSTEM_NAME}]:not([data-${DESIGN_SYSTEM_NAME}="light-only"]) [data-${DESIGN_SYSTEM_NAME}-scale-color="dark"] {
  ${css}
}
`;

const unitTemplate = (css: string) => dedent`
/* Units, Static Colors */
:root[data-${DESIGN_SYSTEM_NAME}] {
  ${css}
}
`;

const jsonSchemaTemplate = (enums: string) => dedent`
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "additionalProperties": {
    "$ref": "#/definitions/anyObject"
  },
  "definitions": {
    "anyObject": {
      "type": "object",
      "properties": {
        "color": {
          "$ref": "#/definitions/colorValue"
        }
      },
      "additionalProperties": {
        "anyOf": [
          { "type": "string" },
          { "type": "number" },
          { "type": "boolean" },
          { "type": "array" },
          { "$ref": "#/definitions/anyObject" }
        ]
      }
    },
    "colorValue": {
      "type": "string",
      "enum": [${enums}]
    }
  }
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

export function generateJsonSchema() {
  const collections = figma.variables.getLocalVariableCollections();
  const variables = figma.variables.getLocalVariables();

  const colorCollection = collections.find((collection) =>
    COLOR_COLLECTIONS.includes(collection.name),
  );

  if (!colorCollection) {
    throw new Error("Color collection not found");
  }

  const colorVariables = variables.filter(
    (variable) => variable.variableCollectionId === colorCollection.id,
  );

  const enums = colorVariables.map((variable) => toJsonSchemaDeclaration(variable)).join(", ");

  const schema = jsonSchemaTemplate(enums);

  return schema;
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

  const colorCollection = collections.find((collection) =>
    COLOR_COLLECTIONS.includes(collection.name),
  );

  if (!colorCollection) {
    throw new Error("Color collection not found");
  }

  const colorVariables = variables.filter(
    (variable) => variable.variableCollectionId === colorCollection.id,
  );

  const lightMode = colorCollection.modes.find((mode) => LIGHT_MODE_THEME.includes(mode.name));
  const darkMode = colorCollection.modes.find((mode) => DARK_MODE_THEME.includes(mode.name));

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

  return `--${DESIGN_SYSTEM_NAME}-color-${group}-${colorName}`;
}

function figmaColorVarToSpecVar(name: string) {
  const [group, colorName] = name.split("/") as [string, string];

  return `$color.${group}.${colorName}`;
}

function figmaUnitVarToCssVar(name: string) {
  const [group, value] = name.split("/") as [string, string];

  return `--${DESIGN_SYSTEM_NAME}-${group}-${value}`;
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

function toJsonSchemaDeclaration(variable: Variable) {
  return `"${figmaColorVarToSpecVar(variable.name)}"`;
}
