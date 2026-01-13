import './image-frame-overlay-reaction-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameOverlayReactionButtonVariantMap = {};

export const imageFrameOverlayReactionButtonVariantKeys = Object.keys(imageFrameOverlayReactionButtonVariantMap);

export function imageFrameOverlayReactionButton(props) {
  return createClassName(
    "seed-image-frame-overlay-reaction-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameOverlayReactionButton, { splitVariantProps: (props) => splitVariantProps(props, imageFrameOverlayReactionButtonVariantMap) });

// @recipe(seed): image-frame-overlay-reaction-button