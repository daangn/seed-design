import type {
  CSSPropertiesWithLonghands as LynxCssLonghands,
  CSSPropertiesWithShorthands as LynxCssShorthands,
} from "@lynx-js/types";
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

type CssWideKeyword = "initial" | "inherit" | "unset";

type ForbiddenLynxStyleKey =
  | "boxSizing"
  | "verticalAlign"
  | "font"
  | "fontFeatureSettings"
  | "fontVariationSettings"
  | "fontOpticalSizing"
  | "cursor"
  | "content"
  | "stroke"
  | "strokeDasharray"
  | "strokeDashoffset"
  | "strokeLinecap"
  | "strokeLinejoin"
  | "strokeWidth"
  | "fill"
  | "gridColumn"
  | "gridRow"
  | "textTransform"
  | "textDecoration"
  | "textDecorationColor"
  | "textDecorationLine"
  | "textDecorationStyle"
  | "textDecorationThickness"
  | "textUnderlineOffset"
  | "outline"
  | "outlineColor"
  | "outlineStyle"
  | "outlineWidth"
  | "objectFit"
  | "objectPosition"
  | "mask"
  | "maskImage"
  | "maskSize"
  | "maskPosition"
  | "maskRepeat"
  | "maskComposite"
  | "backdropFilter"
  | "mixBlendMode"
  | "writingMode"
  | "unicodeBidi"
  | "appearance"
  | "userSelect"
  | "touchAction"
  | "overscrollBehavior"
  | "overscrollBehaviorX"
  | "overscrollBehaviorY"
  | "scrollBehavior"
  | "scrollMargin"
  | "scrollPadding"
  | "scrollbarColor"
  | "scrollbarGutter"
  | "overflowAnchor"
  | "overflowClipMargin"
  | "colorScheme"
  | "listStyle"
  | "listStyleType"
  | "listStylePosition"
  | "counterReset"
  | "counterIncrement"
  | "quotes"
  | "tableLayout"
  | "borderCollapse"
  | "borderSpacing"
  | "emptyCells"
  | "captionSide"
  | "columnCount"
  | "columnRule"
  | "float"
  | "clear"
  | "resize"
  | "placeContent"
  | "placeItems"
  | "placeSelf";

type AllowedLynxCss = Omit<LynxCssLonghands & LynxCssShorthands, ForbiddenLynxStyleKey>;

type LynxStyleProperties = {
  [K in keyof AllowedLynxCss]: AllowedLynxCss[K] | CssVarRef;
} & {
  [K in CssVarKey]?: string;
} & {
  [K in ForbiddenLynxStyleKey]?: never;
};

type RejectCssWideKeywords<T> = T extends CssWideKeyword
  ? never
  : T extends readonly unknown[]
    ? { [K in keyof T]: RejectCssWideKeywords<T[K]> }
    : T extends object
      ? { [K in keyof T]: RejectCssWideKeywords<T[K]> }
      : T;

type StrictLynxInput<T> = RejectCssWideKeywords<T>;

/**
 * Style object constrained to the SEED Lynx preset contract. It starts from
 * Lynx's known longhand/shorthand CSS keys, then removes web-only properties
 * that SEED does not allow in preset sources. State styles should be modeled
 * as recipe variants instead of selector nesting.
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

type LynxKeyframes = {
  [name: string]: {
    from?: LynxStyleObject;
    to?: LynxStyleObject;
    [key: `${string}%`]: LynxStyleObject | undefined;
  };
};

export function defineRecipe<
  const T extends RecipeVariantRecord,
  const D extends LynxRecipeDefinition<T>,
>(definition: D & StrictLynxInput<D>): RecipeDefinition<T> {
  return definition as unknown as RecipeDefinition<T>;
}

export function defineSlotRecipe<
  const S extends string,
  const T extends SlotRecipeVariantRecord<S>,
  const D extends LynxSlotRecipeDefinition<S, T>,
>(definition: D & StrictLynxInput<D>): SlotRecipeDefinition<S, T> {
  return definition as unknown as SlotRecipeDefinition<S, T>;
}

export function defineKeyframes<const T extends LynxKeyframes>(
  definition: T & StrictLynxInput<T>,
): CssKeyframes {
  return definition as unknown as CssKeyframes;
}

export function defineGlobalCss<const T extends Record<string, unknown>>(
  globalCss: T & StrictLynxInput<T>,
): Record<string, StyleObject> {
  return globalCss as unknown as Record<string, StyleObject>;
}

export function definePreset<const T extends Config>(preset: T): Config {
  return preset;
}
