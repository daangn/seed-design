import './image-frame-indicator.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const imageFrameIndicatorSlotNames = [
  [
    "root",
    "seed-image-frame-indicator__root"
  ],
  [
    "label",
    "seed-image-frame-indicator__label"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const imageFrameIndicatorVariantMap = {};

export const imageFrameIndicatorVariantKeys = Object.keys(imageFrameIndicatorVariantMap);

export function imageFrameIndicator(props) {
  return Object.fromEntries(
    imageFrameIndicatorSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(imageFrameIndicator, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIndicatorVariantMap) });

// @recipe(seed): image-frame-indicator

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const imageFrameIndicatorSeedTagSpec = {
  name: "ImageFrameIndicator",
  axes: [],
  defaults: {},
};
