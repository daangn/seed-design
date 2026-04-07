import './image-frame-icon.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameIconVariantMap = {};

export const imageFrameIconVariantKeys = Object.keys(imageFrameIconVariantMap);

export function imageFrameIcon(props) {
  return createClassName(
    "ride-image-frame-icon",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameIcon, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIconVariantMap) });

// @recipe(seed): image-frame-icon