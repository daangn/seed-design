import type { VariableScope } from "@figma/rest-api-spec";

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

export function isIdenticalVariableValue(
  value1: string | number | boolean | RGBA,
  value2: string | number | boolean | RGBA,
) {
  if (typeof value1 !== typeof value2) {
    return false;
  }

  if (typeof value1 === "string" || typeof value1 === "number" || typeof value1 === "boolean") {
    return value1 === value2;
  }

  return (
    value1.r === (value2 as RGBA).r &&
    value1.g === (value2 as RGBA).g &&
    value1.b === (value2 as RGBA).b &&
    value1.a === (value2 as RGBA).a
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
