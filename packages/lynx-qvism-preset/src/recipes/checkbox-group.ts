import { checkboxGroup as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";

const checkboxGroupRecipe = defineRecipe({
  name: "checkbox-group",
  base: {
    display: "flex",
    flexDirection: "column",
    gap: vars.base.enabled.root.gapY,
  },
  variants: {},
  defaultVariants: {},
});

export default checkboxGroupRecipe;
