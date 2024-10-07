import { createClassName } from "./className.mjs";

const expandButtonSlotNames = [
  [
    "root",
    "expandButton__root"
  ],
  [
    "label",
    "expandButton__label"
  ],
  [
    "suffixIcon",
    "expandButton__suffixIcon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const expandButtonVariantMap = {};

export const expandButtonVariantKeys = Object.keys(expandButtonVariantMap);

export function expandButton(props) {
  return Object.fromEntries(
    expandButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}