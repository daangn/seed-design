import type { TokenRef } from "./types";

export function isTokenRef(expression: string | number | object): expression is TokenRef {
  if (typeof expression === "number") {
    return false;
  }

  if (typeof expression === "object") {
    return false;
  }

  return expression.startsWith("$");
}
