import './tag-group-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
  return Object.fromEntries(
    tagGroupItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(tagGroupItem, { splitVariantProps: (props) => splitVariantProps(props, tagGroupItemVariantMap) });

// @recipe(seed): tag-group-item

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const tagGroupItemSeedTagSpec = {
  name: "TagGroupItem",
  axes: ["size", "weight", "tone"],
  defaults: { size: "t2", weight: "regular", tone: "neutralSubtle" },
};
