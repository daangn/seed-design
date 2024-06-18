import type { Token } from "../../../packages/component-spec/core/lib/types";

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

export function stringifyToken(token: Token) {
  return `$${[token.category, ...token.group, token.key].join("/")}`;
}
