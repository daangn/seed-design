import './list-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const listItemSlotNames = [
  [
    "root",
    "ride-list-item__root"
  ],
  [
    "content",
    "ride-list-item__content"
  ],
  [
    "title",
    "ride-list-item__title"
  ],
  [
    "detail",
    "ride-list-item__detail"
  ],
  [
    "prefix",
    "ride-list-item__prefix"
  ],
  [
    "suffix",
    "ride-list-item__suffix"
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