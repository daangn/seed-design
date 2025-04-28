import { createValueResolver, type ValueResolver } from "@/codegen/core";
import { styleService, variableService } from "@/codegen/default-services";
import { camelCasePreserveUnderscoreBetweenNumbers } from "@/utils/common";
import { toCssPixel, toCssRgba } from "@/utils/css";
import { camelCase } from "change-case";

export type ReactValueResolver = ValueResolver<string, string, string, number>;

export const valueResolver = createValueResolver({
  variableService,
  variableNameFormatter: ({ slug }) =>
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
      .join("."),
  styleService,
  styleNameFormatter: ({ slug }) =>
    camelCase(slug[slug.length - 1]!, { mergeAmbiguousCharacters: true }),
  rawValueFormatters: {
    color: (value: RGBA) => toCssRgba(value),
    dimension: (value: number) => toCssPixel(value),
    fontDimension: (value: number) => toCssPixel(value),
    fontWeight: (value: number) => value,
  },
});
