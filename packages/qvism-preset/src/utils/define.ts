import type {
  CssKeyframes,
  Preset,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  StyleObject,
} from "@seed-design/qvism-core";

export function defineRecipe<S extends string, T extends SlotRecipeVariantRecord<S>>(
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

export function definePreset(preset: Preset): Preset {
  return preset;
}
