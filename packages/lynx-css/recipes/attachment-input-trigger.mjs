import './attachment-input-trigger.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const attachmentInputTriggerSlotNames = [
  [
    "root",
    "seed-attachment-input-trigger__root"
  ],
  [
    "icon",
    "seed-attachment-input-trigger__icon"
  ],
  [
    "itemCountArea",
    "seed-attachment-input-trigger__itemCountArea"
  ],
  [
    "itemCount",
    "seed-attachment-input-trigger__itemCount"
  ],
  [
    "maxItemCount",
    "seed-attachment-input-trigger__maxItemCount"
  ]
];

const defaultVariant = {
  "pressed": false,
  "disabled": false
};

const compoundVariants = [];

export const attachmentInputTriggerVariantMap = {
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ]
};

export const attachmentInputTriggerVariantKeys = Object.keys(attachmentInputTriggerVariantMap);

export function attachmentInputTrigger(props) {
  return createSlots(attachmentInputTriggerSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(attachmentInputTrigger, { splitVariantProps: (props) => splitVariantProps(props, attachmentInputTriggerVariantMap) });

// @recipe(seed): attachment-input-trigger