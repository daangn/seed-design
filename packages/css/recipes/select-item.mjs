import './select-item.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const selectItemSlotNames = [
  [
    "root",
    "seed-select-item__root"
  ],
  [
    "prefixIcon",
    "seed-select-item__prefixIcon"
  ],
  [
    "body",
    "seed-select-item__body"
  ],
  [
    "label",
    "seed-select-item__label"
  ],
  [
    "description",
    "seed-select-item__description"
  ],
  [
    "indicator",
    "seed-select-item__indicator"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const selectItemVariantMap = {
  "size": [
    "large",
    "medium",
    "responsive"
  ]
};

export const selectItemVariantKeys = Object.keys(selectItemVariantMap);

export function selectItem(props) {
  return createSlots(selectItemSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(selectItem, { splitVariantProps: (props) => splitVariantProps(props, selectItemVariantMap) });

// @recipe(seed): select-item