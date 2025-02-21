import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const skeletonSlotNames = [
  [
    "root",
    "seed-skeleton__root"
  ]
];

const defaultVariant = {
  "radius": 8
};

const compoundVariants = [];

export const skeletonVariantMap = {
  "radius": [
    "0",
    "8",
    "16",
    "full"
  ]
};

export const skeletonVariantKeys = Object.keys(skeletonVariantMap);

export function skeleton(props) {
  return Object.fromEntries(
    skeletonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(skeleton, { splitVariantProps: (props) => splitVariantProps(props, skeletonVariantMap) });