import { radioGroup as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";

const radioGroupRecipe = defineRecipe({
  name: "radio-group",
  base: {
    display: "flex",
    flexDirection: "column",
    gap: vars.base.enabled.root.gapY,
  },
  variants: {},
  defaultVariants: {},
});

export default radioGroupRecipe;
