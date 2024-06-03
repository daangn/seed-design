import { createClassName } from "./className.mjs";

const checkboxSlotNames = [
  [
    "root",
    "checkbox__root"
  ],
  [
    "control",
    "checkbox__control"
  ],
  [
    "icon",
    "checkbox__icon"
  ],
  [
    "label",
    "checkbox__label"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const checkboxVariantMap = {
  "size": [
    "large",
    "medium",
    "small"
  ]
};

export const checkboxVariantKeys = Object.keys(checkboxVariantMap);

export function checkbox(props) {
  return Object.fromEntries(
    checkboxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}