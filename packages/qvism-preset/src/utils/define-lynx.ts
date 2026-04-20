import type { CSSProperties as LynxCss } from "@lynx-js/types";
import type {
  AnySelector,
  CssVarProperties,
  RecipeDefinition,
  RecipeVariantRecord,
  Selectors,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
} from "@seed-design/qvism-core";

type LynxStyleProperties = LynxCss & CssVarProperties;

type LynxNested<P> = P & {
  [K in Selectors]?: LynxNested<P>;
} & {
  [K in AnySelector]?: LynxNested<P>;
};

/**
 * Style object constrained to properties/values that the Lynx view engine
 * actually supports. Derived from `@lynx-js/types` `CSSProperties`, so keys
 * like `inline-*` display values or `verticalAlign` are unavailable at
 * compile time — unlike the web `StyleObject` which accepts them.
 */
export type LynxStyleObject = LynxNested<LynxStyleProperties>;

type LynxSlotRecord<S extends string> = Partial<Record<S, LynxStyleObject>>;

type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

type MaybeArray<T> = T | Array<T>;

type LynxRecipeSelection<T extends RecipeVariantRecord> = keyof any extends keyof T
  ? {}
  : { [K in keyof T]?: StringToBoolean<keyof T[K]> };

type LynxRecipeCompoundSelection<T> = {
  [K in keyof T]?: MaybeArray<StringToBoolean<keyof T[K]>> | undefined;
};

type LynxRecipeCompoundVariant<T> = T & { css: LynxStyleObject };

type LynxSlotRecipeCompoundVariant<S extends string, T> = T & {
  css: LynxSlotRecord<S>;
};

export interface LynxRecipeDefinition<T extends RecipeVariantRecord = RecipeVariantRecord> {
  name: string;
  base: LynxStyleObject;
  variants: { [K in keyof T]: { [V in keyof T[K]]: LynxStyleObject } };
  compoundVariants?: LynxRecipeCompoundVariant<LynxRecipeCompoundSelection<T>>[];
  defaultVariants: Required<LynxRecipeSelection<T>>;
}

export interface LynxSlotRecipeDefinition<
  S extends string = string,
  T extends SlotRecipeVariantRecord<S> = SlotRecipeVariantRecord<S>,
> {
  name: string;
  slots: S[] | Readonly<S[]>;
  base: LynxSlotRecord<S>;
  variants: { [K in keyof T]: { [V in keyof T[K]]: LynxSlotRecord<S> } };
  compoundVariants?: LynxSlotRecipeCompoundVariant<S, LynxRecipeCompoundSelection<T>>[];
  defaultVariants: Required<LynxRecipeSelection<T>>;
}

/**
 * Recipe helper whose style inputs are narrowed to Lynx-supported CSS only.
 * Runtime behaviour is identical to `defineRecipe`; the type boundary catches
 * mistakes like `display: "inline-block"` at compile time.
 */
export function defineLynxRecipe<T extends RecipeVariantRecord>(
  definition: LynxRecipeDefinition<T>,
): RecipeDefinition<T> {
  return definition as unknown as RecipeDefinition<T>;
}

/**
 * Slot-recipe helper with Lynx-narrowed style inputs.
 */
export function defineLynxSlotRecipe<S extends string, T extends SlotRecipeVariantRecord<S>>(
  definition: LynxSlotRecipeDefinition<S, T>,
): SlotRecipeDefinition<S, T> {
  return definition as unknown as SlotRecipeDefinition<S, T>;
}
