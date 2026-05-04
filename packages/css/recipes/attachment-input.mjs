import './attachment-input.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const attachmentInputSlotNames = [
  [
    "root",
    "seed-attachment-input__root"
  ],
  [
    "dropzone",
    "seed-attachment-input__dropzone"
  ],
  [
    "dropzoneLabel",
    "seed-attachment-input__dropzoneLabel"
  ],
  [
    "container",
    "seed-attachment-input__container"
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