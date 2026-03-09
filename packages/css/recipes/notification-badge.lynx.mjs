import './notification-badge.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const notificationBadgeSlotNames = [
  [
    "root",
    "seed-notification-badge"
  ],
  [
    "text",
    "seed-notification-badge__text"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const notificationBadgeVariantMap = {
  "size": [
    "small",
    "large"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const notificationBadgeVariantKeys = Object.keys(notificationBadgeVariantMap);

export function notificationBadge(props) {
  return Object.fromEntries(
    notificationBadgeSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(notificationBadge, { splitVariantProps: (props) => splitVariantProps(props, notificationBadgeVariantMap) });

// @recipe(seed): notification-badge