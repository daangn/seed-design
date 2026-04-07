import './chip.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const chipSlotNames = [
  [
    "root",
    "ride-chip__root"
  ],
  [
    "label",
    "ride-chip__label"
  ],
  [
    "prefixIcon",
    "ride-chip__prefixIcon"
  ],
  [
    "suffixIcon",
    "ride-chip__suffixIcon"
  ],
  [
    "prefixAvatar",
    "ride-chip__prefixAvatar"
  ]
];

const defaultVariant = {
  "variant": "solid",
  "size": "medium",
  "layout": "withText"
};

const compoundVariants = [
  {
    "size": "small",
    "layout": "iconOnly"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "large",
    "layout": "iconOnly"
  }
];

export const chipVariantMap = {
  "variant": [
    "solid",
    "outlineStrong",
    "outlineWeak"
  ],
  "size": [
    "large",
    "medium",
    "small"
  ],
  "layout": [
    "iconOnly",
    "withText"
  ]
};

export const chipVariantKeys = Object.keys(chipVariantMap);

export function chip(props) {
  return Object.fromEntries(
    chipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(chip, { splitVariantProps: (props) => splitVariantProps(props, chipVariantMap) });

// @recipe(seed): chip