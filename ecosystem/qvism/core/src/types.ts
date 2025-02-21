import type * as CSS from "csstype";

type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

type SVGExtraProperties = {
  r?: string;
  cx?: string;
  cy?: string;
};

type SimpleStyleObject = CSS.Properties & { [K in string as `--${K}`]?: string };

export type StyleObject = SimpleStyleObject &
  SVGExtraProperties & {
    [P in CSS.SimplePseudos as `&${P}`]?: SimpleStyleObject;
  } & {
    [P in string as `&${P}`]?: SimpleStyleObject;
  };

type RecipeVariantRecord = Record<any, Record<any, StyleObject>>;

export type RecipeSelection<T extends RecipeVariantRecord> = keyof any extends keyof T
  ? {}
  : {
      [K in keyof T]?: StringToBoolean<keyof T[K]>;
    };

type SlotRecord<S extends string, T> = Partial<Record<S, T>>;

export type SlotRecipeVariantRecord<S extends string> = Record<
  any,
  Record<any, SlotRecord<S, StyleObject>>
>;

export interface SlotRecipeDefinition<S extends string, T extends SlotRecipeVariantRecord<S>> {
  name: string;
  slots: S[] | Readonly<S[]>;
  base: SlotRecord<S, StyleObject>;
  variants: T | SlotRecipeVariantRecord<S>;
  compoundVariants?: Array<
    RecipeSelection<T> & {
      css: SlotRecord<S, StyleObject>;
    }
  >;
  defaultVariants: Required<RecipeSelection<T>>;
}

export interface KeyframeDefinition {
  from?: StyleObject;
  to?: StyleObject;
  [key: `${string}%`]: StyleObject;
}

export interface Theme {
  tokens: {
    // TODO: implement qvism tokens; currently using rootage-generated token.css
    _raw: string;
  };

  recipes: Record<string, SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>>;

  keyframes: Record<string, KeyframeDefinition>;
}

export interface CssgenOptions {
  prefix?: string;

  minify?: boolean;

  globalCss?: StyleObject;
}

// TODO: add extendable option to each theme items
export interface Config extends CssgenOptions {
  theme: Theme;
}

export interface Preset {
  theme: Theme;
}
