import './switch-control.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const switchControlSlotNames = [
  [
    "root",
    "seed-switch-control__root"
  ],
  [
    "thumb",
    "seed-switch-control__thumb"
  ]
];

const defaultVariant = {
  "tone": "brand",
  "size": 32
};

const compoundVariants = [];

export const switchControlVariantMap = {
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

export const switchControlVariantKeys = Object.keys(switchControlVariantMap);

export function switchControl(props) {
  return Object.fromEntries(
    switchControlSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchControl, { splitVariantProps: (props) => splitVariantProps(props, switchControlVariantMap) });

// @recipe(seed): switch-control