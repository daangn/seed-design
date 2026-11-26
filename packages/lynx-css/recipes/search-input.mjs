import './search-input.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const searchInputSlotNames = [
  [
    "root",
    "seed-search-input__root"
  ],
  [
    "value",
    "seed-search-input__value"
  ],
  [
    "clearButton",
    "seed-search-input__clearButton"
  ],
  [
    "clearButtonIcon",
    "seed-search-input__clearButtonIcon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const searchInputVariantMap = {};

export const searchInputVariantKeys = Object.keys(searchInputVariantMap);

export function searchInput(props) {
  return Object.fromEntries(
    searchInputSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(searchInput, { splitVariantProps: (props) => splitVariantProps(props, searchInputVariantMap) });

// @recipe(seed): search-input

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const searchInputSeedTagSpec = {
  name: "SearchInput",
  axes: [],
  defaults: {},
};
