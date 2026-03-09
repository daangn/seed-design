import './content-placeholder.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contentPlaceholderSlotNames = [
  [
    "root",
    "seed-content-placeholder__root"
  ],
  [
    "container",
    "seed-content-placeholder__container"
  ],
  [
    "asset",
    "seed-content-placeholder__asset"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const contentPlaceholderVariantMap = {};

export const contentPlaceholderVariantKeys = Object.keys(contentPlaceholderVariantMap);

export function contentPlaceholder(props) {
  return Object.fromEntries(
    contentPlaceholderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(contentPlaceholder, { splitVariantProps: (props) => splitVariantProps(props, contentPlaceholderVariantMap) });

// @recipe(seed): content-placeholder