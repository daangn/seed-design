import './select-trigger.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectTriggerSlotNames = [
  [
    "root",
    "seed-select-trigger__root"
  ],
  [
    "value",
    "seed-select-trigger__value"
  ],
  [
    "placeholder",
    "seed-select-trigger__placeholder"
  ],
  [
    "prefixIcon",
    "seed-select-trigger__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-select-trigger__suffixIcon"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const selectTriggerVariantMap = {
  "size": [
    "large",
    "medium",
    "responsive"
  ]
};

export const selectTriggerVariantKeys = Object.keys(selectTriggerVariantMap);

export function selectTrigger(props) {
  return Object.fromEntries(
    selectTriggerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectTrigger, { splitVariantProps: (props) => splitVariantProps(props, selectTriggerVariantMap) });

// @recipe(seed): select-trigger