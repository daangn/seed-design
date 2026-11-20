import './identity-placeholder.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const identityPlaceholderSlotNames = [
  [
    "root",
    "seed-identity-placeholder__root"
  ],
  [
    "image",
    "seed-identity-placeholder__image"
  ]
];

const defaultVariant = {
  "identity": "person"
};

const compoundVariants = [];

export const identityPlaceholderVariantMap = {
  "identity": [
    "person",
    "business"
  ]
};

export const identityPlaceholderVariantKeys = Object.keys(identityPlaceholderVariantMap);

export function identityPlaceholder(props) {
  return Object.fromEntries(
    identityPlaceholderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(identityPlaceholder, { splitVariantProps: (props) => splitVariantProps(props, identityPlaceholderVariantMap) });

// @recipe(seed): identity-placeholder

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const identityPlaceholderSeedTagSpec = {
  name: "IdentityPlaceholder",
  axes: [],
  defaults: {},
};
