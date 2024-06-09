import { camelCase } from "change-case";
import { ParsedExpression, Token } from "./types";

function stringifyVariantKey(variant: Record<string, string>) {
  const asKebab = Object.entries(variant)
    .map(([key, value]) => `${key}-${value}`)
    .join("-");

  if (asKebab === "") {
    return "base";
  }

  return camelCase(asKebab);
}

function stringifyStateKey(state: string[]) {
  return camelCase(state.join("-"));
}

function stringifyTokenCssVar(token: Token) {
  if (token.group.length === 0) {
    return `var(--seed-${token.category}-${token.key
      .toString()
      .replaceAll(".", "\\.")})`;
  }

  return `var(--seed-${token.category}-${token.group.join("-")}-${token.key
    .toString()
    .replaceAll(".", "\\.")})`;
}

export function stringifyTs(expressions: ParsedExpression) {
  const result = {};

  for (let expression of expressions) {
    const variantKey = stringifyVariantKey(expression.key);
    const variant = {};

    for (let state of expression.state) {
      const stateKey = stringifyStateKey(state.key);
      const slot = {};

      for (let slotItem of state.slot) {
        const slotKey = slotItem.key;
        const property = {};

        for (let propertyItem of slotItem.property) {
          const propertyKey = propertyItem.key;
          const token = propertyItem.value;

          property[propertyKey] =
            typeof token === "object" ? stringifyTokenCssVar(token) : token;
        }

        slot[slotKey] = property;
      }

      variant[stateKey] = slot;
    }

    result[variantKey] = variant;
  }

  return `export const vars = ${JSON.stringify(result, null, 2)}`;
}