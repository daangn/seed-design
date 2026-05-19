import { css, type AST } from "@seed-design/rootage-core";

type TokenDeclaration = AST.TokenDeclaration;
type TokenLit = AST.TokenLit;
type ValueLit = AST.ValueLit;

/**
 * Creates a SEED-specific declaration function with platform-aware font scaling
 */
const createSeedDeclaration =
  (prefix: string) =>
  ({
    decl,
    mode,
    helpers,
  }: {
    decl: TokenDeclaration;
    mode: string;
    helpers: {
      tokenName: (token: TokenLit) => string;
      valueOrToken: (value: ValueLit | TokenLit) => string;
    };
  }) => {
    const { tokenName, valueOrToken } = helpers;
    const valueObj = decl.values.find((v) => v.mode === mode);
    if (!valueObj) {
      throw new Error(`No value found for mode ${mode}`);
    }
    const value = valueOrToken(valueObj.value);

    // Static tokens don't need any scaling
    const tokenKey = decl.token.key.toString();
    if (tokenKey.includes("static")) {
      return `${tokenName(decl.token)}: ${value};`;
    }

    // Check if this is a font-size or line-height token that needs scaling
    const tokenGroup = decl.token.group;
    const isFontSize = tokenGroup.includes("font-size");
    const isLineHeight = tokenGroup.includes("line-height");

    if (isFontSize || isLineHeight) {
      // Build CSS variable names for scaling
      const tokenType = isFontSize ? "font-size" : "line-height";
      const multiplierVar = `var(--${prefix}-font-size-multiplier, 1)`;
      const staticTokenVar = `var(--${prefix}-${tokenType}-${tokenKey}-static)`;
      const limitMinVar = `var(--${prefix}-${tokenType}-limit-min, 0.8)`;
      const limitMaxVar = `var(--${prefix}-${tokenType}-limit-max, 1.5)`;

      // Return clamp with dynamic min and max using static values
      return `${tokenName(decl.token)}: clamp(calc(${staticTokenVar} * ${limitMinVar}), calc(${value} * ${multiplierVar}), calc(${staticTokenVar} * ${limitMaxVar}));`;
    }

    // Default: return the value as-is for other tokens
    return `${tokenName(decl.token)}: ${value};`;
  };

/**
 * SEED CSS Generator function
 * Generates CSS with SEED-specific font scaling and theme configuration
 */
export default function generateSeedCss(
  ast: Parameters<typeof css.getTokenCss>[0],
  options?: Partial<Parameters<typeof css.getTokenCss>[1]>,
): string {
  // SEED-specific default options - we ignore most of the passed options
  // and use our own defaults because CLI provides minimal options
  const prefix = options?.prefix || "seed"; // Extract prefix for use in declaration
  const seedOptions = {
    prefix,
    banner:
      options?.banner ||
      `:root, [data-seed-color-mode="system"] {
  color-scheme: light dark;
}

[data-seed-color-mode="light-only"] {
  color-scheme: light;
  color-scheme: only light;
}

[data-seed-color-mode="dark-only"] {
  color-scheme: dark;
  color-scheme: only dark;
}

`,
    selectors: {
      global: {
        default: ":root",
      },
      color: {
        "theme-light": `:root,
:root[data-seed-color-mode="system"][data-seed-user-color-scheme="light"],
:root[data-seed-color-mode="light-only"],
:root [data-seed-color-mode="light-only"]`,
        "theme-dark": `:root[data-seed-color-mode="system"][data-seed-user-color-scheme="dark"],
:root[data-seed-color-mode="dark-only"],
:root [data-seed-color-mode="dark-only"]`,
      },
    },
    customDeclaration: createSeedDeclaration(prefix), // Pass prefix to declaration factory
  };

  // Use core's getTokenCss with our custom declaration
  return css.getTokenCss(ast, seedOptions);
}

// Also export as named export for compatibility
export { generateSeedCss };
