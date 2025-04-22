import './notification-badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const notificationBadgeVariantMap = {
  "size": [
    "small",
    "large"
  ]
};

export const notificationBadgeVariantKeys = Object.keys(notificationBadgeVariantMap);

export function notificationBadge(props) {
  return createClassName(
    "seed-notification-badge",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(notificationBadge, { splitVariantProps: (props) => splitVariantProps(props, notificationBadgeVariantMap) });

// @recipe(seed): notification-badge