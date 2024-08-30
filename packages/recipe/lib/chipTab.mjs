import { createClassName } from "./className.mjs";

const chipTabSlotNames = [
  [
    "root",
    "chipTab__root"
  ],
  [
    "label",
    "chipTab__label"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const chipTabVariantMap = {};

export const chipTabVariantKeys = Object.keys(chipTabVariantMap);

export function chipTab(props) {
  return Object.fromEntries(
    chipTabSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}