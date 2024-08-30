import { createClassName } from "./className.mjs";

const tabSlotNames = [
  [
    "root",
    "tab__root"
  ],
  [
    "label",
    "tab__label"
  ],
  [
    "notification",
    "tab__notification"
  ]
];

const defaultVariant = {
  "size": "medium",
  "layout": "hug"
};

const compoundVariants = [];

export const tabVariantMap = {
  "layout": [
    "fill",
    "hug"
  ],
  "size": [
    "medium",
    "small"
  ]
};

export const tabVariantKeys = Object.keys(tabVariantMap);

export function tab(props) {
  return Object.fromEntries(
    tabSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}