import './image-frame-overlay-positioner.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "position": "top-left"
};

const compoundVariants = [];

export const imageFrameOverlayPositionerVariantMap = {
  "position": [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ]
};

export const imageFrameOverlayPositionerVariantKeys = Object.keys(imageFrameOverlayPositionerVariantMap);

export function imageFrameOverlayPositioner(props) {
  return createClassName(
    "seed-image-frame-overlay-positioner",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameOverlayPositioner, { splitVariantProps: (props) => splitVariantProps(props, imageFrameOverlayPositionerVariantMap) });

// @recipe(seed): image-frame-overlay-positioner