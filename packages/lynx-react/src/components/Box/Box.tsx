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
  const { asChild = false, className, children, ...nativeProps } = restProps;

  const mergedProps = {
    ...(ref ? { ref } : {}),
    className: clsx("seed-box", className),
    style: style as any,
    ...nativeProps,
  };

  if (asChild) {
    return <Slot {...mergedProps}>{children}</Slot>;
  }

  return <view {...mergedProps}>{children}</view>;
});

Box.displayName = "Box";
