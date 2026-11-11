import type { CSSProperties } from "react";

/** 부모를 가득 채우는 이미지의 inline style. `next/image`의 `fill`이 내던 값과 같다. */
export const fillImageStyle: CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};
