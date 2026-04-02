import clsx from "clsx";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import { Slot } from "@seed-design/lynx-primitive";
import { useStyleProps, type StyleProps } from "../../utils/styled";

export interface BoxProps extends StyleProps {
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Box = forwardRef<any, BoxProps>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const { asChild = false, className, ...nativeProps } = restProps;

  // DEBUG: circular reference 원인 파악
  try {
    JSON.stringify(style);
  } catch (e) {
    console.error("[Box] style is circular:", Object.keys(style));
  }
  try {
    JSON.stringify(nativeProps);
  } catch (e) {
    console.error("[Box] nativeProps is circular:", Object.keys(nativeProps));
  }

  if (asChild) {
    return (
      <Slot ref={ref} className={clsx("seed-box", className)} style={style} {...nativeProps} />
    );
  }

  return <view ref={ref} className={clsx("seed-box", className)} style={style} {...nativeProps} />;
});

Box.displayName = "Box";
