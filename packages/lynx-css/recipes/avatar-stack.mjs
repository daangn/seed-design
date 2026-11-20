import './avatar-stack.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const avatarStackSlotNames = [
  [
    "root",
    "seed-avatar-stack__root"
  ],
  [
    "item",
    "seed-avatar-stack__item"
  ],
  [
    "overlap",
    "seed-avatar-stack__overlap"
  ]
];

const defaultVariant = {
  "size": 48
};

const compoundVariants = [];

export const avatarStackVariantMap = {
  "size": [
    "20",
    "24",
    "36",
    "42",
    "48",
    "56",
    "64",
    "80",
    "96",
    "108"
  ]
};

export const avatarStackVariantKeys = Object.keys(avatarStackVariantMap);

export function avatarStack(props) {
  return Object.fromEntries(
    avatarStackSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(avatarStack, { splitVariantProps: (props) => splitVariantProps(props, avatarStackVariantMap) });

// @recipe(seed): avatar-stack

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const avatarStackSeedTagSpec = {
  name: "AvatarStack",
  axes: ["size"],
  defaults: { size: 48 },
};
