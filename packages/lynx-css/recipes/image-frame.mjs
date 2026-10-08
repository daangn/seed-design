import './image-frame.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameSlotNames = [
  [
    "root",
    "seed-image-frame__root"
  ],
  [
    "content",
    "seed-image-frame__content"
  ],
  [
    "fallback",
    "seed-image-frame__fallback"
  ],
  [
    "stroke",
    "seed-image-frame__stroke"
  ],
  [
    "floater",
    "seed-image-frame__floater"
  ]
];

const defaultVariant = {
  "stroke": false,
  "loaded": false,
  "placement": "bottom-end"
};

const compoundVariants = [];

export const imageFrameVariantMap = {
  "stroke": [
    true,
    false
  ],
  "loaded": [
    true,
    false
  ],
  "placement": [
    "top-start",
    "top-center",
    "top-end",
    "middle-start",
    "middle-center",
    "middle-end",
    "bottom-start",
    "bottom-center",
    "bottom-end"
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