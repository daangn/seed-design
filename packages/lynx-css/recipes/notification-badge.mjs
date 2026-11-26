import './notification-badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const notificationBadgeSlotNames = [
  [
    "root",
    "seed-notification-badge__root"
  ],
  [
    "label",
    "seed-notification-badge__label"
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const notificationBadgeSeedTagSpec = {
  name: "NotificationBadge",
  axes: ["size"],
  defaults: { size: "large" },
};
