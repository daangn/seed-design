import {
  notificationBadge,
  type NotificationBadgeVariantProps,
} from "@seed-design/lynx-css/recipes/notification-badge";
import {
  notificationBadgePositioner,
  type NotificationBadgePositionerVariantProps,
} from "@seed-design/lynx-css/recipes/notification-badge-positioner";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxViewRef,
} from "../../types";

const NotificationBadgeContext = React.createContext<NotificationBadgeVariantProps | null>(null);

/**
 * @platform Lynx
 *
 * 웹 Notification Badge와 동일한 `size` variant를 제공하며, Lynx native `<view>`와
 * `<text>`를 직접 렌더링합니다. `NotificationBadgePositioner` 안에서는 Positioner의 `size`를
 * 기본값으로 사용하고, Badge에 직접 전달한 `size`가 이를 덮어씁니다.
 */
export interface NotificationBadgeProps
  extends NotificationBadgeVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const NotificationBadge = React.forwardRef<unknown, NotificationBadgeProps>(
  (innerProps, ref) => {
    const contextProps = React.useContext(NotificationBadgeContext);
    const props = { ...contextProps, ...innerProps };
    const [variantProps, otherProps] = notificationBadge.splitVariantProps(props);
    const classes = notificationBadge(variantProps);
    const { children, className, ...nativeProps } = otherProps;

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.root, className)}
      >
        <text className={classes.label} text-single-line-vertical-align="center">
          {children}
        </text>
      </view>
    );
  },
);

NotificationBadge.displayName = "NotificationBadge";

export interface NotificationBadgePositionerProps
  extends NotificationBadgePositionerVariantProps,
    LynxStyledElementProps {}

export const NotificationBadgePositioner = React.forwardRef<
  unknown,
  NotificationBadgePositionerProps
>((props, ref) => {
  const [variantProps, otherProps] = notificationBadgePositioner.splitVariantProps(props);
  const { children, className, ...nativeProps } = otherProps;
  const contextValue = React.useMemo(() => ({ size: variantProps.size }), [variantProps.size]);

  return (
    <NotificationBadgeContext.Provider value={contextValue}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(notificationBadgePositioner(variantProps), className)}
      >
        {children}
      </view>
    </NotificationBadgeContext.Provider>
  );
});

NotificationBadgePositioner.displayName = "NotificationBadgePositioner";
