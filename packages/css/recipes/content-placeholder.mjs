import './content-placeholder.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contentPlaceholderSlotNames = [
  [
    "root",
    "ride-content-placeholder__root"
  ],
  [
    "asset",
    "ride-content-placeholder__asset"
  ]
];

const defaultVariant = {
  "type": "default"
};

const compoundVariants = [];

export const contentPlaceholderVariantMap = {
  "type": [
    "default",
    "buySell",
    "car",
    "commerce",
    "coupon",
    "food",
    "group",
    "image",
    "jobs",
    "business",
    "post",
    "realty"
  ]
};

export const contentPlaceholderVariantKeys = Object.keys(contentPlaceholderVariantMap);

export function contentPlaceholder(props) {
  return Object.fromEntries(
    contentPlaceholderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(contentPlaceholder, { splitVariantProps: (props) => splitVariantProps(props, contentPlaceholderVariantMap) });

// @recipe(seed): content-placeholder