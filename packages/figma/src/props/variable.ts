import { vars } from "@seed-design/css/vars";
import { camelCase } from "change-case";
import { FIGMA_VARIABLES } from "../data/variables";

function sanitizeVariableId(id: string) {
  return id.replace("VariableID:", "").split("/")[0]!;
}

function getNameFromSlashSeparatedVariableName(id: string | undefined) {
  if (!id) return undefined;

  const sanitizedId = sanitizeVariableId(id);
  const variable = FIGMA_VARIABLES.find((v) => v.id === sanitizedId || v.key === sanitizedId);

  if (!variable) return undefined;

  const splits = variable.name.split("/");

  const name = splits.pop() ?? "";
  const group = splits.pop() ?? "";

  switch (group) {
    case "spacing-x":
    case "spacing-y":
      return `${camelCase(group)}.${camelCase(name)}`;
    default:
      return camelCase(name);
  }
}

export const getLayoutVariableName = getNameFromSlashSeparatedVariableName;

export const getTypographyVariableName = getNameFromSlashSeparatedVariableName;

export function getColorVariableName(id: string) {
  const sanitizedId = sanitizeVariableId(id);
  const variable = FIGMA_VARIABLES.find((v) => v.id === sanitizedId || v.key === sanitizedId);

  if (!variable) return undefined;

  const [group, name] = variable.name.split("/") as [string, string];

  return `${camelCase(group, { mergeAmbiguousCharacters: true })}.${camelCase(name, { mergeAmbiguousCharacters: true })}`;
}

export function inferDimension(value: number) {
  if (value === 0) return 0;

  const expectedDimensionVar = `x${Number.parseFloat((value / 4).toFixed(1))}`.replace(".", "_");
  if (expectedDimensionVar in vars.$dimension) {
    return expectedDimensionVar;
  }

  return `${value}px`;
}

export function inferRadius(value: number) {
  if (value === 0) return 0;

  const expectedRadiusVar = `r${Number.parseFloat((value / 4).toFixed(1))}`.replace(".", "_");
  if (expectedRadiusVar in vars.$radius) {
    return expectedRadiusVar;
  }

  return `${value}px`;
}
