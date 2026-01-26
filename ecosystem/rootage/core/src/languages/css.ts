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

function stringifyShadowLit(expr: ShadowLit, tokenReference?: (token: TokenLit) => string): string {
  return expr.layers
    .map((item) => {
      let colorValue: string;
      if (item.color.kind === "TokenLit") {
        if (!tokenReference) {
          throw new Error("tokenReference is required for ShadowLit with TokenLit references");
        }
        colorValue = tokenReference(item.color);
      } else {
        colorValue = item.color.value;
      }
      return `${item.offsetX.value}${item.offsetX.unit} ${item.offsetY.value}${item.offsetY.unit} ${item.blur.value}${item.blur.unit} ${item.spread.value}${item.spread.unit} ${colorValue}`;
    })
    .join(", ");
}

function stringifyGradientLit(
  expr: GradientLit,
  tokenReference?: (token: TokenLit) => string,
): string {
  return expr.stops
    .map((item) => {
      let colorValue: string;
      if (item.color.kind === "TokenLit") {
        if (!tokenReference) {
          throw new Error("tokenReference is required for GradientLit with TokenLit references");
        }
        colorValue = tokenReference(item.color);
      } else {
        colorValue = item.color.value;
      }
      return `${colorValue} ${item.position.value * 100}%`;
    })
    .join(", ");
}

function stringifyValueLit(expr: ValueLit, tokenReference?: (token: TokenLit) => string): string {
  if (expr.kind === "ColorHexLit") {
    return expr.value;
  }

  if (expr.kind === "DimensionLit") {
    return `${expr.value}${expr.unit}`;
  }

  if (expr.kind === "DurationLit") {
    return `${expr.value}${expr.unit}`;
  }

  if (expr.kind === "NumberLit") {
    return `${expr.value}`;
  }

  if (expr.kind === "CubicBezierLit") {
    return stringifyCubicBezierLit(expr);
  }

  if (expr.kind === "ShadowLit") {
    return stringifyShadowLit(expr, tokenReference);
  }

  if (expr.kind === "GradientLit") {
    return stringifyGradientLit(expr, tokenReference);
  }

  throw new Error("Invalid value expression");
}

export const staticStringifier = {
  value: stringifyValueLit,
};

export type DeclarationFunction = (params: {
  decl: TokenDeclaration;
  mode: string;
  helpers: {
    tokenName: (token: TokenLit) => string;
    valueOrToken: (value: ValueLit | TokenLit) => string;
  };
}) => string;

export function createStringifier(
  options: { prefix?: string; customDeclaration?: DeclarationFunction } = {},
) {
  const { prefix, customDeclaration } = options;

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
    return value.kind === "TokenLit"
      ? tokenReference(value)
      : stringifyValueLit(value, tokenReference);
  }

  function declaration({ decl, mode }: { decl: TokenDeclaration; mode: string }) {
    if (customDeclaration) {
      return customDeclaration({
        decl,
        mode,
        helpers: { tokenName, valueOrToken },
      });
    }
    const value = valueOrToken(decl.values.find((v) => v.mode === mode)!.value);
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
  customDeclaration?: DeclarationFunction;
}

export function getTokenCss(
  ast: {
    tokens: TokenDeclaration[];
    tokenCollections: TokenCollectionDeclaration[];
  },
  options: CssOptions,
) {
  const stringifier = createStringifier({
    prefix: options.prefix,
    customDeclaration: options.customDeclaration,
  });
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
