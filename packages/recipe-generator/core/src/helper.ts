import type {
  RecipeSelection,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  StyleObject,
} from "./types";

export function selectVariantFrom<
  S extends string,
  T extends SlotRecipeVariantRecord<S>,
>(
  recipe: SlotRecipeDefinition<S, T>,
  slot: S,
  variant: Required<RecipeSelection<T>>,
) {
  const result = {} as StyleObject;

  const baseStyle = recipe.base[slot] as StyleObject;
  if (baseStyle) {
    Object.assign(result, baseStyle);
  }

  for (const variantName in recipe.variants) {
    const variantValue = variant[variantName];
    const variantStyle = recipe.variants[variantName][variantValue]?.[slot];
    if (variantStyle) {
      Object.assign(result, variantStyle);
    }
  }

  return result;
}

export function rem(px: string | number, base: string | number = 16): string {
  if (typeof px === "string" && !px.endsWith("px")) {
    return px;
  }

  return `${parseFloat(px.toString()) / parseFloat(base.toString())}rem`;
}
