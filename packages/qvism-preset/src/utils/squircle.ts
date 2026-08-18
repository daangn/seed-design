/**
 * A nine-slice mask source shaped like an Apple "continuous" rounded corner.
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
 * radius. Scale the nine-slice corner by this and its arc lands on `radius`.
 */
export const SQUIRCLE_CORNER_SPAN_RATIO = 1 + CORNER_SMOOTHING;

// Nine-slice geometry in the source image's own units: one corner occupies the
// outer SPAN of each side, leaving a straight middle for the edge and centre
// pieces to stretch over. The slice has to cut exactly where the curve ends,
// and SIZE has to leave something between the two cuts to stretch.
const SPAN = 100;
const SIZE = SPAN * 4;

/** Where to cut the source, as the percentage `mask-border-slice` takes. */
export const SQUIRCLE_SLICE = `${(SPAN / SIZE) * 100}%`;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** (dx, dy) taken through `quarters` clockwise quarter turns, y pointing down. */
const turn = (quarters: number, x: number, y: number): [number, number] =>
  quarters === 0 ? [x, y] : turn(quarters - 1, -y, x);

function squirclePath() {
  const radius = SPAN / SQUIRCLE_CORNER_SPAN_RATIO;
  const arcMeasure = 90 * (1 - CORNER_SMOOTHING);
  const alpha = toRadians((90 - arcMeasure) / 2);

  const arc = Math.sin(toRadians(arcMeasure / 2)) * radius * Math.SQRT2;
  const c = radius * Math.tan(toRadians((45 * CORNER_SMOOTHING) / 2)) * Math.cos(alpha);
  const d = c * Math.tan(alpha);
  const b = (SPAN - arc - c - d) / 3;
  const a = 2 * b;

  // Each corner is the same run of deltas rotated one more quarter turn, which
  // is what makes the four of them close back on the start point exactly.
  const corners = [0, 1, 2, 3]
    .map((quarters) => {
      const delta = (x: number, y: number) =>
        turn(quarters, x, y)
          .map((value) => Number(value.toFixed(4)))
          .join(",");

      return [
        `c${delta(a, 0)} ${delta(a + b, 0)} ${delta(a + b + c, d)}`,
        `a${radius},${radius} 0 0 1 ${delta(arc, arc)}`,
        `c${delta(d, c)} ${delta(d, c + b)} ${delta(d, a + b + c)}`,
        `l${delta(0, SIZE - SPAN * 2)}`,
      ].join(" ");
    })
    .join(" ");

  return `M${SIZE - SPAN},0 ${corners} Z`;
}

/**
 * White rather than black so the mask reads as opaque whether the engine takes
 * it as alpha or as luminance. `<` and `>` are percent-encoded because a bare
 * `<` cuts the data URL short in some CSS parsers.
 */
export const SQUIRCLE_MASK_IMAGE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}' viewBox='0 0 ${SIZE} ${SIZE}'%3E%3Cpath fill='white' d='${squirclePath()}'/%3E%3C/svg%3E")`;
