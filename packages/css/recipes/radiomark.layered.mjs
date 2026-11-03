import './radiomark.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(radiomarkSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(radiomark, { splitVariantProps: (props) => splitVariantProps(props, radiomarkVariantMap) });

// @recipe(seed): radiomark