import './list-item.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const listItemSlotNames = [
  [
    "root",
    "seed-list-item__root"
  ],
  [
    "highlightedOverlay",
    "seed-list-item__highlightedOverlay"
  ],
  [
    "pressedOverlay",
    "seed-list-item__pressedOverlay"
  ],
  [
    "layout",
    "seed-list-item__layout"
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
  ],
  [
    "prefixIcon",
    "seed-list-item__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-list-item__suffixIcon"
  ]
];

const defaultVariant = {
  "interactive": false,
  "highlighted": false,
  "pressed": false,
  "disabled": false
};

const compoundVariants = [
  {
    "interactive": true,
    "disabled": false
  }
];

export const listItemVariantMap = {
  "interactive": [
    true,
    false
  ],
  "highlighted": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ]
};

export const listItemVariantKeys = Object.keys(listItemVariantMap);

export function listItem(props) {
  return createSlots(listItemSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(listItem, { splitVariantProps: (props) => splitVariantProps(props, listItemVariantMap) });

// @recipe(seed): list-item