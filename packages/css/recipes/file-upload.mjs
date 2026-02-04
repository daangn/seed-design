import './file-upload.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fileUploadSlotNames = [
  [
    "root",
    "seed-file-upload__root"
  ],
  [
    "dropzone",
    "seed-file-upload__dropzone"
  ],
  [
    "container",
    "seed-file-upload__container"
  ],
  [
    "trigger",
    "seed-file-upload__trigger"
  ],
  [
    "itemGroup",
    "seed-file-upload__itemGroup"
  ],
  [
    "item",
    "seed-file-upload__item"
  ],
  [
    "itemPreview",
    "seed-file-upload__itemPreview"
  ],
  [
    "itemImage",
    "seed-file-upload__itemImage"
  ],
  [
    "itemName",
    "seed-file-upload__itemName"
  ],
  [
    "itemSize",
    "seed-file-upload__itemSize"
  ],
  [
    "itemDeleteTrigger",
    "seed-file-upload__itemDeleteTrigger"
  ],
  [
    "clearTrigger",
    "seed-file-upload__clearTrigger"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const fileUploadVariantMap = {};

export const fileUploadVariantKeys = Object.keys(fileUploadVariantMap);

export function fileUpload(props) {
  return Object.fromEntries(
    fileUploadSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fileUpload, { splitVariantProps: (props) => splitVariantProps(props, fileUploadVariantMap) });

// @recipe(seed): file-upload