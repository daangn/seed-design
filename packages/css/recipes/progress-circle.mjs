import './progress-circle.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const progressCircleSlotNames = [
  [
    "root",
    "ride-progress-circle__root"
  ],
  [
    "track",
    "ride-progress-circle__track"
  ],
  [
    "range",
    "ride-progress-circle__range"
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
  return Object.fromEntries(
    progressCircleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(progressCircle, { splitVariantProps: (props) => splitVariantProps(props, progressCircleVariantMap) });

// @recipe(seed): progress-circle