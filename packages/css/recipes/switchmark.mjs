import './switchmark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const switchmarkSlotNames = [
  [
    "root",
    "seed-switchmark__root"
  ],
  [
    "thumb",
    "seed-switchmark__thumb"
  ]
];

const defaultVariant = {
  "tone": "brand",
  "size": 32
};

const compoundVariants = [];

export const switchmarkVariantMap = {
  "tone": [
    "neutral",
    "brand"
  ],
  "size": [
    "16",
    "24",
    "32"
  ]
};

export const switchmarkVariantKeys = Object.keys(switchmarkVariantMap);

export function switchmark(props) {
  return Object.fromEntries(
    switchmarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchmark, { splitVariantProps: (props) => splitVariantProps(props, switchmarkVariantMap) });

// @recipe(seed): switchmark