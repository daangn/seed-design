export function isVariableAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}

// boundVariable.id is formatted as "VariableID:{key}/{localId}", we have to extract the key
export function sanitizeVariableId(id: string) {
  return id.replace("VariableID:", "").split("/")[0]!;
}
