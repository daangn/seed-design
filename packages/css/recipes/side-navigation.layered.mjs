import './side-navigation.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const sideNavigationSlotNames = [
  [
    "root",
    "seed-side-navigation__root"
  ],
  [
    "header",
    "seed-side-navigation__header"
  ],
  [
    "content",
    "seed-side-navigation__content"
  ],
  [
    "footer",
    "seed-side-navigation__footer"
  ],
  [
    "group",
    "seed-side-navigation__group"
  ],
  [
    "groupLabel",
    "seed-side-navigation__groupLabel"
  ],
  [
    "trigger",
    "seed-side-navigation__trigger"
  ]
];

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

export const sideNavigationVariantMap = {
  "tone": [
    "neutral",
    "transparent"
  ]
};

export const sideNavigationVariantKeys = Object.keys(sideNavigationVariantMap);

export function sideNavigation(props) {
  return createSlots(sideNavigationSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(sideNavigation, { splitVariantProps: (props) => splitVariantProps(props, sideNavigationVariantMap) });

// @recipe(seed): side-navigation