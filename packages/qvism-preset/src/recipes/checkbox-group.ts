import { defineRecipe } from "../utils/define";
import { checkboxGroup as vars } from "../vars/component";

const checkboxGroup = defineRecipe({
  name: "checkbox-group",
  base: {
    display: "flex",

    flexDirection: "column",
    gap: vars.base.enabled.root.gapY,
  },
  variants: {},
  defaultVariants: {},
});

export default checkboxGroup;
