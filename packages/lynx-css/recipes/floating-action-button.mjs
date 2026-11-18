import './floating-action-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const floatingActionButtonSlotNames = [
  [
    "root",
    "seed-floating-action-button__root"
  ],
  [
    "icon",
    "seed-floating-action-button__icon"
  ],
  [
    "label",
    "seed-floating-action-button__label"
  ]
];

const defaultVariant = {
  "extended": true,
  "pressed": false,
  "disabled": false,
  "transitionEnabled": false
};

const compoundVariants = [
  {
    "extended": true,
    "transitionEnabled": true
  }
];

export const floatingActionButtonVariantMap = {
  "extended": [
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
  ],
  "transitionEnabled": [
    true,
    false
  ],
  "glass": [
    true,
    false
  ]
};

export const floatingActionButtonVariantKeys = Object.keys(floatingActionButtonVariantMap);

export function floatingActionButton(props) {
  return Object.fromEntries(
    floatingActionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(floatingActionButton, { splitVariantProps: (props) => splitVariantProps(props, floatingActionButtonVariantMap) });

// @recipe(seed): floating-action-button

// Generated from Rootage component specs and color tokens by scripts/generate-glass-tint.mjs. Do not edit directly.
// Liquid Glass tint (`root.color`) per variant and state, resolved for each color scheme.
export const glassTint = {
  base: {
    enabled: { light: "#ff6600", dark: "#ff6600" },
    pressed: { light: "#e14d00", dark: "#ff9e65" },
  },
};
