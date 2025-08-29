import './select-box.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxSlotNames = [
  [
    "root",
    "seed-select-box__root"
  ],
  [
    "content",
    "seed-select-box__content"
  ],
  [
    "label",
    "seed-select-box__label"
  ],
  [
    "description",
    "seed-select-box__description"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const selectBoxVariantMap = {};

export const selectBoxVariantKeys = Object.keys(selectBoxVariantMap);

export function selectBox(props) {
  return Object.fromEntries(
    selectBoxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBox, { splitVariantProps: (props) => splitVariantProps(props, selectBoxVariantMap) });

// @recipe(seed): select-box