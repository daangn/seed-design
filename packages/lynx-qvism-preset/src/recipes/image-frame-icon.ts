import { defineRecipe } from "../utils/define";
import * as palette from "../vars/color/palette";

export default defineRecipe({
  name: "image-frame-icon",
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: palette.staticWhite,
    width: "24px",
    height: "24px",
  },
  variants: {},
  defaultVariants: {},
});
