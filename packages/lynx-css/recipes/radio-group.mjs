import './radio-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const radioGroupSlotNames = [
  [
    "root",
    "seed-radio-group__root"
  ],
  [
    "text",
    "seed-radio-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const radioGroupVariantMap = {};

export const radioGroupVariantKeys = Object.keys(radioGroupVariantMap);

export function radioGroup(props) {
  return Object.fromEntries(
    radioGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radioGroup, { splitVariantProps: (props) => splitVariantProps(props, radioGroupVariantMap) });

// @recipe(seed): radio-group

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const radioGroupSeedTagSpec = {
  name: "RadioGroup",
  axes: [],
  defaults: {},
};
