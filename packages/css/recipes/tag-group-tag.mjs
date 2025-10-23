import './tag-group-tag.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "t2",
  "weight": "regular",
  "tone": "neutralSubtle"
};

const compoundVariants = [];

export const tagGroupTagVariantMap = {
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

export const tagGroupTagVariantKeys = Object.keys(tagGroupTagVariantMap);

export function tagGroupTag(props) {
  return createClassName(
    "seed-tag-group-tag",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(tagGroupTag, { splitVariantProps: (props) => splitVariantProps(props, tagGroupTagVariantMap) });

// @recipe(seed): tag-group-tag