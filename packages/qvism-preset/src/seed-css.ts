import { css, type AST } from "@seed-design/rootage-core";

type TokenDeclaration = AST.TokenDeclaration;
type TokenLit = AST.TokenLit;
type ValueLit = AST.ValueLit;

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

/**
 * Creates a SEED-specific declaration function with proper prefix handling
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
    // Use the correct prefix and provide fallback value of 1
    const MULTIPLIER_TOKEN = `var(--${prefix}-font-size-multiplier, 1)`;

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
        // Calculate min pixel value: base * 0.8 (80% minimum)
        const minPx = Number.parseFloat((basePx * 0.8).toFixed(1));
        // Calculate max pixel value: base * 0.9412 (iOS multiplier) * 1.35 (135% limit)
        const maxPx = Number.parseFloat((basePx * 0.9412 * 1.35).toFixed(2));

        // Return clamp with fixed px min, dynamic preferred, and fixed px max
        return `${tokenName(decl.token)}: clamp(${minPx}px, calc(${value} * ${MULTIPLIER_TOKEN}), ${maxPx}px);`;
      }
    }

    // Default behavior for other tokens
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
}

[data-seed-color-mode="dark-only"] {
  color-scheme: dark;
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
