import * as React from "@lynx-js/react";
import { float, type FloatVariantProps } from "@seed-design/lynx-css/recipes/float";
import type { Dimension } from "@seed-design/lynx-css/vars";
import clsx from "clsx";
import type { LynxStyledElementProps, LynxViewProps, LynxViewRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { handleDimension } from "../../utils/styled";

/** @platform Lynx Renders a native view; polymorphic `as` and HTML attributes are unsupported. */
export interface FloatProps
  extends Omit<LynxViewProps, "style">,
    Pick<LynxStyledElementProps, "style"> {
  placement: NonNullable<FloatVariantProps["placement"]>;
  /** @default 0 */
  offsetX?: 0 | Dimension | (string & {});
  /** @default 0 */
  offsetY?: 0 | Dimension | (string & {});
  zIndex?: number | (string & {});
}

export const Float = React.forwardRef<unknown, FloatProps>((props, ref) => {
  const [variantProps, otherProps] = float.splitVariantProps(props);
  const {
    offsetX = 0,
    offsetY = 0,
    zIndex,
    children,
    className,
    style,
    ...nativeProps
  } = otherProps;

  const floatStyle = {
    "--seed-float-offset-x": handleDimension(offsetX),
    "--seed-float-offset-y": handleDimension(offsetY),
    zIndex,
    ...style,
  };

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(float(variantProps), className)}
      style={floatStyle}
    >
      {children}
    </view>
  );
});
Float.displayName = "Float";
