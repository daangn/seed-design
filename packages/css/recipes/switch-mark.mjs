import './switch-mark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const switchMarkSlotNames = [
  [
    "root",
    "seed-switch-mark__root"
  ],
  [
    "thumb",
    "seed-switch-mark__thumb"
  ]
];

const defaultVariant = {
  "tone": "brand",
  "size": 32
};

const compoundVariants = [];

export const switchMarkVariantMap = {
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

export const switchMarkVariantKeys = Object.keys(switchMarkVariantMap);

export function switchMark(props) {
  return Object.fromEntries(
    switchMarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchMark, { splitVariantProps: (props) => splitVariantProps(props, switchMarkVariantMap) });

// @recipe(seed): switch-mark