import type * as CSS from "csstype";

// utils
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

type MaybeArray<T> = T | Array<T>;

type Pretty<T> = { [K in keyof T]: T[K] } & {};

// selectors
type DataAttributes =
  | "[data-selected]"
  | "[data-highlighted]"
  | "[data-hover]"
  | "[data-active]"
  | "[data-checked]"
  | "[data-indeterminate]"
  | "[data-disabled]"
  | "[data-readonly]"
  | "[data-focus]"
  | "[data-focus-visible]"
  | "[data-invalid]"
  | "[data-pressed]"
  | "[data-expanded]"
  | "[data-orientation=horizontal]"
  | "[data-orientation=vertical]"
  | `[data-part=${string}]`
  | `[data-placement=${string}]`
  | `[data-state=${string}]`
  | `[data-loading-state=${string}]`
  | "[data-loading]";

type AttributeSelector = `&${CSS.Pseudos | DataAttributes}`;
type ParentSelector = `${DataAttributes} &`;

type AtRuleType = "media" | "layer" | "container" | "supports" | "page";

type AnySelector = `${string}&` | `&${string}` | `@${AtRuleType}${string}`;

type Selectors = AttributeSelector | ParentSelector;

// properties
type CssVarRef = `var(--${string})`;
type CssVarKey = `--${string}`;

type CssVarProperties = {
  [key in CssVarKey]?: string;
};

type NamedProperties = {
  [K in keyof CSS.PropertiesFallback<String | Number>]:
    | CSS.PropertiesFallback<String | Number>[K]
    | CssVarRef;
};

export interface CssProperties extends NamedProperties, CssVarProperties {}

export interface CssKeyframes {
  [name: string]: {
    from?: CssProperties;
    to?: CssProperties;
    [key: `${string}%`]: CssProperties;
  };
}

type Nested<P> = P & {
  [K in Selectors]?: Nested<P>;
} & {
  [K in AnySelector]?: Nested<P>;
};

export type StyleObject = Nested<CssProperties>;

// recipe
export type RecipeSelection<T extends SlotRecipeVariantRecord<string>> = keyof any extends keyof T
  ? {}
  : {
      [K in keyof T]?: StringToBoolean<keyof T[K]>;
    };

export type RecipeCompoundSelection<T> = {
  [K in keyof T]?: MaybeArray<StringToBoolean<keyof T[K]>> | undefined;
};

type SlotRecord<S extends string, T> = Partial<Record<S, T>>;

export type SlotRecipeVariantRecord<S extends string> = Record<
  any,
  Record<any, SlotRecord<S, StyleObject>>
>;

export type SlotRecipeCompoundVariant<S extends string, T> = T & {
  css: SlotRecord<S, StyleObject>;
};

export interface SlotRecipeDefinition<
  S extends string = string,
  T extends SlotRecipeVariantRecord<S> = SlotRecipeVariantRecord<S>,
> {
  name: string;
  slots: S[] | Readonly<S[]>;
  base: SlotRecord<S, StyleObject>;
  variants: T;
  compoundVariants?: Pretty<SlotRecipeCompoundVariant<S, RecipeCompoundSelection<T>>>[];
  defaultVariants: Required<RecipeSelection<T>>;
}

// config
export interface Theme {
  tokens: {
    // TODO: implement qvism tokens; currently using rootage-generated token.css
    _raw: string;
  };

  recipes: Record<string, SlotRecipeDefinition>;

  keyframes: CssKeyframes;

  globalCss?: Record<string, StyleObject>;
}

export interface Config {
  prefix?: string;

  theme: Theme;
}

export interface CssgenConfig {
  minify?: boolean;
}
