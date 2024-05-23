import { camelCase } from "change-case";

const numericRegex = /^-?\d+(,\d+)?$/;

export function getLayoutVariableName(id: string) {
  const variable = figma.variables.getVariableById(id);
  if (!variable) {
    throw new Error(`Variable not found: ${id}`);
  }

  const name = variable.name.split("/").pop() as string;
  if (numericRegex.test(name)) {
    return Number(name.split(",").join("."));
  }

  return camelCase(name, { mergeAmbiguousCharacters: true });
}

export function getColorVariableName(id: string) {
  const variable = figma.variables.getVariableById(id);
  if (!variable) {
    throw new Error(`Variable not found: ${id}`);
  }

  const [group, name] = variable.name.split("/") as [string, string];

  return camelCase(name, { mergeAmbiguousCharacters: true });
}
