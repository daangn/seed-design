/**
 * Mask sources shaped like an Apple "continuous" rounded corner, one image per
 * corner.
 *
 * The curve is the figma-squircle construction at the smoothing Figma ships as
 * its iOS preset, the accepted stand-in for `.continuous` corner curvature. It
 * rides the same circle a plain `border-radius` would, centred `radius` in from
 * both edges, but leaves it after 36° instead of 90° and blends the rest of the
 * way out with a cubic on each side. So the two shapes meet at the diagonal and
 * differ only in how they rejoin the straight edge — abruptly for the arc,
 * across `SQUIRCLE_CORNER_SPAN_RATIO * radius` for this one.
 *
 * https://www.figma.com/blog/desperately-seeking-squircles/
 */

const CORNER_SMOOTHING = 0.6;

/**
 * How far the smoothed corner runs along each edge, as a multiple of the
 * radius. Size a corner image to this times the radius and its arc lands on
 * `radius`.
 */
export const SQUIRCLE_CORNER_SPAN_RATIO = 1 + CORNER_SMOOTHING;

// Each image is one corner's square in its own units: the curve runs from one
// edge of the square to the adjacent one, and the fill closes on the square's
// inner corner.
const SPAN = 100;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** (dx, dy) taken through `quarters` clockwise quarter turns, y pointing down. */
const turn = (quarters: number, x: number, y: number): [number, number] =>
  quarters === 0 ? [x, y] : turn(quarters - 1, -y, x);

/** Where the curve starts and the inner corner it closes on, per quarter turn from top-right. */
const CORNER_ENDPOINTS = [
  { start: [0, 0], inner: [0, SPAN] },
  { start: [SPAN, 0], inner: [0, 0] },
  { start: [SPAN, SPAN], inner: [SPAN, 0] },
  { start: [0, SPAN], inner: [SPAN, SPAN] },
] as const;

function squircleCornerPath(quarters: number) {
  const radius = SPAN / SQUIRCLE_CORNER_SPAN_RATIO;
  const arcMeasure = 90 * (1 - CORNER_SMOOTHING);
  const alpha = toRadians((90 - arcMeasure) / 2);

  const arc = Math.sin(toRadians(arcMeasure / 2)) * radius * Math.SQRT2;
  const c = radius * Math.tan(toRadians((45 * CORNER_SMOOTHING) / 2)) * Math.cos(alpha);
  const d = c * Math.tan(alpha);
  const b = (SPAN - arc - c - d) / 3;
  const a = 2 * b;

  const delta = (x: number, y: number) =>
    turn(quarters, x, y)
      .map((value) => Number(value.toFixed(4)))
      .join(",");
  const { start, inner } = CORNER_ENDPOINTS[quarters];

  return [
    `M${start.join(",")}`,
    `c${delta(a, 0)} ${delta(a + b, 0)} ${delta(a + b + c, d)}`,
    `a${radius},${radius} 0 0 1 ${delta(arc, arc)}`,
    `c${delta(d, c)} ${delta(d, c + b)} ${delta(d, a + b + c)}`,
    `L${inner.join(",")} Z`,
  ].join(" ");
}

/**
 * White rather than black so the mask reads as opaque whether the engine takes
 * it as alpha or as luminance. `<` and `>` are percent-encoded because a bare
 * `<` cuts the data URL short in some CSS parsers.
 */
const toMaskImage = (path: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${SPAN}' height='${SPAN}' viewBox='0 0 ${SPAN} ${SPAN}'%3E%3Cpath fill='white' d='${path}'/%3E%3C/svg%3E")`;

export const SQUIRCLE_CORNER_MASK_IMAGES = {
  topRight: toMaskImage(squircleCornerPath(0)),
  bottomRight: toMaskImage(squircleCornerPath(1)),
  bottomLeft: toMaskImage(squircleCornerPath(2)),
  topLeft: toMaskImage(squircleCornerPath(3)),
};
