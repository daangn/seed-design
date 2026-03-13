import './side-navigation.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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

const defaultVariant = {};

const compoundVariants = [];

export const sideNavigationVariantMap = {};

export const sideNavigationVariantKeys = Object.keys(sideNavigationVariantMap);

export function sideNavigation(props) {
  return Object.fromEntries(
    sideNavigationSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(sideNavigation, { splitVariantProps: (props) => splitVariantProps(props, sideNavigationVariantMap) });

// @recipe(seed): side-navigation