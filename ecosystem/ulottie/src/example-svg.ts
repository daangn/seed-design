import { UlottieCompiler } from "./svg";
import type { UlottieComposition } from "./types";

const lottieData: UlottieComposition = {
  v: "5.5.0",
  fr: 30,
  w: 400,
  h: 400,
  ip: 0,
  op: 90,
  layers: [
    {
      ty: "shape",
      nm: "Demo Shape Layer",
      shapes: [
        {
          ty: "rc",
          nm: "Rect1",
          p: {
            a: 1,
            kf: [
              { t: 0, s: [200, 200] },
              { t: 90, s: [300, 300] },
            ],
          },
          s: {
            a: 0,
            k: [100, 100],
          },
          r: {
            a: 0,
            k: 20,
          },
        },
        {
          ty: "sh",
          nm: "MorphingPath",
          ks: {
            a: 1,
            kf: [
              {
                t: 0,
                s: [
                  {
                    c: true,
                    i: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [150, 100],
                      [250, 100],
                      [250, 200],
                      [150, 200],
                    ],
                  },
                ],
              },
              {
                t: 45,
                s: [
                  {
                    c: true,
                    i: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [100, 100],
                      [300, 100],
                      [300, 200],
                      [100, 200],
                    ],
                  },
                ],
              },
              {
                t: 90,
                s: [
                  {
                    c: true,
                    i: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [200, 50],
                      [350, 150],
                      [250, 300],
                      [150, 150],
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          ty: "fl",
          nm: "Solid Fill",
          c: {
            a: 1,
            kf: [
              { t: 0, s: [1, 0.5, 0, 1] }, // orange at frame 0
              { t: 45, s: [0, 1, 0, 1] }, // green  at frame 45
              { t: 90, s: [0, 0, 1, 1] }, // blue   at frame 90
            ],
          },
        },
        {
          ty: "st",
          nm: "Animated Stroke",
          c: {
            a: 1,
            kf: [
              { t: 0, s: [0, 0, 1, 1] }, // blue  at frame 0
              { t: 30, s: [0, 1, 0, 1] }, // green at frame 30
              { t: 60, s: [1, 0, 0, 1] }, // red   at frame 60
              { t: 90, s: [0, 0, 0, 1] }, // black at frame 90
            ],
          },
          w: {
            a: 1,
            kf: [
              { t: 0, s: [1] }, // width=1  at frame 0
              { t: 45, s: [5] }, // width=5  at frame 45
              { t: 90, s: [10] }, // width=10 at frame 90
            ],
          },
        },
        {
          ty: "gf",
          t: 1, // linear gradient
          nm: "Gradient Fill",
          g: {
            p: 8,
            k: [
              0,
              1,
              1,
              1, // offset=0,   color=white
              0.5,
              1,
              0,
              0, // offset=0.5, color=red
              1,
              0,
              1,
              0, // offset=1,   color=green
            ],
          },
          s: {
            a: 0,
            k: [150, 150],
          },
          e: {
            a: 0,
            k: [250, 250],
          },
        },
        {
          ty: "tr",
          nm: "transform",
          a: {
            a: 0,
            k: [0, 0],
          },
          p: {
            a: 0,
            k: [0, 0],
          },
          s: {
            a: 0,
            k: [100, 100],
          },
          r: {
            a: 0,
            k: 0,
          },
          o: {
            a: 0,
            k: 100,
          },
        },
      ],
      masksProperties: [
        {
          nm: "Subtract Mask",
          mode: "s",
          pt: {
            a: 0,
            k: {
              c: true,
              i: [
                [0, 0],
                [0, 0],
                [0, 0],
              ],
              o: [
                [0, 0],
                [0, 0],
                [0, 0],
              ],
              v: [
                [100, 100],
                [300, 100],
                [200, 300],
              ],
            },
          },
          o: {
            a: 0,
            k: 50,
          },
        },
      ],
    },
  ],
};
const compiler = new UlottieCompiler();
const { initialSvg, runtimeJs } = compiler.compile(lottieData);

console.log(initialSvg);
console.log(runtimeJs);
