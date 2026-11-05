import './attachment-input-trigger.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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

const defaultVariant = {};

const compoundVariants = [];

export const attachmentInputTriggerVariantMap = {};

export const attachmentInputTriggerVariantKeys = Object.keys(attachmentInputTriggerVariantMap);

export function attachmentInputTrigger(props) {
  return Object.fromEntries(
    attachmentInputTriggerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(attachmentInputTrigger, { splitVariantProps: (props) => splitVariantProps(props, attachmentInputTriggerVariantMap) });

// @recipe(seed): attachment-input-trigger