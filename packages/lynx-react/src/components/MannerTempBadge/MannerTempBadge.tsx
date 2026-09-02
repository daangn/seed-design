import {
  mannerTempBadge,
  type MannerTempBadgeVariantProps,
} from "@seed-design/lynx-css/recipes/manner-temp-badge";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxStyledElementProps, LynxViewRef } from "../../types";

/**
 * @platform Lynx
 *
 * React와 같은 `level` variant를 제공하지만, HTML `<span>` 대신 native
 * `<view>` / `<text>`를 렌더링합니다.
 */
export interface MannerTempBadgeProps extends MannerTempBadgeVariantProps, LynxStyledElementProps {}

export const MannerTempBadge = React.forwardRef<unknown, MannerTempBadgeProps>((props, ref) => {
  const [variantProps, otherProps] = mannerTempBadge.splitVariantProps(props);
  const classes = mannerTempBadge(variantProps);
  const { children, className, ...nativeProps } = otherProps;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classes.root, className)}
    >
      <text className={classes.label}>{children}</text>
    </view>
  );
});

MannerTempBadge.displayName = "MannerTempBadge";
