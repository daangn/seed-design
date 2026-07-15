import './next-list-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const nextListItemSlotNames = [
  [
    "root",
    "seed-next-list-item__root"
  ],
  [
    "layout",
    "seed-next-list-item__layout"
  ],
  [
    "content",
    "seed-next-list-item__content"
  ],
  [
    "title",
    "seed-next-list-item__title"
  ],
  [
    "detail",
    "seed-next-list-item__detail"
  ],
  [
    "prefix",
    "seed-next-list-item__prefix"
  ],
  [
    "suffix",
    "seed-next-list-item__suffix"
  ]
];

const defaultVariant = {
  "highlighted": false
};

const compoundVariants = [];

export const nextListItemVariantMap = {
  "highlighted": [
    false,
    true
  ]
};

export const nextListItemVariantKeys = Object.keys(nextListItemVariantMap);

export function nextListItem(props) {
  return Object.fromEntries(
    nextListItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(nextListItem, { splitVariantProps: (props) => splitVariantProps(props, nextListItemVariantMap) });

// @recipe(seed): next-list-item