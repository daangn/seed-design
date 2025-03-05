/*****************************************************
 *  Minimal Type Definitions (Subset for Demo)
 *****************************************************/
export interface UlottieComposition {
  v: string; // Lottie version
  fr: number; // frame rate
  w: number; // width
  h: number; // height
  ip: number; // in point
  op: number; // out point
  layers: UlottieLayer[];
}

/** Subset: only shape layers (no text, precomps, images, etc.). */
export interface UlottieLayer {
  ty: "shape";
  nm?: string;
  shapes: (
    | UlottieShape // "sh" or "rc"
    | UlottieFill // "fl"
    | UlottieGradientFill // "gf" (linear)
    | UlottieStroke // "st"
    | UlottieTransform // "tr"
  )[];
}

export interface UlottieShape {
  ty: "sh" | "rc";
  nm?: string;

  // For "sh" (custom path):
  ks?: UlottieAnimatedPath;

  // For "rc" (rectangle):
  p?: UlottieAnimatedValue2D; // position
  s?: UlottieAnimatedValue2D; // size
  r?: UlottieAnimatedValue; // roundness
}

export interface UlottieFill {
  ty: "fl";
  c: UlottieAnimatedColor; // fill color
}

/** Linear Gradient Fill (no radial) */
export interface UlottieGradientFill {
  ty: "gf";
  t: 1; // 1=linear
  g: {
    p: number; // number of color stops * 2
    k: number[]; // array of offset & color: [offset0, r0, g0, b0, offset1, r1, g1, b1, ...]
  };
  s: UlottieAnimatedValue2D; // gradient start
  e: UlottieAnimatedValue2D; // gradient end
}

export interface UlottieStroke {
  ty: "st";
  c: UlottieAnimatedColor; // stroke color
  w: UlottieAnimatedValue; // stroke width
}

export interface UlottieTransform {
  ty: "tr";
  a: UlottieAnimatedValue2D; // anchor
  p: UlottieAnimatedValue2D; // position
  s: UlottieAnimatedValue2D; // scale
  r: UlottieAnimatedValue; // rotation
  o: UlottieAnimatedValue; // opacity
}

/*****************************************************
 * Animated Values
 *****************************************************/
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

/** Keyframe for numeric or array data. */
export interface UlottieKeyframe {
  t: number; // time (in frames)
  s: number[]; // start value
}

export interface UlottiePath {
  c: boolean; // closed
  i: number[][]; // in tangents (ignored here)
  o: number[][]; // out tangents (ignored)
  v: number[][]; // vertices
}

export interface UlottiePathKeyframe {
  t: number;
  s: UlottiePath[];
}

/*****************************************************
 * 1) Parsing (Minimal)
 *****************************************************/
export function parseUlottie(raw: any): UlottieComposition {
  // do minimal checks for demo
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid Lottie JSON");
  }
  if (!Array.isArray(raw.layers)) {
    throw new Error("No layers array found");
  }
  return raw as UlottieComposition;
}

/*****************************************************
 * 2) Evaluate a property at a given frame (static or linear interpolation).
 *    For SSR/initial frame or for animation updates.
 *****************************************************/
function evaluateProp(
  prop: UlottieAnimatedValue | UlottieAnimatedValue2D | UlottieAnimatedColor | UlottieAnimatedPath,
  frame: number,
): any {
  if (!prop.a) {
    // static
    return prop.k;
  } else {
    // keyframed
    const kfs = prop.kf || [];
    if (kfs.length === 0) return 0; // fallback
    if (frame <= kfs[0].t) return kfs[0].s[0];
    if (frame >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1].s[0];

    // linear interpolation
    for (let i = 0; i < kfs.length - 1; i++) {
      const kf1 = kfs[i];
      const kf2 = kfs[i + 1];
      if (frame >= kf1.t && frame <= kf2.t) {
        const ratio = (frame - kf1.t) / (kf2.t - kf1.t);
        const startVal = kf1.s[0];
        const endVal = kf2.s[0];
        if (Array.isArray(startVal) && Array.isArray(endVal)) {
          const out: number[] = [];
          for (let j = 0; j < startVal.length; j++) {
            out.push(startVal[j] + (endVal[j] - startVal[j]) * ratio);
          }
          return out;
        } else if (typeof startVal === "object") {
          // path => no partial interpolation in this demo
          return startVal;
        } else {
          // single numeric
          return startVal + (endVal - startVal) * ratio;
        }
      }
    }
    return kfs[kfs.length - 1].s[0];
  }
}

/*****************************************************
 * 3) Convert path data to an SVG "d" string
 *****************************************************/
function pathToD(path: UlottiePath): string {
  if (!path || !path.v || path.v.length === 0) return "";
  const first = path.v[0];
  let d = `M ${first[0]},${first[1]}`;
  for (let i = 1; i < path.v.length; i++) {
    d += ` L ${path.v[i][0]},${path.v[i][1]}`;
  }
  if (path.c) d += " Z"; // closed
  return d;
}

/*****************************************************
 * 4) Build the static <svg> for the "initial frame" (frame=ip).
 *    Each layer => <g> => shape => <path> or <rect> (or we can do <path> for rect).
 *    Fills can be: solid or a <defs><linearGradient> + fill="url(#...)".
 *****************************************************/
interface ShapeEntry {
  id: string; // DOM id for the shape
  type: "path" | "rect";
  gradientId?: string; // if it's a gradient fill
  fillColor?: string; // if it's a solid fill (e.g. "rgb(255,0,0)")
  strokeColor?: string;
  strokeWidth?: number;
}

/** Data we gather so that the script can update shape attributes at runtime. */
interface ShapeRuntimeData {
  shapeId: string;
  shapeType: "path" | "rect";
  // references to transform, fill, stroke, etc. property lookups
  // We'll store indexes or function calls in the JS generation step
}

interface LayerRuntimeData {
  layerId: string;
  transformIndex?: number; // We'll store an index into a "transform" function array, for instance
  shapes: ShapeRuntimeData[];
  gradientDefs?: string[]; // If multiple gradient fills in one layer
}

/** We’ll return the full static <svg> plus metadata for runtime animations. */
function buildInitialSVG(comp: UlottieComposition): {
  svgMarkup: string;
  layerData: LayerRuntimeData[];
} {
  const ipFrame = comp.ip; // we consider the "initial frame" as ip

  let svgParts: string[] = [];
  let gradientDefs: string[] = [];
  let layerDatas: LayerRuntimeData[] = [];

  // Start the <svg> opening tag
  svgParts.push(
    `<svg width="${comp.w}" height="${comp.h}" viewBox="0 0 ${comp.w} ${comp.h}" xmlns="http://www.w3.org/2000/svg">`,
  );

  comp.layers.forEach((layer, layerIndex) => {
    if (layer.ty !== "shape") return;

    const layerId = `layer_${layerIndex}`;
    let layerShapes: ShapeRuntimeData[] = [];
    let layerGradientDefs: string[] = [];

    // We'll compute a single transform for the layer (if it has a "tr" item).
    // In Lottie, transforms can appear anywhere, but in practice often appear at the end or in a "group."
    // For simplicity, we do a single transform. Real Lottie might have multiple.
    let transformAttr = "";
    let globalOpacity = 1;

    // We'll collect fill/stroke from shapes, but if there's a gradient, we'll define a <defs><linearGradient>...</defs>.
    // Then the shape references it via fill="url(#gradId)"
    // We gather shapes in a <g> block to apply the transform.
    let gOpen = `<g id="${layerId}">`;
    let gClose = `</g>`;

    // Evaluate each shape/fill/stroke for the initial frame
    // We'll store them so we can also animate them later.
    let shapeCounter = 0;

    // Because Lottie can have multiple shape items in the same layer, we combine them:
    // - If there's a "tr" item, we use it for the entire group
    // - If there's a fill or stroke, it typically applies to the shapes that follow
    // - For a gradient fill, we define a gradient ID
    // This is simplified compared to real Lottie grouping, but enough for a demonstration.
    let currentFillColor = "";
    let currentStrokeColor = "";
    let currentStrokeWidth = 0;
    let currentGradientId = "";

    layer.shapes.forEach((shapeItem) => {
      switch (shapeItem.ty) {
        // ========== TRANSFORM ==========
        case "tr": {
          // Evaluate anchor, position, scale, rotation, opacity at ipFrame
          const anchor = evaluateProp(shapeItem.a, ipFrame) || [0, 0];
          const position = evaluateProp(shapeItem.p, ipFrame) || [0, 0];
          const scale = evaluateProp(shapeItem.s, ipFrame) || [100, 100];
          const rotation = evaluateProp(shapeItem.r, ipFrame) || 0;
          const opacity = evaluateProp(shapeItem.o, ipFrame) || 100;

          globalOpacity = (opacity as number) / 100;
          // Build an SVG transform attribute:
          //   translate(position) rotate(...) scale(...)
          //   but we also shift by anchor
          //   e.g. translate(px, py) rotate(r) scale(sx/100, sy/100) translate(-ax, -ay)
          // For simplicity, we do anchor last, or we can incorporate it directly:
          // There's more than one "correct" approach to layering transforms in SVG, but we'll do a typical approach:
          const px = position[0],
            py = position[1];
          const sx = (scale[0] || 100) / 100,
            sy = (scale[1] || 100) / 100;
          const r = (rotation * Math.PI) / 180; // in radians
          const ax = anchor[0],
            ay = anchor[1];

          // We'll do: translate(px,py) rotate(deg) scale(...) translate(-ax, -ay)
          // But note that SVG rotates in degrees, so we can just do `rotate(rotation)`.
          transformAttr = `
transform="translate(${px},${py}) rotate(${rotation}) scale(${sx},${sy}) translate(${-ax},${-ay})"
opacity="${globalOpacity}"
`;
          break;
        }

        // ========== SOLID FILL ==========
        case "fl": {
          // Evaluate color [r,g,b]
          const c = evaluateProp(shapeItem.c, ipFrame) || [0, 0, 0];
          currentFillColor = `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`;
          currentGradientId = ""; // Not using gradient fill anymore
          break;
        }

        // ========== GRADIENT FILL (LINEAR) ==========
        case "gf": {
          // Evaluate start/end points
          // We'll do a single <linearGradient> for each gf item
          const gfObj = shapeItem as UlottieGradientFill;
          const startPt = evaluateProp(gfObj.s, ipFrame) || [0, 0];
          const endPt = evaluateProp(gfObj.e, ipFrame) || [0, 0];
          const gradId = `grad_${layerIndex}_${shapeCounter}`;

          // Build gradient stops from gfObj.g.k (static in this example)
          const stops = gfObj.g.k;
          // e.g. [offset0, r0, g0, b0, offset1, r1, g1, b1, ...]

          // We define a <linearGradient> in <defs>
          // The tricky part is that Lottie’s gradient coords might be in shape space,
          // while SVG’s default is objectBoundingBox or userSpaceOnUse. We pick userSpaceOnUse:
          // We'll place the gradient from startPt to endPt in absolute user coordinates.
          let gradientDef = `<linearGradient id="${gradId}" gradientUnits="userSpaceOnUse" x1="${startPt[0]}" y1="${startPt[1]}" x2="${endPt[0]}" y2="${endPt[1]}">`;
          for (let i = 0; i < stops.length; i += 4) {
            const offset = stops[i];
            const r = Math.round(stops[i + 1]);
            const g = Math.round(stops[i + 2]);
            const b = Math.round(stops[i + 3]);
            // offset typically 0..1 => 0%..100%
            gradientDef += `<stop offset="${offset * 100}%" stop-color="rgb(${r},${g},${b})"/>`;
          }
          gradientDef += `</linearGradient>`;

          layerGradientDefs.push(gradientDef);
          currentGradientId = gradId;
          currentFillColor = ""; // not using a solid fill
          break;
        }

        // ========== STROKE ==========
        case "st": {
          const c = evaluateProp(shapeItem.c, ipFrame) || [0, 0, 0];
          const w = evaluateProp(shapeItem.w, ipFrame) || 1;
          currentStrokeColor = `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`;
          currentStrokeWidth = w as number;
          break;
        }

        // ========== SHAPE (PATH) ==========
        case "sh": {
          const shapeId = `layer_${layerIndex}_shape_${shapeCounter}`;
          shapeCounter++;

          // Evaluate path for the initial frame
          const pathVal = evaluateProp(shapeItem.ks!, ipFrame) as UlottiePath;
          const dStr = pathVal ? pathToD(pathVal) : "";

          const fillAttr = currentGradientId
            ? `fill="url(#${currentGradientId})"`
            : currentFillColor
              ? `fill="${currentFillColor}"`
              : `fill="none"`;

          let strokeAttr = `stroke="none"`;
          if (currentStrokeColor) {
            strokeAttr = `stroke="${currentStrokeColor}" stroke-width="${currentStrokeWidth}"`;
          }

          svgParts.push(`  <path id="${shapeId}" d="${dStr}" ${fillAttr} ${strokeAttr} />`);

          layerShapes.push({
            shapeId,
            shapeType: "path",
          });
          break;
        }

        // ========== RECT ==========
        case "rc": {
          const shapeId = `layer_${layerIndex}_shape_${shapeCounter}`;
          shapeCounter++;

          // Evaluate p, s, r for the initial frame
          const pos = evaluateProp(shapeItem.p!, ipFrame) || [0, 0];
          const size = evaluateProp(shapeItem.s!, ipFrame) || [0, 0];
          const rd = evaluateProp(shapeItem.r!, ipFrame) || 0; // roundness
          const x = pos[0] - size[0] / 2;
          const y = pos[1] - size[1] / 2;

          const fillAttr = currentGradientId
            ? `fill="url(#${currentGradientId})"`
            : currentFillColor
              ? `fill="${currentFillColor}"`
              : `fill="none"`;

          let strokeAttr = `stroke="none"`;
          if (currentStrokeColor) {
            strokeAttr = `stroke="${currentStrokeColor}" stroke-width="${currentStrokeWidth}"`;
          }

          // For an SVG rect, rx & ry for rounding
          svgParts.push(
            `  <rect id="${shapeId}" x="${x}" y="${y}" width="${size[0]}" height="${size[1]}" rx="${rd}" ry="${rd}" ${fillAttr} ${strokeAttr} />`,
          );

          layerShapes.push({
            shapeId,
            shapeType: "rect",
          });
          break;
        }
      }
    }); // end shapes.forEach

    // Insert transform on the group
    svgParts.push(`${gOpen}<!-- the shapes above actually should be inside this <g> -->`);
    // Actually, to keep the code valid, we should wrap the shapes in the group.
    // Let's reorder: wrap the shapes inside <g>...
    // For simplicity, let's assume we do:
    //   <g id="layer_0" transform="..." opacity="...">
    //     <path ... />
    //     <rect ... />
    //   </g>
    // We'll fix the order to ensure the group encloses them properly.

    // So let's do that: pop the shapes we just wrote, wrap them in a single <g>.
    const shapeMarkup = svgParts.splice(svgParts.length - shapeCounter, shapeCounter);
    // Now open the group:
    const groupOpenTag = `<g id="${layerId}" ${transformAttr}>`;
    svgParts.push(groupOpenTag);
    shapeMarkup.forEach((line) => svgParts.push("  " + line));
    svgParts.push(gClose);

    // Merge gradient definitions (if any) from this layer
    gradientDefs.push(...layerGradientDefs);

    // Store for runtime updates
    layerDatas.push({
      layerId,
      shapes: layerShapes,
    });
  });

  // If we have gradient definitions, wrap them in <defs>
  if (gradientDefs.length > 0) {
    let defBlock = `<defs>\n${gradientDefs.join("\n")}\n</defs>`;
    svgParts.splice(1, 0, defBlock);
    // Insert after the <svg> opening tag
  }

  // Close </svg>
  svgParts.push(`</svg>`);

  return {
    svgMarkup: svgParts.join("\n"),
    layerData: layerDatas,
  };
}

/*****************************************************
 * 5) Build JavaScript that updates the <svg> each frame
 *    We'll do a single function: `function playUlottieSVG(svgId) {...}`
 *****************************************************/
function buildAnimationScript(comp: UlottieComposition, layerData: LayerRuntimeData[]): string {
  const totalFrames = comp.op - comp.ip;
  const fr = comp.fr;
  const frameDuration = 1000 / fr;
  const startFrame = comp.ip;

  // We'll build up JS code that:
  // 1) Finds each shape by ID
  // 2) On each tick, for (currentFrame) from ip..op, re-evaluates
  //    path or rect position, fill, stroke, transform, etc.
  // For brevity, we only show shape re-computation. If you have multiple
  // gradient fills or advanced logic, you might store them in arrays or
  // generate specialized code. We'll do a single generalized approach
  // using the same `evaluateProp` function in JS form.

  // We'll embed a small "inline" version of evaluateProp, pathToD, etc. in the output code.
  // In a real project, you might minify them or do a more advanced approach.

  // 1) We'll gather code for "property getters" from Lottie data.
  //    Just like previous AOT approach, but now we rely on DOM updates.

  let propertyGetterCodes: string[] = [];

  // We'll keep a list of "instructions" for each shape: e.g. which properties to re-eval
  // In a real approach, you'd only store the ones that actually vary over time (keyframed).
  // For demonstration, we do them all and skip if static.

  interface ShapeInstruction {
    shapeId: string;
    shapeType: "path" | "rect";
    pathProp?: string; // name of the JS getter for the path
    posProp?: string; // name of the JS getter for rect position
    sizeProp?: string; // ...
    roundProp?: string;
    fillProp?: string;
    strokeColorProp?: string;
    strokeWidthProp?: string;
    transformProp?: string; // if we did per-shape transforms
  }

  interface LayerInstruction {
    layerId: string;
    transformAnchor?: string;
    transformPosition?: string;
    transformScale?: string;
    transformRotation?: string;
    transformOpacity?: string;
    shapes: ShapeInstruction[];
  }

  let layerInstructions: LayerInstruction[] = [];

  // Re-parse the composition, generating "getter" function code for every property found,
  // and record which shapes need which getters.
  // (This is akin to the canvas approach, but now we store IDs and attribute updates for SVG.)
  //
  // For brevity, we do a second pass. Alternatively, we could have done it in buildInitialSVG,
  // but let's keep it conceptually separate.

  let getterCounter = 0;
  function makeGetterName(): string {
    return `g${getterCounter++}`;
  }

  function genPropGetter(prop: any): string {
    const name = makeGetterName();
    if (!prop || !prop.a) {
      // static
      propertyGetterCodes.push(`
function ${name}(frame) {
  return ${JSON.stringify(prop?.k)};
}
`);
    } else {
      // keyframed
      propertyGetterCodes.push(`
function ${name}(frame) {
  const kfs = ${JSON.stringify(prop.kf || [])};
  if (kfs.length===0) return 0;
  if (frame <= kfs[0].t) return kfs[0].s[0];
  if (frame >= kfs[kfs.length-1].t) return kfs[kfs.length-1].s[0];
  for(let i=0; i<kfs.length-1; i++){
    const kf1 = kfs[i], kf2 = kfs[i+1];
    if(frame>=kf1.t && frame<=kf2.t){
      const ratio = (frame - kf1.t)/(kf2.t - kf1.t);
      const startVal = kf1.s[0];
      const endVal   = kf2.s[0];
      if(Array.isArray(startVal)){
        const out = [];
        for(let j=0; j<startVal.length; j++){
          out.push(startVal[j] + (endVal[j]-startVal[j])*ratio);
        }
        return out;
      } else if(typeof startVal==='object'){
        // path => skip partial interpolation
        return startVal;
      } else {
        // single numeric
        return startVal + (endVal - startVal)*ratio;
      }
    }
  }
  return kfs[kfs.length-1].s[0];
}
`);
    }
    return name;
  }

  comp.layers.forEach((layer, layerIndex) => {
    if (layer.ty !== "shape") return;
    const instructions: LayerInstruction = {
      layerId: `layer_${layerIndex}`,
      shapes: [],
    };

    let currentFillGetter = "";
    let currentStrokeColorGetter = "";
    let currentStrokeWidthGetter = "";
    let currentGradStartGetter = "";
    let currentGradEndGetter = "";
    let haveGradient = false;

    layer.shapes.forEach((shapeItem, shapeIdx) => {
      switch (shapeItem.ty) {
        case "tr": {
          instructions.transformAnchor = genPropGetter(shapeItem.a);
          instructions.transformPosition = genPropGetter(shapeItem.p);
          instructions.transformScale = genPropGetter(shapeItem.s);
          instructions.transformRotation = genPropGetter(shapeItem.r);
          instructions.transformOpacity = genPropGetter(shapeItem.o);
          break;
        }
        case "fl": {
          currentFillGetter = genPropGetter(shapeItem.c);
          haveGradient = false;
          break;
        }
        case "gf": {
          // gradient fill
          const gf = shapeItem as UlottieGradientFill;
          currentGradStartGetter = genPropGetter(gf.s);
          currentGradEndGetter = genPropGetter(gf.e);
          haveGradient = true;
          // For color stops array gf.g.k we do no animation in this example
          // so no separate getter needed.
          currentFillGetter = ""; // not a single color
          break;
        }
        case "st": {
          currentStrokeColorGetter = genPropGetter(shapeItem.c);
          currentStrokeWidthGetter = genPropGetter(shapeItem.w);
          break;
        }
        case "sh": {
          // path
          const shapeId = `layer_${layerIndex}_shape_${shapeIdx}`;
          const pathGetter = genPropGetter(shapeItem.ks);
          instructions.shapes.push({
            shapeId,
            shapeType: "path",
            pathProp: pathGetter,
            fillProp: haveGradient
              ? `gradient:${currentGradStartGetter},${currentGradEndGetter},${JSON.stringify(
                  (shapeItem as any).g?.k || [],
                )}`
              : currentFillGetter,
            strokeColorProp: currentStrokeColorGetter,
            strokeWidthProp: currentStrokeWidthGetter,
          });
          break;
        }
        case "rc": {
          // rect
          const shapeId = `layer_${layerIndex}_shape_${shapeIdx}`;
          const posG = genPropGetter(shapeItem.p);
          const sizeG = genPropGetter(shapeItem.s);
          const roundG = genPropGetter(shapeItem.r);

          instructions.shapes.push({
            shapeId,
            shapeType: "rect",
            posProp: posG,
            sizeProp: sizeG,
            roundProp: roundG,
            fillProp: haveGradient
              ? `gradient:${currentGradStartGetter},${currentGradEndGetter},${JSON.stringify(
                  (shapeItem as any).g?.k || [],
                )}`
              : currentFillGetter,
            strokeColorProp: currentStrokeColorGetter,
            strokeWidthProp: currentStrokeWidthGetter,
          });
          break;
        }
      }
    });

    layerInstructions.push(instructions);
  });

  // Now we generate the final JS:
  // We'll embed the "evaluate to path D" code:

  const script = `
(function(){
  "use strict";

  // -- All property getters --
  ${propertyGetterCodes.join("\n")}

  // Helper for pathToD
  function pathToD(pathVal) {
    if(!pathVal || !pathVal.v || pathVal.v.length===0) return "";
    let d = "M " + pathVal.v[0][0] + "," + pathVal.v[0][1];
    for(let i=1; i<pathVal.v.length; i++){
      d += " L " + pathVal.v[i][0] + "," + pathVal.v[i][1];
    }
    if(pathVal.c) d += " Z";
    return d;
  }

  // We'll define a function that starts animating the SVG
  function playUlottieSVG(svgId) {
    const svgEl = document.getElementById(svgId);
    if(!svgEl || svgEl.nodeName.toLowerCase() !== "svg"){
      console.warn("ulottie: No valid <svg> with id=", svgId);
      return;
    }

    // Grab references to layers & shapes
    ${layerInstructions
      .map((layer) => {
        const shapesRef = layer.shapes
          .map(
            (sh) => `
    const el_${sh.shapeId} = document.getElementById("${sh.shapeId}");
    `,
          )
          .join("");
        return `// Layer ${layer.layerId}
    ${shapesRef}
    `;
      })
      .join("\n")}

    // Animation loop
    let currentFrame = ${startFrame};
    const totalFrames = ${totalFrames};
    const frameDuration = ${frameDuration};
    let lastTime = performance.now();
    let requestId = 0;

    function draw(frame) {
      // For each layer, re-compute transform (if any), then update each shape
      ${layerInstructions
        .map((layer) => {
          let code = `{
  const layerEl = document.getElementById("${layer.layerId}");
  if(!layerEl) return;`;
          if (layer.transformAnchor) {
            code += `
  const anchor = ${layer.transformAnchor}(frame)||[0,0];
  const position = ${layer.transformPosition}(frame)||[0,0];
  const scale = ${layer.transformScale}(frame)||[100,100];
  const rotation = ${layer.transformRotation}(frame)||0;
  const opacity = (${layer.transformOpacity}(frame)||100)/100;
  // Build an SVG transform attribute
  // translate(px,py) rotate(...) scale(...) translate(-ax, -ay)
  const px=position[0], py=position[1];
  const sx=scale[0]/100, sy=scale[1]/100;
  const ax=anchor[0], ay=anchor[1];
  layerEl.setAttribute("opacity", opacity);
  layerEl.setAttribute("transform",
    "translate(" + px + "," + py + ") " +
    "rotate(" + rotation + ") " +
    "scale(" + sx + "," + sy + ") " +
    "translate(" + (-ax) + "," + (-ay) + ")"
  );
`;
          }
          // shapes:
          layer.shapes.forEach((sh) => {
            if (sh.shapeType === "path" && sh.pathProp) {
              code += `
  {
    const shapeEl = document.getElementById("${sh.shapeId}");
    if(shapeEl){
      const pathVal = ${sh.pathProp}(frame);
      shapeEl.setAttribute("d", pathToD(pathVal));
    } 
  }
`;
            }
            if (sh.shapeType === "rect" && sh.posProp && sh.sizeProp) {
              code += `
  {
    const shapeEl = document.getElementById("${sh.shapeId}");
    if(shapeEl){
      const pos = ${sh.posProp}(frame)||[0,0];
      const size= ${sh.sizeProp}(frame)||[0,0];
      const round=${sh.roundProp}(frame)||0;
      const x = pos[0] - size[0]/2;
      const y = pos[1] - size[1]/2;
      shapeEl.setAttribute("x", x);
      shapeEl.setAttribute("y", y);
      shapeEl.setAttribute("width", size[0]);
      shapeEl.setAttribute("height", size[1]);
      shapeEl.setAttribute("rx", round);
      shapeEl.setAttribute("ry", round);
    }
  }
`;
            }

            // fill/stroke might be "gradient: gradStartGetter, gradEndGetter, array"
            // or a color getter name
            if (sh.fillProp) {
              if (sh.fillProp.startsWith("gradient:")) {
                // parse out the gradient data
                // "gradient:${gradStartGetter},${gradEndGetter},${JSON.stringify(stops)}"
                const parts = sh.fillProp.split(":")[1].split(",");
                const gradStartGetter = parts[0];
                const gradEndGetter = parts[1];
                // The remainder is the stops array
                const stopsJson = parts.slice(2).join(",");
                code += `
  {
    const shapeEl = document.getElementById("${sh.shapeId}");
    if(shapeEl){
      const sPt = ${gradStartGetter}(frame)||[0,0];
      const ePt = ${gradEndGetter}(frame)||[0,0];
      // stops (static)
      const stops = ${stopsJson};
      // For simplicity, we re-generate a new <linearGradient> each frame with a unique ID
      // Then set fill="url(#thatID)". This is not super efficient, but it demonstrates the idea.
      // A more advanced approach would partially update <stop> or handle boundingBox usage.
      const uniqueGradId = "autoGrad_" + "${sh.shapeId}" + "_" + frame;
      // we assume the <defs> is the first child of the root SVG:
      let defsEl = svgEl.querySelector("defs");
      if(!defsEl){
        defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svgEl.insertBefore(defsEl, svgEl.firstChild);
      }
      const gradEl = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      gradEl.setAttribute("id", uniqueGradId);
      gradEl.setAttribute("gradientUnits","userSpaceOnUse");
      gradEl.setAttribute("x1", sPt[0]);
      gradEl.setAttribute("y1", sPt[1]);
      gradEl.setAttribute("x2", ePt[0]);
      gradEl.setAttribute("y2", ePt[1]);
      for(let i=0; i<stops.length; i+=4){
        const offset= stops[i];
        const r= Math.round(stops[i+1]);
        const g= Math.round(stops[i+2]);
        const b= Math.round(stops[i+3]);
        const stopEl = document.createElementNS("http://www.w3.org/2000/svg","stop");
        stopEl.setAttribute("offset", (offset*100)+"%");
        stopEl.setAttribute("stop-color", "rgb(" + r + "," + g + "," + b + ")");
        gradEl.appendChild(stopEl);
      }
      defsEl.appendChild(gradEl);
      shapeEl.setAttribute("fill", "url(#" + uniqueGradId + ")");
    }
  }
`;
              } else {
                // a color getter
                code += `
  {
    const shapeEl = document.getElementById("${sh.shapeId}");
    if(shapeEl){
      const c = ${sh.fillProp}(frame)||[0,0,0];
      shapeEl.setAttribute("fill", "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")");
    }
  }
`;
              }
            }
            if (sh.strokeColorProp) {
              code += `
  {
    const shapeEl = document.getElementById("${sh.shapeId}");
    if(shapeEl){
      const sc = ${sh.strokeColorProp}(frame)||[0,0,0];
      shapeEl.setAttribute("stroke", "rgb(" + Math.round(sc[0]) + "," + Math.round(sc[1]) + "," + Math.round(sc[2]) + ")");
    }
  }
`;
            }
            if (sh.strokeWidthProp) {
              code += `
  {
    const shapeEl = document.getElementById("${sh.shapeId}");
    if(shapeEl){
      const sw = ${sh.strokeWidthProp}(frame)||1;
      shapeEl.setAttribute("stroke-width", sw);
    }
  }
`;
            }
          });
          code += `}`;
          return code;
        })
        .join("\n")}
    }

    function tick(time){
      const elapsed = time - lastTime;
      if(elapsed >= frameDuration){
        lastTime = time;
        draw(currentFrame);
        currentFrame++;
        if(currentFrame >= (${startFrame}+totalFrames)){
          // stop or loop
          // currentFrame = ${startFrame}; // to loop
        }
      }
      if(currentFrame < (${startFrame}+totalFrames)){
        requestId = requestAnimationFrame(tick);
      }
    }
    requestId = requestAnimationFrame(tick);
    return {
      stop: function(){
        cancelAnimationFrame(requestId);
      }
    }
  }

  // Expose globally
  if(typeof window !== "undefined"){
    window.playUlottieSVG = playUlottieSVG;
  }
})();
`;
  return script;
}

/*****************************************************
 * 6) Combined Compiler: parse -> build initial SVG -> build animation JS
 *****************************************************/
export function compileUlottieToSVG(raw: any): { initialSVG: string; animationJS: string } {
  const comp = parseUlottie(raw);
  // Build the static <svg>
  const { svgMarkup, layerData } = buildInitialSVG(comp);
  // Build the JS
  const animationJS = buildAnimationScript(comp, layerData);
  return { initialSVG: svgMarkup, animationJS };
}

/*****************************************************
 * Usage Example
 *****************************************************/
// You can do something like:

const sampleComp: UlottieComposition = {
  v: "5.7.1",
  fr: 30,
  w: 300,
  h: 300,
  ip: 0,
  op: 60,
  layers: [
    {
      ty: "shape",
      nm: "My Rectangle Layer",
      shapes: [
        {
          ty: "rc",
          p: { a: 0, k: [150, 150] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 20 },
        },
        {
          ty: "fl",
          c: { a: 0, k: [255, 0, 0] }, // red fill
        },
        {
          ty: "st",
          c: { a: 0, k: [0, 0, 0] }, // black stroke
          w: { a: 0, k: 3 },
        },
        {
          ty: "tr",
          a: { a: 0, k: [50, 50] }, // anchor
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: {
            a: 1,
            kf: [
              { t: 0, s: [0] },
              { t: 60, s: [360] },
            ],
          },
          o: { a: 0, k: 100 },
        },
      ],
    },
  ],
};

const { initialSVG, animationJS } = compileUlottieToSVG(sampleComp);
console.log("=== SVG ===\n", initialSVG);
console.log("=== JS ===\n", animationJS);
//
// // Then you can embed the SVG in your HTML, e.g.:
// //   <div id="myAnimationContainer">${initialSVG}</div>
// //   <script>${animationJS}</script>
// //   <script>
// //     // After DOM loads...
// //     window.playUlottieSVG("myAnimationContainer").stop;
// //   </script>
//
// // If you want SSR or <noscript>, you can place `initialSVG` directly in
// // the HTML so the user sees the first frame even with JS off.
