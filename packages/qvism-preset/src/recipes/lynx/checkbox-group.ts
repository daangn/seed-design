import { checkboxGroup as vars } from "../../vars/component";
import { defineLynxRecipe } from "../../utils/define-lynx";

const checkboxGroupRecipe = defineLynxRecipe({
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
