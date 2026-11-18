import type { VariableComposedColor, VariableScope } from "@figma/rest-api-spec";

// boundVariable.id is formatted as "VariableID:{key}/{localId}", we have to extract the key
export function sanitizeVariableId(id: string) {
  return id.replace("VariableID:", "").split("/")[0]!;
}

export function isVariableAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}

type ComparableVariableValue = string | number | boolean | RGBA | VariableComposedColor;

export function isIdenticalVariableValue(
  value1: ComparableVariableValue,
  value2: ComparableVariableValue,
) {
  if (typeof value1 !== "object" || typeof value2 !== "object") {
    return value1 === value2;
  }

  // A composed color keeps its opacity as a variable alias, so it never equals a resolved value.
  if (!("r" in value1) || !("r" in value2)) {
    return false;
  }

  return (
    value1.r === value2.r && value1.g === value2.g && value1.b === value2.b && value1.a === value2.a
  );
}

export function isInsideScope(variable: { scopes: VariableScope[] }, scope: VariableScope) {
  if (variable.scopes.includes("ALL_SCOPES")) {
    return true;
  }

  if (variable.scopes.includes("ALL_FILLS")) {
    if (scope === "FRAME_FILL" || scope === "SHAPE_FILL" || scope === "TEXT_FILL") {
      return true;
    }
  }

  return variable.scopes.includes(scope);
}
