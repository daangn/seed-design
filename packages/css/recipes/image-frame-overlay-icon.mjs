import './image-frame-overlay-icon.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameOverlayIconVariantMap = {};

export const imageFrameOverlayIconVariantKeys = Object.keys(imageFrameOverlayIconVariantMap);

export function imageFrameOverlayIcon(props) {
  return createClassName(
    "seed-image-frame-overlay-icon",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameOverlayIcon, { splitVariantProps: (props) => splitVariantProps(props, imageFrameOverlayIconVariantMap) });

// @recipe(seed): image-frame-overlay-icon