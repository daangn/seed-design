import { camelCase } from "change-case";
import { rgba } from "color2k";
import dedent from "dedent";

const COLOR_COLLECTIONS = ["Color"];
const UNIT_COLLECTIONS = ["Unit", "Numbers"]; // V3 = Unit
const PLATFORM_COLLECTIONS = ["Platform"];

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

interface JsonSchemaTemplate {
  colorEnumsStr: string;
  fontWeightEnumsStr: string;
  fontSizeEnumsStr: string;
  cornerRadiusEnumsStr: string;
}
const jsonSchemaTemplate = ({
  colorEnumsStr,
  cornerRadiusEnumsStr,
  fontSizeEnumsStr,
  fontWeightEnumsStr,
}: JsonSchemaTemplate) => dedent`
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
        },
        "fontWeight": {
          "$ref": "#/definitions/fontWeightValue"
        },
        "fontSize": {
          "$ref": "#/definitions/fontSizeValue"
        },
        "cornerRadius": {
          "$ref": "#/definitions/cornerRadiusValue"
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
      "enum": [${colorEnumsStr}]
    },
    "fontWeightValue": {
      "type": "string",
      "enum": [${fontWeightEnumsStr}]
    },
    "fontSizeValue": {
      "type": "string",
      "enum": [${fontSizeEnumsStr}]
    },
    "cornerRadiusValue": {
      "type": "string",
      "enum": [${cornerRadiusEnumsStr}]
    }
  }
}
`;

export function generateCss() {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
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

  const platformCollection = collections.find((collection) =>
    PLATFORM_COLLECTIONS.includes(collection.name),
  );

  if (!platformCollection) {
    throw new Error("Platform collection not found");
  }

  const unitCollection = collections.find((collection) =>
    UNIT_COLLECTIONS.includes(collection.name),
  );

  if (!unitCollection) {
    throw new Error("Unit collection not found");
  }

  const colorVariables = variables.filter(
    (variable) => variable.variableCollectionId === colorCollection.id,
  );

  const platformVariables = variables.filter(
    (variable) => variable.variableCollectionId === platformCollection.id,
  );

  const unitVariables = variables.filter(
    (variable) => variable.variableCollectionId === unitCollection.id,
  );

  const platFormDelcarations = platformVariables.map((variable) =>
    toJsonSchemaDeclaration(variable),
  );
  const unitDelcarations = unitVariables.map((variable) => toJsonSchemaDeclaration(variable));
  const colorDeclaration = colorVariables.map((variable) => toJsonSchemaDeclaration(variable));

  const fontWeightEnumsStr = platFormDelcarations
    .filter((declaration) => declaration.type === "font-weight")
    .map((declaration) => declaration.value)
    .join(", ");
  const fontSizeEnumsStr = platFormDelcarations
    .filter((declaration) => declaration.type === "font-size")
    .map((declaration) => declaration.value)
    .join(", ");
  const cornerRadiusEnumsStr = unitDelcarations
    .filter((declaration) => declaration.type === "radius")
    .map((declaration) => declaration.value)
    .join(", ");
  const colorEnumsStr = colorDeclaration.map((declaration) => declaration.value).join(", ");

  const schema = jsonSchemaTemplate({
    colorEnumsStr,
    fontWeightEnumsStr,
    fontSizeEnumsStr,
    cornerRadiusEnumsStr,
  });

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

/**
 * @param name font-weight/regular
 * @returns $font-weight.medium
 */
function figmaFontWeightVarToJsVar(name: string) {
  const [group, value] = name.split("/") as [string, string];

  return `$${group}.${value}`;
}

/**
 * @param name font-size/500
 * @returns $font-size[500]
 *
 * @param name font-size/static-100
 * @returns $font-size.static[100]
 */
function figmaFontSizeVarToJsVar(name: string) {
  const [group, value] = name.split("/") as [string, string];

  if (value.startsWith("static")) {
    return `$${group}.static[${value.split("-")[1]}]`;
  }

  return `$${group}[${value}]`;
}

/**
 *
 * @param name radius/x1,5
 * @returns $radii[1.5]
 *
 * @param name radius/full
 * @returns $radii.full
 */
function figmaCornerRadiusVarToJsVar(name: string) {
  const [_, value] = name.split("/") as [string, string];

  if (value === "full") {
    return `$radii.full`;
  }

  const convertedValue = value.replace("x", "").replace(",", ".");
  return `$radii[${convertedValue}]`;
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
  if (variable.name.includes("font-weight")) {
    return {
      type: "font-weight",
      value: `"${figmaFontWeightVarToJsVar(variable.name)}"`,
    };
  }

  if (variable.name.includes("font-size")) {
    return {
      type: "font-size",
      value: `"${figmaFontSizeVarToJsVar(variable.name)}"`,
    };
  }

  if (variable.name.includes("radius")) {
    return {
      type: "radius",
      value: `"${figmaCornerRadiusVarToJsVar(variable.name)}"`,
    };
  }

  if (
    variable.name.startsWith("bg") ||
    variable.name.startsWith("fg") ||
    variable.name.startsWith("palette") ||
    variable.name.startsWith("stroke")
  ) {
    console.log("variable.name", variable.name);

    return {
      type: "color",
      value: `"${figmaColorVarToSpecVar(variable.name)}"`,
    };
  }

  return {
    type: "unknown",
    value: `"${variable.name}"`,
  };
}
