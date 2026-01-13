import './image-frame-overlay-indicator.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameOverlayIndicatorVariantMap = {};

export const imageFrameOverlayIndicatorVariantKeys = Object.keys(imageFrameOverlayIndicatorVariantMap);

export function imageFrameOverlayIndicator(props) {
  return createClassName(
    "seed-image-frame-overlay-indicator",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameOverlayIndicator, { splitVariantProps: (props) => splitVariantProps(props, imageFrameOverlayIndicatorVariantMap) });

// @recipe(seed): image-frame-overlay-indicator