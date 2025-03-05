/*****************************************************
 *  Subset Lottie Types for μLottie
 *****************************************************/
export interface UlottieShapePath {
  ty: "sh";
  nm?: string;
  ks: UlottieAnimatedPath;
}

export interface UlottieRect {
  ty: "rc";
  nm?: string;
  p: UlottieAnimatedValue2D;
  s: UlottieAnimatedValue2D;
  r: UlottieAnimatedValue;
}

/** Basic shape (no ellipses, polystars, etc.) */
export interface UlottieShape {
  ty: "sh" | "rc";
  nm?: string;

  // For "sh":
  ks?: UlottieAnimatedPath;
  // For "rc":
  p?: UlottieAnimatedValue2D;
  s?: UlottieAnimatedValue2D;
  r?: UlottieAnimatedValue;
}

/** Solid Fill (no gradient) */
export interface UlottieFill {
  ty: "fl";
  c: UlottieAnimatedColor; // color only
}

/** Stroke (no dash, no opacity) */
export interface UlottieStroke {
  ty: "st";
  c: UlottieAnimatedColor; // stroke color
  w: UlottieAnimatedValue; // stroke width
}

/**
 * Linear Gradient Fill.
 * - `t=1` for linear only (radial not supported).
 * - `g` is an object storing the color stops.
 * - `s` and `e` are animated 2D points for start/end (in layer coords).
 */
export interface UlottieGradientFill {
  ty: "gf";
  t: 1;
  g: {
    p: number; // number of color points * 4? (Lottie uses p = 2 * (# of color stops))
    k: number[]; // color stop data [offset0, r0, g0, b0, offset1, r1, g1, b1, ...]
  };
  s: UlottieAnimatedValue2D; // start point
  e: UlottieAnimatedValue2D; // end point
}

/** Transform for a shape layer: anchor, position, scale, rotation, opacity */
export interface UlottieTransform {
  ty: "tr";
  a: UlottieAnimatedValue2D;
  p: UlottieAnimatedValue2D;
  s: UlottieAnimatedValue2D;
  r: UlottieAnimatedValue;
  o: UlottieAnimatedValue;
}

/** Minimal shape layer (no text, images, precomps, etc.) */
export interface UlottieLayer {
  ty: "shape";
  nm?: string;
  shapes: Array<
    UlottieShape | UlottieFill | UlottieGradientFill | UlottieStroke | UlottieTransform
  >;
  masksProperties?: UlottieMask[];
}

/** Limited mask: only subtract with path+opacity. */
export interface UlottieMask {
  nm?: string;
  mode: "s"; // subtract
  pt: UlottieAnimatedPath;
  o: UlottieAnimatedValue; // mask opacity
}

/** Top-level composition. */
export interface UlottieComposition {
  v: string; // version
  fr: number; // frame rate
  w: number; // width
  h: number; // height
  ip: number; // in point
  op: number; // out point
  layers: UlottieLayer[];
}

/*****************************************************
 *  Animated Value Definitions
 *****************************************************/
export interface UlottieKeyframe {
  t: number; // time (in frames)
  s: number[]; // start value
}

export interface UlottieAnimatedValue {
  a: 0 | 1;
  k?: number;
  kf?: UlottieKeyframe[];
}

export interface UlottieAnimatedValue2D {
  a: 0 | 1;
  k?: number[];
  kf?: UlottieKeyframe[];
}

export interface UlottieAnimatedColor {
  a: 0 | 1;
  k?: number[];
  kf?: UlottieKeyframe[];
}

export interface UlottieAnimatedPath {
  a: 0 | 1;
  k?: UlottiePath;
  kf?: UlottiePathKeyframe[];
}

export interface UlottiePath {
  c: boolean; // closed?
  i: number[][]; // in tangents
  o: number[][]; // out tangents
  v: number[][]; // vertices
}

export interface UlottiePathKeyframe {
  t: number;
  s: UlottiePath[];
}
