import clsx from "clsx";
import * as React from "react";

import type { LynxPressableProps, LynxStyledElementProps } from "../../types";
import { useStyleProps, type StyleProps } from "../../utils/styled";

export interface BoxProps extends StyleProps, LynxStyledElementProps, LynxPressableProps {
  bindtouchstart?: () => void;
  bindtouchend?: () => void;
  bindtouchcancel?: () => void;
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
