import './skeleton.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const skeletonSlotNames = [
  [
    "root",
    "seed-skeleton__root"
  ],
  [
    "shimmer",
    "seed-skeleton__shimmer"
  ]
];

const defaultVariant = {
  "radius": 8,
  "tone": "neutral"
};

const compoundVariants = [];

export const skeletonVariantMap = {
  "radius": [
    "0",
    "8",
    "16",
    "full"
  ],
  "tone": [
    "neutral",
    "magic"
  ]
};

export const skeletonVariantKeys = Object.keys(skeletonVariantMap);

export function skeleton(props) {
  return createSlots(skeletonSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(skeleton, { splitVariantProps: (props) => splitVariantProps(props, skeletonVariantMap) });

// @recipe(seed): skeleton