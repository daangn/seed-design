/**
 * Convert a style object to a Lynx-compatible style string.
 *
 * Lynx compiles object-form `style` props into static CSS at build time,
 * which drops dynamically-set CSS custom properties. Passing styles as a
 * string literal preserves runtime values.
 */
export function dynamicStyle(style: Record<string, unknown>): string {
  return Object.entries(style)
    .filter(([_, v]) => v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}
