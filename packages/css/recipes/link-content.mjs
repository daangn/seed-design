import './link-content.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "t4",
  "weight": "regular"
};

const compoundVariants = [];

export const linkContentVariantMap = {
  "weight": [
    "bold",
    "regular"
  ],
  "size": [
    "t6",
    "t5",
    "t4"
  ]
};

export const linkContentVariantKeys = Object.keys(linkContentVariantMap);

export function linkContent(props) {
  return createClassName(
    "seed-link-content",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(linkContent, { splitVariantProps: (props) => splitVariantProps(props, linkContentVariantMap) });

// @recipe(seed): link-content