import type { GradientStop, IRGroup, IRLayer, IRPath, IRRect, IRTransform, Ulottie } from "./types";

/**
 * Generate the <svg> markup for the initial frame (usually frame=0 or ip).
 */
export function generateInitialSvg(comp: Ulottie.Animation, layers: IRLayer[]): string {
  const { w, h } = comp;
  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">\n`;

  // We can insert <defs> for masks/gradients
  svg += `<defs>\n`;
  // (Gradients and mask definitions will be appended inline below)
  svg += `</defs>\n`;

  // for each layer => <g> ...
  for (const ly of layers) {
    // if mask => define <mask ...>
    let maskRef = "";
    if (ly.mask) {
      maskRef = `mask="url(#${ly.mask.id})"`;
      const firstM = ly.mask.pathKFs[0]?.val;
      const d = bezierShapeToString(firstM);
      const maskOp = (ly.mask.opacity.keyframes[0].val || 100) / 100;

      svg += `<mask id="${ly.mask.id}" maskUnits="userSpaceOnUse">\n`;
      svg += `  <rect x="0" y="0" width="${w}" height="${h}" fill="white" />\n`;
      svg += `  <path d="${d}" fill="black" fill-opacity="${maskOp}" />\n`;
      svg += `</mask>\n`;
    }

    // layer transform from first keyframes
    const anchor = pickValue2D(ly.transform?.anchor, [0, 0]);
    const pos = pickValue2D(ly.transform?.position, [0, 0]);
    const sc = pickValue2D(ly.transform?.scale, [100, 100]);
    const rot = pickValue(ly.transform?.rotation, 0);
    const lop = pickValue(ly.transform?.opacity, 100) / 100;

    let layerTr = `translate(${pos[0]},${pos[1]}) `;
    if (anchor[0] || anchor[1]) {
      layerTr += `rotate(${rot},${anchor[0]},${anchor[1]}) `;
    } else {
      layerTr += `rotate(${rot}) `;
    }
    layerTr += `scale(${sc[0] / 100},${sc[1] / 100}) `;

    svg += `<g id="${ly.id}" ${maskRef} opacity="${lop}" transform="${layerTr.trim()}">\n`;

    // For each shape in the layer, generate its SVG element recursively.
    for (const sh of ly.shapes) {
      svg += generateShape(sh);
    }

    svg += `</g>\n`;
  }

  svg += `</svg>`;
  return svg;
}

/**
 * Generate the SVG element string for an IRShape.
 * If the shape is a group, delegate to generateGroup.
 */
function generateShape(sh: any): string {
  if (sh.type === "group") {
    return generateGroup(sh);
  }
  if (sh.type === "rect" && sh.rect) {
    return generateRect(sh);
  }
  if (sh.type === "path" && sh.pathKeyframes) {
    return generatePath(sh);
  }
  return "";
}

/**
 * Generate a <g> element for an IRGroup.
 * Applies its own transform (if any), modifier attributes, and recursively
 * nests child shape SVG.
 */
function generateGroup(group: IRGroup): string {
  // Build the transform attribute for the group.
  const transformAttr = group.transform ? buildTransformAttribute(group.transform) : "";
  // Process any group-level modifiers (e.g. fill, stroke, gradient)
  let modifierAttrs = "";
  if (group.modifiers) {
    for (const mod of group.modifiers) {
      if (mod.type === "fill") {
        modifierAttrs += ` fill="${colorToRgb(mod.fillColor.keyframes[0].val)}"`;
      }
      // Extend for stroke and gradient as needed.
    }
  }
  // Recursively generate children SVG.
  let childrenSvg = "";
  for (const child of group.children) {
    childrenSvg += generateShape(child);
  }
  return `<g id="${group.id}" ${transformAttr}${modifierAttrs}>${childrenSvg}</g>\n`;
}

/**
 * Generate a <rect> element for an IRRect.
 */
function generateRect(rectShape: IRRect): string {
  const fx = pickColor(rectShape.fillColor, [0, 0, 0, 1]);
  const sx = pickColor(rectShape.strokeColor, [0, 0, 0, 0]);
  const sw = pickValue(rectShape.strokeWidth, 1);
  const fOp = fx[3];
  const sOp = sx[3];
  // Position adjustments: center the rectangle.
  const x = rectShape.rect.x - rectShape.rect.width / 2;
  const y = rectShape.rect.y - rectShape.rect.height / 2;
  let fillAttr = `fill="rgb(${Math.round(fx[0] * 255)},${Math.round(fx[1] * 255)},${Math.round(fx[2] * 255)})" fill-opacity="${fOp}"`;
  if (rectShape.gradient) {
    // Use a gradient if available.
    const gradId = `gradRect_${rectShape.id}`;
    const gradKF = rectShape.gradient.keyframes[0];
    // Append gradient definition to <defs> if necessary.
    // (In this demo, we assume makeLinearGradientDef appends its output to the SVG.)
    // For simplicity, we call it here.
    // In production, you might manage defs separately.
    fillAttr = `fill="url(#${gradId})"`;
  }
  return `<rect id="${rectShape.id}" x="${x}" y="${y}" width="${rectShape.rect.width}" height="${rectShape.rect.height}" rx="${rectShape.rect.cornerRadius}" opacity="1" ${fillAttr} stroke="rgb(${Math.round(sx[0] * 255)},${Math.round(sx[1] * 255)},${Math.round(sx[2] * 255)})" stroke-opacity="${sOp}" stroke-width="${sw}" />\n`;
}

/**
 * Generate a <path> element for an IRPath.
 */
function generatePath(pathShape: IRPath): string {
  const pathFirst = pathShape.pathKeyframes[0].val;
  const d = bezierShapeToString(pathFirst);
  const fx = pickColor(pathShape.fillColor, [0, 0, 0, 1]);
  const sx = pickColor(pathShape.strokeColor, [0, 0, 0, 0]);
  const sw = pickValue(pathShape.strokeWidth, 1);
  const fOp = fx[3];
  const sOp = sx[3];
  let fillAttr = `fill="rgb(${Math.round(fx[0] * 255)},${Math.round(fx[1] * 255)},${Math.round(fx[2] * 255)})" fill-opacity="${fOp}"`;
  // if (pathShape.gradient) {
  //   const gradId = `gradPath_${pathShape.id}`;
  //   const gradKF = pathShape.gradient.keyframes[0];
  //   svgDefs += makeLinearGradientDef(gradId, gradKF);
  //   fillAttr = `fill="url(#${gradId})"`;
  // }
  return `<path id="${pathShape.id}" d="${d}" opacity="1" ${fillAttr} stroke="rgb(${Math.round(sx[0] * 255)},${Math.round(sx[1] * 255)},${Math.round(sx[2] * 255)})" stroke-opacity="${sOp}" stroke-width="${sw}" />\n`;
}

/**
 * Build a transform attribute from an IRTransform.
 */
function buildTransformAttribute(transform: IRTransform): string {
  const pos = pickValue2D(transform.position, [0, 0]);
  const anc = pickValue2D(transform.anchor, [0, 0]);
  const sc = pickValue2D(transform.scale, [100, 100]);
  const rt = pickValue(transform.rotation, 0);
  let t = `translate(${pos[0]},${pos[1]}) `;
  if (anc[0] || anc[1]) {
    t += `rotate(${rt},${anc[0]},${anc[1]}) `;
  } else {
    t += `rotate(${rt}) `;
  }
  t += `scale(${sc[0] / 100},${sc[1] / 100})`;
  return `transform="${t.trim()}"`;
}

/**
 * Helper: Convert a color keyframe value array to an RGB string.
 */
function colorToRgb(c: number[]): string {
  return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
}

/*********************************************************
 *  Utility: Build shapes from Bezier shape data
 *********************************************************/
/**
 * Converts a Lottie bezier shape into an SVG path data string.
 *
 * @param shapeData - The Lottie shape data object.
 * @returns The SVG path string.
 */
function bezierShapeToString(shapeData: Ulottie.BezierShape): string {
  if (!shapeData.s || shapeData.s.length === 0) {
    return "";
  }

  // Using the first shape from the "s" array
  const shape = shapeData.s[0];
  const { v, i, o, c } = shape;

  if (!v || v.length === 0) {
    return "";
  }

  // Start the path at the first vertex
  let d = `M ${v[0][0]} ${v[0][1]}`;
  const pointCount = v.length;

  // Build path segments.
  // For a closed path, loop over every point; for an open path, stop before the last vertex.
  if (c) {
    // For each segment, wrap around using modulus.
    for (let j = 0; j < pointCount; j++) {
      const current = v[j];
      const next = v[(j + 1) % pointCount];
      // Compute control points by adding tangent offsets to the anchor points.
      const cp1: [number, number] = [current[0] + o[j][0], current[1] + o[j][1]];
      const cp2: [number, number] = [
        next[0] + i[(j + 1) % pointCount][0],
        next[1] + i[(j + 1) % pointCount][1],
      ];
      d += ` C ${cp1[0]} ${cp1[1]} ${cp2[0]} ${cp2[1]} ${next[0]} ${next[1]}`;
    }
    // Close the path
    d += " Z";
  } else {
    // Open path: iterate until the second-to-last vertex
    for (let j = 0; j < pointCount - 1; j++) {
      const current = v[j];
      const next = v[j + 1];
      const cp1: [number, number] = [current[0] + o[j][0], current[1] + o[j][1]];
      const cp2: [number, number] = [next[0] + i[j + 1][0], next[1] + i[j + 1][1]];
      d += ` C ${cp1[0]} ${cp1[1]} ${cp2[0]} ${cp2[1]} ${next[0]} ${next[1]}`;
    }
  }

  return d;
}

/** pickValue2D from the first keyframe, or fallback */
function pickValue2D(v2: any, defVal: [number, number]): [number, number] {
  if (!v2 || !v2.keyframes || v2.keyframes.length < 1) return defVal;
  return v2.keyframes[0].val;
}

function pickValue(v: any, defVal: number): number {
  if (!v || !v.keyframes || v.keyframes.length < 1) return defVal;
  return v.keyframes[0].val;
}

function pickColor(
  c: any,
  defVal: [number, number, number, number],
): [number, number, number, number] {
  if (!c || !c.keyframes || c.keyframes.length < 1) return defVal;
  return c.keyframes[0].val;
}

/** Utility to generate <linearGradient> definition from one gradient keyframe. */
function makeLinearGradientDef(id: string, gradKF: any): string {
  let def = `<linearGradient id="${id}" x1="${gradKF.start[0]}" y1="${gradKF.start[1]}" x2="${gradKF.end[0]}" y2="${gradKF.end[1]}" gradientUnits="userSpaceOnUse">\n`;
  gradKF.stops.forEach((s: GradientStop) => {
    def += `  <stop offset="${s.offset * 100}%" stop-color="rgb(${Math.round(s.r * 255)},${Math.round(s.g * 255)},${Math.round(s.b * 255)})" />\n`;
  });
  def += `</linearGradient>\n`;
  return def;
}

/**
 * Generate the runtime JS that will animate the SVG in the browser.
 */
export function generateRuntimeJs(comp: Ulottie.Animation, layers: IRLayer[]): string {
  // Build a big JSON for each layer & shape
  const data = layers.map((ly) => ({
    layerId: ly.id,
    transform: ly.transform
      ? {
          anchor: ly.transform.anchor?.keyframes,
          position: ly.transform.position?.keyframes,
          scale: ly.transform.scale?.keyframes,
          rotation: ly.transform.rotation?.keyframes,
          opacity: ly.transform.opacity?.keyframes,
        }
      : null,
    mask: ly.mask
      ? {
          id: ly.mask.id,
          pathKFs: ly.mask.pathKFs,
          opacity: ly.mask.opacity.keyframes,
        }
      : null,
    shapes: ly.shapes.map((sh) => {
      if (sh.type === "rect") {
        return {
          id: sh.id,
          type: "rect",
          rect: sh.rect,
          fillColor: sh.fillColor?.keyframes,
          strokeColor: sh.strokeColor?.keyframes,
          strokeWidth: sh.strokeWidth?.keyframes,
          gradient: sh.gradient,
        };
      }
      if (sh.type === "path") {
        return {
          id: sh.id,
          type: "path",
          pathKFs: sh.pathKeyframes,
          fillColor: sh.fillColor?.keyframes,
          strokeColor: sh.strokeColor?.keyframes,
          strokeWidth: sh.strokeWidth?.keyframes,
          gradient: sh.gradient,
        };
      }
      if (sh.type === "group") {
        return {
          id: sh.id,
          type: "group",
          children: sh.children,
          transform: sh.transform,
          modifiers: sh.modifiers,
        };
      }
      return null;
    }),
  }));

  const runtimeData = JSON.stringify(data);

  // The main animation code calls `uLottie.runAnimation(...)`
  const code = `
(function(){
  const comp = {
    ip: ${comp.ip},
    op: ${comp.op},
    fr: ${comp.fr},
    data: ${runtimeData}
  };
  uLottie.runAnimation(comp);
})();
`;
  return code;
}

/**
 * Shared runtime JS for numeric/array interpolation, path building, etc.
 */
export function generateSharedRuntimeJS(): string {
  return `(function () {
  function cubicBezier(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return u*u*u * p0 + 3 * u*u * t * p1 + 3 * u * t*t * p2 + t*t*t * p3;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function findKFValue(kfs, frame) {
    if (!kfs || kfs.length < 1) return 0;
    if (frame <= kfs[0].t) return kfs[0].val;
    if (frame >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1].val;
    for (let i = 0; i < kfs.length - 1; i++) {
      let k0 = kfs[i], k1 = kfs[i+1];
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

  function buildPathBetween(a, b, t) {
    const out = { c: a.c, v: [], i: [], o: [] };
    const len = Math.min(a.v.length, b.v.length);
    for (let i = 0; i < len; i++) {
      // Define control points for x and y.
      const p0x = a.v[i][0], p0y = a.v[i][1];
      const p1x = a.v[i][0] + a.o[i][0], p1y = a.v[i][1] + a.o[i][1];
      const p2x = b.v[i][0] + b.i[i][0], p2y = b.v[i][1] + b.i[i][1];
      const p3x = b.v[i][0], p3y = b.v[i][1];

      // Compute new vertex position using the cubic Bezier formula.
      const newX = cubicBezier(p0x, p1x, p2x, p3x, t);
      const newY = cubicBezier(p0y, p1y, p2y, p3y, t);
      out.v.push([newX, newY]);

      // For the tangents we can choose to keep linear interpolation,
      // or apply a similar cubic interpolation. Here, we opt for linear.
      const newOutX = lerp(a.o[i][0], b.o[i][0], t);
      const newOutY = lerp(a.o[i][1], b.o[i][1], t);
      const newInX = lerp(a.i[i][0], b.i[i][0], t);
      const newInY = lerp(a.i[i][1], b.i[i][1], t);
      out.o.push([newOutX, newOutY]);
      out.i.push([newInX, newInY]);
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
        return;
      }
      requestAnimationFrame(animateFrame);

      const progress = elapsed / duration;
      const frame = comp.ip + progress * (comp.op - comp.ip);

      comp.data.forEach(layer => {
        let lElem = document.getElementById(layer.layerId);
        if (!lElem) return;

        let anchor = findKFValue(layer.transform?.anchor, frame) || [0, 0];
        let position = findKFValue(layer.transform?.position, frame) || [0, 0];
        let scale = findKFValue(layer.transform?.scale, frame) || [100, 100];
        let rotation = findKFValue(layer.transform?.rotation, frame) || 0;
        let lopacity = (findKFValue(layer.transform?.opacity, frame) || 100) / 100;

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

        if (layer.mask) {
          let maskElem = document.getElementById(layer.mask.id);
          if (maskElem) {
            let mp = findPathKeyframeValue(layer.mask.pathKFs, frame);
            let mOp = findKFValue(layer.mask.opacity, frame) / 100;
            let pathElem = maskElem.querySelector('path');
            if (pathElem) {
              pathElem.setAttribute('d', pathToD(mp));
              pathElem.setAttribute('fill-opacity', mOp);
            }
          }
        }

        layer.shapes.forEach(sh => {
          let sElem = document.getElementById(sh.id);
          if (!sElem) return;

          let shAnchor = findKFValue(sh.anchor, frame) || [0, 0];
          let shPos = findKFValue(sh.position, frame) || [0, 0];
          let shScale = findKFValue(sh.scale, frame) || [100, 100];
          let shRot = findKFValue(sh.rotation, frame) || 0;
          let shOp = (findKFValue(sh.opacity, frame) || 100) / 100;

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

          if (sh.fillColor && sh.fillColor.length > 0) {
            let fc = findKFValue(sh.fillColor, frame);
            let col = 'rgb(' + Math.round(fc[0] * 255) + ',' + Math.round(fc[1] * 255) + ',' + Math.round(fc[2] * 255) + ')';
            sElem.setAttribute('fill', col);
            sElem.setAttribute('fill-opacity', fc[3]);
          }
          if (sh.strokeColor && sh.strokeColor.length > 0) {
            let sc = findKFValue(sh.strokeColor, frame);
            let scol = 'rgb(' + Math.round(sc[0] * 255) + ',' + Math.round(sc[1] * 255) + ',' + Math.round(sc[2] * 255) + ')';
            sElem.setAttribute('stroke', scol);
            sElem.setAttribute('stroke-opacity', sc[3]);
          }
          if (sh.strokeWidth && sh.strokeWidth.length > 0) {
            let sw = findKFValue(sh.strokeWidth, frame);
            sElem.setAttribute('stroke-width', sw);
          }
          if (sh.type === 'path' && sh.pathKFs && sh.pathKFs.length > 0) {
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
