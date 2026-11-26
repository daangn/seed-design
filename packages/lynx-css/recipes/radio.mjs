import './radio.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const radioSlotNames = [
  [
    "root",
    "seed-radio__root"
  ],
  [
    "control",
    "seed-radio__control"
  ],
  [
    "label",
    "seed-radio__label"
  ]
];

const defaultVariant = {
  "weight": "regular",
  "size": "medium",
  "disabled": false
};

const compoundVariants = [];

export const radioVariantMap = {
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

export const radioVariantKeys = Object.keys(radioVariantMap);

export function radio(props) {
  return Object.fromEntries(
    radioSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radio, { splitVariantProps: (props) => splitVariantProps(props, radioVariantMap) });

// @recipe(seed): radio

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const radioSeedTagSpec = {
  name: "Radio",
  axes: ["weight", "size"],
  defaults: { weight: "regular", size: "medium" },
};
