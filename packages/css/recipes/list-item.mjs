import './list-item.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const listItemSlotNames = [
  [
    "root",
    "seed-list-item__root"
  ],
  [
    "content",
    "seed-list-item__content"
  ],
  [
    "title",
    "seed-list-item__title"
  ],
  [
    "detail",
    "seed-list-item__detail"
  ],
  [
    "prefix",
    "seed-list-item__prefix"
  ],
  [
    "suffix",
    "seed-list-item__suffix"
  ]
];

const defaultVariant = {
  "highlighted": false
};

const compoundVariants = [];

export const listItemVariantMap = {
  "highlighted": [
    false,
    true
  ]
};

export const listItemVariantKeys = Object.keys(listItemVariantMap);

export function listItem(props) {
  return createSlots(listItemSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(listItem, { splitVariantProps: (props) => splitVariantProps(props, listItemVariantMap) });

// @recipe(seed): list-item