import './content-placeholder.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contentPlaceholderSlotNames = [
  [
    "root",
    "seed-content-placeholder__root"
  ],
  [
    "asset",
    "seed-content-placeholder__asset"
  ],
  [
    "presetLight",
    "seed-content-placeholder__presetLight"
  ],
  [
    "presetDark",
    "seed-content-placeholder__presetDark"
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const contentPlaceholderSeedTagSpec = {
  name: "ContentPlaceholder",
  axes: ["type"],
  defaults: {},
};
