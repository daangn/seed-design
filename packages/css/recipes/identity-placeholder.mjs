import './identity-placeholder.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(identityPlaceholderSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(identityPlaceholder, { splitVariantProps: (props) => splitVariantProps(props, identityPlaceholderVariantMap) });

// @recipe(seed): identity-placeholder