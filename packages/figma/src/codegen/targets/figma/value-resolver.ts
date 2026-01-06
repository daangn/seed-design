import type { ValueResolver } from "@/codegen/core";
import { toCssRgba } from "@/utils/css";
import type { RGBA } from "@figma/rest-api-spec";
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

export const defaultEffectStyleNameFormatter = ({ slug }: { slug: string[] }) =>
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

function formatBoxShadow(value: {
  type: "DROP_SHADOW" | "INNER_SHADOW";
  color: RGBA;
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
}): string {
  const { type, color, offset, radius, spread } = value;
  const inset = type === "INNER_SHADOW" ? "inset " : "";
  const colorStr = toCssRgba(color);
  const spreadStr = spread !== undefined ? ` ${spread}px` : "";

  return `${inset}${offset.x}px ${offset.y}px ${radius}px${spreadStr} ${colorStr}`;
}

export const defaultRawValueFormatters = {
  color: (value: RGBA) => toCssRgba(value),
  dimension: (value: number) => value,
  fontDimension: (value: number) => value,
  fontWeight: (value: number) => value,
  boxShadow: formatBoxShadow,
};
