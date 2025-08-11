import type { ValueResolver } from "@/codegen/core";
import { toCssRgba } from "@/utils/css";
import { camelCase } from "change-case";

export type FigmaValueResolver = ValueResolver<
  string,
  { value: string; direction?: string },
  number,
  number,
  number
>;

export const defaultVariableNameFormatter = ({ slug }: { slug: string[] }) =>
  slug
    .filter((s) => s !== "dimension")
    .map((s) => s.replaceAll(",", "_"))
    .join("/");

export const defaultTextStyleNameFormatter = ({ slug }: { slug: string[] }) =>
  slug[slug.length - 1]!;

export const defaultFillStyleResolver = ({ slug }: { slug: string[] }) => {
  const [, ...rest] = slug;

  if (rest.includes("fade")) {
    // ["fade", "layer-default", "↓(to-bottom)"]

    const last = rest[rest.length - 1];

    const direction = (() => {
      if (last.startsWith("↓")) return "to bottom";
      if (last.startsWith("↑")) return "to top";
      if (last.startsWith("→")) return "to right";
      if (last.startsWith("←")) return "to left";

      return "unknown";
    })();

    return {
      value: camelCase(rest.slice(0, -1).join("-"), { mergeAmbiguousCharacters: true }),
      direction,
    };
  }

  return {
    value: camelCase(rest.join("-"), { mergeAmbiguousCharacters: true }),
  };
};

export const defaultRawValueFormatters = {
  color: (value: RGBA) => toCssRgba(value),
  dimension: (value: number) => value,
  fontDimension: (value: number) => value,
  fontWeight: (value: number) => value,
};
