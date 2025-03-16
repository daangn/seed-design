import {
  notificationBadge,
  type NotificationBadgeVariantProps,
} from "@seed-design/css/recipes/notification-badge";
import {
  notificationBadgePositioner,
  type NotificationBadgePositionerVariantProps,
} from "@seed-design/css/recipes/notification-badge-positioner";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { useMemo } from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withProvider, PropsProvider } = createRecipeContext(notificationBadge);

////////////////////////////////////////////////////////////////////////////////////

export interface NotificationBadgeProps
  extends NotificationBadgeVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NotificationBadge = withProvider<HTMLSpanElement, NotificationBadgeProps>(
  Primitive.span,
);

////////////////////////////////////////////////////////////////////////////////////

export interface NotificationBadgePositionerProps
  extends NotificationBadgePositionerVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NotificationBadgePositioner = React.forwardRef<
  HTMLSpanElement,
  NotificationBadgePositionerProps
>((props, ref) => {
  const { attach, size, className, ...otherProps } = props;
  const positionerClassName = notificationBadgePositioner({ attach, size });

  return (
    <PropsProvider value={useMemo(() => ({ size }), [size])}>
      <Primitive.span ref={ref} className={clsx(positionerClassName, className)} {...otherProps} />
    </PropsProvider>
  );
});
