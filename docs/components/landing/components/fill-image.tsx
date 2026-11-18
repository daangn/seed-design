import type { ImgHTMLAttributes } from "react";

/** `next/image`의 `fill`(정적 export라 unoptimized)과 같은 `<img>`: 위치가 있는 부모를 가득 채우고 lazy로 받는다. */
export function FillImage({ style, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        color: "transparent",
        ...style,
      }}
    />
  );
}
