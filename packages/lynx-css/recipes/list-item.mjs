import './list-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const listItemSlotNames = [
  [
    "interactionRoot",
    "seed-list-item__interactionRoot"
  ],
  [
    "root",
    "seed-list-item__root"
  ],
  [
    "highlightedOverlay",
    "seed-list-item__highlightedOverlay"
  ],
  [
    "pressedOverlay",
    "seed-list-item__pressedOverlay"
  ],
  [
    "layout",
    "seed-list-item__layout"
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
  ],
  [
    "prefixIcon",
    "seed-list-item__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-list-item__suffixIcon"
  ]
];

const defaultVariant = {
  "highlighted": false,
  "pressed": false,
  "disabled": false
};

const compoundVariants = [];

export const listItemVariantMap = {
  "highlighted": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
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