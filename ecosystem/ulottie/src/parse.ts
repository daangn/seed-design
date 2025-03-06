import type {
  ColorKF,
  GradientKF,
  IRGroup,
  IRLayer,
  IRModifier,
  IRShape,
  IRTransform,
  PathKFArray,
  Ulottie,
  Value2DKF,
  ValueKF,
} from "./types";

import { reducePathKeyframes } from "./analyze";

let layerCounter = 0;
let shapeCounter = 0;
let maskCounter = 0;

/**
 * parseAnimation: parse the entire animation into IR layers
 */
export function parseAnimation(comp: Ulottie.Animation): IRLayer[] {
  // Reset counters for each compile
  layerCounter = 0;
  shapeCounter = 0;
  maskCounter = 0;

  const irLayers: IRLayer[] = [];

  for (const layer of comp.layers) {
    const lid = `layer${layerCounter++}`;
    const parsed = parseLayer(layer, lid);
    irLayers.push(parsed);
  }

  return irLayers;
}

/** Parse a single Lottie layer into an IRLayer */
function parseLayer(layer: Ulottie.ShapeLayer, lid: string): IRLayer {
  const shapeIRs: IRShape[] = [];
  let transformIR: IRTransform | undefined = undefined;
  let maskIR: IRLayer["mask"] | undefined;

  // parse mask if any
  if (layer.masksProperties && layer.masksProperties.length > 0) {
    // TODO: processing first mask for test; need to handle multiple masks
    const m = layer.masksProperties[0];
    if (m.mode === "s") {
      // parse subtract mask
      const pathKFs = parseBezierShapeProperty(m.pt, 0.5);
      const opKF = parseScalarProperty(m.o);
      maskIR = {
        id: `mask${maskCounter++}`,
        pathKFs,
        opacity: opKF,
      };
    }
  }

  // parse shape items
  let shapeInProgress: IRShape | null = null;

  for (const item of layer.shapes) {
    switch (item.ty) {
      case "sh": {
        // path
        const shape = parseShapePath(item);
        shapeIRs.push(shape);
        shapeInProgress = shape;
        break;
      }
      case "rc": {
        // rectangle
        const shape = parseRectangle(item);
        shapeIRs.push(shape);
        shapeInProgress = shape;
        break;
      }
      case "fl": {
        // fill
        const fl = item as Ulottie.Fill;
        const col = parseColorProperty(fl.c);
        if (shapeInProgress) {
          shapeInProgress.fillColor = col;
        }
        break;
      }
      case "st": {
        // stroke
        const st = item as Ulottie.Stroke;
        const col = parseColorProperty(st.c);
        const w = parseScalarProperty(st.w);
        if (shapeInProgress) {
          shapeInProgress.strokeColor = col;
          shapeInProgress.strokeWidth = w;
        }
        break;
      }
      case "gf": {
        // gradient fill
        const gf = item as Ulottie.GradientFill;
        const grad = parseGradient(gf);
        if (shapeInProgress) {
          shapeInProgress.gradient = grad;
        }
        break;
      }
      case "tr": {
        // transform
        const tr = item as Ulottie.TransformShape;
        transformIR = parseTransform(tr);
        break;
      }
      case "gr": {
        // group
        const gr = item as Ulottie.Group;
        const parsedGroup = parseGroup(gr);
        shapeIRs.push(parsedGroup);
        break;
      }
      default:
        throw new Error(
          `Unsupported feature encountered in Ulottie parser: type "${(item as any).ty}" is not supported.`,
        );
    }
  }

  return {
    id: lid,
    shapes: shapeIRs,
    transform: transformIR,
    mask: maskIR,
  };
}

/*******************************************************
 *  Animated Path parse with keyframe reduction
 *******************************************************/
function parseBezierShapeProperty(ap: Ulottie.BezierShapeProperty, tolerance: number): PathKFArray {
  const result: PathKFArray = [];
  if (ap.a === 0 && ap.k) {
    // single static path
    result.push({ t: 0, val: ap.k });
  } else if (ap.a === 1 && ap.k) {
    for (const k of ap.k) {
      result.push({ t: k.t, val: k.s[0] });
    }
    // sort by time
    result.sort((a, b) => a.t - b.t);

    // reduce
    return reducePathKeyframes(result, tolerance);
  }
  return result;
}

/*******************************************************
 *  Parse gradients, color, numeric values, etc.
 *******************************************************/
function parseGradient(gf: Ulottie.GradientFill): GradientKF {
  // Minimal approach: single keyframe
  if (gf.g.k.a === 1) throw new Error("GradientFill with multiple keyframes not supported");

  const stops = [];
  const kArr = gf.g.k.k; // [offset0, r0, g0, b0, offset1, r1,g1,b1, ...]
  for (let i = 0; i < kArr.length; i += 4) {
    stops.push({ offset: kArr[i], r: kArr[i + 1], g: kArr[i + 2], b: kArr[i + 3] });
  }

  // parse start+end
  const s = parseVectorProperty(gf.s).keyframes[0].val;
  const e = parseVectorProperty(gf.e).keyframes[0].val;
  return {
    keyframes: [
      {
        t: 0,
        stops,
        start: s,
        end: e,
      },
    ],
  };
}

function parseColorProperty(ac: Ulottie.ColorProperty): ColorKF {
  const out: ColorKF = { keyframes: [] };
  if (ac.a === 0 && ac.k) {
    out.keyframes.push({
      t: 0,
      val: [ac.k[0] || 0, ac.k[1] || 0, ac.k[2] || 0, ac.k[3] === undefined ? 1 : ac.k[3]],
    });
  } else if (ac.a === 1 && ac.k) {
    for (const k of ac.k) {
      out.keyframes.push({
        t: k.t,
        val: [k.s[0] || 0, k.s[1] || 0, k.s[2] || 0, k.s[3] === undefined ? 1 : k.s[3]],
      });
    }
    out.keyframes.sort((a, b) => a.t - b.t);
  } else {
    out.keyframes.push({ t: 0, val: [0, 0, 0, 1] });
  }
  return out;
}

function parseScalarProperty(v: Ulottie.ScalarProperty): ValueKF {
  const out: ValueKF = { keyframes: [] };
  if (v.a === 0 && typeof v.k === "number") {
    out.keyframes.push({ t: 0, val: v.k });
  } else if (v.a === 1 && v.k) {
    for (const k of v.k) {
      out.keyframes.push({ t: k.t, val: k.s[0] });
    }
    out.keyframes.sort((a, b) => a.t - b.t);
  } else {
    out.keyframes.push({ t: 0, val: 0 });
  }
  return out;
}

function parsePositionProperty(v2d: Ulottie.PositionProperty): Value2DKF {
  const out: Value2DKF = { keyframes: [] };
  if (v2d.a === 0 && v2d.k) {
    out.keyframes.push({ t: 0, val: [v2d.k[0] || 0, v2d.k[1] || 0] });
  } else if (v2d.a === 1 && v2d.k) {
    for (const k of v2d.k) {
      out.keyframes.push({ t: k.t, val: [k.s[0] || 0, k.s[1] || 0] });
    }
    out.keyframes.sort((a, b) => a.t - b.t);
  } else {
    out.keyframes.push({ t: 0, val: [0, 0] });
  }
  return out;
}

function parseVectorProperty(v2d: Ulottie.VectorProperty): Value2DKF {
  const out: Value2DKF = { keyframes: [] };
  if (v2d.a === 0 && v2d.k) {
    out.keyframes.push({ t: 0, val: [v2d.k[0] || 0, v2d.k[1] || 0] });
  } else if (v2d.a === 1 && v2d.k) {
    for (const k of v2d.k) {
      out.keyframes.push({ t: k.t, val: [k.s[0] || 0, k.s[1] || 0] });
    }
    out.keyframes.sort((a, b) => a.t - b.t);
  } else {
    out.keyframes.push({ t: 0, val: [0, 0] });
  }
  return out;
}

function parseShapePath(sp: Ulottie.Path): IRShape {
  const pathKFs = parseBezierShapeProperty(sp.ks, 0.5);
  const newId = `shape${shapeCounter++}`;
  return {
    id: newId,
    type: "path",
    pathKeyframes: pathKFs,
    fillColor: emptyColorKF(),
    strokeColor: undefined,
    strokeWidth: undefined,
  };
}

function parseRectangle(rc: Ulottie.Rectangle): IRShape {
  const px = parseVectorProperty(rc.p).keyframes[0].val;
  const sx = parseVectorProperty(rc.s).keyframes[0].val;
  const rr = parseScalarProperty(rc.r).keyframes[0].val;
  const newId = `shape${shapeCounter++}`;
  return {
    id: newId,
    type: "rect",
    rect: {
      x: px[0],
      y: px[1],
      width: sx[0],
      height: sx[1],
      cornerRadius: rr,
    },
    fillColor: emptyColorKF(),
    strokeColor: undefined,
    strokeWidth: undefined,
  };
}
function parseGroup(gr: Ulottie.Group): IRGroup {
  if (gr.ty !== "gr") {
    throw new Error(`Expected "gr" but got "${gr.ty}"`);
  }

  // Guaranteed by spec: non-null transform element using non-null assertion.
  const trItem = gr.it.find((it) => it.ty === "tr")!;
  const groupTransform = parseTransform(trItem as Ulottie.TransformShape);

  const children: IRShape[] = [];
  const modifiers: IRModifier[] = [];

  // Process each item in the group's "it" array
  for (const subItem of gr.it) {
    if (subItem.ty === "tr") {
      // Already processed as the group transform.
      continue;
    }
    if (subItem.ty === "sh" || subItem.ty === "rc" || subItem.ty === "gr") {
      // Recursively parse shapes and nested groups.
      const parsedShapes = parseShape(subItem);
      children.push(...parsedShapes);
    } else if (subItem.ty === "fl") {
      // Handle fill modifier.
      const fl = subItem as Ulottie.Fill;
      modifiers.push({ type: "fill", fillColor: parseColorProperty(fl.c) });
    } else if (subItem.ty === "st") {
      // Handle stroke modifier.
      const st = subItem as Ulottie.Stroke;
      modifiers.push({
        type: "stroke",
        strokeColor: parseColorProperty(st.c),
        strokeWidth: parseScalarProperty(st.w),
      });
    } else if (subItem.ty === "gf") {
      // Handle gradient modifier.
      const gf = subItem as Ulottie.GradientFill;
      modifiers.push({ type: "gradient", gradient: parseGradient(gf) });
    }
    // (Other modifier types can be handled similarly.)
  }

  return {
    id: `group${shapeCounter++}`,
    type: "group",
    transform: groupTransform,
    children,
    modifiers: modifiers.length ? modifiers : undefined,
  };
}

function parseShape(item: Ulottie.Path | Ulottie.Rectangle | Ulottie.Group): IRShape[] {
  switch (item.ty) {
    case "sh":
      return [parseShapePath(item as Ulottie.Path)];
    case "rc":
      return [parseRectangle(item as Ulottie.Rectangle)];
    case "gr":
      return [parseGroup(item as Ulottie.Group)];
    default:
      throw new Error(
        `Unsupported feature encountered in Ulottie parser: type "${(item as any).ty}" is not supported.`,
      );
  }
}

function parseTransform(tr: Ulottie.TransformShape): IRTransform {
  return {
    anchor: tr.a ? parsePositionProperty(tr.a) : undefined,
    position: tr.p ? parsePositionProperty(tr.p) : undefined,
    scale: tr.s ? parseVectorProperty(tr.s) : undefined,
    rotation: tr.r ? parseScalarProperty(tr.r) : undefined,
    opacity: tr.o ? parseScalarProperty(tr.o) : undefined,
  };
}

/*******************************************************
 *  Utility: empty placeholders
 *******************************************************/
function emptyColorKF(): ColorKF {
  return { keyframes: [{ t: 0, val: [0, 0, 0, 1] }] };
}
