import { vars } from "../vars";
import { defineSlotRecipe } from "../utils/define";

export default defineSlotRecipe({
  name: "pull-to-refresh",
  slots: ["root", "indicator", "content"],
  base: {
    root: {
      height: "100%",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: vars.$dimension.x8,
      paddingBottom: vars.$dimension.x8,
    },
    content: { height: "100%", width: "100%" },
  },
  variants: {},
  defaultVariants: {},
});
