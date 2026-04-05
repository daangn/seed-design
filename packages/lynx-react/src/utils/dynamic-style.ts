/**
 * Convert camelCase CSS property names to kebab-case.
 * CSS custom properties (starting with `--`) are left unchanged.
 */
function toKebabCase(str: string): string {
  if (str.startsWith("--")) return str;
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Convert a style object to a Lynx-compatible style string.
 *
 * Lynx compiles object-form `style` props into static CSS at build time,
 * which drops dynamically-set CSS custom properties. Passing styles as a
 * string literal preserves runtime values.
 *
 * Property names are converted from camelCase to kebab-case so that
 * `React.CSSProperties` keys (e.g. `fontSize`) produce valid CSS
 * (e.g. `font-size`).
 */
export function dynamicStyle(style: Record<string, unknown>): string {
  return Object.entries(style)
    .filter(([_, v]) => v != null)
    .map(([k, v]) => `${toKebabCase(k)}: ${v}`)
    .join("; ");
}
