import { createClassName } from "./className.mjs";

const chipSlotNames = [
  [
    "root",
    "chip__root"
  ],
  [
    "label",
    "chip__label"
  ],
  [
    "prefix",
    "chip__prefix"
  ],
  [
    "suffix",
    "chip__suffix"
  ],
  [
    "count",
    "chip__count"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const chipVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "variant": [
    "default",
    "inverted"
  ]
};

export const chipVariantKeys = Object.keys(chipVariantMap);

export function chip(props) {
  return Object.fromEntries(
    chipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}