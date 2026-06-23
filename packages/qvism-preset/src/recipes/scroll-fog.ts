import { defineRecipe } from "../utils/define";

const fogStops: ReadonlyArray<readonly [string, number]> = [
  ["#00000000", 0],
  ["#00000003", 0.08],
  ["#00000005", 0.16],
  ["#0000000d", 0.22],
  ["#00000014", 0.29],
  ["#00000021", 0.35],
  ["#0000002e", 0.41],
  ["#00000040", 0.47],
  ["#00000052", 0.53],
  ["#00000066", 0.59],
  ["#0000007a", 0.65],
  ["#00000094", 0.71],
  ["#000000ab", 0.78],
  ["#000000c7", 0.84],
  ["#000000e3", 0.92],
  ["#000000ff", 1],
];

const buildMask = (direction: string, scrollableVar: string, sizeVar: string) =>
  `linear-gradient(${direction}, ${fogStops
    .map(([color, position]) =>
      position === 0
        ? `${color} 0`
        : `${color} calc(var(${scrollableVar}) * var(${sizeVar}) * ${position})`,
    )
    .join(", ")})`;

const maskImage = [
  buildMask("to bottom", "--scrollable-top", "--scroll-fog-size-top"),
  buildMask("to top", "--scrollable-bottom", "--scroll-fog-size-bottom"),
  buildMask("to right", "--scrollable-left", "--scroll-fog-size-left"),
  buildMask("to left", "--scrollable-right", "--scroll-fog-size-right"),
].join(", ");

const scrollFog = defineRecipe({
  name: "scroll-fog",
  base: {
    position: "relative",
    overflow: "auto",
    height: "100%",
    width: "100%",

    // 4-directional gradients for fog effect
    maskImage,
    WebkitMaskImage: maskImage,
    maskSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
    WebkitMaskSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  },
  variants: {
    hideScrollBar: {
      true: {
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  },
  defaultVariants: {
    hideScrollBar: false,
  },
});

export default scrollFog;
