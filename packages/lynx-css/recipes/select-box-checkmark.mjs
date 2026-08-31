import './select-box-checkmark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxCheckmarkSlotNames = [
  [
    "root",
    "seed-select-box-checkmark__root"
  ],
  [
    "icon",
    "seed-select-box-checkmark__icon"
  ]
];

const defaultVariant = {
  "selected": false,
  "pressed": false,
  "disabled": false
};

const compoundVariants = [];

export const selectBoxCheckmarkVariantMap = {
  "selected": [
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

export const selectBoxCheckmarkVariantKeys = Object.keys(selectBoxCheckmarkVariantMap);

export function selectBoxCheckmark(props) {
  return Object.fromEntries(
    selectBoxCheckmarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBoxCheckmark, { splitVariantProps: (props) => splitVariantProps(props, selectBoxCheckmarkVariantMap) });

// @recipe(seed): select-box-checkmark