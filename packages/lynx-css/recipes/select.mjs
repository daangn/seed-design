import './select.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectSlotNames = [
  [
    "positioner",
    "seed-select__positioner"
  ],
  [
    "backdrop",
    "seed-select__backdrop"
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
    "scrollContent",
    "seed-select__scrollContent"
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
    "separator",
    "seed-select__separator"
  ]
];

const defaultVariant = {
  "size": "large",
  "open": false,
  "positioned": false
};

const compoundVariants = [
  {
    "positioned": false
  }
];

export const selectVariantMap = {
  "size": [
    "large",
    "medium"
  ],
  "open": [
    true,
    false
  ],
  "positioned": [
    true,
    false
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