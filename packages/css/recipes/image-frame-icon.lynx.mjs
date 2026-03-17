import './image-frame-icon.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameIconSlotNames = [
  [
    "root",
    "seed-image-frame-icon"
  ],
  [
    "text",
    "seed-image-frame-icon__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameIconVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const imageFrameIconVariantKeys = Object.keys(imageFrameIconVariantMap);

export function imageFrameIcon(props) {
  return Object.fromEntries(
    imageFrameIconSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(imageFrameIcon, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIconVariantMap) });

// @recipe(seed): image-frame-icon