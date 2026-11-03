import './switch.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  "size": 32,
  "disabled": false
};

const compoundVariants = [];

export const switchVariantMap = {
  "size": [
    "16",
    "24",
    "32"
  ],
  "disabled": [
    true,
    false
  ]
};

export const switchVariantKeys = Object.keys(switchVariantMap);

export function switchStyle(props) {
  return createSlots(switchSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(switchStyle, { splitVariantProps: (props) => splitVariantProps(props, switchVariantMap) });

// @recipe(seed): switch