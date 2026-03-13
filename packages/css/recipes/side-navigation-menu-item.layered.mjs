import './side-navigation-menu-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sideNavigationMenuItemSlotNames = [
  [
    "item",
    "seed-side-navigation-menu-item__item"
  ],
  [
    "collapsibleContent",
    "seed-side-navigation-menu-item__collapsibleContent"
  ],
  [
    "chevron",
    "seed-side-navigation-menu-item__chevron"
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