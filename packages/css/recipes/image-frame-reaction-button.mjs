import './image-frame-reaction-button.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const imageFrameReactionButtonSlotNames = [
  [
    "root",
    "seed-image-frame-reaction-button__root"
  ],
  [
    "fillIcon",
    "seed-image-frame-reaction-button__fillIcon"
  ],
  [
    "lineIcon",
    "seed-image-frame-reaction-button__lineIcon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameReactionButtonVariantMap = {};

export const imageFrameReactionButtonVariantKeys = Object.keys(imageFrameReactionButtonVariantMap);

export function imageFrameReactionButton(props) {
  return createSlots(imageFrameReactionButtonSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(imageFrameReactionButton, { splitVariantProps: (props) => splitVariantProps(props, imageFrameReactionButtonVariantMap) });

// @recipe(seed): image-frame-reaction-button