import type {
  CubicBezierLit,
  GradientLit,
  ShadowLit,
  TokenCollectionDeclaration,
  TokenDeclaration,
  TokenLit,
  ValueLit,
} from "../parser/ast";

function stringifyCubicBezierLit(expr: CubicBezierLit): string {
  return `cubic-bezier(${expr.value.join(", ")})`;
}

function stringifyShadowLit(expr: ShadowLit): string {
  return expr.layers
    .map((item) => {
      return `${item.offsetX.value}${item.offsetX.unit} ${item.offsetY.value}${item.offsetY.unit} ${item.blur.value}${item.blur.unit} ${item.spread.value}${item.spread.unit} ${item.color.value}`;
    })
    .join(", ");
}

function stringifyGradientLit(expr: GradientLit): string {
  return expr.stops.map((item) => `${item.color.value} ${item.position.value * 100}%`).join(", ");
}

function stringifyValueLit(expr: ValueLit): string {
  if (expr.kind === "ColorHexLit") {
    return expr.value;
  }

  if (expr.kind === "DimensionLit") {
    return `${expr.value}${expr.unit}`;
  }

  if (expr.kind === "NumberLit") {
    return expr.value.toString();
  }

  if (expr.kind === "DurationLit") {
    return `${expr.value}${expr.unit}`;
  }

  if (expr.kind === "CubicBezierLit") {
    return stringifyCubicBezierLit(expr);
  }

  if (expr.kind === "ShadowLit") {
    return stringifyShadowLit(expr);
  }

  if (expr.kind === "GradientLit") {
    return stringifyGradientLit(expr);
  }

  throw new Error("Invalid value expression");
}

export const staticStringifier = {
  value: stringifyValueLit,
};

export function createStringifier(options: { prefix?: string } = {}) {
  const { prefix } = options;

  function tokenName(token: TokenLit) {
    const words = [
      prefix,
      token.group.join("-"),
      token.key.toString().replaceAll(".", "\\."),
    ].filter(Boolean);
    return `--${words.join("-")}`;
  }

  function tokenReference(token: TokenLit) {
    return `var(${tokenName(token)})`;
  }

  function valueOrToken(value: ValueLit | TokenLit): string {
    return value.kind === "TokenLit" ? tokenReference(value) : staticStringifier.value(value);
  }

  function declaration({ decl, mode }: { decl: TokenDeclaration; mode: string }) {
    const value = valueOrToken(decl.values.find((v) => v.mode === mode)!.value);
    const MULTIPLIER_TOKEN = "var(--seed-font-size-multiplier)";

    // Handle static tokens first - no multiplier needed
    if (decl.token.key.toString().includes("static")) {
      return `${tokenName(decl.token)}: ${value};`;
    }

    // Apply font-size multiplier for font-size and line-height tokens
    const isFontSize = decl.token.group.includes("font-size");
    const isLineHeight = decl.token.group.includes("line-height");

    if (isFontSize || isLineHeight) {
      // Extract numeric value and unit from the value (e.g., "1rem" → 1 and "rem")
      const match = value.match(/^([\d.]+)(.*)$/);
      if (match?.[1]) {
        const numericValue = Number.parseFloat(match[1]);
        const unit = match[2] || "";
        const maxValue = `${(numericValue * 1.35).toFixed(4)}${unit}`;

        // Use clamp to limit font size/line-height to 135% of the base value
        return `${tokenName(decl.token)}: clamp(calc(${value} * ${MULTIPLIER_TOKEN}), calc(${value} * ${MULTIPLIER_TOKEN}), calc(${maxValue} * ${MULTIPLIER_TOKEN}));`;
      }

      // Fallback to original behavior if parsing fails
      return `${tokenName(decl.token)}: calc(${value} * ${MULTIPLIER_TOKEN});`;
    }

    return `${tokenName(decl.token)}: ${value};`;
  }

  function rule({
    selector,
    decls,
    mode,
  }: {
    selector: string;
    decls: TokenDeclaration[];
    mode: string;
  }) {
    const declsStr = decls.map((decl) => declaration({ decl, mode })).join("\n  ");
    return `${selector} {
  ${declsStr}
}`;
  }

  function root(rules: { selector: string; decls: TokenDeclaration[]; mode: string }[]) {
    return rules.map(({ selector, decls, mode }) => rule({ selector, decls, mode })).join("\n\n");
  }

  return {
    ...staticStringifier,
    tokenName,
    tokenReference,
    valueOrToken,
    declaration,
    rule,
    root,
  };
}

export interface CssOptions {
  prefix?: string;
  banner?: string;
  selectors: {
    [collection: string]: {
      [mode: string]: string;
    };
  };
}

export function getTokenCss(
  ast: {
    tokens: TokenDeclaration[];
    tokenCollections: TokenCollectionDeclaration[];
  },
  options: CssOptions,
) {
  const stringifier = createStringifier(options);
  const { tokens, tokenCollections } = ast;

  const rules = tokenCollections.flatMap((collection) => {
    const inCollection = tokens.filter((token) => token.collection === collection.name);
    return collection.modes.map((mode) => {
      const selector = options.selectors[collection.name]?.[mode];

      if (!selector) {
        throw new Error(
          `Selector for collection ${collection.name} and mode ${mode} is not defined`,
        );
      }

      return { selector, decls: inCollection, mode };
    });
  });

  const code = stringifier.root(rules);

  return `${options.banner ?? ""}${code}`;
}
