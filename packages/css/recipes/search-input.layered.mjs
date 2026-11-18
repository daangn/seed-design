import './search-input.layered.css';
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