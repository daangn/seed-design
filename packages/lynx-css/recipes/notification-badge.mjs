import './notification-badge.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(notificationBadgeSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(notificationBadge, { splitVariantProps: (props) => splitVariantProps(props, notificationBadgeVariantMap) });

// @recipe(seed): notification-badge