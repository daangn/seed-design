import './image-frame.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameSlotNames = [
  [
    "root",
    "ride-image-frame__root"
  ],
  [
    "content",
    "ride-image-frame__content"
  ],
  [
    "fallback",
    "ride-image-frame__fallback"
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