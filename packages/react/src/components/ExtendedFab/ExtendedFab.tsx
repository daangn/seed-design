import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { extendedFab, type ExtendedFabVariantProps } from "@seed-design/css/recipes/extended-fab";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withProvider } = createRecipeContext(extendedFab);

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedFabProps
  extends ExtendedFabVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ExtendedFab = withProvider<HTMLButtonElement, ExtendedFabProps>(Primitive.button, {
  defaultProps: {
    variant: "neutralSolid",
    size: "medium",
  },
});
