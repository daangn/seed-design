import type { CSSProperties as LynxCss } from "@lynx-js/types";
import type {
  Config,
  CssKeyframes,
  RecipeDefinition,
  RecipeVariantRecord,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  StyleObject,
} from "@seed-design/qvism-core";

type CssVarRef = `var(--${string})`;
type CssVarKey = `--${string}`;

type LynxStyleProperties = {
  [K in keyof LynxCss]: LynxCss[K] | CssVarRef;
} & {
  [K in CssVarKey]?: string;
};

/**
 * Style object constrained to properties/values that the Lynx view engine
 * actually supports. Derived from `@lynx-js/types` `CSSProperties`, so keys
 * like `inline-*` display values or `verticalAlign` are unavailable at
 * compile time. Unlike the web style object, selector nesting is intentionally
 * omitted so state styles are modeled as recipe variants and emitted as
 * className combinations.
 */
export type LynxStyleObject = LynxStyleProperties;

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

export function defineRecipe<T extends RecipeVariantRecord>(
  definition: LynxRecipeDefinition<T>,
): RecipeDefinition<T> {
  return definition as unknown as RecipeDefinition<T>;
}

export function defineSlotRecipe<S extends string, T extends SlotRecipeVariantRecord<S>>(
  definition: LynxSlotRecipeDefinition<S, T>,
): SlotRecipeDefinition<S, T> {
  return definition as unknown as SlotRecipeDefinition<S, T>;
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
