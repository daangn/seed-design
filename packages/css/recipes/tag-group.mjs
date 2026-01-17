import './tag-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const tagGroupSlotNames = [
  [
    "root",
    "seed-tag-group__root"
  ],
  [
    "separator",
    "seed-tag-group__separator"
  ]
];

const defaultVariant = {
  "size": "t2",
  "inline": false
};

const compoundVariants = [];

export const tagGroupVariantMap = {
  "size": [
    "t2",
    "t3",
    "t4"
  ],
  "inline": [
    true,
    false
  ]
};

export const tagGroupVariantKeys = Object.keys(tagGroupVariantMap);

export function tagGroup(props) {
  return Object.fromEntries(
    tagGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(tagGroup, { splitVariantProps: (props) => splitVariantProps(props, tagGroupVariantMap) });

// @recipe(seed): tag-group