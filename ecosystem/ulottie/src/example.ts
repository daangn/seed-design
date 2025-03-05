import { compileUlottie } from "./compile";
import type { UlottieComposition } from "./types";

const sample: UlottieComposition = {
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

const jsCode = compileUlottie(sample, { functionName: "playDemo" });
console.log(jsCode);
//
// // Then put that JS code into an HTML page, call `playDemo("canvasID")`
// // in a <script> after the canvas is present.
