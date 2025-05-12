import type { ValueResolver } from "@/codegen/core";
import { toCssRgba } from "@/utils/css";

export type FigmaValueResolver = ValueResolver<string, number, number, number>;

export const defaultVariableNameFormatter = ({ slug }: { slug: string[] }) =>
  slug
    .filter((s) => s !== "dimension")
    .map((s) => s.replaceAll(",", "_"))
    .join("/");

export const defaultStyleNameFormatter = ({ slug }: { slug: string[] }) => slug[slug.length - 1]!;

export const defaultRawValueFormatters = {
  color: (value: RGBA) => toCssRgba(value),
  dimension: (value: number) => value,
  fontDimension: (value: number) => value,
  fontWeight: (value: number) => value,
};
