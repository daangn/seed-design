import './switch.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const switchSlotNames = [
  [
    "root",
    "seed-switch__root"
  ],
  [
    "label",
    "seed-switch__label"
  ]
];

const defaultVariant = {
  "size": 32
};

const compoundVariants = [];

export const switchVariantMap = {
  "size": [
    "16",
    "24",
    "32"
  ]
};

export const switchVariantKeys = Object.keys(switchVariantMap);

export function switchStyle(props) {
  return Object.fromEntries(
    switchSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchStyle, { splitVariantProps: (props) => splitVariantProps(props, switchVariantMap) });

// @recipe(seed): switch