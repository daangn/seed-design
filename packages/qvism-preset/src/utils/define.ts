import type {
  Config,
  CssKeyframes,
  RecipeDefinition,
  RecipeVariantRecord,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  StyleObject,
} from "@seed-design/qvism-core";

export function defineRecipe<T extends RecipeVariantRecord>(
  definition: RecipeDefinition<T>,
): RecipeDefinition<T> {
  return definition;
}

export function defineSlotRecipe<S extends string, T extends SlotRecipeVariantRecord<S>>(
  definition: SlotRecipeDefinition<S, T>,
): SlotRecipeDefinition<S, T> {
  return definition;
}

export function defineKeyframes(definition: CssKeyframes): CssKeyframes {
  return definition;
}

export function defineGlobalCss(
  globalCss: Record<string, StyleObject>,
): Record<string, StyleObject> {
  return globalCss;
}

export function definePreset(preset: Config): Config {
  return preset;
}
