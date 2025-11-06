import { defineRecipe } from "../utils/define";

const scrollFog = defineRecipe({
  name: "scroll-fog",
  base: {
    position: "relative",
    overflow: "auto",
    height: "100%",
    width: "100%",

    // 4-directional gradients for fog effect
    maskImage: [
      "linear-gradient(to bottom, transparent 0, #000 calc(var(--scroll-fog-can-scroll-top) * var(--scroll-fog-size-top)))",
      "linear-gradient(to top, transparent 0, #000 calc(var(--scroll-fog-can-scroll-bottom) * var(--scroll-fog-size-bottom)))",
      "linear-gradient(to right, transparent 0, #000 calc(var(--scroll-fog-can-scroll-left) * var(--scroll-fog-size-left)))",
      "linear-gradient(to left, transparent 0, #000 calc(var(--scroll-fog-can-scroll-right) * var(--scroll-fog-size-right)))",
    ].join(", "),
    WebkitMaskImage: [
      "linear-gradient(to bottom, transparent 0, #000 calc(var(--scroll-fog-can-scroll-top) * var(--scroll-fog-size-top)))",
      "linear-gradient(to top, transparent 0, #000 calc(var(--scroll-fog-can-scroll-bottom) * var(--scroll-fog-size-bottom)))",
      "linear-gradient(to right, transparent 0, #000 calc(var(--scroll-fog-can-scroll-left) * var(--scroll-fog-size-left)))",
      "linear-gradient(to left, transparent 0, #000 calc(var(--scroll-fog-can-scroll-right) * var(--scroll-fog-size-right)))",
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
