import './content-placeholder.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contentPlaceholderSlotNames = [
  [
    "root",
    "seed-content-placeholder__root"
  ],
  [
    "container",
    "seed-content-placeholder__container"
  ],
  [
    "image",
    "seed-content-placeholder__image"
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