import { defineRecipe } from "../utils/define";
import { radioGroup as vars } from "../vars/component";

const radioGroup = defineRecipe({
  name: "radio-group",
  base: {
    display: "flex",

    flexDirection: "column",
    gap: vars.base.rest.root.gapY,
  },
  variants: {},
  defaultVariants: {},
});

export default radioGroup;
