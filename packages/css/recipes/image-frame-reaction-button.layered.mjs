import './image-frame-reaction-button.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameReactionButtonSlotNames = [
  [
    "root",
    "ride-image-frame-reaction-button__root"
  ],
  [
    "fillIcon",
    "ride-image-frame-reaction-button__fillIcon"
  ],
  [
    "lineIcon",
    "ride-image-frame-reaction-button__lineIcon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameReactionButtonVariantMap = {};

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