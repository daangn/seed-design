import { badge, type BadgeVariantProps } from "@seed-design/lynx-css/recipes/badge";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxStyledElementProps, LynxViewRef } from "../../types";

/**
 * @platform Lynx
 *
 * 웹 Badge와 동일한 variant surface를 제공하지만, Lynx native `<view>` / `<text>`를
 * 직접 렌더링합니다. Badge는 정적 정보 표시 컴포넌트이므로 press/tap API를 별도
 * 소유하지 않습니다.
 */
export interface BadgeProps extends BadgeVariantProps, LynxStyledElementProps {}

export const Badge = React.forwardRef<unknown, BadgeProps>((props, ref) => {
  const [variantProps, otherProps] = badge.splitVariantProps(props);
  const classes = badge(variantProps);
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

Badge.displayName = "Badge";
