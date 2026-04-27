import { radioGroup as vars } from "../../vars/component";
import { defineLynxRecipe } from "../../utils/define-lynx";

const radioGroupRecipe = defineLynxRecipe({
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
