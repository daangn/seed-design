import './field-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fieldButtonSlotNames = [
  [
    "root",
    "seed-field-button__root"
  ],
  [
    "button",
    "seed-field-button__button"
  ],
  [
    "content",
    "seed-field-button__content"
  ],
  [
    "baseStroke",
    "seed-field-button__baseStroke"
  ],
  [
    "stroke",
    "seed-field-button__stroke"
  ],
  [
    "value",
    "seed-field-button__value"
  ],
  [
    "placeholder",
    "seed-field-button__placeholder"
  ],
  [
    "prefixText",
    "seed-field-button__prefixText"
  ],
  [
    "prefixIcon",
    "seed-field-button__prefixIcon"
  ],
  [
    "suffixText",
    "seed-field-button__suffixText"
  ],
  [
    "suffixIcon",
    "seed-field-button__suffixIcon"
  ],
  [
    "clearButton",
    "seed-field-button__clearButton"
  ]
];

const defaultVariant = {
  "size": "large",
  "pressed": false,
  "invalid": false,
  "disabled": false,
  "readOnly": false
};

const compoundVariants = [
  {
    "disabled": false,
    "readOnly": false
  }
];

export const fieldButtonVariantMap = {
  "size": [
    "large",
    "medium"
  ],
  "pressed": [
    true,
    false
  ],
  "invalid": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "readOnly": [
    true,
    false
  ]
};

export const fieldButtonVariantKeys = Object.keys(fieldButtonVariantMap);

export function fieldButton(props) {
  return Object.fromEntries(
    fieldButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fieldButton, { splitVariantProps: (props) => splitVariantProps(props, fieldButtonVariantMap) });

// @recipe(seed): field-button

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const fieldButtonSeedTagSpec = {
  name: "InputButton",
  axes: ["size"],
  defaults: { size: "large" },
};
