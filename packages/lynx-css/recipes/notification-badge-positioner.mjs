import './notification-badge-positioner.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "large",
  "attach": "icon"
};

const compoundVariants = [
  {
    "size": "large",
    "attach": "icon"
  },
  {
    "size": "small",
    "attach": "icon"
  },
  {
    "size": "large",
    "attach": "text"
  },
  {
    "size": "small",
    "attach": "text"
  }
];

export const notificationBadgePositionerVariantMap = {
  "attach": [
    "icon",
    "text"
  ],
  "size": [
    "small",
    "large"
  ]
};

export const notificationBadgePositionerVariantKeys = Object.keys(notificationBadgePositionerVariantMap);

export function notificationBadgePositioner(props) {
  return createClassName(
    "seed-notification-badge-positioner",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(notificationBadgePositioner, { splitVariantProps: (props) => splitVariantProps(props, notificationBadgePositionerVariantMap) });

// @recipe(seed): notification-badge-positioner