import './image-frame-icon.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameIconVariantMap = {};

export const imageFrameIconVariantKeys = Object.keys(imageFrameIconVariantMap);

export function imageFrameIcon(props) {
  return createClassName(
    "seed-image-frame-icon",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(imageFrameIcon, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIconVariantMap) });

// @recipe(seed): image-frame-icon

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const imageFrameIconSeedTagSpec = {
  name: "ImageFrameIcon",
  axes: [],
  defaults: {},
};
