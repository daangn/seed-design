import './image-frame-indicator.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameIndicatorVariantMap = {};

export const imageFrameIndicatorVariantKeys = Object.keys(imageFrameIndicatorVariantMap);

export function imageFrameIndicator(props) {
  return createClassName(
    "seed-image-frame-indicator",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameIndicator, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIndicatorVariantMap) });

// @recipe(seed): image-frame-indicator