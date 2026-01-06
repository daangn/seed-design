import type { ValueResolver } from "@/codegen/core";
import { camelCasePreserveUnderscoreBetweenNumbers } from "@/utils/common";
import { toCssPixel, toCssRgba } from "@/utils/css";
import type { RGBA } from "@figma/rest-api-spec";
import { camelCase } from "change-case";

export type ReactValueResolver = ValueResolver<
  string,
  { value: string; direction?: string },
  string,
  string,
  number
>;

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

export const defaultTextStyleNameFormatter = ({ slug }: { slug: string[] }) => {
  return camelCase(slug[slug.length - 1]!, { mergeAmbiguousCharacters: true });
};

export const defaultEffectStyleNameFormatter = ({ slug }: { slug: string[] }) => {
  return camelCase(slug[slug.length - 1]!, { mergeAmbiguousCharacters: true });
};

export const defaultFillStyleResolver = ({ slug }: { slug: string[] }) => {
  const [, ...rest] = slug;

  if (rest[0] === "fade") {
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

function formatBoxShadow({
  type,
  color,
  offset,
  radius,
  spread,
}: {
  type: "DROP_SHADOW" | "INNER_SHADOW";
  color: RGBA;
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
}): string {
  const inset = type === "INNER_SHADOW" ? "inset " : "";
  const colorStr = toCssRgba(color);
  const spreadStr = spread ? ` ${spread}px` : "";

  return `${inset}${offset.x}px ${offset.y}px ${radius}px${spreadStr} ${colorStr}`;
}

export const defaultRawValueFormatters = {
  color: (value: RGBA) => toCssRgba(value),
  dimension: (value: number) => toCssPixel(value),
  fontDimension: (value: number) => toCssPixel(value),
  fontWeight: (value: number) => value,
  boxShadow: formatBoxShadow,
};
