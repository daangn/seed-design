export namespace Ulottie {
  /*****************************************************
   *  Values
   *****************************************************/

  export type IntegerBoolean = 0 | 1;

  export type Vector = number[];

  export type Color = [number, number, number] | [number, number, number, number];

  export type HexColor = `#${string}`;

  export type Gradient = number[];

  export interface BezierShape {
    c?: boolean; // closed?
    i: Vector[]; // in tangents
    o: Vector[]; // out tangents
    v: Vector[]; // vertices
  }

  /*****************************************************
   *  Properties
   *****************************************************/

  export type Property =
    | VectorProperty
    | ScalarProperty
    | PositionProperty
    | ColorProperty
    | BezierShapeProperty
    | GradientProperty;

  export type Keyframe =
    | VectorKeyframe
    | PositionKeyframe
    | ColorKeyframe
    | BezierShapeKeyframe
    | GradientKeyframe;

  export interface KeyframeEasing {
    x: Vector | number;
    y: Vector | number;
  }

  export type VectorProperty = { a: 0; k: Vector } | { a: 1; k: VectorKeyframe[] };

  export interface VectorKeyframe {
    t: number;
    h?: IntegerBoolean;
    i?: KeyframeEasing;
    o?: KeyframeEasing;
    s: Vector;
  }

  export type ScalarProperty = { a: 0; k: number } | { a: 1; k: VectorKeyframe[] };

  export type PositionProperty = { a: 0; k: Vector } | { a: 1; k: PositionKeyframe[] };

  export interface PositionKeyframe {
    t: number;
    h?: IntegerBoolean;
    i?: KeyframeEasing;
    o?: KeyframeEasing;
    s: Vector;
    ti: Vector;
    to: Vector;
  }

  export interface SplitPosition {
    s: 1;
    x: ScalarProperty;
    y: ScalarProperty;
  }

  export type SplittablePositionProperty = { s?: boolean } & (SplitPosition | PositionProperty);

  export type BezierShapeProperty = { a: 0; k: BezierShape } | { a: 1; k: BezierShapeKeyframe[] };

  export interface BezierShapeKeyframe {
    t: number;
    h?: IntegerBoolean;
    i?: KeyframeEasing;
    o?: KeyframeEasing;
    s: [BezierShape];
  }

  export type ColorProperty = { a: 0; k: Color } | { a: 1; k: ColorKeyframe[] };

  export interface ColorKeyframe {
    t: number;
    h?: IntegerBoolean;
    i?: KeyframeEasing;
    o?: KeyframeEasing;
    s: Color;
  }

  export interface GradientProperty {
    p: number;
    k: { a: 0; k: Gradient } | { a: 1; k: GradientKeyframe[] };
  }

  export interface GradientKeyframe {
    t: number;
    h?: IntegerBoolean;
    i?: KeyframeEasing;
    o?: KeyframeEasing;
    s: Gradient;
  }

  /*****************************************************
   *  Layers
   *****************************************************/

  /** Minimal shape layer (no text, images, precomps, etc.) */
  export interface ShapeLayer {
    ty: 4;
    nm?: string;
    shapes: GraphicElement[];
    masksProperties?: Mask[];
  }

  /*****************************************************
   *  Shapes
   *****************************************************/

  export interface Path {
    ty: "sh";
    nm?: string;
    hd?: boolean;
    d?: ShapeDirection;
    ks: BezierShapeProperty;
  }

  export interface Rectangle {
    ty: "rc";
    nm?: string;
    hd?: boolean;
    d?: ShapeDirection;
    p: VectorProperty;
    s: VectorProperty;
    r: ScalarProperty;
  }

  export type Shape = Path | Rectangle;

  /** Transform for a shape layer: anchor, position, scale, rotation, opacity */
  export interface TransformShape {
    ty: "tr";
    nm?: string;
    a?: PositionProperty;
    p?: SplittablePositionProperty;
    r?: ScalarProperty;
    s?: VectorProperty;
    o?: ScalarProperty;
    sk?: ScalarProperty;
    sa?: ScalarProperty;
  }

  export interface Group {
    ty: "gr";
    nm?: string;
    np: number; // number of properties
    it: GraphicElement[];
  }

  /** Solid Fill */
  export interface Fill {
    ty: "fl";
    nm?: string;
    o?: ScalarProperty; // opacity
    c: ColorProperty; // color only
    r?: FillRule;
  }

  /** Stroke (no dash, no opacity) */
  export interface Stroke {
    ty: "st";
    nm?: string;
    o?: ScalarProperty; // opacity
    lc?: LineCap;
    lj?: LineJoin;
    ml?: number; // miter limit
    ml2?: ScalarProperty; // miter limit (animated)
    w: ScalarProperty; // stroke width
    d?: StrokeDash[];
    c: ColorProperty; // stroke color
  }

  export interface StrokeDash {
    n: StrokeDashType;
    v: ScalarProperty;
  }

  /**
   * Linear Gradient Fill.
   * - `t=1` for linear only (radial not supported).
   * - `g` is an object storing the color stops.
   * - `s` and `e` are animated 2D points for start/end (in layer coords).
   */
  export interface GradientFill {
    ty: "gf";
    nm?: string;
    t: 1;
    o?: ScalarProperty; // opacity
    g: GradientProperty;
    s: PositionProperty; // start point
    e: PositionProperty; // end point
    h?: ScalarProperty; // highlight length
    a?: ScalarProperty; // angle
    r?: FillRule;
  }

  export type ShapeStyle = Fill | GradientFill | Stroke;

  export type GraphicElement = Shape | ShapeStyle | TransformShape | Group;

  /*****************************************************
   *  Compositions
   *****************************************************/

  /** Top-level animation. */
  export interface Animation {
    v: string; // version
    fr: number; // frame rate
    w: number; // width
    h: number; // height
    ip: number; // in point
    op: number; // out point
    layers: ShapeLayer[];
  }

  /*****************************************************
   *  Enums
   *****************************************************/

  export type ShapeDirection = 1 | 3; // 1=normal, 3=reversed

  export type FillRule = 1 | 2; // 1=non-zero, 2=even-odd

  export type LineCap = 1 | 2 | 3; // 1=butt, 2=round, 3=square

  export type LineJoin = 1 | 2 | 3; // 1=miter, 2=round, 3=bevel

  export type StrokeDashType = "d" | "g" | "o"; // dashed, gap, offset

  /*****************************************************
   *  Helpers
   *****************************************************/

  /** Limited mask: only subtract with path+opacity. */
  export interface Mask {
    nm?: string;
    mode: "s"; // subtract
    o: ScalarProperty; // mask opacity
    pt: BezierShapeProperty; // mask path
  }
}

/*****************************************************
 *  Internal IR structures
 *****************************************************/

export interface PathKeyframe {
  t: number;
  val: Ulottie.BezierShape;
}
export interface PathKFArray extends Array<PathKeyframe> {}

export interface IRTransform {
  anchor?: Value2DKF;
  position?: Value2DKF;
  scale?: Value2DKF;
  rotation?: ValueKF;
  opacity?: ValueKF;
}

// IRModifier type: used for modifier elements inside a group
export type IRModifier =
  | { type: "fill"; fillColor: ColorKF }
  | { type: "stroke"; strokeColor: ColorKF; strokeWidth: ValueKF }
  | { type: "gradient"; gradient: GradientKF };

// Extend the IRShape union to include a group type.
export interface IRGroup {
  id: string;
  type: "group";
  transform?: IRTransform;
  children: IRShape[];
  modifiers?: IRModifier[];
}

// Existing IRPath and IRRect remain unchanged:
export interface IRPath {
  id: string;
  type: "path";
  pathKeyframes: PathKFArray;
  fillColor?: ColorKF;
  strokeColor?: ColorKF;
  strokeWidth?: ValueKF;
  gradient?: GradientKF;
}

export interface IRRect {
  id: string;
  type: "rect";
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius: number;
  };
  fillColor?: ColorKF;
  strokeColor?: ColorKF;
  strokeWidth?: ValueKF;
  gradient?: GradientKF;
}

// IRShape union now includes IRGroup:
export type IRShape = IRPath | IRRect | IRGroup;

/** IR for a single layer. It might have multiple shapes, plus a layer transform, plus a mask. */
export interface IRLayer {
  id: string;
  shapes: IRShape[];
  transform?: IRTransform;
  mask?: {
    id: string;
    pathKFs: PathKFArray;
    opacity: ValueKF;
  };
}

export interface GradientKF {
  keyframes: Array<{
    t: number;
    stops: GradientStop[];
    start: [number, number];
    end: [number, number];
  }>;
}

export interface GradientStop {
  offset: number;
  r: number;
  g: number;
  b: number;
}

export interface ValueKF {
  keyframes: Array<{ t: number; val: number }>;
}

export interface Value2DKF {
  keyframes: Array<{ t: number; val: [number, number] }>;
}

export interface ColorKF {
  keyframes: Array<{ t: number; val: [number, number, number, number] }>;
}

/** Final output: SSR <svg> + minimal runtime JS. */
export interface CompileOutput {
  initialSvg: string;
  runtimeJs: string;
}
