import './layout.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const layoutSlotNames = [
  [
    "root",
    "seed-layout__root"
  ],
  [
    "content",
    "seed-layout__content"
  ]
];

const defaultVariant = {
  "density": "medium"
};

const compoundVariants = [];

export const layoutVariantMap = {
  "density": [
    "low",
    "medium",
    "high"
  ]
};

export const layoutVariantKeys = Object.keys(layoutVariantMap);

export function layout(props) {
  return createSlots(layoutSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(layout, { splitVariantProps: (props) => splitVariantProps(props, layoutVariantMap) });

// @recipe(seed): layout