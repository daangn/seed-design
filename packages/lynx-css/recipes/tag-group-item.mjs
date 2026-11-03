import './tag-group-item.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const tagGroupItemSlotNames = [
  [
    "root",
    "seed-tag-group-item__root"
  ],
  [
    "label",
    "seed-tag-group-item__label"
  ]
];

const defaultVariant = {
  "size": "t2",
  "weight": "regular",
  "tone": "neutralSubtle"
};

const compoundVariants = [];

export const tagGroupItemVariantMap = {
  "size": [
    "t2",
    "t3",
    "t4"
  ],
  "weight": [
    "regular",
    "bold"
  ],
  "tone": [
    "neutralSubtle",
    "neutral",
    "brand"
  ]
};

export const tagGroupItemVariantKeys = Object.keys(tagGroupItemVariantMap);

export function tagGroupItem(props) {
  return createSlots(tagGroupItemSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(tagGroupItem, { splitVariantProps: (props) => splitVariantProps(props, tagGroupItemVariantMap) });

// @recipe(seed): tag-group-item