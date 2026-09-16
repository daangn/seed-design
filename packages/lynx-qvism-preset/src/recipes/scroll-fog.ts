import { defineSlotRecipe } from "../utils/define";
import { scrollFog as vars } from "../vars/component";

type Edge = "top" | "bottom" | "left" | "right";

const directions: Record<Edge, string> = {
  top: "to bottom",
  bottom: "to top",
  left: "to right",
  right: "to left",
};

const opaqueMask = "linear-gradient(#000000ff, #000000ff)";
const fogStops = vars.base.enabled.root.gradient.stops;

function buildGradient(edge: Edge): string {
  const stops = fogStops
    .map(({ color, position }) => `${color} ${Number((position * 100).toFixed(6))}%`)
    .join(", ");

  return `linear-gradient(${directions[edge]}, ${stops})`;
}

const scrollFog = defineSlotRecipe({
  name: "scroll-fog",
  slots: [
    "root",
    "topMask",
    "bottomMask",
    "leftMask",
    "rightMask",
    "verticalScroll",
    "horizontalScroll",
  ],
  base: {
    root: {},
    topMask: {
      width: "100%",
      height: "100%",
      maskImage: opaqueMask,
      maskPosition: "top left",
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
      pointerEvents: "none",
    },
    bottomMask: {
      width: "100%",
      height: "100%",
      maskImage: opaqueMask,
      maskPosition: "top left",
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
      pointerEvents: "none",
    },
    leftMask: {
      width: "100%",
      height: "100%",
      maskImage: opaqueMask,
      maskPosition: "top left",
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
      pointerEvents: "none",
    },
    rightMask: {
      width: "100%",
      height: "100%",
      maskImage: opaqueMask,
      maskPosition: "top left",
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
      pointerEvents: "none",
    },
    verticalScroll: {
      width: "100%",
      height: "100%",
      pointerEvents: "auto",
    },
    horizontalScroll: {
      width: "100%",
      pointerEvents: "auto",
    },
  },
  variants: {
    top: {
      true: {
        topMask: {
          maskImage: `${buildGradient("top")}, ${opaqueMask}`,
          maskPosition: "top, bottom",
          maskSize: "100% var(--scroll-fog-size-top), 100% calc(100% - var(--scroll-fog-size-top))",
        },
      },
      false: {},
    },
    bottom: {
      true: {
        bottomMask: {
          maskImage: `${buildGradient("bottom")}, ${opaqueMask}`,
          maskPosition: "bottom, top",
          maskSize:
            "100% var(--scroll-fog-size-bottom), 100% calc(100% - var(--scroll-fog-size-bottom))",
        },
      },
      false: {},
    },
    left: {
      true: {
        leftMask: {
          maskImage: `${buildGradient("left")}, ${opaqueMask}`,
          maskPosition: "left, right",
          maskSize:
            "var(--scroll-fog-size-left) 100%, calc(100% - var(--scroll-fog-size-left)) 100%",
        },
      },
      false: {},
    },
    right: {
      true: {
        rightMask: {
          maskImage: `${buildGradient("right")}, ${opaqueMask}`,
          maskPosition: "right, left",
          maskSize:
            "var(--scroll-fog-size-right) 100%, calc(100% - var(--scroll-fog-size-right)) 100%",
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    top: false,
    bottom: false,
    left: false,
    right: false,
  },
});

export default scrollFog;
