import type { TokenRef } from "./types";

export function isTokenRef(expression: string | number | object): expression is TokenRef {
  if (typeof expression !== "string") {
    return false;
  }

  return expression.startsWith("$");
}
