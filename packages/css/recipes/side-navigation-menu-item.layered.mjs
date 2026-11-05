import './side-navigation-menu-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sideNavigationMenuItemSlotNames = [
  [
    "root",
    "seed-side-navigation-menu-item__root"
  ],
  [
    "prefixIcon",
    "seed-side-navigation-menu-item__prefixIcon"
  ],
  [
    "label",
    "seed-side-navigation-menu-item__label"
  ],
  [
    "suffixIcon",
    "seed-side-navigation-menu-item__suffixIcon"
  ],
  [
    "panel",
    "seed-side-navigation-menu-item__panel"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const sideNavigationMenuItemVariantMap = {};

export const sideNavigationMenuItemVariantKeys = Object.keys(sideNavigationMenuItemVariantMap);

export function sideNavigationMenuItem(props) {
  return Object.fromEntries(
    sideNavigationMenuItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(sideNavigationMenuItem, { splitVariantProps: (props) => splitVariantProps(props, sideNavigationMenuItemVariantMap) });

// @recipe(seed): side-navigation-menu-item