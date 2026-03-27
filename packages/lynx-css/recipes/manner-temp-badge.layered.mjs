import './manner-temp-badge.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const mannerTempBadgeSlotNames = [
  [
    "root",
    "seed-manner-temp-badge"
  ],
  [
    "text",
    "seed-manner-temp-badge__text"
  ]
];

const defaultVariant = {
  "level": "l1"
};

const compoundVariants = [];

export const mannerTempBadgeVariantMap = {
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

export const mannerTempBadgeVariantKeys = Object.keys(mannerTempBadgeVariantMap);

export function mannerTempBadge(props) {
  return Object.fromEntries(
    mannerTempBadgeSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(mannerTempBadge, { splitVariantProps: (props) => splitVariantProps(props, mannerTempBadgeVariantMap) });

// @recipe(seed): manner-temp-badge