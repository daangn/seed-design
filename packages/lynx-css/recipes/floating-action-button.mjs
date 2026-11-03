import './floating-action-button.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  ]
};

export const floatingActionButtonVariantKeys = Object.keys(floatingActionButtonVariantMap);

export function floatingActionButton(props) {
  return createSlots(floatingActionButtonSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(floatingActionButton, { splitVariantProps: (props) => splitVariantProps(props, floatingActionButtonVariantMap) });

// @recipe(seed): floating-action-button