import './file-upload-trigger.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fileUploadTriggerSlotNames = [
  [
    "root",
    "seed-file-upload-trigger__root"
  ],
  [
    "icon",
    "seed-file-upload-trigger__icon"
  ],
  [
    "itemCountArea",
    "seed-file-upload-trigger__itemCountArea"
  ],
  [
    "itemCount",
    "seed-file-upload-trigger__itemCount"
  ],
  [
    "maxItemCount",
    "seed-file-upload-trigger__maxItemCount"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const fileUploadTriggerVariantMap = {};

export const fileUploadTriggerVariantKeys = Object.keys(fileUploadTriggerVariantMap);

export function fileUploadTrigger(props) {
  return Object.fromEntries(
    fileUploadTriggerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fileUploadTrigger, { splitVariantProps: (props) => splitVariantProps(props, fileUploadTriggerVariantMap) });

// @recipe(seed): file-upload-trigger