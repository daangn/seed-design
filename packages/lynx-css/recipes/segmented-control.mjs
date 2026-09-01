import './segmented-control.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const segmentedControlSlotNames = [
  [
    "root",
    "seed-segmented-control__root"
  ],
  [
    "indicator",
    "seed-segmented-control__indicator"
  ],
  [
    "item",
    "seed-segmented-control__item"
  ],
  [
    "itemBackground",
    "seed-segmented-control__itemBackground"
  ],
  [
    "label",
    "seed-segmented-control__label"
  ]
];

const defaultVariant = {
  "selected": false,
  "disabled": false,
  "pressed": false,
  "hasSelection": true
};

const compoundVariants = [
  {
    "selected": true,
    "disabled": true
  }
];

export const segmentedControlVariantMap = {
  "selected": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "hasSelection": [
    true,
    false
  ]
};

export const segmentedControlVariantKeys = Object.keys(segmentedControlVariantMap);

export function segmentedControl(props) {
  return Object.fromEntries(
    segmentedControlSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(segmentedControl, { splitVariantProps: (props) => splitVariantProps(props, segmentedControlVariantMap) });

// @recipe(seed): segmented-control