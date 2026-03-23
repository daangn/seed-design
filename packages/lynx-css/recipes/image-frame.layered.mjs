import './image-frame.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameSlotNames = [
  [
    "root",
    "seed-image-frame"
  ],
  [
    "text",
    "seed-image-frame__text"
  ]
];

const defaultVariant = {
  "stroke": false,
  "rounded": false
};

const compoundVariants = [];

export const imageFrameVariantMap = {
  "stroke": [
    true,
    false
  ],
  "rounded": [
    true,
    false
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const imageFrameVariantKeys = Object.keys(imageFrameVariantMap);

export function imageFrame(props) {
  return Object.fromEntries(
    imageFrameSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(imageFrame, { splitVariantProps: (props) => splitVariantProps(props, imageFrameVariantMap) });

// @recipe(seed): image-frame