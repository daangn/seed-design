import './image-frame-reaction-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameReactionButtonVariantMap = {};

export const imageFrameReactionButtonVariantKeys = Object.keys(imageFrameReactionButtonVariantMap);

export function imageFrameReactionButton(props) {
  return createClassName(
    "seed-image-frame-reaction-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameReactionButton, { splitVariantProps: (props) => splitVariantProps(props, imageFrameReactionButtonVariantMap) });

// @recipe(seed): image-frame-reaction-button