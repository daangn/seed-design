import type * as CSS from "csstype";
import type { AcceptedPlugin } from "postcss";

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
export type RecipeSelection<T extends RecipeVariantRecord> = keyof any extends keyof T
  ? {}
  : {
      [K in keyof T]?: StringToBoolean<keyof T[K]>;
    };

export type RecipeCompoundSelection<T> = {
  [K in keyof T]?: MaybeArray<StringToBoolean<keyof T[K]>> | undefined;
};

export type RecipeVariantRecord = Record<any, Record<any, StyleObject>>;

export type RecipeCompoundVariant<T> = T & {
  css: StyleObject;
};

export interface VariantValueMetadata {
  description?: string;
}

export interface RecipeMetadata<T extends RecipeVariantRecord = RecipeVariantRecord> {
  variants?: {
    [K in keyof T]?: {
      description?: string;
      values?: { [V in Extract<keyof T[K], string | number>]?: VariantValueMetadata };
    };
  };
}

/**
 * Validate that `M` (e.g. yaml-sourced metadata) does not contain any axis or
 * value keys that are absent from the recipe `variants` (`T`). Extra keys
 * collapse the relevant slot to `never`, so the assignment fails to compile
 * and the offending key surfaces in the error.
 *
 * Keys are compared after stringification so numeric recipe keys (e.g. `20`)
 * still match their JSON-imported string counterparts (e.g. `"20"`).
 */
type StringifiedKeys<T> = `${keyof T & (string | number)}`;

export type ExactRecipeMetadata<T extends RecipeVariantRecord, M> = M extends {
  variants?: infer MV;
}
  ? Exclude<StringifiedKeys<MV>, StringifiedKeys<T>> extends never
    ? M & {
        variants?: {
          [K in keyof MV]: K extends `${infer Kn}`
            ? Kn extends StringifiedKeys<T>
              ? MV[K] extends { values?: infer VV }
                ? Exclude<
                    StringifiedKeys<VV>,
                    StringifiedKeys<T[Extract<keyof T, K | Kn | number>]>
                  > extends never
                  ? MV[K]
                  : never
                : MV[K]
              : never
            : never;
        };
      }
    : never
  : M;

export interface RecipeDefinition<T extends RecipeVariantRecord = RecipeVariantRecord> {
  name: string;
  base: StyleObject;
  variants: T;
  compoundVariants?: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<T>>>[];
  defaultVariants: Required<RecipeSelection<T>>;
  metadata?: RecipeMetadata<T>;
}

// slot recipe
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
  metadata?: RecipeMetadata<T>;
}

export type RecipeKindDefinition = RecipeDefinition | SlotRecipeDefinition;

// config
export interface Theme {
  tokens: {
    // TODO: implement qvism tokens; currently using rootage-generated token.css
    _raw: string;
  };

  recipes: Record<string, RecipeKindDefinition>;

  keyframes: CssKeyframes;

  globalCss?: Record<string, StyleObject>;
}

export interface Config {
  prefix?: string;

  postcssPlugins?: AcceptedPlugin[];

  theme: Theme;
}

export interface CssgenConfig {
  minify?: boolean;
  layer?: boolean;
}
