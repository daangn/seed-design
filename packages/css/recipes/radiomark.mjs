import './radiomark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const radiomarkSlotNames = [
  [
    "root",
    "seed-radiomark__root"
  ],
  [
    "icon",
    "seed-radiomark__icon"
  ]
];

const defaultVariant = {
  "tone": "brand",
  "size": "medium"
};

const compoundVariants = [];

export const radiomarkVariantMap = {
  "tone": [
    "neutral",
    "brand"
  ],
  "size": [
    "large",
    "medium"
  ]
};

export const radiomarkVariantKeys = Object.keys(radiomarkVariantMap);

export function radiomark(props) {
  return Object.fromEntries(
    radiomarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radiomark, { splitVariantProps: (props) => splitVariantProps(props, radiomarkVariantMap) });

// @recipe(seed): radiomark