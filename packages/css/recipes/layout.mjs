import './layout.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const layoutSlotNames = [
  [
    "root",
    "seed-layout__root"
  ],
  [
    "content",
    "seed-layout__content"
  ]
];

const defaultVariant = {
  "density": "medium"
};

const compoundVariants = [];

export const layoutVariantMap = {
  "density": [
    "low",
    "medium",
    "high"
  ]
};

export const layoutVariantKeys = Object.keys(layoutVariantMap);

export function layout(props) {
  return Object.fromEntries(
    layoutSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(layout, { splitVariantProps: (props) => splitVariantProps(props, layoutVariantMap) });

// @recipe(seed): layout