import { radioGroup as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const radioGroupRecipe = defineSlotRecipe({
  name: "radio-group",
  slots: ["root", "text"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.rest.root.gapY,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default radioGroupRecipe;
