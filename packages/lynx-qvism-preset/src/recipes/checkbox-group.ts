import { checkboxGroup as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const checkboxGroupRecipe = defineSlotRecipe({
  name: "checkbox-group",
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

export default checkboxGroupRecipe;
