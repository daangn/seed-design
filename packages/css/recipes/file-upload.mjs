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
    "dropzoneLabel",
    "seed-file-upload__dropzoneLabel"
  ],
  [
    "container",
    "seed-file-upload__container"
  ],
  [
    "itemGroup",
    "seed-file-upload__itemGroup"
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