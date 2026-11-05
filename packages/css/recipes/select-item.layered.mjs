import './select-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectItemSlotNames = [
  [
    "root",
    "seed-select-item__root"
  ],
  [
    "prefixIcon",
    "seed-select-item__prefixIcon"
  ],
  [
    "body",
    "seed-select-item__body"
  ],
  [
    "label",
    "seed-select-item__label"
  ],
  [
    "description",
    "seed-select-item__description"
  ],
  [
    "indicator",
    "seed-select-item__indicator"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const selectItemVariantMap = {
  "size": [
    "large",
    "medium",
    "responsive"
  ]
};

export const selectItemVariantKeys = Object.keys(selectItemVariantMap);

export function selectItem(props) {
  return Object.fromEntries(
    selectItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectItem, { splitVariantProps: (props) => splitVariantProps(props, selectItemVariantMap) });

// @recipe(seed): select-item