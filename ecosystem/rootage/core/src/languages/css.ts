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

  // Font size base pixel values mapping
  const fontSizeBasePx: Record<string, number> = {
    t1: 11, // 0.6875rem
    t2: 12, // 0.75rem
    t3: 13, // 0.8125rem
    t4: 14, // 0.875rem
    t5: 16, // 1rem
    t6: 18, // 1.125rem
    t7: 20, // 1.25rem
    t8: 22, // 1.375rem
    t9: 24, // 1.5rem
    t10: 26, // 1.625rem
  };

  // Line height base pixel values mapping
  const lineHeightBasePx: Record<string, number> = {
    t1: 15, // 0.9375rem
    t2: 16, // 1rem
    t3: 18, // 1.125rem
    t4: 19, // 1.1875rem
    t5: 22, // 1.375rem
    t6: 24, // 1.5rem
    t7: 27, // 1.6875rem
    t8: 30, // 1.875rem
    t9: 32, // 2rem
    t10: 35, // 2.1875rem
  };

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
      const tokenKey = decl.token.key.toString();

      // Get base pixel value
      let basePx: number | undefined;
      if (isFontSize) {
        basePx = fontSizeBasePx[tokenKey];
      } else if (isLineHeight) {
        basePx = lineHeightBasePx[tokenKey];
      }

      if (basePx) {
        // Calculate max pixel value: base * 0.9412 (iOS multiplier) * 1.35 (135% limit)
        const maxPx = Number.parseFloat((basePx * 0.9412 * 1.35).toFixed(2));

        // Return clamp with dynamic min/preferred and fixed px max
        return `${tokenName(decl.token)}: clamp(calc(${value} * ${MULTIPLIER_TOKEN}), calc(${value} * ${MULTIPLIER_TOKEN}), ${maxPx}px);`;
      }
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
    const declarations = decls.map((decl) => declaration({ decl, mode }));

    return `${selector} {
  ${declarations.join("\n  ")}
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
