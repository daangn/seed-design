import { defineRecipe } from "../utils/define";
import { imageFrame as vars } from "../vars/component";

const imageFrame = defineRecipe({
  name: "image-frame",
  base: {
    position: "relative",

    "& > img, & > video": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  variants: {
    rounded: {
      true: {
        overflow: "hidden",
        borderRadius: vars.roundedTrue.enabled.root.cornerRadius,

        "& > img, & > video": {
          borderRadius: vars.roundedTrue.enabled.root.cornerRadius,
        },
      },
      false: {},
    },
    stroke: {
      true: {
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
      false: {},
    },
  },
  defaultVariants: {
    rounded: false,
    stroke: false,
  },
});

export default imageFrame;
