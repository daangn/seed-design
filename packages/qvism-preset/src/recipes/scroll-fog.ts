import { defineRecipe } from "../utils/define";
import { scrollFog as vars } from "../vars/component";

const scrollFog = defineRecipe({
  name: "scroll-fog",
  base: {
    position: "relative",
    overflow: "auto",
    height: "100%",
    width: "100%",

    "--scroll-fog-from-color": vars.base.enabled.root.fromColor,
    "--scroll-fog-to-color": vars.base.enabled.root.toColor,

    // 4-directional gradients for fog effect
    maskImage: [
      "linear-gradient(to bottom, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-top) * var(--scroll-fog-size-top)))",
      "linear-gradient(to top, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-bottom) * var(--scroll-fog-size-bottom)))",
      "linear-gradient(to right, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-left) * var(--scroll-fog-size-left)))",
      "linear-gradient(to left, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-right) * var(--scroll-fog-size-right)))",
    ].join(", "),
    WebkitMaskImage: [
      "linear-gradient(to bottom, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-top) * var(--scroll-fog-size-top)))",
      "linear-gradient(to top, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-bottom) * var(--scroll-fog-size-bottom)))",
      "linear-gradient(to right, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-left) * var(--scroll-fog-size-left)))",
      "linear-gradient(to left, var(--scroll-fog-from-color) 0, var(--scroll-fog-to-color) calc(var(--scrollable-right) * var(--scroll-fog-size-right)))",
    ].join(", "),
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
