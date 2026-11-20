import './switch.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const switchSlotNames = [
  [
    "root",
    "seed-switch__root"
  ],
  [
    "label",
    "seed-switch__label"
  ]
];

const defaultVariant = {
  "size": 32,
  "disabled": false
};

const compoundVariants = [];

export const switchVariantMap = {
  "size": [
    "16",
    "24",
    "32"
  ],
  "disabled": [
    true,
    false
  ]
};

export const switchVariantKeys = Object.keys(switchVariantMap);

export function switchStyle(props) {
  return Object.fromEntries(
    switchSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchStyle, { splitVariantProps: (props) => splitVariantProps(props, switchVariantMap) });

// @recipe(seed): switch

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const switchSeedTagSpec = {
  name: "Switch",
  axes: ["size"],
  defaults: { size: 32 },
};
