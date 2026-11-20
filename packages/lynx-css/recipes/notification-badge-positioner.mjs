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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const notificationBadgePositionerSeedTagSpec = {
  name: "NotificationBadgePositioner",
  axes: [],
  defaults: {},
};
