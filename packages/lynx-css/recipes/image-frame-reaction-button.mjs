import './image-frame-reaction-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const imageFrameReactionButtonSeedTagSpec = {
  name: "ImageFrameReactionButton",
  axes: [],
  defaults: {},
};
