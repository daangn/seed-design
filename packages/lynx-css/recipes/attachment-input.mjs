import './attachment-input.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const attachmentInputSlotNames = [
  [
    "root",
    "seed-attachment-input__root"
  ],
  [
    "container",
    "seed-attachment-input__container"
  ],
  [
    "containerContent",
    "seed-attachment-input__containerContent"
  ],
  [
    "itemGroup",
    "seed-attachment-input__itemGroup"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const attachmentInputVariantMap = {};

export const attachmentInputVariantKeys = Object.keys(attachmentInputVariantMap);

export function attachmentInput(props) {
  return createSlots(attachmentInputSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(attachmentInput, { splitVariantProps: (props) => splitVariantProps(props, attachmentInputVariantMap) });

// @recipe(seed): attachment-input