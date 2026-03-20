import './header.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const headerSlotNames = [
  [
    "root",
    "seed-header__root"
  ],
  [
    "left",
    "seed-header__left"
  ],
  [
    "center",
    "seed-header__center"
  ],
  [
    "right",
    "seed-header__right"
  ]
];

const defaultVariant = {
  "tone": "layer",
  "divider": false
};

const compoundVariants = [];

export const headerVariantMap = {
  "tone": [
    "layer",
    "transparent"
  ],
  "divider": [
    true,
    false
  ]
};

export const headerVariantKeys = Object.keys(headerVariantMap);

export function header(props) {
  return Object.fromEntries(
    headerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(header, { splitVariantProps: (props) => splitVariantProps(props, headerVariantMap) });

// @recipe(seed): header