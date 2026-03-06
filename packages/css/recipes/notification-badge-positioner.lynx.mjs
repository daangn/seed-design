import './notification-badge-positioner.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const notificationBadgePositionerSlotNames = [
  [
    "root",
    "seed-notification-badge-positioner"
  ],
  [
    "text",
    "seed-notification-badge-positioner__text"
  ]
];

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
  return Object.fromEntries(
    notificationBadgePositionerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(notificationBadgePositioner, { splitVariantProps: (props) => splitVariantProps(props, notificationBadgePositionerVariantMap) });

// @recipe(seed): notification-badge-positioner