import {
  isVariableAlias,
  stringifyPrimitiveVariableValue,
} from "@tachyon/core";

function stringifyAlias(
  alias: VariableAlias,
  variableRecord: Record<string, { id: string; name: string }>,
) {
  const boundVariable = variableRecord[alias.id]!;

  return boundVariable.name;
}

export function stringifyVariableValue(
  value: VariableValue,
  variableRecord: Record<string, { id: string; name: string }>,
) {
  if (isVariableAlias(value)) {
    return stringifyAlias(value, variableRecord);
  }
  return stringifyPrimitiveVariableValue(value);
}

export function stringifyVariants(variants: Record<string, string>) {
  const entries = Object.entries(variants);
  if (entries.length === 0) {
    return "base";
  }

  return Object.entries(variants)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
}

export function stringifyConditions(conditions: string[]) {
  if (conditions.length === 0) {
    return "default";
  }

  return conditions.join(", ");
}
