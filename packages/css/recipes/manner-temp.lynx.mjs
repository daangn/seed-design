import './manner-temp.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const mannerTempSlotNames = [
  [
    "root",
    "seed-manner-temp"
  ],
  [
    "text",
    "seed-manner-temp__text"
  ]
];

const defaultVariant = {
  "level": "l1"
};

const compoundVariants = [];

export const mannerTempVariantMap = {
  "level": [
    "l1",
    "l2",
    "l3",
    "l4",
    "l5",
    "l6",
    "l7",
    "l8",
    "l9",
    "l10"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const mannerTempVariantKeys = Object.keys(mannerTempVariantMap);

export function mannerTemp(props) {
  return Object.fromEntries(
    mannerTempSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(mannerTemp, { splitVariantProps: (props) => splitVariantProps(props, mannerTempVariantMap) });

// @recipe(seed): manner-temp