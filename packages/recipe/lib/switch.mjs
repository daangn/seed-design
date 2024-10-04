import { createClassName } from "./className.mjs";

const switchSlotNames = [
  [
    "root",
    "switch__root"
  ],
  [
    "control",
    "switch__control"
  ],
  [
    "thumb",
    "switch__thumb"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const switchVariantMap = {
  "size": [
    "medium",
    "small"
  ]
};

export const switchVariantKeys = Object.keys(switchVariantMap);

export function switchStyle(props) {
  return Object.fromEntries(
    switchSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}