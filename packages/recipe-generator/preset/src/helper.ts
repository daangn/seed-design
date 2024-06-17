import type {
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
} from "@seed-design/recipe-generator-core";

export function defineRecipe<S extends string, V extends SlotRecipeVariantRecord<S>>(
  definition: SlotRecipeDefinition<S, V>,
): SlotRecipeDefinition<S, V> {
  return definition;
}

export const visuallyHiddenStyle = {
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
  wordWrap: "normal",
} as const;
