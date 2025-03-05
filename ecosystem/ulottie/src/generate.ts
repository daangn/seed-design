import type { UlottieAnalysis } from "./analyze";
import type {
  UlottieAnimatedValue,
  UlottieAnimatedValue2D,
  UlottieAnimatedColor,
  UlottieAnimatedPath,
  UlottieComposition,
  UlottieTransform,
} from "./types";

/*****************************************************
 * Generate Animated Property Functions
 *****************************************************/
function generateAnimatedValueFunction(
  property:
    | UlottieAnimatedValue
    | UlottieAnimatedValue2D
    | UlottieAnimatedColor
    | UlottieAnimatedPath,
  funcName: string,
  fps: number,
): string {
  if (!property.a) {
    // static
    return `
function ${funcName}(frame) {
  return ${JSON.stringify(property.k)};
}`;
  } else {
    if (!property.kf) {
      return `function ${funcName}(frame){return 0;}`;
    }
    return `
function ${funcName}(frame) {
  const kfs = ${JSON.stringify(property.kf)};
  if (frame <= kfs[0].t) {
    return kfs[0].s[0];
  }
  if (frame >= kfs[kfs.length - 1].t) {
    return kfs[kfs.length - 1].s[0];
  }
  for (let i=0; i < kfs.length - 1; i++) {
    const kf1 = kfs[i];
    const kf2 = kfs[i+1];
    if (frame >= kf1.t && frame <= kf2.t) {
      const ratio = (frame - kf1.t)/(kf2.t - kf1.t);
      const startVal = kf1.s[0];
      const endVal   = kf2.s[0];
      if (Array.isArray(startVal) && Array.isArray(endVal)) {
        // linear interpolation component-wise
        const out = [];
        for (let j=0; j<startVal.length; j++){
          out.push( startVal[j] + (endVal[j] - startVal[j]) * ratio );
        }
        return out;
      } else if (typeof startVal === 'object') {
        // path => no partial interpolation
        return startVal;
      } else {
        // single numeric
        return startVal + (endVal - startVal) * ratio;
      }
    }
  }
  return kfs[kfs.length - 1].s[0];
}`;
  }
}

/*****************************************************
 * Generate Per-Layer Drawing Function
 *****************************************************/
interface GeneratorOptions {
  functionName?: string; // e.g. "playMyAnimation"
}

export function generateUlottieCode(
  comp: UlottieComposition,
  analysis: UlottieAnalysis,
  opts: GeneratorOptions = {},
): string {
  const fnName = opts.functionName || "ulottiePlay";
  const totalFrames = comp.op - comp.ip;
  const fps = comp.fr;
  const width = comp.w;
  const height = comp.h;

  // We'll store code for:
  // 1. All "getter" functions for animated properties
  // 2. One function per layer
  // 3. A main playback function
  const propertyFunctions: string[] = [];
  const layerFunctionDefs: string[] = [];
  const layerFunctionCalls: string[] = [];

  comp.layers.forEach((layer, layerIndex) => {
    if (layer.ty !== "shape") return;

    // We’ll gather references to fill/stroke/transform.
    let fillFuncName = "";
    let strokeColorFuncName = "";
    let strokeWidthFuncName = "";
    let transformAnchorFunc = "";
    let transformPositionFunc = "";
    let transformScaleFunc = "";
    let transformRotationFunc = "";
    let transformOpacityFunc = "";

    // We'll build an array of shape items in code.
    const shapeItems: string[] = [];
    const layerName = `drawLayer${layerIndex}`;

    // Mask code if we have masks
    let maskCode = "";
    if (layer.masksProperties && layer.masksProperties.length > 0) {
      // We'll do a naive "subtract" using destination-out
      // for each mask. Real Lottie is more complex,
      // but this is just a demonstration.
      layer.masksProperties.forEach((mask, maskIndex) => {
        const maskPathFunc = `getValue_layer${layerIndex}_maskPath${maskIndex}`;
        const maskOpacityFunc = `getValue_layer${layerIndex}_maskOp${maskIndex}`;

        propertyFunctions.push(generateAnimatedValueFunction(mask.pt, maskPathFunc, fps));
        propertyFunctions.push(generateAnimatedValueFunction(mask.o, maskOpacityFunc, fps));

        maskCode += `
{
  const mp = ${maskPathFunc}(frame);
  const mo = ${maskOpacityFunc}(frame) / 100.0;
  ctx.save();
  ctx.globalAlpha = mo;
  ctx.beginPath();
  if (mp && mp.v && mp.v.length > 0) {
    ctx.moveTo(mp.v[0][0], mp.v[0][1]);
    for (let i=1; i<mp.v.length; i++){
      ctx.lineTo(mp.v[i][0], mp.v[i][1]);
    }
    if (mp.c) ctx.closePath();
  }
  // Subtract => 'destination-out'
  ctx.globalCompositeOperation = "destination-out";
  ctx.fill();
  ctx.restore();
}
`;
      });
    }

    // Process shape items
    layer.shapes.forEach((shapeItem, shapeIndex) => {
      switch (shapeItem.ty) {
        case "fl": {
          fillFuncName = `getValue_layer${layerIndex}_fillColor${shapeIndex}`;
          propertyFunctions.push(generateAnimatedValueFunction(shapeItem.c, fillFuncName, fps));
          break;
        }
        case "st": {
          strokeColorFuncName = `getValue_layer${layerIndex}_strokeColor${shapeIndex}`;
          strokeWidthFuncName = `getValue_layer${layerIndex}_strokeWidth${shapeIndex}`;
          propertyFunctions.push(
            generateAnimatedValueFunction(shapeItem.c, strokeColorFuncName, fps),
          );
          propertyFunctions.push(
            generateAnimatedValueFunction(shapeItem.w, strokeWidthFuncName, fps),
          );
          break;
        }
        case "tr": {
          const tr = shapeItem as UlottieTransform;
          transformAnchorFunc = `getValue_layer${layerIndex}_anchor${shapeIndex}`;
          transformPositionFunc = `getValue_layer${layerIndex}_position${shapeIndex}`;
          transformScaleFunc = `getValue_layer${layerIndex}_scale${shapeIndex}`;
          transformRotationFunc = `getValue_layer${layerIndex}_rotation${shapeIndex}`;
          transformOpacityFunc = `getValue_layer${layerIndex}_opacity${shapeIndex}`;

          propertyFunctions.push(generateAnimatedValueFunction(tr.a, transformAnchorFunc, fps));
          propertyFunctions.push(generateAnimatedValueFunction(tr.p, transformPositionFunc, fps));
          propertyFunctions.push(generateAnimatedValueFunction(tr.s, transformScaleFunc, fps));
          propertyFunctions.push(generateAnimatedValueFunction(tr.r, transformRotationFunc, fps));
          propertyFunctions.push(generateAnimatedValueFunction(tr.o, transformOpacityFunc, fps));
          break;
        }
        case "sh": {
          // path
          const pathFunc = `getValue_layer${layerIndex}_shapePath${shapeIndex}`;
          propertyFunctions.push(generateAnimatedValueFunction(shapeItem.ks!, pathFunc, fps));
          shapeItems.push(`{ type: "path", getter: ${pathFunc} }`);
          break;
        }
        case "rc": {
          // rect
          const posFunc = `getValue_layer${layerIndex}_rectPos${shapeIndex}`;
          const sizeFunc = `getValue_layer${layerIndex}_rectSize${shapeIndex}`;
          const roundFunc = `getValue_layer${layerIndex}_rectRound${shapeIndex}`;

          propertyFunctions.push(generateAnimatedValueFunction(shapeItem.p!, posFunc, fps));
          propertyFunctions.push(generateAnimatedValueFunction(shapeItem.s!, sizeFunc, fps));
          propertyFunctions.push(generateAnimatedValueFunction(shapeItem.r!, roundFunc, fps));

          shapeItems.push(
            `{ type: "rect", pos: ${posFunc}, size: ${sizeFunc}, round: ${roundFunc} }`,
          );
          break;
        }
      }
    });

    // Build the draw function for this layer
    const shapeItemsArray = `[${shapeItems.join(", ")}]`;

    // Transform code
    let transformCode = "";
    if (analysis.usesTransforms && transformAnchorFunc) {
      transformCode = `
  const anchor = ${transformAnchorFunc}(frame);
  const position = ${transformPositionFunc}(frame);
  const scale = ${transformScaleFunc}(frame);
  const rotation = ${transformRotationFunc}(frame) * Math.PI/180;
  const opacity = ${transformOpacityFunc}(frame) / 100;

  ctx.globalAlpha *= opacity;
  ctx.translate(position[0], position[1]);
  ctx.rotate(rotation);
  ctx.scale(scale[0]/100, scale[1]/100);
  // Shift anchor
  ctx.translate(-anchor[0], -anchor[1]);
`;
    } else {
      transformCode = `// no transform\n`;
    }

    // Fill/stroke code
    const fillCode =
      analysis.usesFill && fillFuncName
        ? `const fc = ${fillFuncName}(frame);
ctx.fillStyle = "rgb(" + Math.round(fc[0]) + "," + Math.round(fc[1]) + "," + Math.round(fc[2]) + ")";`
        : `ctx.fillStyle = "transparent";`;

    const strokeCode =
      analysis.usesStroke && strokeColorFuncName && strokeWidthFuncName
        ? `const sc = ${strokeColorFuncName}(frame);
ctx.strokeStyle = "rgb(" + Math.round(sc[0]) + "," + Math.round(sc[1]) + "," + Math.round(sc[2]) + ")";
ctx.lineWidth = ${strokeWidthFuncName}(frame);`
        : `ctx.strokeStyle = "transparent";
ctx.lineWidth = 0;`;

    const layerFnCode = `
function ${layerName}(ctx, frame) {
  ctx.save();
  ${transformCode}
  ${fillCode}
  ${strokeCode}

  const shapes = ${shapeItemsArray};
  for (let i=0; i<shapes.length; i++) {
    const s = shapes[i];
    ctx.beginPath();
    if (s.type === "path") {
      const val = s.getter(frame);
      if (!val || !val.v || val.v.length===0) continue;
      ctx.moveTo(val.v[0][0], val.v[0][1]);
      for (let k=1; k<val.v.length; k++){
        ctx.lineTo(val.v[k][0], val.v[k][1]);
      }
      if (val.c) ctx.closePath();
    } else if (s.type === "rect") {
      const pos = s.pos(frame);
      const size = s.size(frame);
      const round = s.round(frame);
      // Simple rounded rect
      const x = pos[0] - size[0]/2;
      const y = pos[1] - size[1]/2;

      ctx.moveTo(x + round, y);
      ctx.lineTo(x + size[0] - round, y);
      ctx.quadraticCurveTo(x + size[0], y, x + size[0], y + round);
      ctx.lineTo(x + size[0], y + size[1] - round);
      ctx.quadraticCurveTo(x + size[0], y + size[1], x + size[0] - round, y + size[1]);
      ctx.lineTo(x + round, y + size[1]);
      ctx.quadraticCurveTo(x, y + size[1], x, y + size[1] - round);
      ctx.lineTo(x, y + round);
      ctx.quadraticCurveTo(x, y, x + round, y);
      ctx.closePath();
    }

    ctx.fill();
    if (ctx.lineWidth > 0) {
      ctx.stroke();
    }
  }

  // If mask => apply subtract
  ${maskCode}

  ctx.restore();
}
`;
    // Keep track of the function definition and the call
    layerFunctionDefs.push(layerFnCode);
    layerFunctionCalls.push(`${layerName}(ctx, currentFrame);`);
  });

  // Finally, piece it all together
  const code = `
(function(){
  "use strict";

  // --- Animated property getters ---
  ${propertyFunctions.join("\n")}

  // --- Layer drawing functions ---
  ${layerFunctionDefs.join("\n")}

  // --- Main playback function ---
  function ${fnName}(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) {
      console.warn("ulottie: Invalid canvas or canvasId");
      return;
    }
    const ctx = canvas.getContext("2d");
    canvas.width = ${width};
    canvas.height = ${height};

    let currentFrame = 0;
    const totalFrames = ${totalFrames};
    const fps = ${fps};
    const frameDuration = 1000 / fps;
    let requestId = 0;
    let lastTime = performance.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ${layerFunctionCalls.join("\n")}
    }

    function tick(time) {
      const elapsed = time - lastTime;
      if (elapsed >= frameDuration) {
        lastTime = time;
        draw();
        currentFrame++;
        if (currentFrame >= totalFrames) {
          // stop or loop
          // currentFrame = 0; // Uncomment to loop
        }
      }
      if (currentFrame < totalFrames) {
        requestId = requestAnimationFrame(tick);
      }
    }

    requestId = requestAnimationFrame(tick);

    return {
      stop: function() {
        cancelAnimationFrame(requestId);
      }
    };
  }

  // Expose globally
  if (typeof window !== "undefined") {
    window.${fnName} = ${fnName};
  }
})();
`;
  return code;
}
