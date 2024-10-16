import type { ComponentExpression, ParsedExpression, Token } from "./types";

function isTokenExpression(expression: string | number | string[]): boolean {
  if (typeof expression === "number") {
    return false;
  }

  if (Array.isArray(expression)) {
    return expression.every((item) => typeof item === "string" && item.startsWith("$"));
  }

  return expression.startsWith("$");
}

/**
 * @example
 * parseToken("$color.bg.layer-1") // { category: "color", group: ["bg"], key: "layer-1" }
 * parseToken("$unit[1]") // { category: "unit", group: [], key: 1 }
 * parseToken("$unit.space[1]") // { category: "unit", group: ["space"], key: 1 }
 */
function parseToken(tokenExpression: string): Token {
  if (!isTokenExpression(tokenExpression)) {
    throw new Error("Invalid token format");
  }

  const prefixStriped = tokenExpression.slice(1);
  const numericParts = prefixStriped.split("[");

  if (numericParts.length === 1) {
    const parts = prefixStriped.split(".");
    const category = parts[0];
    const group = parts.slice(1, -1);
    const last = parts[parts.length - 1];
    return { category, group, key: last };
  }

  const parts = numericParts[0].split(".");
  const [category, ...group] = parts;
  const key = numericParts[1].slice(0, -1);
  return { category, group, key };
}

function parseVariant(variantExpression: string) {
  if (variantExpression === "base") {
    return {};
  }

  const keyValues = variantExpression.split(",");
  const variant = {};
  for (const keyValue of keyValues) {
    const [key, value] = keyValue.split("=");
    variant[key] = value;
  }

  return variant;
}

function parseState(stateExpression: string) {
  return stateExpression.split(",");
}

export function parse(input: ComponentExpression): ParsedExpression {
  const parsedExpressions: ParsedExpression = [];

  for (const variantExpression in input) {
    const variant = parseVariant(variantExpression);
    const state = [];

    for (const stateExpression in input[variantExpression]) {
      const slot = [];

      for (const slotExpression in input[variantExpression][stateExpression]) {
        const property = [];

        for (const propertyExpression in input[variantExpression][stateExpression][
          slotExpression
        ]) {
          const tokenExpression =
            input[variantExpression][stateExpression][slotExpression][propertyExpression];

          let token: Token | Token[] | string;

          if (Array.isArray(tokenExpression)) {
            token = tokenExpression.map((token) =>
              isTokenExpression(token) ? parseToken(token) : token,
            );
          } else {
            token = isTokenExpression(tokenExpression)
              ? parseToken(tokenExpression)
              : tokenExpression;
          }

          property.push({ key: propertyExpression, value: token });
        }

        slot.push({ key: slotExpression, property });
      }

      state.push({ key: parseState(stateExpression), slot });
    }

    parsedExpressions.push({ key: variant, state });
  }

  return parsedExpressions;
}
