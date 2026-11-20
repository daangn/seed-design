import './manner-temp-badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const mannerTempBadgeSlotNames = [
  [
    "root",
    "seed-manner-temp-badge__root"
  ],
  [
    "label",
    "seed-manner-temp-badge__label"
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const mannerTempBadgeSeedTagSpec = {
  name: "MannerTempBadge",
  axes: ["level"],
  defaults: { level: "l1" },
};
