import { defineSlotRecipe } from "../utils/define";
import { imageFrame as vars } from "../vars/component";

export default defineSlotRecipe({
  name: "image-frame",
  slots: ["root", "content", "fallback", "stroke", "floater"],
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
      aspectRatio: "var(--seed-image-frame-ratio)",
    },
    content: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
      pointerEvents: "none",
    },
    fallback: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
    stroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: "var(--seed-image-frame-radius)",
      pointerEvents: "none",
    },
    floater: { position: "absolute", display: "flex" },
  },
  variants: {
    stroke: {
      true: {
        stroke: {
          borderWidth: vars.strokeTrue.enabled.root.strokeWidth,
          borderStyle: "solid",
          borderColor: vars.strokeTrue.enabled.root.strokeColor,
        },
      },
      false: {},
    },
    loaded: { true: { content: { opacity: 1, pointerEvents: "auto" } }, false: {} },
    placement: {
      "top-start": {
        floater: {
          top: "var(--seed-image-frame-offset-y)",
          left: "calc(var(--seed-image-frame-offset-x) + var(--seed-image-frame-safe-area-left, 0px))",
        },
      },
      "top-center": {
        floater: {
          top: "var(--seed-image-frame-offset-y)",
          left: "calc(50% + var(--seed-image-frame-offset-x) + (var(--seed-image-frame-safe-area-left, 0px) - var(--seed-image-frame-safe-area-right, 0px)) / 2)",
          transform: "translateX(-50%)",
        },
      },
      "top-end": {
        floater: {
          top: "var(--seed-image-frame-offset-y)",
          right:
            "calc(var(--seed-image-frame-offset-x) + var(--seed-image-frame-safe-area-right, 0px))",
        },
      },
      "middle-start": {
        floater: {
          top: "calc(50% + var(--seed-image-frame-offset-y))",
          left: "calc(var(--seed-image-frame-offset-x) + var(--seed-image-frame-safe-area-left, 0px))",
          transform: "translateY(-50%)",
        },
      },
      "middle-center": {
        floater: {
          top: "calc(50% + var(--seed-image-frame-offset-y))",
          left: "calc(50% + var(--seed-image-frame-offset-x) + (var(--seed-image-frame-safe-area-left, 0px) - var(--seed-image-frame-safe-area-right, 0px)) / 2)",
          transform: "translate(-50%, -50%)",
        },
      },
      "middle-end": {
        floater: {
          top: "calc(50% + var(--seed-image-frame-offset-y))",
          right:
            "calc(var(--seed-image-frame-offset-x) + var(--seed-image-frame-safe-area-right, 0px))",
          transform: "translateY(-50%)",
        },
      },
      "bottom-start": {
        floater: {
          bottom: "var(--seed-image-frame-offset-y)",
          left: "calc(var(--seed-image-frame-offset-x) + var(--seed-image-frame-safe-area-left, 0px))",
        },
      },
      "bottom-center": {
        floater: {
          bottom: "var(--seed-image-frame-offset-y)",
          left: "calc(50% + var(--seed-image-frame-offset-x) + (var(--seed-image-frame-safe-area-left, 0px) - var(--seed-image-frame-safe-area-right, 0px)) / 2)",
          transform: "translateX(-50%)",
        },
      },
      "bottom-end": {
        floater: {
          bottom: "var(--seed-image-frame-offset-y)",
          right:
            "calc(var(--seed-image-frame-offset-x) + var(--seed-image-frame-safe-area-right, 0px))",
        },
      },
    },
  },
  defaultVariants: { stroke: false, loaded: false, placement: "bottom-end" },
});
