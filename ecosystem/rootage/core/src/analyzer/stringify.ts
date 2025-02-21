import type { StateExpression, VariantExpression } from "../parser/ast";

export function stringifyVariantExpression(variants: VariantExpression[]): string {
  if (variants.length === 0) {
    return "base";
  }

  return variants.map(({ name, value }) => `${name}=${value}`).join(",");
}

export function stringifyStateExpression(states: StateExpression[]): string {
  return states.map((s) => s.value).join(",");
}
