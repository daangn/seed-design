import './checkbox-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const checkboxGroupSlotNames = [
  [
    "root",
    "seed-checkbox-group__root"
  ],
  [
    "text",
    "seed-checkbox-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const checkboxGroupVariantMap = {};

export const checkboxGroupVariantKeys = Object.keys(checkboxGroupVariantMap);

export function checkboxGroup(props) {
  return Object.fromEntries(
    checkboxGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkboxGroup, { splitVariantProps: (props) => splitVariantProps(props, checkboxGroupVariantMap) });

// @recipe(seed): checkbox-group

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const checkboxGroupSeedTagSpec = {
  name: "CheckboxGroup",
  axes: [],
  defaults: {},
};
