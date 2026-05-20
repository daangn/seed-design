import clsx from "clsx";
import * as React from "react";

import { useStyleProps, type StyleProps } from "../../utils/styled";

export interface BoxProps extends StyleProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  bindtap?: () => void;
  bindtouchstart?: () => void;
  bindtouchend?: () => void;
  bindtouchcancel?: () => void;
  "main-thread:bindtap"?: () => void;
}

export const Box = React.forwardRef<unknown, BoxProps>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const { children, className, ...nativeProps } = restProps;

  return (
    <view
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
      {...nativeProps}
      className={clsx(className)}
      style={style}
    >
      {children}
    </view>
  );
});

Box.displayName = "Box";
