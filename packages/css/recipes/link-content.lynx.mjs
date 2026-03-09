import './link-content.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const linkContentSlotNames = [
  [
    "root",
    "seed-link-content"
  ],
  [
    "text",
    "seed-link-content__text"
  ]
];

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
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const linkContentVariantKeys = Object.keys(linkContentVariantMap);

export function linkContent(props) {
  return Object.fromEntries(
    linkContentSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(linkContent, { splitVariantProps: (props) => splitVariantProps(props, linkContentVariantMap) });

// @recipe(seed): link-content