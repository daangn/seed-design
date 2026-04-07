import './segmented-control.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const segmentedControlSlotNames = [
  [
    "root",
    "ride-segmented-control__root"
  ],
  [
    "indicator",
    "ride-segmented-control__indicator"
  ],
  [
    "item",
    "ride-segmented-control__item"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const segmentedControlVariantMap = {};

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