import clsx from "clsx";
import * as React from "react";

/**
 * @platform Lynx
 *
 * 웹의 `<span class="seed-count">` 래퍼 대신 Lynx `<text>` 요소에 `seed-count__text`
 * 클래스를 적용한다. Lynx는 텍스트 스타일을 `<text>` 요소에 직접 주는 구조이고,
 * `seed-count`는 postcss-lynx-compat이 `seed-count__text`로 변환한다.
 */
export interface CountProps {
  children?: React.ReactNode;
  className?: string;
}

export const Count = React.forwardRef<unknown, CountProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
      className={clsx("seed-count__text", className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
Count.displayName = "Count";
