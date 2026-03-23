import './toggle-button.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const toggleButtonSlotNames = [
  [
    "root",
    "seed-toggle-button"
  ],
  [
    "text",
    "seed-toggle-button__text"
  ]
];

const defaultVariant = {
  "variant": "brandSolid",
  "size": "small"
};

const compoundVariants = [];

export const toggleButtonVariantMap = {
  "variant": [
    "brandSolid",
    "neutralWeak"
  ],
  "size": [
    "xsmall",
    "small"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const toggleButtonVariantKeys = Object.keys(toggleButtonVariantMap);

export function toggleButton(props) {
  return Object.fromEntries(
    toggleButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(toggleButton, { splitVariantProps: (props) => splitVariantProps(props, toggleButtonVariantMap) });

// @recipe(seed): toggle-button