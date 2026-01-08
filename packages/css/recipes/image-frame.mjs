import './image-frame.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "rounded": false,
  "stroke": false
};

const compoundVariants = [];

export const imageFrameVariantMap = {
  "rounded": [
    true,
    false
  ],
  "stroke": [
    true,
    false
  ]
};

export const imageFrameVariantKeys = Object.keys(imageFrameVariantMap);

export function imageFrame(props) {
  return createClassName(
    "seed-image-frame",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrame, { splitVariantProps: (props) => splitVariantProps(props, imageFrameVariantMap) });

// @recipe(seed): image-frame