import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const reactionButtonSlotNames = [
  [
    "root",
    "seed-reaction-button__root"
  ]
];

const defaultVariant = {
  "size": "small"
};

const compoundVariants = [];

export const reactionButtonVariantMap = {
  "size": [
    "xsmall",
    "small"
  ]
};

export const reactionButtonVariantKeys = Object.keys(reactionButtonVariantMap);

export function reactionButton(props) {
  return Object.fromEntries(
    reactionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(reactionButton, { splitVariantProps: (props) => splitVariantProps(props, reactionButtonVariantMap) });