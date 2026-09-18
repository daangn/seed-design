import './select-trigger.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectTriggerSlotNames = [
  [
    "root",
    "seed-select-trigger__root"
  ],
  [
    "scaleContent",
    "seed-select-trigger__scaleContent"
  ],
  [
    "pressedOverlay",
    "seed-select-trigger__pressedOverlay"
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
  "size": "large",
  "disabled": false,
  "readOnly": false,
  "invalid": false,
  "open": false,
  "pressed": false
};

const compoundVariants = [
  {
    "disabled": false,
    "readOnly": false
  },
  {
    "pressed": true,
    "disabled": false,
    "readOnly": false
  }
];

export const selectTriggerVariantMap = {
  "size": [
    "large",
    "medium"
  ],
  "disabled": [
    true,
    false
  ],
  "readOnly": [
    true,
    false
  ],
  "invalid": [
    true,
    false
  ],
  "open": [
    true,
    false
  ],
  "pressed": [
    true,
    false
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