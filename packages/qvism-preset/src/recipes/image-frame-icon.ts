import { defineRecipe } from "../utils/define";
import * as palette from "../vars/color/palette";

export default defineRecipe({
  name: "image-frame-icon",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    color: palette.staticWhite,
  },
  variants: {},
  defaultVariants: {},
});
