import type { ValueResolver } from "@/codegen/core";
import { camelCasePreserveUnderscoreBetweenNumbers } from "@/utils/common";
import { toCssPixel, toCssRgba } from "@/utils/css";
import { camelCase } from "change-case";

export type ReactValueResolver = ValueResolver<string, string, string, number>;

export const defaultVariableNameFormatter = ({ slug }: { slug: string[] }) =>
  slug
    .filter(
      (s) =>
        !(
          s === "dimension" ||
          s === "radius" ||
          s === "font-size" ||
          s === "font-weight" ||
          s === "line-height"
        ),
    )
    .map((s) => s.replaceAll(",", "_"))
    .map(camelCasePreserveUnderscoreBetweenNumbers)
    .join(".");

export const defaultStyleNameFormatter = ({ slug }: { slug: string[] }) =>
  camelCase(slug[slug.length - 1]!, { mergeAmbiguousCharacters: true });

export const defaultRawValueFormatters = {
  color: (value: RGBA) => toCssRgba(value),
  dimension: (value: number) => toCssPixel(value),
  fontDimension: (value: number) => toCssPixel(value),
  fontWeight: (value: number) => value,
};
