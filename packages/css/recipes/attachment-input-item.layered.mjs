import './attachment-input-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const attachmentInputItemSlotNames = [
  [
    "root",
    "seed-attachment-input-item__root"
  ],
  [
    "image",
    "seed-attachment-input-item__image"
  ],
  [
    "thumbnail",
    "seed-attachment-input-item__thumbnail"
  ],
  [
    "metadata",
    "seed-attachment-input-item__metadata"
  ],
  [
    "name",
    "seed-attachment-input-item__name"
  ],
  [
    "size",
    "seed-attachment-input-item__size"
  ],
  [
    "badge",
    "seed-attachment-input-item__badge"
  ],
  [
    "backdrop",
    "seed-attachment-input-item__backdrop"
  ],
  [
    "actionButton",
    "seed-attachment-input-item__actionButton"
  ],
  [
    "removeButton",
    "seed-attachment-input-item__removeButton"
  ]
];

const defaultVariant = {
  "type": "general"
};

const compoundVariants = [];

export const attachmentInputItemVariantMap = {
  "type": [
    "general",
    "image"
  ]
};

export const attachmentInputItemVariantKeys = Object.keys(attachmentInputItemVariantMap);

export function attachmentInputItem(props) {
  return Object.fromEntries(
    attachmentInputItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(attachmentInputItem, { splitVariantProps: (props) => splitVariantProps(props, attachmentInputItemVariantMap) });

// @recipe(seed): attachment-input-item