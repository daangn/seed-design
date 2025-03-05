/*******************************************************
 * Full μLottie Compiler with Path KF Reduction
 *
 * It:
 *  1) Parses a UlottieComposition (subset Lottie).
 *  2) For shape paths, stores ALL path keyframes but
 *     culls “unneeded” frames via reducePathKeyframes().
 *  3) Produces:
 *     - initialSvg: <svg> for the composition’s initial frame
 *     - runtimeJs: minimal code that does dynamic interpolation
 *       of transforms, colors, strokes, and path geometry.
 *******************************************************/

import type {
  UlottieAnimatedColor,
  UlottieAnimatedPath,
  UlottieAnimatedValue,
  UlottieAnimatedValue2D,
  UlottieComposition,
  UlottieFill,
  UlottieGradientFill,
  UlottieLayer,
  UlottiePath,
  UlottieRect,
  UlottieShapePath,
  UlottieStroke,
  UlottieTransform,
} from "./types";

/** A simplified representation of path keyframes after culling. */
interface PathKeyframe {
  t: number;
  val: UlottiePath;
}

interface PathKFArray extends Array<PathKeyframe> {}

/**
 * IR for each shape. Notably, if "type==='path'", we store the entire
 * path keyframe array (post-reduction).
 */
interface IRShape {
  id: string; // unique shape ID
  type: "rect" | "path";
  // For rect
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius: number;
  };
  // For path
  pathKeyframes?: PathKFArray;

  // fill/stroke
  fillColor?: ColorKF;
  strokeColor?: ColorKF;
  strokeWidth?: ValueKF;
  gradient?: GradientKF;

  // shape-level transform
  anchor?: Value2DKF;
  position?: Value2DKF;
  scale?: Value2DKF;
  rotation?: ValueKF;
  opacity?: ValueKF;
}

/**
 * Keyframe arrays for numeric or color properties.
 * We'll keep them in an array of {t, val}, sorted by t.
 */
interface ValueKF {
  keyframes: Array<{ t: number; val: number }>;
}

interface Value2DKF {
  keyframes: Array<{ t: number; val: [number, number] }>;
}

interface ColorKF {
  keyframes: Array<{ t: number; val: [number, number, number, number] }>;
}

/** Simple gradient structure for demonstration. */
interface GradientKF {
  keyframes: Array<{
    t: number;
    stops: GradientStop[];
    start: [number, number];
    end: [number, number];
  }>;
}
interface GradientStop {
  offset: number;
  r: number;
  g: number;
  b: number;
}

/**
 * IR for a single layer. It might have multiple shapes, plus a layer transform, plus a mask.
 */
interface IRLayer {
  id: string;
  shapes: IRShape[];
  transform?: {
    anchor: Value2DKF;
    position: Value2DKF;
    scale: Value2DKF;
    rotation: ValueKF;
    opacity: ValueKF;
  };
  mask?: {
    id: string;
    pathKFs: PathKFArray;
    opacity: ValueKF;
  };
}

/** Final output: SSR <svg> + minimal runtime JS. */
export interface CompileOutput {
  initialSvg: string;
  runtimeJs: string;
}

export class UlottieCompiler {
  private layerCounter = 0;
  private shapeCounter = 0;
  private maskCounter = 0;
  private gradientCounter = 0;

  /**
   * The main compile entry.
   *
   * usage:
   *   const compiler = new UlottieCompiler();
   *   const { initialSvg, runtimeJs } = compiler.compile(myCompData);
   */
  public compile(comp: UlottieComposition): CompileOutput {
    const irLayers: IRLayer[] = [];

    for (const layer of comp.layers) {
      const lid = `layer${this.layerCounter++}`;
      const parsed = this.parseLayer(layer, lid);
      irLayers.push(parsed);
    }

    const initialSvg = this.generateInitialSvg(comp, irLayers);
    const runtimeJs = this.generateRuntimeJs(comp, irLayers);

    return { initialSvg, runtimeJs };
  }

  public generateHelperJS(): string {
    return `(function () {
  function lerp(a, b, t) { return a + (b - a) * t; }
  function findKFValue(kfs, frame) {
    // find bracketing frames
    if (!kfs || kfs.length < 1) return 0;
    if (frame <= kfs[0].t) return kfs[0].val;
    if (frame >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1].val;
    for (let i = 0; i < kfs.length - 1; i++) {
      let k0 = kfs[i], k1 = kfs[i + 1];
      if (frame >= k0.t && frame <= k1.t) {
        let span = (k1.t - k0.t);
        let alpha = span === 0 ? 0 : (frame - k0.t) / span;
        if (Array.isArray(k0.val)) {
          let out = [];
          for (let c = 0; c < k0.val.length; c++) {
            out[c] = lerp(k0.val[c], k1.val[c], alpha);
          }
          return out;
        } else {
          return lerp(k0.val, k1.val, alpha);
        }
      }
    }
    return kfs[0].val;
  }

  function buildPathBetween(a, b, alpha) {
    // linearly interpolate a & b's v,i,o
    let out = { c: a.c, v: [], i: [], o: [] };
    let len = Math.min(a.v.length, b.v.length);
    for (let i = 0; i < len; i++) {
      out.v.push([
        lerp(a.v[i][0], b.v[i][0], alpha),
        lerp(a.v[i][1], b.v[i][1], alpha)
      ]);
      out.i.push([
        lerp(a.i[i][0], b.i[i][0], alpha),
        lerp(a.i[i][1], b.i[i][1], alpha)
      ]);
      out.o.push([
        lerp(a.o[i][0], b.o[i][0], alpha),
        lerp(a.o[i][1], b.o[i][1], alpha)
      ]);
    }
    return out;
  }

  function findPathKeyframeValue(kfs, frame) {
    if (kfs.length < 1) return null;
    if (frame <= kfs[0].t) return kfs[0].val;
    if (frame >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1].val;
    for (let i = 0; i < kfs.length - 1; i++) {
      let k0 = kfs[i], k1 = kfs[i + 1];
      if (frame >= k0.t && frame <= k1.t) {
        let span = (k1.t - k0.t);
        let alpha = span === 0 ? 0 : (frame - k0.t) / span;
        return buildPathBetween(k0.val, k1.val, alpha);
      }
    }
    return kfs[0].val;
  }

  function pathToD(p) {
    if (!p || !p.v || p.v.length < 1) return '';
    let d = 'M' + p.v[0][0] + ',' + p.v[0][1];
    for (let i = 1; i < p.v.length; i++) {
      let px = i - 1;
      let cx1 = p.v[px][0] + p.o[px][0];
      let cy1 = p.v[px][1] + p.o[px][1];
      let cx2 = p.v[i][0] + p.i[i][0];
      let cy2 = p.v[i][1] + p.i[i][1];
      d += ' C' + cx1 + ',' + cy1 + ' ' + cx2 + ',' + cy2 + ' ' + p.v[i][0] + ',' + p.v[i][1];
    }
    if (p.c) {
      let last = p.v.length - 1;
      let cx1 = p.v[last][0] + p.o[last][0];
      let cy1 = p.v[last][1] + p.o[last][1];
      let cx2 = p.v[0][0] + p.i[0][0];
      let cy2 = p.v[0][1] + p.i[0][1];
      d += ' C' + cx1 + ',' + cy1 + ' ' + cx2 + ',' + cy2 + ' ' + p.v[0][0] + ',' + p.v[0][1] + ' Z';
    }
    return d;
  }

  function runAnimation(comp) {
    const totalFrames = comp.op - comp.ip;
    const duration = (totalFrames / comp.fr) * 1000;
    let startTime;

    function animateFrame(t) {
      if (!startTime) startTime = t;
      const elapsed = t - startTime;
      if (elapsed > duration) {
        // end
        return;
      }
      requestAnimationFrame(animateFrame);

      const progress = elapsed / duration; // 0..1
      const frame = comp.ip + progress * (comp.op - comp.ip);

      // each layer
      comp.data.forEach(layer => {
        let lElem = document.getElementById(layer.layerId);
        if (!lElem) return;

        let anchor = findKFValue(layer.transform?.anchor, frame);
        let position = findKFValue(layer.transform?.position, frame);
        let scale = findKFValue(layer.transform?.scale, frame);
        let rotation = findKFValue(layer.transform?.rotation, frame);
        let lopacity = findKFValue(layer.transform?.opacity, frame) / 100;

        let lTr = '';
        lTr += 'translate(' + position[0] + ',' + position[1] + ') ';
        if (anchor[0] || anchor[1]) {
          lTr += 'rotate(' + rotation + ',' + anchor[0] + ',' + anchor[1] + ') ';
        } else {
          lTr += 'rotate(' + rotation + ') ';
        }
        lTr += 'scale(' + (scale[0] / 100) + ',' + (scale[1] / 100) + ') ';
        lElem.setAttribute('transform', lTr.trim());
        lElem.setAttribute('opacity', lopacity);

        // mask
        if (layer.mask) {
          let maskElem = document.getElementById(layer.mask.id);
          if (maskElem) {
            // find path
            let mp = findPathKeyframeValue(layer.mask.pathKFs, frame);
            let mOp = findKFValue(layer.mask.opacity, frame) / 100;
            let pathElem = maskElem.querySelector('path');
            if (pathElem) {
              pathElem.setAttribute('d', pathToD(mp));
              pathElem.setAttribute('fill-opacity', mOp);
            }
          }
        }

        // shapes
        layer.shapes.forEach(sh => {
          let sElem = document.getElementById(sh.id);
          if (!sElem) return;
          let shAnchor = findKFValue(sh.anchor, frame);
          let shPos = findKFValue(sh.position, frame);
          let shScale = findKFValue(sh.scale, frame);
          let shRot = findKFValue(sh.rotation, frame);
          let shOp = findKFValue(sh.opacity, frame);

          let sTr = '';
          sTr += 'translate(' + shPos[0] + ',' + shPos[1] + ') ';
          if (shAnchor[0] || shAnchor[1]) {
            sTr += 'rotate(' + shRot + ',' + shAnchor[0] + ',' + shAnchor[1] + ') ';
          } else {
            sTr += 'rotate(' + shRot + ') ';
          }
          sTr += 'scale(' + (shScale[0] / 100) + ',' + (shScale[1] / 100) + ') ';
          sElem.setAttribute('transform', sTr.trim());
          sElem.setAttribute('opacity', shOp);

          // fill color
          if (sh.fillColor && sh.fillColor.length > 0) {
            let fc = findKFValue(sh.fillColor, frame);
            let col = 'rgb(' + Math.round(fc[0] * 255) + ',' + Math.round(fc[1] * 255) + ',' + Math.round(fc[2] * 255) + ')';
            sElem.setAttribute('fill', col);
            sElem.setAttribute('fill-opacity', fc[3]);
          }
          // stroke color
          if (sh.strokeColor && sh.strokeColor.length > 0) {
            let sc = findKFValue(sh.strokeColor, frame);
            let col = 'rgb(' + Math.round(sc[0] * 255) + ',' + Math.round(sc[1] * 255) + ',' + Math.round(sc[2] * 255) + ')';
            sElem.setAttribute('stroke', col);
            sElem.setAttribute('stroke-opacity', sc[3]);
          }
          // stroke width
          if (sh.strokeWidth && sh.strokeWidth.length > 0) {
            let sw = findKFValue(sh.strokeWidth, frame);
            sElem.setAttribute('stroke-width', sw);
          }
          // path geometry
          if (sh.type === 'path' && sh.pathKFs && sh.pathKFs.length > 0) {
            // fully dynamic path
            let pVal = findPathKeyframeValue(sh.pathKFs, frame);
            sElem.setAttribute('d', pathToD(pVal));
          }
        });
      });
    }
    requestAnimationFrame(animateFrame);
  }

  window.uLottie = {
    runAnimation: runAnimation
  };
})();`;
  }

  /*******************************************************
   *  parseLayer => IRLayer
   *******************************************************/
  private parseLayer(layer: UlottieLayer, lid: string): IRLayer {
    // parse shapes
    const shapeIRs: IRShape[] = [];
    let transformIR: IRLayer["transform"] = undefined;
    let maskIR: IRLayer["mask"] | undefined;

    // parse mask if any
    if (layer.masksProperties && layer.masksProperties.length > 0) {
      // We only demonstrate the first mask
      const m = layer.masksProperties[0];
      if (m.mode === "s") {
        // parse subtract mask
        const pathKFs = this.parseAnimatedPath(m.pt, /*tolerance=*/ 0.5);
        const opKF = this.parseValue(m.o);
        maskIR = {
          id: `mask${this.maskCounter++}`,
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
          const sp = item as UlottieShapePath;
          const newId = `shape${this.shapeCounter++}`;
          const pathKFs = this.parseAnimatedPath(sp.ks, /*some tolerance*/ 0.5);

          const shape: IRShape = {
            id: newId,
            type: "path",
            pathKeyframes: pathKFs,
            fillColor: this.emptyColorKF(),
            strokeColor: undefined,
            strokeWidth: undefined,
            anchor: this.emptyValue2DKF([0, 0]),
            position: this.emptyValue2DKF([0, 0]),
            scale: this.emptyValue2DKF([100, 100]),
            rotation: this.emptyValueKF(0),
            opacity: this.emptyValueKF(1),
          };
          shapeIRs.push(shape);
          shapeInProgress = shape;
          break;
        }
        case "rc": {
          const rc = item as UlottieRect;
          const newId = `shape${this.shapeCounter++}`;
          // We do not store keyframes for rect geometry itself in this example,
          // if you want to animate rect size, you can parse them in the same manner.
          const shape: IRShape = {
            id: newId,
            type: "rect",
            rect: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              cornerRadius: 0,
            },
            fillColor: this.emptyColorKF(),
            anchor: this.emptyValue2DKF([0, 0]),
            position: this.emptyValue2DKF([0, 0]),
            scale: this.emptyValue2DKF([100, 100]),
            rotation: this.emptyValueKF(0),
            opacity: this.emptyValueKF(1),
          };
          // parse p, s, r => store them if you want shape-level geometry anim
          // Or we just read the initial and store them in `rect`.
          shapeIRs.push(shape);
          shapeInProgress = shape;
          break;
        }
        case "fl": {
          // fill
          const fl = item as UlottieFill;
          const col = this.parseAnimatedColor(fl.c);
          if (shapeInProgress) {
            shapeInProgress.fillColor = col;
          }
          break;
        }
        case "st": {
          // stroke
          const st = item as UlottieStroke;
          const col = this.parseAnimatedColor(st.c);
          const w = this.parseValue(st.w);
          if (shapeInProgress) {
            shapeInProgress.strokeColor = col;
            shapeInProgress.strokeWidth = w;
          }
          break;
        }
        case "gf": {
          // gradient fill
          const gf = item as UlottieGradientFill;
          const grad = this.parseGradient(gf);
          if (shapeInProgress) {
            shapeInProgress.gradient = grad;
          }
          break;
        }
        case "tr": {
          // transform
          const tr = item as UlottieTransform;
          transformIR = {
            anchor: this.parseValue2D(tr.a),
            position: this.parseValue2D(tr.p),
            scale: this.parseValue2D(tr.s),
            rotation: this.parseValue(tr.r),
            opacity: this.parseValue(tr.o),
          };
          break;
        }
        default:
          // not implemented
          break;
      }
    }

    const out: IRLayer = {
      id: lid,
      shapes: shapeIRs,
      transform: transformIR,
      mask: maskIR,
    };
    return out;
  }

  /*******************************************************
   *  parseAnimatedPath with Keyframe Reduction
   *******************************************************/
  private parseAnimatedPath(ap: UlottieAnimatedPath, tolerance: number): PathKFArray {
    const result: PathKFArray = [];

    if (ap.a === 0 && ap.k) {
      // single static path
      result.push({ t: 0, val: ap.k });
    } else if (ap.a === 1 && ap.kf) {
      for (const k of ap.kf) {
        if (k.s && k.s[0]) {
          result.push({ t: k.t, val: k.s[0] });
        }
      }
      // sort by time
      result.sort((a, b) => a.t - b.t);

      // Now do the reduction
      const reduced = this.reducePathKeyframes(result, tolerance);
      return reduced;
    }

    return result;
  }

  /**
   * reducePathKeyframes: remove “unnecessary” frames if the shape can be approximated
   * by interpolating from neighbors within a certain tolerance.
   */
  private reducePathKeyframes(pathKFs: PathKFArray, tolerance: number): PathKFArray {
    if (pathKFs.length <= 2) return pathKFs;

    const reduced: PathKFArray = [pathKFs[0]];

    for (let i = 1; i < pathKFs.length - 1; i++) {
      const prev = reduced[reduced.length - 1];
      const curr = pathKFs[i];
      const next = pathKFs[i + 1];
      if (!next) break;

      const alphaSpan = next.t - prev.t;
      const alpha = alphaSpan === 0 ? 0 : (curr.t - prev.t) / alphaSpan;

      const approx = this.interpolatePath(prev.val, next.val, alpha);
      const dist = this.shapeDifference(curr.val, approx);

      if (dist <= tolerance) {
        // skip
      } else {
        reduced.push(curr);
      }
    }
    reduced.push(pathKFs[pathKFs.length - 1]);
    return reduced;
  }

  /**
   * Interpolate two path shapes linearly by alpha in [0..1].
   * (Assumes same # of vertices, tangents).
   */
  private interpolatePath(a: UlottiePath, b: UlottiePath, alpha: number): UlottiePath {
    const out: UlottiePath = {
      c: a.c, // assuming same closed
      i: [],
      o: [],
      v: [],
    };
    // naive approach: same vertex count
    for (let idx = 0; idx < a.v.length; idx++) {
      // v
      out.v.push([
        a.v[idx][0] + alpha * (b.v[idx][0] - a.v[idx][0]),
        a.v[idx][1] + alpha * (b.v[idx][1] - a.v[idx][1]),
      ]);
      // i
      out.i.push([
        a.i[idx][0] + alpha * (b.i[idx][0] - a.i[idx][0]),
        a.i[idx][1] + alpha * (b.i[idx][1] - a.i[idx][1]),
      ]);
      // o
      out.o.push([
        a.o[idx][0] + alpha * (b.o[idx][0] - a.o[idx][0]),
        a.o[idx][1] + alpha * (b.o[idx][1] - a.o[idx][1]),
      ]);
    }
    return out;
  }

  /**
   * shapeDifference => average distance between corresponding vertices/tangents
   */
  private shapeDifference(a: UlottiePath, b: UlottiePath): number {
    let sum = 0,
      count = 0;
    // naive assume same # points
    for (let i = 0; i < a.v.length; i++) {
      const dx = a.v[i][0] - b.v[i][0];
      const dy = a.v[i][1] - b.v[i][1];
      sum += Math.sqrt(dx * dx + dy * dy);
      count++;

      const dix = a.i[i][0] - b.i[i][0];
      const diy = a.i[i][1] - b.i[i][1];
      sum += Math.sqrt(dix * dix + diy * diy);
      count++;

      const dox = a.o[i][0] - b.o[i][0];
      const doy = a.o[i][1] - b.o[i][1];
      sum += Math.sqrt(dox * dox + doy * doy);
      count++;
    }
    return sum / count;
  }

  /*******************************************************
   *  parse gradients, color, value, etc.
   *******************************************************/
  private parseGradient(gf: UlottieGradientFill): GradientKF {
    // Minimal approach: single keyframe
    const stops: GradientStop[] = [];
    const kArr = gf.g.k; // [offset0,r0,g0,b0, offset1, r1,g1,b1, ...]
    for (let i = 0; i < kArr.length; i += 4) {
      stops.push({ offset: kArr[i], r: kArr[i + 1], g: kArr[i + 2], b: kArr[i + 3] });
    }
    // parse start+end
    const start = this.parseValue2D(gf.s).keyframes[0].val;
    const end = this.parseValue2D(gf.e).keyframes[0].val;

    return {
      keyframes: [{ t: 0, stops, start, end }],
    };
  }

  private parseAnimatedColor(ac: UlottieAnimatedColor): ColorKF {
    const out: ColorKF = { keyframes: [] };
    if (ac.a === 0 && ac.k) {
      out.keyframes.push({
        t: 0,
        val: [ac.k[0] || 0, ac.k[1] || 0, ac.k[2] || 0, ac.k[3] === undefined ? 1 : ac.k[3]],
      });
    } else if (ac.a === 1 && ac.kf) {
      for (const k of ac.kf) {
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

  private parseValue(v: UlottieAnimatedValue): ValueKF {
    const out: ValueKF = { keyframes: [] };
    if (v.a === 0 && typeof v.k === "number") {
      out.keyframes.push({ t: 0, val: v.k });
    } else if (v.a === 1 && v.kf) {
      for (const k of v.kf) {
        out.keyframes.push({ t: k.t, val: k.s[0] });
      }
      out.keyframes.sort((a, b) => a.t - b.t);
    } else {
      out.keyframes.push({ t: 0, val: 0 });
    }
    return out;
  }

  private parseValue2D(v2d: UlottieAnimatedValue2D): Value2DKF {
    const out: Value2DKF = { keyframes: [] };
    if (v2d.a === 0 && v2d.k) {
      out.keyframes.push({ t: 0, val: [v2d.k[0] || 0, v2d.k[1] || 0] });
    } else if (v2d.a === 1 && v2d.kf) {
      for (const k of v2d.kf) {
        out.keyframes.push({ t: k.t, val: [k.s[0] || 0, k.s[1] || 0] });
      }
      out.keyframes.sort((a, b) => a.t - b.t);
    } else {
      out.keyframes.push({ t: 0, val: [0, 0] });
    }
    return out;
  }

  private emptyColorKF(): ColorKF {
    return { keyframes: [{ t: 0, val: [0, 0, 0, 1] }] };
  }
  private emptyValueKF(defVal: number): ValueKF {
    return { keyframes: [{ t: 0, val: defVal }] };
  }
  private emptyValue2DKF(defVal: [number, number]): Value2DKF {
    return { keyframes: [{ t: 0, val: defVal }] };
  }

  /*******************************************************
   *  Generate <svg> for initial frame
   *******************************************************/
  private generateInitialSvg(comp: UlottieComposition, layers: IRLayer[]): string {
    const { w, h } = comp;
    let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">\n`;

    // We'll place <defs> inside if needed
    svg += `<defs>\n`;
    // We define masks and gradients inline as we go
    svg += `</defs>\n`;

    // for each layer => <g> ...
    layers.forEach((ly) => {
      // if mask => define <mask ...>
      let maskRef = "";
      if (ly.mask) {
        maskRef = `mask="url(#${ly.mask.id})"`;

        // Build the path from the first keyframe
        const firstM = ly.mask.pathKFs[0].val;
        const d = this.pathToString(firstM);
        const maskOp = (ly.mask.opacity.keyframes[0].val || 100) / 100;

        // Create a <mask> with a big white rect minus a black path
        // naive approach to "subtract" mask
        svg += `<mask id="${ly.mask.id}" maskUnits="userSpaceOnUse">\n`;
        svg += `  <rect x="0" y="0" width="${w}" height="${h}" fill="white"/>\n`;
        svg += `  <path d="${d}" fill="black" fill-opacity="${maskOp}"/>\n`;
        svg += `</mask>\n`;
      }

      // layer transform => from the first keyframe
      const anchor = this.pickValue2D(ly.transform?.anchor, 0);
      const pos = this.pickValue2D(ly.transform?.position, 0);
      const sc = this.pickValue2D(ly.transform?.scale, 0);
      const rot = this.pickValue(ly.transform?.rotation, 0);
      const lop = this.pickValue(ly.transform?.opacity, 100) / 100;

      let layerTr = `translate(${pos[0]}, ${pos[1]}) `;
      if (anchor[0] || anchor[1]) {
        layerTr += `rotate(${rot}, ${anchor[0]}, ${anchor[1]}) `;
      } else {
        layerTr += `rotate(${rot}) `;
      }
      layerTr += `scale(${sc[0] / 100}, ${sc[1] / 100}) `;

      svg += `<g id="${ly.id}" ${maskRef} opacity="${lop}" transform="${layerTr.trim()}">\n`;

      // shapes
      ly.shapes.forEach((sh) => {
        if (sh.type === "rect" && sh.rect) {
          // pick the shape's initial transform, fill, etc.
          const fx = this.pickColor(sh.fillColor, [0, 0, 0, 1]);
          const sx = this.pickColor(sh.strokeColor, [0, 0, 0, 0]);
          const sw = this.pickValue(sh.strokeWidth, 1);
          const sOp = sx[3];
          const fOp = fx[3];

          const x = sh.rect.x - sh.rect.width / 2;
          const y = sh.rect.y - sh.rect.height / 2;

          // shape-level transform?
          const shapetr = this.buildShapeTransform(sh, 0);

          // gradient?
          let fillAttr = `fill="rgb(${Math.round(fx[0] * 255)},${Math.round(fx[1] * 255)},${Math.round(fx[2] * 255)})" fill-opacity="${fOp}"`;
          if (sh.gradient) {
            const gradId = `grad${this.gradientCounter++}`;
            const gradKF = sh.gradient.keyframes[0];
            svg += `<defs><linearGradient id="${gradId}" x1="${gradKF.start[0]}" y1="${gradKF.start[1]}" x2="${gradKF.end[0]}" y2="${gradKF.end[1]}" gradientUnits="userSpaceOnUse">\n`;
            gradKF.stops.forEach((s) => {
              svg += `  <stop offset="${s.offset * 100}%" stop-color="rgb(${Math.round(s.r * 255)},${Math.round(s.g * 255)},${Math.round(s.b * 255)})"/>\n`;
            });
            svg += `</linearGradient></defs>\n`;
            fillAttr = `fill="url(#${gradId})"`;
          }

          svg += `<rect id="${sh.id}" x="${x}" y="${y}" width="${sh.rect.width}" height="${sh.rect.height}" rx="${sh.rect.cornerRadius}" transform="${shapetr}" opacity="1" ${fillAttr} stroke="rgb(${Math.round(sx[0] * 255)},${Math.round(sx[1] * 255)},${Math.round(sx[2] * 255)})" stroke-opacity="${sOp}" stroke-width="${sw}" />\n`;
        } else if (sh.type === "path" && sh.pathKeyframes) {
          // build from first keyframe
          const pathFirst = sh.pathKeyframes[0].val;
          const d = this.pathToString(pathFirst);

          const fx = this.pickColor(sh.fillColor, [0, 0, 0, 1]);
          const sx = this.pickColor(sh.strokeColor, [0, 0, 0, 0]);
          const sw = this.pickValue(sh.strokeWidth, 1);
          const sOp = sx[3];
          const fOp = fx[3];

          const shapetr = this.buildShapeTransform(sh, 0);

          let fillAttr = `fill="rgb(${Math.round(fx[0] * 255)},${Math.round(fx[1] * 255)},${Math.round(fx[2] * 255)})" fill-opacity="${fOp}"`;
          if (sh.gradient) {
            const gradId = `grad${this.gradientCounter++}`;
            const gradKF = sh.gradient.keyframes[0];
            svg += `<defs><linearGradient id="${gradId}" x1="${gradKF.start[0]}" y1="${gradKF.start[1]}" x2="${gradKF.end[0]}" y2="${gradKF.end[1]}" gradientUnits="userSpaceOnUse">\n`;
            gradKF.stops.forEach((s) => {
              svg += `  <stop offset="${s.offset * 100}%" stop-color="rgb(${Math.round(s.r * 255)},${Math.round(s.g * 255)},${Math.round(s.b * 255)})"/>\n`;
            });
            svg += `</linearGradient></defs>\n`;
            fillAttr = `fill="url(#${gradId})"`;
          }

          svg += `<path id="${sh.id}" d="${d}" transform="${shapetr}" opacity="1" ${fillAttr} stroke="rgb(${Math.round(sx[0] * 255)},${Math.round(sx[1] * 255)},${Math.round(sx[2] * 255)})" stroke-opacity="${sOp}" stroke-width="${sw}" />\n`;
        }
      });

      svg += `</g>\n`;
    });

    svg += `</svg>`;
    return svg;
  }

  private pathToString(p: UlottiePath): string {
    if (!p.v || p.v.length < 1) return "";
    let d = `M${p.v[0][0]},${p.v[0][1]}`;
    for (let i = 1; i < p.v.length; i++) {
      const px = i - 1;
      const cx1 = p.v[px][0] + p.o[px][0];
      const cy1 = p.v[px][1] + p.o[px][1];
      const cx2 = p.v[i][0] + p.i[i][0];
      const cy2 = p.v[i][1] + p.i[i][1];
      d += ` C${cx1},${cy1} ${cx2},${cy2} ${p.v[i][0]},${p.v[i][1]}`;
    }
    if (p.c) {
      const last = p.v.length - 1;
      const cx1 = p.v[last][0] + p.o[last][0];
      const cy1 = p.v[last][1] + p.o[last][1];
      const cx2 = p.v[0][0] + p.i[0][0];
      const cy2 = p.v[0][1] + p.i[0][1];
      d += ` C${cx1},${cy1} ${cx2},${cy2} ${p.v[0][0]},${p.v[0][1]} Z`;
    }
    return d;
  }

  private pickValue2D(v2: Value2DKF | undefined, def: number): [number, number] {
    if (!v2 || v2.keyframes.length < 1) return [def, def];
    return v2.keyframes[0].val;
  }
  private pickValue(v: ValueKF | undefined, def: number): number {
    if (!v || v.keyframes.length < 1) return def;
    return v.keyframes[0].val;
  }
  private pickColor(
    c: ColorKF | undefined,
    def: [number, number, number, number],
  ): [number, number, number, number] {
    if (!c || c.keyframes.length < 1) return def;
    return c.keyframes[0].val;
  }

  private buildShapeTransform(sh: IRShape, frame: number): string {
    // just pick first or do a real “lookup.” For the initial:
    const pos = sh.position?.keyframes[0].val || [0, 0];
    const anc = sh.anchor?.keyframes[0].val || [0, 0];
    const sc = sh.scale?.keyframes[0].val || [100, 100];
    const rt = sh.rotation?.keyframes[0].val || 0;
    let sTr = "";
    sTr += `translate(${pos[0]},${pos[1]}) `;
    if (anc[0] || anc[1]) {
      sTr += `rotate(${rt},${anc[0]},${anc[1]}) `;
    } else {
      sTr += `rotate(${rt}) `;
    }
    sTr += `scale(${sc[0] / 100},${sc[1] / 100}) `;
    return sTr.trim();
  }

  /*******************************************************
   *  Generate runtime JS
   *******************************************************/
  private generateRuntimeJs(comp: UlottieComposition, layers: IRLayer[]): string {
    // We'll store a big JSON for each layer & shape, including path keyframes
    const data = layers.map((ly) => {
      return {
        layerId: ly.id,
        transform: ly.transform
          ? {
              anchor: ly.transform.anchor.keyframes,
              position: ly.transform.position.keyframes,
              scale: ly.transform.scale.keyframes,
              rotation: ly.transform.rotation.keyframes,
              opacity: ly.transform.opacity.keyframes,
            }
          : null,
        mask: ly.mask
          ? {
              id: ly.mask.id,
              pathKFs: ly.mask.pathKFs,
              opacity: ly.mask.opacity.keyframes,
            }
          : null,
        shapes: ly.shapes.map((sh) => ({
          id: sh.id,
          type: sh.type,
          pathKFs: sh.pathKeyframes || [],
          rect: sh.rect || null,
          fillColor: sh.fillColor?.keyframes || [],
          strokeColor: sh.strokeColor?.keyframes || [],
          strokeWidth: sh.strokeWidth?.keyframes || [],
          gradient: sh.gradient ? sh.gradient.keyframes : null,
          anchor: sh.anchor?.keyframes || [],
          position: sh.position?.keyframes || [],
          scale: sh.scale?.keyframes || [],
          rotation: sh.rotation?.keyframes || [],
          opacity: sh.opacity?.keyframes || [],
        })),
      };
    });

    const runtimeData = JSON.stringify(data);

    // We'll also embed helper JS: linear interpolation for numeric/array,
    // plus dynamic path building for shape keyframes
    const code = `
(function(){
  const comp = {
    ip:${comp.ip},
    op:${comp.op},
    fr:${comp.fr},
    data:${runtimeData}
  };
  uLottie.runAnimation(comp);
})();
`;
    return code;
  }
}
