import './aspect-ratio.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const aspectRatioSlotNames = [
  [
    "root",
    "seed-aspect-ratio"
  ],
  [
    "text",
    "seed-aspect-ratio__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const aspectRatioVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const aspectRatioVariantKeys = Object.keys(aspectRatioVariantMap);

export function aspectRatio(props) {
  return Object.fromEntries(
    aspectRatioSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(aspectRatio, { splitVariantProps: (props) => splitVariantProps(props, aspectRatioVariantMap) });

// @recipe(seed): aspect-ratio