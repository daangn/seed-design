import type { CSSProperties, IntrinsicElements } from "@lynx-js/types";

/** Native object·string style 모두에서 사용자 값을 기본 geometry 뒤에 적용합니다. */
export function mergeStyle(
  defaults: CSSProperties,
  style: IntrinsicElements["view"]["style"],
): CSSProperties | string {
  if (typeof style === "string") {
    const defaultStyle = Object.entries(defaults)
      .map(
        ([key, value]) =>
          `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`,
      )
      .join(";");
    return `${defaultStyle};${style}`;
  }
  return { ...defaults, ...style };
}
