import './tag-group-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
  return createClassName(
    "seed-tag-group-item",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(tagGroupItem, { splitVariantProps: (props) => splitVariantProps(props, tagGroupItemVariantMap) });

// @recipe(seed): tag-group-item