import type { UlottieComposition } from "./types";

export interface UlottieAnalysis {
  usesMasks: boolean;
  usesFill: boolean;
  usesGradientFill: boolean;
  usesStroke: boolean;
  usesTransforms: boolean;
  shapeTypes: Set<string>;
}

export function analyzeUlottie(comp: UlottieComposition): UlottieAnalysis {
  let usesMasks = false;
  let usesFill = false;
  let usesGradientFill = false;
  let usesStroke = false;
  let usesTransforms = false;
  const shapeTypes = new Set<string>();

  comp.layers.forEach((layer) => {
    if (layer.ty !== "shape") return;

    if (layer.masksProperties && layer.masksProperties.length > 0) {
      usesMasks = true;
    }

    layer.shapes.forEach((item) => {
      switch (item.ty) {
        case "fl":
          usesFill = true;
          break;
        case "gf":
          usesGradientFill = true;
          break;
        case "st":
          usesStroke = true;
          break;
        case "tr":
          usesTransforms = true;
          break;
        case "sh":
        case "rc":
          shapeTypes.add(item.ty);
          break;
      }
    });
  });

  return {
    usesMasks,
    usesFill,
    usesGradientFill,
    usesStroke,
    usesTransforms,
    shapeTypes,
  };
}
