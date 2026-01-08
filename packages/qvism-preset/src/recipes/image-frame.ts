import { defineRecipe } from "../utils/define";
import * as radius from "../vars/radius";
import * as stroke from "../vars/color/stroke";

const imageFrame = defineRecipe({
  name: "image-frame",
  base: {
    "& > img, & > video": {
      objectFit: "cover",
    },
  },
  variants: {
    rounded: {
      true: {
        borderRadius: radius.r2,

        "& > img, & > video": {
          borderRadius: radius.r2,
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
          boxShadow: `inset 0 0 0 1px ${stroke.neutralSubtle}`,
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
