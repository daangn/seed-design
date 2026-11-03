import './image-frame-indicator.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(imageFrameIndicatorSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(imageFrameIndicator, { splitVariantProps: (props) => splitVariantProps(props, imageFrameIndicatorVariantMap) });

// @recipe(seed): image-frame-indicator