import './segmented-control.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
    "itemContent",
    "seed-segmented-control__itemContent"
  ],
  [
    "itemBackground",
    "seed-segmented-control__itemBackground"
  ],
  [
    "itemSelectedBackground",
    "seed-segmented-control__itemSelectedBackground"
  ],
  [
    "label",
    "seed-segmented-control__label"
  ]
];

const defaultVariant = {
  "selected": false,
  "disabled": false,
  "hasSelection": true,
  "transitionEnabled": true
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
  "hasSelection": [
    true,
    false
  ],
  "transitionEnabled": [
    true,
    false
  ]
};

export const segmentedControlVariantKeys = Object.keys(segmentedControlVariantMap);

export function segmentedControl(props) {
  return createSlots(segmentedControlSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(segmentedControl, { splitVariantProps: (props) => splitVariantProps(props, segmentedControlVariantMap) });

// @recipe(seed): segmented-control