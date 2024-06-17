import { camelCase } from "change-case";
import { rgba } from "color2k";

export function generateCssVars() {
  const collections = figma.variables.getLocalVariableCollections();
  const variables = figma.variables.getLocalVariables();

  const colorCollection = collections.find((collection) => collection.name === "Color");

  if (!colorCollection) {
    throw new Error("Color collection not found");
  }

  const colorVariables = variables.filter(
    (variable) => variable.variableCollectionId === colorCollection.id,
  );

  const lightColorsCss = colorVariables
    .map((variable) => toCssDeclaration(variable, colorCollection.modes[0]!.modeId))
    .sort((a, b) => a.localeCompare(b))
    .join("\n");

  // const lightColorsTs = colorVariables
  //   .map(toJsDeclaration)
  //   .join("\n");

  return lightColorsCss;
}

function figmaColorVarToCssVar(name: string) {
  const [group, colorName] = name.split("/") as [string, string];

  return `--seed-color-${group}-${colorName}`;
}

function figmaColorVarToJsVar(name: string) {
  const [group, colorName] = name.split("/") as [string, string];

  return camelCase(colorName, { mergeAmbiguousCharacters: true });
}

function toCssDeclaration(variable: Variable, modeId: string) {
  const name = figmaColorVarToCssVar(variable.name);

  const value = variable.valuesByMode[modeId]!;

  if (typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS") {
    const aliasName = figma.variables.getVariableById(value.id)!.name;
    return `${name}: var(${figmaColorVarToCssVar(aliasName)});`;
  }
  const { r, g, b, a } = variable.valuesByMode[modeId] as RGBA;

  return `${name}: ${rgba(r * 255, g * 255, b * 255, a)};`;
}

function toJsDeclaration(variable: Variable) {
  return `export const ${figmaColorVarToJsVar(
    variable.name,
  )} = "var(${figmaColorVarToCssVar(variable.name)})";`;
}
