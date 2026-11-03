import './tag-group.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const tagGroupSlotNames = [
  [
    "root",
    "seed-tag-group__root"
  ],
  [
    "separatorWrapper",
    "seed-tag-group__separatorWrapper"
  ],
  [
    "separator",
    "seed-tag-group__separator"
  ]
];

const defaultVariant = {
  "size": "t2"
};

const compoundVariants = [];

export const tagGroupVariantMap = {
  "size": [
    "t2",
    "t3",
    "t4"
  ]
};

export const tagGroupVariantKeys = Object.keys(tagGroupVariantMap);

export function tagGroup(props) {
  return createSlots(tagGroupSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(tagGroup, { splitVariantProps: (props) => splitVariantProps(props, tagGroupVariantMap) });

// @recipe(seed): tag-group