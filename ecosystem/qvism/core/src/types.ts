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

export interface RecipeDefinition<T extends RecipeVariantRecord = RecipeVariantRecord> {
  name: string;
  base: StyleObject;
  variants: T;
  compoundVariants?: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<T>>>[];
  defaultVariants: Required<RecipeSelection<T>>;
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

export interface TargetConfig {
  /** 출력 파일 접미사 (예: "lynx" → action-button.lynx.css) */
  suffix: string;
  /** 이 타겟에 적용할 PostCSS 플러그인 */
  postcssPlugins: AcceptedPlugin[];
  /** 단일 recipe를 이 슬롯 이름으로 분리된 JS/DTS 생성. 첫 번째가 base class */
  deriveSlots?: string[];
  /** CSS 후처리로 생성된 추가 variant (예: { disabled: [true], loading: [true] }) */
  extraVariants?: Record<string, (string | boolean)[]>;
  /** 타겟 전용 출력 디렉토리. 설정 시 suffix 없이 해당 디렉토리에 출력 */
  outputDir?: string;
  /** 타겟 전용 recipes 출력 디렉토리. 설정 시 suffix 없이 해당 디렉토리에 출력 */
  recipesDir?: string;
}

export interface Config {
  prefix?: string;

  postcssPlugins?: AcceptedPlugin[];

  theme: Theme;

  /** 추가 CSS 출력 타겟 (예: lynx) */
  targets?: TargetConfig[];
}

export interface CssgenConfig {
  minify?: boolean;
  layer?: boolean;
}
