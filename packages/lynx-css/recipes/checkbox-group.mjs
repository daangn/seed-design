import './checkbox-group.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const checkboxGroupSlotNames = [
  [
    "root",
    "seed-checkbox-group__root"
  ],
  [
    "text",
    "seed-checkbox-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const checkboxGroupVariantMap = {};

export const checkboxGroupVariantKeys = Object.keys(checkboxGroupVariantMap);

export function checkboxGroup(props) {
  return createSlots(checkboxGroupSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(checkboxGroup, { splitVariantProps: (props) => splitVariantProps(props, checkboxGroupVariantMap) });

// @recipe(seed): checkbox-group