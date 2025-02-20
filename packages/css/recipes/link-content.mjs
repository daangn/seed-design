import { createClassName } from "./className.mjs";
import { mergeVariants } from "./mergeVariants.mjs";
import { splitVariantProps } from "./splitVariantProps.mjs";

const linkContentSlotNames = [
  [
    "root",
    "seed-link-content__root"
  ]
];

const defaultVariant = {
  "size": "t4"
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