import './list-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const listItemSlotNames = [
  [
    "root",
    "seed-list-item__root"
  ],
  [
    "content",
    "seed-list-item__content"
  ],
  [
    "title",
    "seed-list-item__title"
  ],
  [
    "detail",
    "seed-list-item__detail"
  ],
  [
    "prefix",
    "seed-list-item__prefix"
  ],
  [
    "suffix",
    "seed-list-item__suffix"
  ]
];

const defaultVariant = {
  "highlighted": false
};

const compoundVariants = [];

export const listItemVariantMap = {
  "highlighted": [
    false,
    true
  ]
};

export const listItemVariantKeys = Object.keys(listItemVariantMap);

export function listItem(props) {
  return Object.fromEntries(
    listItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(listItem, { splitVariantProps: (props) => splitVariantProps(props, listItemVariantMap) });

// @recipe(seed): list-item