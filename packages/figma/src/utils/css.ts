import type { RGBA } from "@figma/rest-api-spec";

export function toCssPixel(value: number): `${number}px` {
  return `${value}px`;
}

export function toCssRem(value: number): `${number}rem` {
  return `${value / 16}rem`;
}

export function toCssRgba(
  color: RGBA,
): `rgba(${number}, ${number}, ${number}, ${number})` | `rgb(${number}, ${number}, ${number})` {
  if (color.a === 1) {
    return `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
  }

  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
}
