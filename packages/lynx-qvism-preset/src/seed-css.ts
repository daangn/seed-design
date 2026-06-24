import { css, type AST } from "@seed-design/rootage-core";

type TokenDeclaration = AST.TokenDeclaration;
type TokenLit = AST.TokenLit;
type ValueLit = AST.ValueLit;

/**
 * Creates a SEED-specific declaration function with Lynx font units.
 */
function toSp(value: string): string {
  return value
    .replace(/(?<![a-zA-Z])(\d*\.?\d+)rem\b/g, (_, num: string) => {
      const px = Number.parseFloat(num) * 16;
      return `${Number.parseFloat(px.toFixed(4))}sp`;
    })
    .replace(/(?<![a-zA-Z])(\d*\.?\d+)px\b/g, (_, num: string) => {
      const px = Number.parseFloat(num);
      return `${Number.parseFloat(px.toFixed(4))}sp`;
    });
}

const createSeedDeclaration =
  () =>
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
      return `${tokenName(decl.token)}: ${toSp(value)};`;
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
    banner: options?.banner ?? "",
    selectors: {
      global: {
        default: ":root",
      },
      color: {
        "theme-light": `:root,
:root.seed-user-color-scheme-light,
:root.seed-color-mode-light-only,
.seed-color-mode-light-only`,
        "theme-dark": `:root.seed-user-color-scheme-dark,
:root.seed-color-mode-dark-only,
.seed-color-mode-dark-only`,
      },
      motion: {
        preferred: ":root",
        // Lynx does not evaluate `@media (prefers-reduced-motion: reduce)`, so a
        // reduced-motion guard would never apply on-device. `null` opts the mode
        // out of emission entirely, so motion scales always apply under `:root`.
        reduced: null,
      },
    },
    customDeclaration: createSeedDeclaration(),
  };

  // Use core's getTokenCss with our custom declaration
  return css.getTokenCss(ast, seedOptions);
}

// Also export as named export for compatibility
export { generateSeedCss };
