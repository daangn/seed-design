// Android WebView's textZoom multiplies only font properties (font-size, line-height) at paint time,
// so a non-font length derived from them is short by `--seed-static-font-scale` there. Elsewhere that var is 1.
const STATIC_FONT_SCALE = "var(--seed-static-font-scale, 1)";

/**
 * A rem length that follows font scaling on every platform, clamped like the font-size tokens.
 * @param rem e.g. `"0.375rem"`
 */
export function fontScaledRem(rem: string) {
  const value = Number.parseFloat(rem);
  const px = value * 16;

  return `clamp(calc(${px}px * var(--seed-font-size-limit-min)), calc(${value}rem * var(--seed-font-size-multiplier, 1) * ${STATIC_FONT_SCALE}), calc(${px}px * var(--seed-font-size-limit-max)))`;
}

/**
 * The painted size of a font-size or line-height token, for use in a non-font property.
 * @param token e.g. `"var(--seed-line-height-t4)"`
 */
export function renderedFontLength(token: string) {
  return `(${token} * ${STATIC_FONT_SCALE})`;
}
