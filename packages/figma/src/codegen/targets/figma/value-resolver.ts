import { createValueResolver, type ValueResolver } from "@/codegen/core";
import { styleService, variableService } from "@/codegen/default-services";
import { toCssRgba } from "@/utils/css";

export type FigmaValueResolver = ValueResolver<string, number, number, number>;

export const valueResolver = createValueResolver({
  variableService,
  variableNameFormatter: ({ slug }) =>
    slug
      .filter((s) => s !== "dimension")
      .map((s) => s.replaceAll(",", "_"))
      .join("/"),
  styleService,
  styleNameFormatter: ({ slug }) => slug[slug.length - 1]!,
  rawValueFormatters: {
    color: (value: RGBA) => toCssRgba(value),
    dimension: (value: number) => value,
    fontDimension: (value: number) => value,
    fontWeight: (value: number) => value,
  },
});
