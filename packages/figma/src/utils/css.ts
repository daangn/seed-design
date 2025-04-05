import type { RGBA } from "@figma/rest-api-spec";

export function toCssPixel(value: number) {
  return `${value}px`;
}

export function toCssRgba(color: RGBA) {
  if (color.a === 1) {
    return `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
  }

  return `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a})`;
}
