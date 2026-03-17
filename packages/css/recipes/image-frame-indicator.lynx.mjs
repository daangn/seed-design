import './image-frame-indicator.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameIndicatorSlotNames = [
  [
    "root",
    "seed-image-frame-indicator"
  ],
  [
    "text",
    "seed-image-frame-indicator__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameIndicatorVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const imageFrameIndicatorVariantKeys = Object.keys(imageFrameIndicatorVariantMap);

export function imageFrameIndicator(props) {
  return Object.fromEntries(
    imageFrameIndicatorSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(imageFrameIndicator, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIndicatorVariantMap) });

// @recipe(seed): image-frame-indicator