import './image-frame-reaction-button.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameReactionButtonSlotNames = [
  [
    "root",
    "seed-image-frame-reaction-button"
  ],
  [
    "text",
    "seed-image-frame-reaction-button__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameReactionButtonVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const imageFrameReactionButtonVariantKeys = Object.keys(imageFrameReactionButtonVariantMap);

export function imageFrameReactionButton(props) {
  return Object.fromEntries(
    imageFrameReactionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(imageFrameReactionButton, { splitVariantProps: (props) => splitVariantProps(props, imageFrameReactionButtonVariantMap) });

// @recipe(seed): image-frame-reaction-button