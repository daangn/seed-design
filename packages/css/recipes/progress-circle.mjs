import './progress-circle.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const progressCircleSlotNames = [
  [
    "root",
    "seed-progress-circle__root"
  ],
  [
    "track",
    "seed-progress-circle__track"
  ],
  [
    "range",
    "seed-progress-circle__range"
  ]
];

const defaultVariant = {
  "tone": "neutral",
  "size": 40
};

const compoundVariants = [];

export const progressCircleVariantMap = {
  "tone": [
    "neutral",
    "brand",
    "staticWhite",
    "inherit"
  ],
  "size": [
    "24",
    "40",
    "inherit"
  ]
};

export const progressCircleVariantKeys = Object.keys(progressCircleVariantMap);

export function progressCircle(props) {
  return createSlots(progressCircleSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(progressCircle, { splitVariantProps: (props) => splitVariantProps(props, progressCircleVariantMap) });

// @recipe(seed): progress-circle