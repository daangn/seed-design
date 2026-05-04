import type {
  Config,
  CssKeyframes,
  ExactRecipeMetadata,
  RecipeDefinition,
  RecipeVariantRecord,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  StyleObject,
} from "@seed-design/qvism-core";

export function defineRecipe<T extends RecipeVariantRecord, M = unknown>(
  definition: RecipeDefinition<T> & { metadata?: ExactRecipeMetadata<T, M> },
): RecipeDefinition<T> {
  return definition;
}

export function defineSlotRecipe<
  S extends string,
  T extends SlotRecipeVariantRecord<S>,
  M = unknown,
>(
  definition: SlotRecipeDefinition<S, T> & { metadata?: ExactRecipeMetadata<T, M> },
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
