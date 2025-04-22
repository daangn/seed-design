import './control-chip.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "medium",
  "layout": "withText"
};

const compoundVariants = [
  {
    "size": "medium",
    "layout": "withText"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "small",
    "layout": "withText"
  },
  {
    "size": "small",
    "layout": "iconOnly"
  }
];

export const controlChipVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ]
};

export const controlChipVariantKeys = Object.keys(controlChipVariantMap);

export function controlChip(props) {
  return createClassName(
    "seed-control-chip",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(controlChip, { splitVariantProps: (props) => splitVariantProps(props, controlChipVariantMap) });

// @recipe(seed): control-chip