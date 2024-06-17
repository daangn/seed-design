import type * as CSS from "csstype";

type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

type SVGExtraProperties = {
  r?: string;
  cx?: string;
  cy?: string;
};

export type StyleObject = CSS.Properties &
  SVGExtraProperties & {
    [P in CSS.SimplePseudos as `&${P}`]?: CSS.Properties;
  } & {
    [K in string as `&${K}`]?: CSS.Properties;
  } & {
    [K in string as `--${K}`]?: string;
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
  defaultVariants?: RecipeSelection<T>;
  keyframes?: Record<string, Partial<Record<"from" | "to" | `${string}%`, StyleObject>>>;
}
