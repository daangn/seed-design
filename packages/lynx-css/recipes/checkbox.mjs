import './checkbox.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const checkboxSlotNames = [
  [
    "root",
    "seed-checkbox__root"
  ],
  [
    "control",
    "seed-checkbox__control"
  ],
  [
    "label",
    "seed-checkbox__label"
  ]
];

const defaultVariant = {
  "weight": "regular",
  "size": "medium",
  "disabled": false
};

const compoundVariants = [];

export const checkboxVariantMap = {
  "weight": [
    "regular",
    "bold"
  ],
  "size": [
    "medium",
    "large"
  ],
  "disabled": [
    true,
    false
  ]
};

export const checkboxVariantKeys = Object.keys(checkboxVariantMap);

export function checkbox(props) {
  return Object.fromEntries(
    checkboxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkbox, { splitVariantProps: (props) => splitVariantProps(props, checkboxVariantMap) });

// @recipe(seed): checkbox

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const checkboxSeedTagSpec = {
  name: "Checkbox",
  axes: ["weight", "size"],
  defaults: { weight: "regular", size: "medium" },
};
