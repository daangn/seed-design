import './radio-group.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const radioGroupSlotNames = [
  [
    "root",
    "seed-radio-group__root"
  ],
  [
    "text",
    "seed-radio-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const radioGroupVariantMap = {};

export const radioGroupVariantKeys = Object.keys(radioGroupVariantMap);

export function radioGroup(props) {
  return createSlots(radioGroupSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(radioGroup, { splitVariantProps: (props) => splitVariantProps(props, radioGroupVariantMap) });

// @recipe(seed): radio-group