import { defineSlotRecipe } from "../utils/define";
import { imageFrame as vars } from "../vars/component";

const imageFrame = defineSlotRecipe({
  name: "image-frame",
  slots: ["root", "content", "fallback"],
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "inherit",
    },
    content: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit",
    },
    fallback: {
      width: "100%",
      height: "100%",
    },
  },
  variants: {
    stroke: {
      true: {
        root: {
          "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            boxShadow: `inset 0 0 0 ${vars.strokeTrue.enabled.root.strokeWidth} ${vars.strokeTrue.enabled.root.strokeColor}`,
          },
        },
      },
      false: {},
    },
    rounded: {
      true: {
        root: {
          borderRadius: vars.roundedTrue.enabled.root.cornerRadius,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    stroke: false,
    rounded: false,
  },
});

export default imageFrame;
