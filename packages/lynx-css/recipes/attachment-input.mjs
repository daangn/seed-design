import './attachment-input.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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

const defaultVariant = {
  "extendSafeAreaX": false
};

const compoundVariants = [];

export const attachmentInputVariantMap = {
  "extendSafeAreaX": [
    true,
    false
  ]
};

export const attachmentInputVariantKeys = Object.keys(attachmentInputVariantMap);

export function attachmentInput(props) {
  return Object.fromEntries(
    attachmentInputSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(attachmentInput, { splitVariantProps: (props) => splitVariantProps(props, attachmentInputVariantMap) });

// @recipe(seed): attachment-input

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const attachmentInputSeedTagSpec = {
  name: "AttachmentInput",
  axes: [],
  defaults: {},
};
