import './file-upload-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fileUploadItemSlotNames = [
  [
    "root",
    "seed-file-upload-item__root"
  ],
  [
    "image",
    "seed-file-upload-item__image"
  ],
  [
    "thumbnail",
    "seed-file-upload-item__thumbnail"
  ],
  [
    "metadata",
    "seed-file-upload-item__metadata"
  ],
  [
    "name",
    "seed-file-upload-item__name"
  ],
  [
    "size",
    "seed-file-upload-item__size"
  ],
  [
    "backdrop",
    "seed-file-upload-item__backdrop"
  ],
  [
    "actionButton",
    "seed-file-upload-item__actionButton"
  ],
  [
    "removeButton",
    "seed-file-upload-item__removeButton"
  ]
];

const defaultVariant = {
  "type": "general"
};

const compoundVariants = [];

export const fileUploadItemVariantMap = {
  "type": [
    "general",
    "image"
  ]
};

export const fileUploadItemVariantKeys = Object.keys(fileUploadItemVariantMap);

export function fileUploadItem(props) {
  return Object.fromEntries(
    fileUploadItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fileUploadItem, { splitVariantProps: (props) => splitVariantProps(props, fileUploadItemVariantMap) });

// @recipe(seed): file-upload-item