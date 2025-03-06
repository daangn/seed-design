import type { PathKFArray, Ulottie } from "./types";

/**
 * Evaluate a cubic Bezier curve for a single coordinate.
 * p0, p1, p2, p3 are the control point coordinates (can be x or y).
 */
function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

/**
 * interpolateBezierShape: Given two bezier paths (a and b) and a parameter t in [0,1],
 * return an interpolated path using cubic Bezier interpolation for vertex positions.
 *
 * For each vertex, we define:
 *  - P₀ as the starting vertex (a.v[i])
 *  - P₁ as the control point derived from the starting vertex and its out tangent (a.v[i] + a.o[i])
 *  - P₂ as the control point derived from the ending vertex and its in tangent (b.v[i] + b.i[i])
 *  - P₃ as the ending vertex (b.v[i])
 *
 * The tangents (i and o arrays) are still interpolated linearly.
 */
function interpolateBezierShape(
  a: Ulottie.BezierShape,
  b: Ulottie.BezierShape,
  t: number,
): Ulottie.BezierShape {
  const out: Ulottie.BezierShape = { c: a.c, v: [], i: [], o: [] };
  const len = Math.min(a.v.length, b.v.length);
  for (let i = 0; i < len; i++) {
    // Compute control points for x and y coordinates
    const p0x = a.v[i][0];
    const p0y = a.v[i][1];
    const p1x = a.v[i][0] + a.o[i][0];
    const p1y = a.v[i][1] + a.o[i][1];
    const p2x = b.v[i][0] + b.i[i][0];
    const p2y = b.v[i][1] + b.i[i][1];
    const p3x = b.v[i][0];
    const p3y = b.v[i][1];

    // Evaluate cubic Bezier for the vertex position
    const newX = cubicBezier(p0x, p1x, p2x, p3x, t);
    const newY = cubicBezier(p0y, p1y, p2y, p3y, t);
    out.v.push([newX, newY]);

    // For control points, we continue to interpolate linearly.
    const newOutX = a.o[i][0] + t * (b.o[i][0] - a.o[i][0]);
    const newOutY = a.o[i][1] + t * (b.o[i][1] - a.o[i][1]);
    const newInX = a.i[i][0] + t * (b.i[i][0] - a.i[i][0]);
    const newInY = a.i[i][1] + t * (b.i[i][1] - a.i[i][1]);
    out.o.push([newOutX, newOutY]);
    out.i.push([newInX, newInY]);
  }
  return out;
}

/**
 * shapeDifference: Compute the average Euclidean distance between corresponding vertices
 * and control points (incoming and outgoing tangents) of two bezier paths.
 *
 * This metric helps determine whether a keyframe can be omitted.
 */
function shapeDifference(a: Ulottie.BezierShape, b: Ulottie.BezierShape): number {
  let sum = 0;
  let count = 0;
  const len = Math.min(a.v.length, b.v.length);
  for (let i = 0; i < len; i++) {
    // Difference between vertex positions
    const dx = a.v[i][0] - b.v[i][0];
    const dy = a.v[i][1] - b.v[i][1];
    sum += Math.sqrt(dx * dx + dy * dy);
    count++;

    // Difference between outgoing tangents
    const dxo = a.o[i][0] - b.o[i][0];
    const dyo = a.o[i][1] - b.o[i][1];
    sum += Math.sqrt(dxo * dxo + dyo * dyo);
    count++;

    // Difference between incoming tangents
    const dxi = a.i[i][0] - b.i[i][0];
    const dyi = a.i[i][1] - b.i[i][1];
    sum += Math.sqrt(dxi * dxi + dyi * dyi);
    count++;
  }
  return count ? sum / count : 0;
}

/**
 * reducePathKeyframes: remove “unnecessary” frames if the shape
 * can be approximated by interpolating from neighbors within a certain tolerance.
 */
export function reducePathKeyframes(pathKFs: PathKFArray, tolerance: number): PathKFArray {
  if (pathKFs.length <= 2) return pathKFs;

  const reduced: PathKFArray = [pathKFs[0]];

  for (let i = 1; i < pathKFs.length - 1; i++) {
    const prev = reduced[reduced.length - 1];
    const curr = pathKFs[i];
    const next = pathKFs[i + 1];
    if (!next) break;

    const alphaSpan = next.t - prev.t;
    const alpha = alphaSpan === 0 ? 0 : (curr.t - prev.t) / alphaSpan;

    // approximate
    const approx = interpolateBezierShape(prev.val, next.val, alpha);
    const dist = shapeDifference(curr.val, approx);

    if (dist <= tolerance) {
      // skip
    } else {
      reduced.push(curr);
    }
  }
  reduced.push(pathKFs[pathKFs.length - 1]);
  return reduced;
}
