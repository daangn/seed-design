import * as React from "react";
import { createStyleProps, type StyleProps } from "../../utils/styled";

export interface BoxProps extends StyleProps, Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  as?: React.ElementType;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { style, className, restProps } = createStyleProps(props);
  const { as: Comp = "div", ...nativeProps } = restProps;

  return <Comp ref={ref} className={className} style={style} {...nativeProps} />;
});
