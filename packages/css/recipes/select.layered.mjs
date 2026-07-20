import './select.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectSlotNames = [
  [
    "root",
    "seed-select__root"
  ],
  [
    "value",
    "seed-select__value"
  ],
  [
    "placeholder",
    "seed-select__placeholder"
  ],
  [
    "prefixText",
    "seed-select__prefixText"
  ],
  [
    "prefixIcon",
    "seed-select__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-select__suffixIcon"
  ],
  [
    "positioner",
    "seed-select__positioner"
  ],
  [
    "content",
    "seed-select__content"
  ],
  [
    "scrollArea",
    "seed-select__scrollArea"
  ],
  [
    "group",
    "seed-select__group"
  ],
  [
    "groupLabel",
    "seed-select__groupLabel"
  ],
  [
    "item",
    "seed-select__item"
  ],
  [
    "itemBody",
    "seed-select__itemBody"
  ],
  [
    "itemLabel",
    "seed-select__itemLabel"
  ],
  [
    "itemDescription",
    "seed-select__itemDescription"
  ],
  [
    "itemIndicator",
    "seed-select__itemIndicator"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const selectVariantMap = {
  "size": [
    "large",
    "medium",
    "responsive"
  ]
};

export const selectVariantKeys = Object.keys(selectVariantMap);

export function select(props) {
  return Object.fromEntries(
    selectSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(select, { splitVariantProps: (props) => splitVariantProps(props, selectVariantMap) });

// @recipe(seed): select