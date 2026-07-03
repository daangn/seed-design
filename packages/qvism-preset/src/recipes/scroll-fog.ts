import { defineRecipe } from "../utils/define";
import { scrollFog as vars } from "../vars/component";

// Use the gradient stops exposed by Rootage (raw positions from 0 to 1) for all four fog masks.
const fogStops = vars.base.enabled.root.gradient.stops;

const buildMask = (direction: string, scrollableVar: string, sizeVar: string) =>
  `linear-gradient(${direction}, ${fogStops
    .map(({ color, position }) =>
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
